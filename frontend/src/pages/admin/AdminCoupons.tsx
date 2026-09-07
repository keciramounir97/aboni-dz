import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Coupon } from '@/lib/types';
import { Loading } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';

const emptyForm = { code: '', description: '', discount_percent: 10, max_uses: 0, is_active: true, expires_at: '' };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => { unwrap(api.get('/coupons/admin/all')).then((d) => setCoupons(d as Coupon[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (c: Coupon) => { setEditing(c); setForm({ code: c.code, description: c.description || '', discount_percent: c.discount_percent, max_uses: c.max_uses, is_active: c.is_active, expires_at: c.expires_at?.slice(0, 10) || '' }); setOpen(true); };

  const save = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, expires_at: form.expires_at || undefined };
      if (editing) await unwrap(api.patch(`/coupons/admin/${editing.id}`, payload));
      else await unwrap(api.post('/coupons/admin', payload));
      setOpen(false); load();
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSaving(false); }
  };

  const remove = async (id: number) => { if (confirm('Delete this coupon?')) { await unwrap(api.delete(`/coupons/admin/${id}`)); load(); } };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold">Coupons</h1><p className="mt-1 text-muted-foreground">{coupons.length} discount codes</p></div>
        <Button onClick={openCreate}><Plus className="h-4 w-4" /> Create Coupon</Button>
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6">
        <Table>
          <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Description</TableHead><TableHead>Discount</TableHead><TableHead>Usage</TableHead><TableHead>Status</TableHead><TableHead>Expires</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {coupons.map((c) => (
              <TableRow key={c.id}>
                <TableCell><span className="flex items-center gap-2 font-mono font-bold"><Ticket className="h-3 w-3 text-primary" /> {c.code}</span></TableCell>
                <TableCell className="text-sm text-muted-foreground">{c.description || '—'}</TableCell>
                <TableCell><Badge>{c.discount_percent}%</Badge></TableCell>
                <TableCell className="text-sm">{c.used_count}{c.max_uses > 0 ? ` / ${c.max_uses}` : ''}</TableCell>
                <TableCell><Badge variant={c.is_active ? 'success' : 'destructive'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.expires_at ? formatDate(c.expires_at) : 'Never'}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {coupons.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No coupons yet</p>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Coupon' : 'Create Coupon'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-1 font-mono uppercase" placeholder="WELCOME10" /></div>
            <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" placeholder="10% off first order" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Discount (%)</Label><Input type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} className="mt-1" /></div>
              <div><Label>Max Uses (0 = unlimited)</Label><Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: Number(e.target.value) })} className="mt-1" /></div>
            </div>
            <div><Label>Expires At (optional)</Label><Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="mt-1" /></div>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4" /> Active</label>
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
