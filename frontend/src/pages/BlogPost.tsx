import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Loading, MarkdownContent } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams();
  const { locale } = useI18n();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      unwrap(api.get(`/blog/slug/${slug}`)).then((d) => setPost(d as BlogPost)).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) return <Loading />;
  if (error || !post) return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-destructive">{error || 'Post not found'}</p>
      <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Back to blog</Link>
    </div>
  );

  const title = post[`title_${locale}` as 'title_en'] || post.title_en;
  const content = post[`content_${locale}` as 'content_en'] || post.content_en || '';
  const excerpt = post[`excerpt_${locale}` as 'excerpt_en'] || post.excerpt_en || '';

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
      <div className="mt-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {post.tag && <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> {post.tag}</span>}
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {formatDate(post.published_at || post.created_at, locale)}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {excerpt && <p className="mt-3 text-lg text-muted-foreground">{excerpt}</p>}
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6 sm:p-8">
        <MarkdownContent content={content} />
      </div>
    </article>
  );
}
