import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Testimonial } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Loading, PageContainer } from '@/components/ui/shared';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TestimonialsPage() {
  const { locale } = useI18n();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    unwrap(api.get('/testimonials')).then((d) => setTestimonials(d as Testimonial[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, []);

  const getText = (t: Testimonial) => t[`content_${locale}` as 'content_en'] || t.content_en;

  return (
    <PageContainer title="Customer Testimonials" subtitle="What our customers say about Aboni">
      {loading ? <Loading /> : error ? <p className="text-destructive">{error}</p> : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="relative rounded-xl border border-border bg-card p-6 shadow-sm">
              <Quote className="absolute end-4 top-4 h-8 w-8 text-primary/10" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn('h-4 w-4', i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-muted')} />
                ))}
              </div>
              <p className="mt-4 text-muted-foreground leading-relaxed">"{getText(t)}"</p>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-medium">{t.name}</p>
                  {t.role && <p className="text-xs text-muted-foreground">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}


