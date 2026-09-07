import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { ActivityLog } from '@/lib/types';
import { Loading } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, LogIn, Star, Package, User, Settings, ShoppingCart } from 'lucide-react';

const actionIcons: Record<string, any> = { login: LogIn, order_created: ShoppingCart, review_created: Star, profile_updated: User, password_changed: Settings, order_reviewed: Package, product_created: Package, settings_updated: Settings, user_updated: User };

export default function AdminActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const load = () => { unwrap(api.get(`/activity-logs/admin/all${filter ? `?action=${filter}` : ''}`)).then((d) => setLogs(d as ActivityLog[])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [filter]);

  if (loading) return <Loading />;

  const actions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold">Activity Log</h1><p className="mt-1 text-muted-foreground">{logs.length} entries</p></div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
          <option value="">All Actions</option>
          {actions.map((a) => <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>)}
        </select>
      </div>
      <div className="mt-6">
        <Table>
          <TableHeader><TableRow><TableHead>Action</TableHead><TableHead>User</TableHead><TableHead>Entity</TableHead><TableHead>IP</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
          <TableBody>
            {logs.map((log) => { const Icon = actionIcons[log.action] || Activity; return (
              <TableRow key={log.id}>
                <TableCell><span className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> <span className="capitalize text-sm">{log.action.replace(/_/g, ' ')}</span></span></TableCell>
                <TableCell className="text-sm">{log.user_name || '—'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{log.entity}{log.entity_id ? ` #${log.entity_id}` : ''}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{log.ip_address || '—'}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(log.created_at)}</TableCell>
              </TableRow>
            ); })}
          </TableBody>
        </Table>
        {logs.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground"><Activity className="mx-auto mb-2 h-8 w-8 text-muted-foreground" /> No activity yet</p>}
      </div>
    </div>
  );
}
