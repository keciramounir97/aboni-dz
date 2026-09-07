import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Review } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Loading } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Check, X, Trash2 } from 'lucide-react';

export default function AdminReviews() {
  const { locale } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => { unwrap(api.get('/reviews/admin/all')).then((d) => setReviews(d as Review[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const toggle = async (id: number, approved: boolean) => {
    await unwrap(api.patch(`/reviews/admin/${id}/approve`, { is_approved: approved }));
    load();
  };
  const remove = async (id: number) => { if (confirm('Delete this review?')) { await unwrap(api.delete(`/reviews/admin/${id}`)); load(); } };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Reviews</h1>
      <p className="mt-1 text-muted-foreground">{reviews.length} reviews · {reviews.filter((r) => !r.is_approved).length} pending approval</p>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Product</TableHead><TableHead>User</TableHead><TableHead>Rating</TableHead><TableHead>Comment</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm">{r.product ? getProductName(r.product, locale) : '—'}</TableCell>
                <TableCell className="text-sm">{r.user?.name || 'Unknown'}</TableCell>
                <TableCell><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < r.rating ? 'h-3 w-3 fill-amber-400 text-amber-400' : 'h-3 w-3 text-muted'} />)}</div></TableCell>
                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">{r.comment || '—'}</TableCell>
                <TableCell><Badge variant={r.is_approved ? 'success' : 'warning'}>{r.is_approved ? 'Approved' : 'Pending'}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(r.created_at, locale)}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {!r.is_approved && <Button variant="ghost" size="icon" onClick={() => toggle(r.id, true)} title="Approve"><Check className="h-4 w-4 text-emerald-500" /></Button>}
                    {r.is_approved && <Button variant="ghost" size="icon" onClick={() => toggle(r.id, false)} title="Unapprove"><X className="h-4 w-4 text-amber-500" /></Button>}
                    <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {reviews.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No reviews yet</p>}
      </div>
    </div>
  );
}
