import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '@/lib/api';
import type { Order, Wishlist, Review } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { StatCard, SectionCard, Loading } from '@/components/ui/shared';
import { formatPrice, formatDate } from '@/lib/utils';
import { ShoppingCart, Heart, Star, Clock, Package, ArrowRight, Gift } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const { locale, t } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<Wishlist[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      unwrap(api.get('/orders/mine')).catch(() => []),
      unwrap(api.get('/wishlist/mine')).catch(() => []),
      unwrap(api.get('/reviews/mine')).catch(() => []),
    ]).then(([o, w, r]) => {
      setOrders(o as Order[]);
      setWishlist(w as Wishlist[]);
      setReviews(r as Review[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const pendingOrders = orders.filter((o) => ['pending', 'awaiting_payment', 'payment_submitted'].includes(o.status));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Welcome back, {user?.name}! 👋</h1>
      <p className="mt-1 text-muted-foreground">Here's an overview of your account</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingCart} label="Total Orders" value={orders.length} color="primary" />
        <StatCard icon={Clock} label="Pending Orders" value={pendingOrders.length} color="amber" />
        <StatCard icon={Heart} label="Wishlist Items" value={wishlist.length} color="rose" />
        <StatCard icon={Star} label="Reviews Posted" value={reviews.length} color="purple" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Recent Orders" action={<Link to="/account/orders" className="text-sm text-primary hover:underline">View all</Link>}>
          {orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet. <Link to="/shop" className="text-primary">Browse shop →</Link></p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 3).map((o) => (
                <Link key={o.id} to={`/account/orders/${o.id}`} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/20">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{o.product ? getProductName(o.product, locale) : 'Order'} #{o.order_number.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(o.created_at, locale)} · {o.status.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(o.total_price, 'DZD')}</span>
                </Link>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <Link to="/shop" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:bg-muted/20">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Browse Shop</span>
            </Link>
            <Link to="/account/wishlist" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:bg-muted/20">
              <Heart className="h-6 w-6 text-rose-500" />
              <span className="text-sm font-medium">Wishlist</span>
            </Link>
            <Link to="/account/reviews" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:bg-muted/20">
              <Star className="h-6 w-6 text-amber-500" />
              <span className="text-sm font-medium">My Reviews</span>
            </Link>
            <Link to="/account/profile" className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 hover:bg-muted/20">
              <Gift className="h-6 w-6 text-purple-500" />
              <span className="text-sm font-medium">Profile</span>
            </Link>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
