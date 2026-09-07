import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingBag } from 'lucide-react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductDescription, getProductName } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, resolveMediaUrl } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) return;
    unwrap(api.get(`/products/slug/${slug}`))
      .then((data) => setProduct(data as Product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleOrder = async () => {
    if (!token) {
      navigate('/login', { state: { from: `/shop/${slug}` } });
      return;
    }
    if (!product) return;
    setOrdering(true);
    setError('');
    try {
      const order = await unwrap(api.post('/orders', { product_id: product.id, quantity: 1 }));
      navigate('/orders', { state: { highlight: (order as { id: number }).id } });
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">
          {t.common.back}
        </Link>
      </div>
    );
  }

  const name = getProductName(product, locale);
  const desc = getProductDescription(product, locale);
  const logo = resolveMediaUrl(product.logo_url);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/shop" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> {t.common.back}
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden border-border/80">
          <CardContent className="flex flex-col items-center p-10">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border">
              {logo ? (
                <img src={logo} alt={name} className="h-full w-full object-contain p-4" />
              ) : (
                <span className="font-display text-4xl font-bold text-primary">{name.charAt(0)}</span>
              )}
            </div>
            <Badge className="mt-6" variant="secondary">
              {t.categories[product.category]}
            </Badge>
          </CardContent>
        </Card>

        <div>
          <h1 className="font-display text-4xl font-bold">{name}</h1>
          <p className="mt-4 text-3xl font-bold text-gradient">{formatPrice(product.price, product.currency)}</p>

          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {t.product.duration}: {product.duration_days} {t.shop.days}
            </span>
          </div>

          {desc && (
            <div className="mt-6">
              <h2 className="font-semibold">{t.product.description}</h2>
              <p className="mt-2 text-muted-foreground whitespace-pre-wrap">{desc}</p>
            </div>
          )}

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <Button
            size="lg"
            className="mt-8 w-full gap-2 sm:w-auto"
            onClick={handleOrder}
            disabled={ordering || product.stock <= 0}
          >
            <ShoppingBag className="h-5 w-5" />
            {!token ? t.product.loginRequired : ordering ? t.product.ordering : product.stock <= 0 ? t.shop.outOfStock : t.product.order}
          </Button>
        </div>
      </div>
    </div>
  );
}
