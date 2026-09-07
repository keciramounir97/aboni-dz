import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { BlogPost } from '@/lib/types';
import { Loading } from '@/components/ui/shared';
import { formatDate, slugify } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Checkbox } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

export default function AdminBlog() {
  const { locale } = useI18n();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title_en: '', title_fr: '', title_ar: '', excerpt_en: '', excerpt_fr: '', excerpt_ar: '', content_en: '', content_fr: '', content_ar: '', tag: '', is_published: true });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { unwrap(api.get('/blog/admin/all')).then((d) => setPosts(d as BlogPost[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm({ title_en: '', title_fr: '', title_ar: '', excerpt_en: '', excerpt_fr: '', excerpt_ar: '', content_en: '', content_fr: '', content_ar: '', tag: '', is_published: true }); setOpen(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ title_en: p.title_en, title_fr: p.title_fr, title_ar: p.title_ar, excerpt_en: p.excerpt_en || '', excerpt_fr: p.excerpt_fr || '', excerpt_ar: p.excerpt_ar || '', content_en: p.content_en || '', content_fr: p.content_fr || '', content_ar: p.content_ar || '', tag: p.tag || '', is_published: p.is_published }); setOpen(true); };

  const save = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, slug: editing?.slug || slugify(form.title_en) };
      if (editing) await unwrap(api.patch(`/blog/admin/${editing.id}`, payload));
      else await unwrap(api.post('/blog/admin', payload));
      setOpen(false); load();
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => { if (confirm('Delete this post?')) { await unwrap(api.delete(`/blog/admin/${id}`)); load(); } };

  if (loading) return <Loading />;

  const getTitle = (p: BlogPost) => p[`title_${locale}` as 'title_en'] || p.title_en;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold">Blog</h1><p className="mt-1 text-muted-foreground">{posts.length} posts</p></div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> New Post</Button>
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Tag</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="max-w-xs truncate font-medium">{getTitle(p)}</TableCell>
                <TableCell>{p.tag && <Badge>{p.tag}</Badge>}</TableCell>
                <TableCell><Badge variant={p.is_published ? 'success' : 'default'}>{p.is_published ? 'Published' : 'Draft'}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(p.created_at, locale)}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {posts.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground"><FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" /> No posts yet</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit Post' : 'New Blog Post'}</DialogTitle></DialogHeader>
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto pe-2 sm:grid-cols-2">
            <div className="sm:col-span-2"><Label>Title (EN)</Label><Input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} className="mt-1" /></div>
            <div><Label>Title (FR)</Label><Input value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} className="mt-1" /></div>
            <div><Label>Title (AR)</Label><Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} className="mt-1" dir="rtl" /></div>
            <div className="sm:col-span-2"><Label>Tag</Label><Input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="mt-1" placeholder="guides, comparisons, news" /></div>
            <div className="sm:col-span-2"><Label>Excerpt (EN)</Label><Textarea value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} className="mt-1" rows={2} /></div>
            <div className="sm:col-span-2"><Label>Content (EN)</Label><Textarea value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} className="mt-1" rows={6} /></div>
            <div className="sm:col-span-2"><Label>Content (FR)</Label><Textarea value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} className="mt-1" rows={4} /></div>
            <div className="sm:col-span-2"><Label>Content (AR)</Label><Textarea value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} className="mt-1" rows={4} dir="rtl" /></div>
            <div className="sm:col-span-2"><Checkbox checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} label="Published" /></div>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
