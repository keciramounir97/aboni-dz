import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Loading, PageContainer } from '@/components/ui/shared';
import { resolveMediaUrl, formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/ProductCard';
import { Flame, Ticket } from 'lucide-react';

export default function DealsPage() {
  const { locale, t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'duration'>('price-asc');

  useEffect(() => {
    unwrap(api.get('/products')).then((d) => setProducts(d as Product[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, []);

  const sorted = [...products].sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    return b.duration_days - a.duration_days;
  });

  const cheapest = [...products].sort((a, b) => a.price - b.price)[0];

  return (
    <PageContainer
      title="Best Deals"
      description="Find the best prices and longest durations"
      actions={
        <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration">Longest Duration</option>
        </select>
      }
    >
      {loading ? <Loading /> : error ? <p className="text-destructive">{error}</p> : (
        <>
          {cheapest && (
            <div className="mb-8 flex items-center gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <Flame className="h-8 w-8 text-amber-500" />
              <div className="flex-1">
                <h3 className="font-semibold">🔥 Hottest Deal</h3>
                <p className="text-sm text-muted-foreground">{getProductName(cheapest, locale)} — only {formatPrice(cheapest.price, cheapest.currency)} for {cheapest.duration_days} {t.shop.days}</p>
              </div>
              <Link to={`/shop/${cheapest.slug}`} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">View Deal</Link>
            </div>
          )}
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-border bg-card p-4">
            <Ticket className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Use code <span className="font-mono font-bold text-primary">WELCOME10</span> for 10% off your first order!</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </PageContainer>
  );
}
