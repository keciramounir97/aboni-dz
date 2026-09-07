import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '@/lib/api';
import type { Review } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Loading, EmptyState } from '@/components/ui/shared';
import { formatDate, resolveMediaUrl } from '@/lib/utils';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function UserReviews() {
  const { locale } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    unwrap(api.get('/reviews/mine')).then((d) => setReviews(d as Review[])).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">My Reviews</h1>
      <p className="mt-1 text-muted-foreground">{reviews.length} reviews submitted</p>

      {reviews.length === 0 ? <div className="mt-8"><EmptyState icon={Star} title="No reviews yet" message="Review products after purchase to help other customers." action={<Link to="/shop" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Browse Shop</Link>} /></div> : (
        <div className="mt-8 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                {r.product?.logo_url && <img src={resolveMediaUrl(r.product.logo_url) || ''} alt="" className="h-8 w-8 rounded object-contain" />}
                <Link to={`/shop/${r.product?.slug}`} className="font-medium hover:text-primary">{r.product ? getProductName(r.product, locale) : 'Product'}</Link>
                <Badge variant={r.is_approved ? 'success' : 'warning'}>{r.is_approved ? 'Approved' : 'Pending'}</Badge>
                <span className="ms-auto text-xs text-muted-foreground">{formatDate(r.created_at, locale)}</span>
              </div>
              <div className="mt-2 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < r.rating ? 'h-4 w-4 fill-amber-400 text-amber-400' : 'h-4 w-4 text-muted'} />)}
              </div>
              {r.comment && <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
