import { Injectable } from '@nestjs/common';
import { Order } from '../orders/order.model';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';
import { Review } from '../reviews/review.model';
import { Coupon } from '../coupons/coupon.model';

@Injectable()
export class AnalyticsService {
  async overview() {
    const [products, orders, users, reviews, coupons] = await Promise.all([
      Product.query().count('id as count').first() as any,
      Order.query().count('id as count').first() as any,
      User.query().count('id as count').first() as any,
      Review.query().count('id as count').first() as any,
      Coupon.query().count('id as count').first() as any,
    ]);

    const revenueResult = await Order.query().whereIn('status', ['approved', 'delivered']).sum('total_price as revenue').first() as any;
    const pendingResult = await Order.query().whereIn('status', ['pending', 'awaiting_payment', 'payment_submitted']).count('id as count').first() as any;

    return {
      products: Number(products?.count || 0),
      orders: Number(orders?.count || 0),
      users: Number(users?.count || 0),
      reviews: Number(reviews?.count || 0),
      coupons: Number(coupons?.count || 0),
      revenue: Number(revenueResult?.revenue || 0),
      pending: Number(pendingResult?.count || 0),
    };
  }

  async salesByStatus() {
    const rows = await Order.query().select('status').sum('total_price as total').count('id as count').groupBy('status') as any;
    return rows.map((r: any) => ({ status: r.status, total: Number(r.total), count: Number(r.count) }));
  }

  async salesByCategory() {
    const rows = await Order.query()
      .join('products', 'orders.product_id', 'products.id')
      .select('products.category')
      .sum('orders.total_price as total')
      .count('orders.id as count')
      .groupBy('products.category') as any;
    return rows.map((r: any) => ({ category: r.category, total: Number(r.total), count: Number(r.count) }));
  }

  async recentOrders(limit = 10) {
    return Order.query().withGraphFetched('[product,user]').orderBy('created_at', 'desc').limit(limit);
  }

  async topProducts(limit = 5) {
    const rows = await Order.query()
      .join('products', 'orders.product_id', 'products.id')
      .select('products.id', 'products.name_en', 'products.name_fr', 'products.name_ar', 'products.category')
      .sum('orders.quantity as sold')
      .sum('orders.total_price as revenue')
      .groupBy('products.id', 'products.name_en', 'products.name_fr', 'products.name_ar', 'products.category')
      .orderBy('sold', 'desc')
      .limit(limit) as any;
    return rows.map((r: any) => ({ ...r, sold: Number(r.sold), revenue: Number(r.revenue) }));
  }

  async userGrowth() {
    const rows = await User.query()
      .select(User.raw("DATE_FORMAT(created_at, '%Y-%m') as month"))
      .count('id as count')
      .groupBy('month')
      .orderBy('month', 'desc')
      .limit(12) as any;
    return rows.map((r: any) => ({ month: r.month, count: Number(r.count) }));
  }

  async dailyRevenue(days = 30) {
    const rows = await Order.query()
      .whereIn('status', ['approved', 'delivered'])
      .select(Order.raw("DATE(created_at) as date"))
      .sum('total_price as revenue')
      .count('id as count')
      .groupBy('date')
      .orderBy('date', 'desc')
      .limit(days) as any;
    return rows.map((r: any) => ({ date: r.date, revenue: Number(r.revenue), count: Number(r.count) }));
  }
}
