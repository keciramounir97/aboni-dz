import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap } from '@/lib/api';
import type { Wishlist } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Loading, EmptyState } from '@/components/ui/shared';
import { formatPrice, resolveMediaUrl } from '@/lib/utils';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

export default function UserWishlist() {
  const { locale, t } = useI18n();
  const [items, setItems] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    unwrap(api.get('/wishlist/mine')).then((d) => setItems(d as Wishlist[])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const remove = async (productId: number) => {
    await unwrap(api.delete(`/wishlist/${productId}`));
    load();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
      <p className="mt-1 text-muted-foreground">{items.length} saved items</p>

      {loading ? <Loading /> : items.length === 0 ? (
        <div className="mt-8">
          <EmptyState icon={Heart} title="Your wishlist is empty" message="Save items you're interested in to find them quickly later." action={<Link to="/shop" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Browse Shop</Link>} />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((w) => (
            <div key={w.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-3">
                {w.product?.logo_url && <img src={resolveMediaUrl(w.product.logo_url) || ''} alt="" className="h-10 w-10 rounded object-contain" />}
                <div className="flex-1">
                  <Link to={`/shop/${w.product?.slug}`} className="font-semibold hover:text-primary">{w.product ? getProductName(w.product, locale) : 'Product'}</Link>
                  <p className="text-sm text-muted-foreground">{w.product ? formatPrice(w.product.price, w.product.currency) : ''}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/shop/${w.product?.slug}`} className="flex-1 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <ShoppingCart className="me-1 inline h-4 w-4" /> Order
                </Link>
                <button onClick={() => remove(w.product_id)} className="rounded-md border border-border px-3 py-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
