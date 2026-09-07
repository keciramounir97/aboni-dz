import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, Mail, Newspaper, Clock } from 'lucide-react';
import { api, unwrap } from '@/lib/api';
import type { Contact, Newsletter, Order, Product, User } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Stats = {
  products: number;
  orders: number;
  users: number;
  contacts: number;
  subscribers: number;
  pending: number;
};

export default function AdminDashboard() {
  const { t } = useI18n();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, contacts: 0, subscribers: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetches: Promise<void>[] = [];

    if (hasPermission('products')) {
      fetches.push(unwrap(api.get('/products/admin/all')).then((d) => { setStats((s) => ({ ...s, products: (d as Product[]).length })); }));
    }
    if (hasPermission('orders')) {
      fetches.push(
        unwrap(api.get('/orders/admin/all')).then((d) => {
          const orders = d as Order[];
          setStats((s) => ({
            ...s,
            orders: orders.length,
            pending: orders.filter((o) => ['pending', 'awaiting_payment', 'payment_submitted'].includes(o.status)).length,
          }));
        }),
      );
    }
    if (hasPermission('users')) {
      fetches.push(unwrap(api.get('/users')).then((d) => { setStats((s) => ({ ...s, users: (d as User[]).length })); }));
    }
    if (hasPermission('contacts')) {
      fetches.push(unwrap(api.get('/contacts')).then((d) => { setStats((s) => ({ ...s, contacts: (d as Contact[]).length })); }));
    }
    if (hasPermission('newsletter')) {
      fetches.push(
        unwrap(api.get('/newsletter')).then((d) => {
          setStats((s) => ({ ...s, subscribers: (d as Newsletter[]).filter((n) => n.is_active).length }));
        }),
      );
    }

    Promise.all(fetches).finally(() => setLoading(false));
  }, [hasPermission]);

  const cards = [
    { key: 'products', icon: Package, value: stats.products, show: hasPermission('products') },
    { key: 'orders', icon: ShoppingCart, value: stats.orders, show: hasPermission('orders') },
    { key: 'pending', icon: Clock, value: stats.pending, show: hasPermission('orders') },
    { key: 'users', icon: Users, value: stats.users, show: hasPermission('users') },
    { key: 'contacts', icon: Mail, value: stats.contacts, show: hasPermission('contacts') },
    { key: 'subscribers', icon: Newspaper, value: stats.subscribers, show: hasPermission('newsletter') },
  ].filter((c) => c.show);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t.admin.dashboard}</h1>

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.key}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t.admin.stats[card.key as keyof typeof t.admin.stats]}
                </CardTitle>
                <card.icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
