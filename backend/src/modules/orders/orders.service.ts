import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { Order } from './order.model';
import { Product } from '../products/product.model';
import { CreateOrderDto, ReviewOrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private orderNumber() {
    return `ABO-${Date.now().toString(36).toUpperCase()}-${randomBytes(2).toString('hex').toUpperCase()}`;
  }

  async create(userId: number, dto: CreateOrderDto) {
    const product = await Product.query().findById(dto.product_id);
    if (!product || !product.is_active) {
      throw new NotFoundException({ success: false, message: 'Product not found' });
    }
    const quantity = dto.quantity || 1;
    if (product.stock < quantity) {
      throw new BadRequestException({ success: false, message: 'Insufficient stock' });
    }
    const unit = Number(product.price);
    const order = await Order.query().insertAndFetch({
      order_number: this.orderNumber(),
      user_id: userId,
      product_id: product.id,
      quantity,
      unit_price: unit,
      total_price: unit * quantity,
      status: 'awaiting_payment',
      payment_proof_url: null,
      delivery_account: null,
      admin_note: null,
      reviewed_by: null,
      reviewed_at: null,
    });
    return Order.query().findById(order.id).withGraphFetched('[product, user]');
  }

  async myOrders(userId: number) {
    return Order.query()
      .where('user_id', userId)
      .withGraphFetched('product')
      .orderBy('created_at', 'desc');
  }

  async myOrder(userId: number, id: number) {
    const order = await Order.query().findById(id).withGraphFetched('[product, user]');
    if (!order) throw new NotFoundException({ success: false, message: 'Order not found' });
    if (order.user_id !== userId) {
      throw new ForbiddenException({ success: false, message: 'Forbidden' });
    }
    return order;
  }

  async listAdmin(status?: string) {
    let q = Order.query().withGraphFetched('[product, user]').orderBy('created_at', 'desc');
    if (status) q = q.where('status', status);
    return q;
  }

  async adminOne(id: number) {
    const order = await Order.query().findById(id).withGraphFetched('[product, user]');
    if (!order) throw new NotFoundException({ success: false, message: 'Order not found' });
    return order;
  }

  async submitProof(userId: number, id: number, payment_proof_url: string) {
    const order = await this.myOrder(userId, id);
    if (!['awaiting_payment', 'pending', 'rejected'].includes(order.status)) {
      throw new BadRequestException({
        success: false,
        message: 'Cannot submit proof for this order status',
      });
    }
    return Order.query().patchAndFetchById(id, {
      payment_proof_url,
      status: 'payment_submitted',
    }).then((o) => Order.query().findById(o.id).withGraphFetched('[product, user]'));
  }

  async review(adminId: number, id: number, dto: ReviewOrderDto) {
    const order = await Order.query().findById(id);
    if (!order) throw new NotFoundException({ success: false, message: 'Order not found' });

    if (dto.status === 'approved' || dto.status === 'delivered') {
      if (!dto.delivery_account || (!dto.delivery_account.email && !dto.delivery_account.username)) {
        throw new BadRequestException({
          success: false,
          message: 'delivery_account with username or email is required when approving',
        });
      }
    }

    const patch: Partial<Order> = {
      status: dto.status,
      admin_note: dto.admin_note ?? order.admin_note,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    if (dto.delivery_account) {
      patch.delivery_account = dto.delivery_account;
    }

    if (dto.status === 'approved' || dto.status === 'delivered') {
      patch.status = 'delivered';
      await Product.query()
        .decrement('stock', order.quantity)
        .where('id', order.product_id)
        .where('stock', '>=', order.quantity);
    }

    await Order.query().patchAndFetchById(id, patch);
    return Order.query().findById(id).withGraphFetched('[product, user]');
  }
}
