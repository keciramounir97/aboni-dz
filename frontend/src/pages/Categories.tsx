import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Product, ProductCategory } from '@/lib/types';
import { PRODUCT_CATEGORIES } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Loading, PageContainer } from '@/components/ui/shared';
import { resolveMediaUrl, formatPrice } from '@/lib/utils';

export default function CategoriesPage() {
  const { locale, t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    unwrap(api.get('/products')).then((d) => setProducts(d as Product[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, []);

  const byCategory = (cat: ProductCategory) => products.filter((p) => p.category === cat);
  const categoryIcons: Record<string, string> = {
    spotify: '🎵', netflix: '🎬', playstation: '🎮', xbox: '🕹️', snapchat: '👻', disney: '✨', youtube: '📺', other: '📦',
  };

  if (loading) return <Loading />;
  if (error) return <PageContainer title="Categories"><p className="text-destructive">{error}</p></PageContainer>;

  return (
    <PageContainer title="Browse by Category" subtitle="Find subscriptions for your favorite platforms">
      <div className="space-y-8">
        {PRODUCT_CATEGORIES.map((cat) => {
          const items = byCategory(cat);
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <div className="mb-4 flex items-center gap-3">
                <span className="text-3xl">{categoryIcons[cat]}</span>
                <h2 className="font-display text-2xl font-bold">{t.categories[cat]}</h2>
                <span className="rounded-full bg-muted px-3 py-0.5 text-sm text-muted-foreground">{items.length} items</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p) => (
                  <Link key={p.id} to={`/shop/${p.slug}`} className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3">
                      {p.logo_url && <img src={resolveMediaUrl(p.logo_url) || ''} alt="" className="h-10 w-10 rounded object-contain" />}
                      <div>
                        <h3 className="font-semibold group-hover:text-primary">{getProductName(p, locale)}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(p.price, p.currency)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{p.duration_days} {t.shop.days}</p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}
