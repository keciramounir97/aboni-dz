import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Loading, PageContainer } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { FileText, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const { locale } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    unwrap(api.get('/blog')).then((d) => setPosts(d as BlogPost[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, []);

  const getTitle = (p: BlogPost) => p[`title_${locale}` as 'title_en'] || p.title_en;
  const getExcerpt = (p: BlogPost) => p[`excerpt_${locale}` as 'excerpt_en'] || p.excerpt_en || '';

  return (
    <PageContainer title="Blog & Guides" subtitle="Tips, comparisons, and guides about digital subscriptions">
      {loading ? <Loading /> : error ? <p className="text-destructive">{error}</p> : posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">{p.tag || 'article'}</span>
              <h3 className="mt-3 font-display text-lg font-bold group-hover:text-primary">{getTitle(p)}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{getExcerpt(p)}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{formatDate(p.published_at || p.created_at, locale)}</span>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
