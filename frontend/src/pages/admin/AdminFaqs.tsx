import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Faq } from '@/lib/types';
import { Loading } from '@/components/ui/shared';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Label, Checkbox } from '@/components/ui';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Type } from 'lucide-react';

const emptyForm = { question_en: '', question_fr: '', question_ar: '', answer_en: '', answer_fr: '', answer_ar: '', category: 'general', sort_order: 0, is_active: true };

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { unwrap(api.get('/faqs/admin/all')).then((d) => setFaqs(d as Faq[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (f: Faq) => { setEditing(f); setForm({ question_en: f.question_en, question_fr: f.question_fr, question_ar: f.question_ar, answer_en: f.answer_en, answer_fr: f.answer_fr, answer_ar: f.answer_ar, category: f.category, sort_order: f.sort_order, is_active: f.is_active }); setOpen(true); };
  const save = async () => { setSaving(true); setError(''); try { if (editing) await unwrap(api.patch(`/faqs/admin/${editing.id}`, form)); else await unwrap(api.post('/faqs/admin', form)); setOpen(false); load(); } catch (e) { setError(getErrorMessage(e)); } finally { setSaving(false); } };
  const remove = async (id: number) => { if (confirm('Delete this FAQ?')) { await unwrap(api.delete(`/faqs/admin/${id}`)); load(); } };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="font-display text-3xl font-bold">FAQs</h1><p className="mt-1 text-muted-foreground">{faqs.length} questions</p></div><Button onClick={openCreate}><Plus className="h-4 w-4" /> Add FAQ</Button></div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6">
        <Table><TableHeader><TableRow><TableHead>Question</TableHead><TableHead>Category</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {faqs.map((f) => (<TableRow key={f.id}><TableCell className="max-w-md truncate">{f.question_en}</TableCell><TableCell><Badge>{f.category}</Badge></TableCell><TableCell><Badge variant={f.is_active ? 'success' : 'destructive'}>{f.is_active ? 'Active' : 'Inactive'}</Badge></TableCell><TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(f)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(f.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell></TableRow>))}
          </TableBody>
        </Table>
        {faqs.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground"><Type className="mx-auto mb-2 h-8 w-8 text-muted-foreground" /> No FAQs yet</p>}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle></DialogHeader>
          <div className="grid max-h-[60vh] gap-4 overflow-y-auto pe-2 sm:grid-cols-2">
            <div><Label>Question (EN)</Label><Input value={form.question_en} onChange={(e) => setForm({ ...form, question_en: e.target.value })} className="mt-1" /></div>
            <div><Label>Question (FR)</Label><Input value={form.question_fr} onChange={(e) => setForm({ ...form, question_fr: e.target.value })} className="mt-1" /></div>
            <div className="sm:col-span-2"><Label>Question (AR)</Label><Input value={form.question_ar} onChange={(e) => setForm({ ...form, question_ar: e.target.value })} className="mt-1" dir="rtl" /></div>
            <div className="sm:col-span-2"><Label>Answer (EN)</Label><Textarea value={form.answer_en} onChange={(e) => setForm({ ...form, answer_en: e.target.value })} className="mt-1" rows={3} /></div>
            <div className="sm:col-span-2"><Label>Answer (FR)</Label><Textarea value={form.answer_fr} onChange={(e) => setForm({ ...form, answer_fr: e.target.value })} className="mt-1" rows={3} /></div>
            <div className="sm:col-span-2"><Label>Answer (AR)</Label><Textarea value={form.answer_ar} onChange={(e) => setForm({ ...form, answer_ar: e.target.value })} className="mt-1" rows={3} dir="rtl" /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1" /></div>
            <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="mt-1" /></div>
            <div className="sm:col-span-2"><Checkbox checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} label="Active" /></div>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
