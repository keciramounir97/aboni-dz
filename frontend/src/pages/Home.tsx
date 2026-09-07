import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { Product } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';

export default function HomePage() {
  const { t } = useI18n();
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    unwrap(api.get('/products')).then((data) => setFeatured((data as Product[]).slice(0, 4))).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
        <div className="absolute -start-32 top-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute -end-32 bottom-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-brand-300 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            Algeria&apos;s digital subscription hub
          </div>

          <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-7xl md:text-8xl animate-fade-in">
            <span className="text-gradient">Aboni</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t.home.headline}
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground/80 animate-fade-in" style={{ animationDelay: '0.15s' }}>
            {t.home.subline}
          </p>

          <Link to="/shop" className="mt-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="gap-2 px-10 text-base">
              {t.home.cta}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="mb-8 font-display text-2xl font-bold">{t.home.featured}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
