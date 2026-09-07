import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { ActivityLog } from '@/lib/types';
import { Loading, EmptyState } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { Activity, LogIn, Star, Package, User, Settings, ShoppingCart } from 'lucide-react';

const actionIcons: Record<string, any> = {
  login: LogIn, order_created: ShoppingCart, review_created: Star, profile_updated: User, password_changed: Settings, order_reviewed: Package, product_created: Package,
};

export default function UserActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap(api.get('/activity-logs/mine')).then((d) => setLogs(d as ActivityLog[])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Activity Log</h1>
      <p className="mt-1 text-muted-foreground">Your recent account activity</p>

      {logs.length === 0 ? <div className="mt-8"><EmptyState icon={Activity} title="No activity yet" message="Your actions will appear here." /></div> : (
        <div className="mt-8 space-y-3">
          {logs.map((log) => {
            const Icon = actionIcons[log.action] || Activity;
            return (
              <div key={log.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary"><Icon className="h-4 w-4" /></span>
                <div className="flex-1">
                  <p className="text-sm font-medium capitalize">{log.action.replace(/_/g, ' ')}</p>
                  {log.entity && <p className="text-xs text-muted-foreground">on {log.entity}{log.entity_id ? ` #${log.entity_id}` : ''}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(log.created_at)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
