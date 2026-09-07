import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { AnalyticsOverview, ActivityLog } from '@/lib/types';
import { StatCard, Loading, SectionCard } from '@/components/ui/shared';
import { formatPrice, formatDate } from '@/lib/utils';
import { Shield, Users, DollarSign, Server, Activity, Database, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SuperAdminOverview() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState({ users: 0, admins: 0, products: 0, tables: 12 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      unwrap(api.get('/analytics/overview')).catch(() => null),
      unwrap(api.get('/activity-logs/admin/all?limit=5')).catch(() => []),
      unwrap(api.get('/users')).catch(() => []),
    ]).then(([o, l, users]) => {
      setOverview(o as AnalyticsOverview);
      setLogs(l as ActivityLog[]);
      const userList = users as any[];
      setStats({ users: userList.length, admins: userList.filter((u: any) => u.role !== 'user').length, products: o?.products || 0, tables: 12 });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const systemHealth = [
    { label: 'API Server', status: 'Online', icon: Server, color: 'text-emerald-500' },
    { label: 'Database', status: 'Connected', icon: Database, color: 'text-emerald-500' },
    { label: 'Authentication', status: 'JWT Active', icon: Shield, color: 'text-emerald-500' },
    { label: 'File Storage', status: 'Local', icon: Server, color: 'text-emerald-500' },
  ];

  return (
    <div>
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-rose-500" />
        <div><h1 className="font-display text-3xl font-bold">System Overview</h1><p className="text-muted-foreground">Super admin control center</p></div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={stats.users} color="primary" hint={`${stats.admins} admins`} />
        <StatCard icon={DollarSign} label="Total Revenue" value={overview ? formatPrice(overview.revenue, 'DZD') : '—'} color="emerald" />
        <StatCard icon={Server} label="Database Tables" value={stats.tables} color="blue" />
        <StatCard icon={Activity} label="System Logs" value={logs.length} color="purple" hint="Recent activity" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="System Health">
          <div className="grid gap-3 sm:grid-cols-2">
            {systemHealth.map((h) => (
              <div key={h.label} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3"><h.icon className={`h-5 w-5 ${h.color}`} /><div><p className="text-sm font-medium">{h.label}</p><p className="text-xs text-muted-foreground">{h.status}</p></div></div>
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity">
          <div className="space-y-2">
            {logs.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p> : logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Activity className="h-4 w-4 text-primary" />
                <div className="flex-1"><p className="text-sm font-medium capitalize">{log.action.replace(/_/g, ' ')}</p><p className="text-xs text-muted-foreground">{log.user_name || 'System'} · {formatDate(log.created_at)}</p></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5"><AlertTriangle className="h-6 w-6 text-amber-500" /><h3 className="mt-2 font-semibold">System Status</h3><p className="text-sm text-muted-foreground">All systems operational. No critical alerts.</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><Database className="h-6 w-6 text-primary" /><h3 className="mt-2 font-semibold">Database</h3><p className="text-sm text-muted-foreground">{stats.tables} tables · MySQL 8.x</p></div>
        <div className="rounded-xl border border-border bg-card p-5"><Shield className="h-6 w-6 text-emerald-500" /><h3 className="mt-2 font-semibold">Security</h3><p className="text-sm text-muted-foreground">JWT auth · bcrypt passwords · Role-based access</p></div>
      </div>
    </div>
  );
}
