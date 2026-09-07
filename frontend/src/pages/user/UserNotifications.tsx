import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { SectionCard } from '@/components/ui/shared';
import { Bell, Check, ShoppingCart, Star, Package, Info } from 'lucide-react';
import { formatDate } from '@/lib/utils';

type Notification = { id: string; title: string; message: string; type: 'order' | 'review' | 'system' | 'promotion'; read: boolean; date: string };

export default function UserNotifications() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const stored = localStorage.getItem('aboni_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const sample: Notification[] = [
        { id: '1', title: 'Welcome to Aboni!', message: `Welcome ${user?.name}! Start browsing our premium subscriptions.`, type: 'system', read: false, date: new Date().toISOString() },
        { id: '2', title: 'Newsletter', message: 'Subscribe to our newsletter for exclusive deals and updates.', type: 'promotion', read: false, date: new Date(Date.now() - 86400000).toISOString() },
        { id: '3', title: 'Review your purchases', message: 'Share your experience and help other customers.', type: 'review', read: true, date: new Date(Date.now() - 172800000).toISOString() },
      ];
      setNotifications(sample);
      localStorage.setItem('aboni_notifications', JSON.stringify(sample));
    }
  }, [user]);

  const save = (list: Notification[]) => { setNotifications(list); localStorage.setItem('aboni_notifications', JSON.stringify(list)); };
  const markRead = (id: string) => save(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => save(notifications.map((n) => ({ ...n, read: true })));
  const deleteN = (id: string) => save(notifications.filter((n) => n.id !== id));

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter((n) => !n.read) : notifications.filter((n) => n.type === filter);
  const unread = notifications.filter((n) => !n.read).length;
  const typeIcons: Record<string, any> = { order: ShoppingCart, review: Star, system: Info, promotion: Bell };
  const typeColors: Record<string, string> = { order: 'text-primary', review: 'text-amber-500', system: 'text-blue-500', promotion: 'text-purple-500' };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Notifications</h1>
          <p className="mt-1 text-muted-foreground">{unread > 0 ? `${unread} unread notifications` : 'All caught up!'}</p>
        </div>
        {unread > 0 && <button onClick={markAllRead} className="text-sm text-primary hover:underline">Mark all as read</button>}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {['all', 'unread', 'order', 'review', 'system', 'promotion'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'border border-border bg-card hover:bg-muted'}`}>{f}</button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-16 text-center">
            <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No notifications</p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = typeIcons[n.type] || Bell;
            return (
              <div key={n.id} className={`flex items-start gap-3 rounded-xl border border-border bg-card p-4 ${!n.read ? 'border-primary/30' : ''}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted ${typeColors[n.type] || 'text-muted-foreground'}`}><Icon className="h-4 w-4" /></span>
                <div className="flex-1" onClick={() => !n.read && markRead(n.id)}>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDate(n.date)}</p>
                </div>
                <button onClick={() => deleteN(n.id)} className="text-muted-foreground hover:text-destructive"><Package className="h-4 w-4" /></button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
