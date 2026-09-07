import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api, unwrap } from '@/lib/api';
import type { Product, ProductCategory } from '@/lib/types';
import { PRODUCT_CATEGORIES } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ProductCard } from '@/components/ProductCard';

export default function ShopPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    unwrap(api.get(`/products?${params.toString()}`))
      .then((data) => setProducts(data as Product[]))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{t.shop.title}</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t.shop.search}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="ps-9"
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-52">
          <option value="">{t.shop.allCategories}</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t.categories[c as ProductCategory]}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="mt-16 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">{t.shop.noProducts}</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
