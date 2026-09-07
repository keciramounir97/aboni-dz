import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Faq } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Loading } from '@/components/ui/shared';
import { PageContainer } from '@/components/ui/shared';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FaqPage() {
  const { locale } = useI18n();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    unwrap(api.get('/faqs')).then((d) => setFaqs(d as Faq[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...Array.from(new Set(faqs.map((f) => f.category)))];
  const filtered = category === 'all' ? faqs : faqs.filter((f) => f.category === category);

  const getText = (f: Faq, field: 'question' | 'answer') => {
    return f[`${field}_${locale}` as 'question_en' | 'answer_en'] || f[`${field}_en` as 'question_en' | 'answer_en'];
  };

  return (
    <PageContainer title="Frequently Asked Questions" subtitle="Find answers to common questions about Aboni">
      {loading ? <Loading /> : error ? <p className="text-destructive">{error}</p> : (
        <>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c)} className={cn('rounded-full px-4 py-1.5 text-sm font-medium transition-colors', category === c ? 'bg-primary text-primary-foreground' : 'border border-border bg-card hover:bg-muted')}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-3">
            {filtered.map((f) => (
              <div key={f.id} className="rounded-xl border border-border bg-card shadow-sm">
                <button onClick={() => setOpen(open === f.id ? null : f.id)} className="flex w-full items-center justify-between p-5 text-start">
                  <span className="font-medium">{getText(f, 'question')}</span>
                  <ChevronDown className={cn('h-5 w-5 shrink-0 text-muted-foreground transition-transform', open === f.id && 'rotate-180')} />
                </button>
                {open === f.id && (
                  <div className="border-t border-border px-5 py-4 text-muted-foreground">{getText(f, 'answer')}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
