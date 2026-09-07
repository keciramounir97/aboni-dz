import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { AnalyticsOverview } from '@/lib/types';
import { StatCard, Loading, SectionCard } from '@/components/ui/shared';
import { formatPrice } from '@/lib/utils';
import { DollarSign, Users, ShoppingCart, Package, Star, TrendingUp, Activity, Ticket } from 'lucide-react';

export default function SuperAdminAnalytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionStats, setActionStats] = useState<{ action: string; count: number }[]>([]);

  useEffect(() => {
    Promise.all([
      unwrap(api.get('/analytics/overview')).catch(() => null),
      unwrap(api.get('/activity-logs/admin/stats')).catch(() => []),
    ]).then(([o, s]) => { setOverview(o as AnalyticsOverview); setActionStats(s as any[]); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">System Analytics</h1>
      <p className="mt-1 text-muted-foreground">Platform-wide metrics and insights</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={overview ? formatPrice(overview.revenue, 'DZD') : '—'} color="emerald" />
        <StatCard icon={Users} label="Total Users" value={overview?.users || 0} color="primary" />
        <StatCard icon={ShoppingCart} label="Total Orders" value={overview?.orders || 0} color="blue" />
        <StatCard icon={Package} label="Products" value={overview?.products || 0} color="purple" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Star} label="Reviews" value={overview?.reviews || 0} color="amber" />
        <StatCard icon={Ticket} label="Coupons" value={overview?.coupons || 0} color="rose" />
        <StatCard icon={TrendingUp} label="Pending Orders" value={overview?.pending || 0} color="amber" />
        <StatCard icon={Activity} label="Activity Logs" value={actionStats.reduce((a, b) => a + b.count, 0)} color="primary" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Activity by Action Type">
          <div className="space-y-3">
            {actionStats.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No activity data</p> : actionStats.map((s) => (
              <div key={s.action} className="flex items-center justify-between"><span className="text-sm capitalize">{s.action.replace(/_/g, ' ')}</span><div className="flex items-center gap-3"><span className="font-medium">{s.count}</span><div className="h-2 w-24 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min((s.count / Math.max(...actionStats.map(a => a.count))) * 100, 100)}%` }} /></div></div></div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Platform Metrics">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><span className="text-sm">Conversion Rate</span><span className="font-medium">{overview?.users ? `${((overview.orders / overview.users) * 100).toFixed(1)}%` : '—'}</span></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><span className="text-sm">Avg Revenue per Order</span><span className="font-medium">{overview?.orders ? formatPrice(overview.revenue / overview.orders, 'DZD') : '—'}</span></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><span className="text-sm">Avg Revenue per User</span><span className="font-medium">{overview?.users ? formatPrice(overview.revenue / overview.users, 'DZD') : '—'}</span></div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3"><span className="text-sm">Pending Rate</span><span className="font-medium">{overview?.orders ? `${((overview.pending / overview.orders) * 100).toFixed(1)}%` : '—'}</span></div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
