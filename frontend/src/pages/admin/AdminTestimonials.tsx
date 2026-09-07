import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Testimonial } from '@/lib/types';
import { Loading } from '@/components/ui/shared';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Checkbox } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { Star } from 'lucide-react';

const emptyForm = { name: '', role: '', content_en: '', content_fr: '', content_ar: '', rating: 5, is_active: true };

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { unwrap(api.get('/testimonials/admin/all')).then((d) => setItems(d as Testimonial[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ name: t.name, role: t.role || '', content_en: t.content_en, content_fr: t.content_fr, content_ar: t.content_ar, rating: t.rating, is_active: t.is_active }); setOpen(true); };
  const save = async () => { setSaving(true); setError(''); try { if (editing) await unwrap(api.patch(`/testimonials/admin/${editing.id}`, form)); else await unwrap(api.post('/testimonials/admin', form)); setOpen(false); load(); } catch (e) { setError(getErrorMessage(e)); } finally { setSaving(false); } };
  const remove = async (id: number) => { if (confirm('Delete this testimonial?')) { await unwrap(api.delete(`/testimonials/admin/${id}`)); load(); } };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">Testimonials</h1><p className="mt-1 text-muted-foreground">{items.length} testimonials</p></div><Button onClick={openCreate}><Plus className="h-4 w-4" /> Add Testimonial</Button></div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6">
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Rating</TableHead><TableHead>Content</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {items.map((t) => (<TableRow key={t.id}><TableCell className="font-medium">{t.name}</TableCell><TableCell><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={i < t.rating ? 'h-3 w-3 fill-amber-400 text-amber-400' : 'h-3 w-3 text-muted'} />)}</div></TableCell><TableCell className="max-w-xs truncate text-sm text-muted-foreground">{t.content_en}</TableCell><TableCell><Badge variant={t.is_active ? 'success' : 'destructive'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(t)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>))}
          </TableBody>
        </Table>
        {items.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground"><MessageSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground" /> No testimonials yet</p>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto pe-2">
            <div className="grid grid-cols-2 gap-4"><div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div><div><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1" placeholder="Verified buyer" /></div></div>
            <div><Label>Rating</Label><Input type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="mt-1" /></div>
            <div><Label>Content (EN)</Label><Textarea value={form.content_en} onChange={(e) => setForm({ ...form, content_en: e.target.value })} className="mt-1" rows={2} /></div>
            <div><Label>Content (FR)</Label><Textarea value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} className="mt-1" rows={2} /></div>
            <div><Label>Content (AR)</Label><Textarea value={form.content_ar} onChange={(e) => setForm({ ...form, content_ar: e.target.value })} className="mt-1" rows={2} dir="rtl" /></div>
            <Checkbox checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} label="Active" />
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
