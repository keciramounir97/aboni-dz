import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { AnalyticsOverview, SalesByStatus, SalesByCategory, TopProduct, DailyRevenue } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { StatCard, Loading, SectionCard } from '@/components/ui/shared';
import { formatPrice } from '@/lib/utils';
import { useI18n } from '@/i18n/I18nProvider';
import { DollarSign, Package, ShoppingCart, Users, Clock, TrendingUp, Star, Ticket } from 'lucide-react';

export default function AdminAnalytics() {
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [byStatus, setByStatus] = useState<SalesByStatus[]>([]);
  const [byCategory, setByCategory] = useState<SalesByCategory[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [dailyRev, setDailyRev] = useState<DailyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      unwrap(api.get('/analytics/overview')).catch(() => null),
      unwrap(api.get('/analytics/sales-by-status')).catch(() => []),
      unwrap(api.get('/analytics/sales-by-category')).catch(() => []),
      unwrap(api.get('/analytics/top-products')).catch(() => []),
      unwrap(api.get('/analytics/daily-revenue')).catch(() => []),
    ]).then(([o, s, c, tp, dr]) => {
      setOverview(o as AnalyticsOverview);
      setByStatus(s as SalesByStatus[]);
      setByCategory(c as SalesByCategory[]);
      setTopProducts(tp as TopProduct[]);
      setDailyRev(dr as DailyRevenue[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const maxRev = Math.max(...dailyRev.map((d) => d.revenue), 1);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Analytics</h1>
      <p className="mt-1 text-muted-foreground">Business performance overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={overview ? formatPrice(overview.revenue, 'DZD') : '—'} color="emerald" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={overview?.orders || 0} color="primary" />
        <StatCard icon={Users} label="Total Users" value={overview?.users || 0} color="blue" />
        <StatCard icon={Clock} label="Pending Orders" value={overview?.pending || 0} color="amber" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Revenue (Last 30 Days)">
          <div className="flex h-48 items-end gap-1">
            {dailyRev.slice(0, 30).reverse().map((d, i) => (
              <div key={i} className="flex-1 rounded-t bg-primary/70 hover:bg-primary" style={{ height: `${(d.revenue / maxRev) * 100}%` }} title={`${d.date}: ${formatPrice(d.revenue, 'DZD')}`} />
            ))}
          </div>
          {dailyRev.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No revenue data yet</p>}
        </SectionCard>

        <SectionCard title="Sales by Status">
          <div className="space-y-3">
            {byStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between">
                <span className="text-sm capitalize">{s.status.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{s.count} orders</span>
                  <span className="font-medium">{formatPrice(s.total, 'DZD')}</span>
                </div>
              </div>
            ))}
            {byStatus.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No sales data yet</p>}
          </div>
        </SectionCard>

        <SectionCard title="Sales by Category">
          <div className="space-y-3">
            {byCategory.map((c) => (
              <div key={c.category} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm capitalize font-medium">{c.category}</span>
                <div className="flex items-center gap-3"><span className="text-sm text-muted-foreground">{c.count} orders</span><span className="font-medium">{formatPrice(c.total, 'DZD')}</span></div>
              </div>
            ))}
            {byCategory.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No category data yet</p>}
          </div>
        </SectionCard>

        <SectionCard title="Top Products">
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">{i + 1}</span>
                <div className="flex-1"><p className="text-sm font-medium">{p.name_en}</p><p className="text-xs text-muted-foreground">{p.sold} sold</p></div>
                <span className="font-medium text-sm">{formatPrice(p.revenue, 'DZD')}</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No product data yet</p>}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
