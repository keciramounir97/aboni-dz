import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatPrice, resolveMediaUrl } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { t, locale } = useI18n();
  const name = getProductName(product, locale);
  const logo = resolveMediaUrl(product.logo_url);

  return (
    <Card className="group overflow-hidden border-border/80 bg-card/80 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <CardContent className="p-0">
        <Link to={`/shop/${product.slug}`} className="block p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-muted/60 ring-1 ring-border">
              {logo ? (
                <img src={logo} alt={name} className="h-full w-full object-contain p-2" />
              ) : (
                <span className="font-display text-lg font-bold text-primary">{name.charAt(0)}</span>
              )}
            </div>
            <Badge variant="secondary">{t.categories[product.category]}</Badge>
          </div>
          <h3 className="font-display text-lg font-semibold group-hover:text-primary">{name}</h3>
          <p className="mt-2 text-2xl font-bold text-gradient">{formatPrice(product.price, product.currency)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.duration_days} {t.shop.days}
          </p>
        </Link>
      </CardContent>
      <CardFooter className="border-t border-border/60 p-4">
        <Link to={`/shop/${product.slug}`} className="w-full">
          <Button className="w-full" disabled={product.stock <= 0}>
            {product.stock <= 0 ? t.shop.outOfStock : t.shop.buy}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
