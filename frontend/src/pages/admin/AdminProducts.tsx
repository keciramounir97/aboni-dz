import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { api, getErrorMessage, unwrap, uploadFile } from '@/lib/api';
import type { CreateProductPayload, Product, ProductCategory } from '@/lib/types';
import { PRODUCT_CATEGORIES } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatPrice, resolveMediaUrl, slugify } from '@/lib/utils';

const emptyForm: CreateProductPayload = {
  slug: '',
  name_en: '',
  name_fr: '',
  name_ar: '',
  description_en: '',
  description_fr: '',
  description_ar: '',
  logo_url: '',
  category: 'spotify',
  price: 0,
  currency: 'DZD',
  duration_days: 30,
  is_active: true,
  stock: 99,
};

export default function AdminProductsPage() {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<CreateProductPayload>(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    unwrap(api.get('/products/admin/all')).then((d) => setProducts(d as Product[])).catch(() => setProducts([]));
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      name_en: p.name_en,
      name_fr: p.name_fr,
      name_ar: p.name_ar,
      description_en: p.description_en || '',
      description_fr: p.description_fr || '',
      description_ar: p.description_ar || '',
      logo_url: p.logo_url || '',
      category: p.category,
      price: p.price,
      currency: p.currency,
      duration_days: p.duration_days,
      is_active: p.is_active,
      stock: p.stock,
    });
    setError('');
    setOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = { ...form, logo_url: form.logo_url || undefined };
      if (editing) {
        await unwrap(api.patch(`/products/${editing.id}`, payload));
      } else {
        await unwrap(api.post('/products', payload));
      }
      setOpen(false);
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    try {
      await unwrap(api.delete(`/products/${id}`));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm((f) => ({ ...f, logo_url: url }));
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{t.admin.products}</h1>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> {t.admin.createProduct}
        </Button>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Name (EN)</TableHead>
                <TableHead>{t.categories.spotify.split(' ')[0]}</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => {
                const logo = resolveMediaUrl(p.logo_url);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      {logo ? <img src={logo} alt="" className="h-8 w-8 rounded object-contain" /> : '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{p.slug}</TableCell>
                    <TableCell>{p.name_en}</TableCell>
                    <TableCell>{t.categories[p.category]}</TableCell>
                    <TableCell>{formatPrice(p.price, p.currency)}</TableCell>
                    <TableCell>
                      <Badge variant={p.is_active ? 'success' : 'destructive'}>
                        {p.is_active ? t.admin.active : t.admin.inactive}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? t.admin.editProduct : t.admin.createProduct}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2 max-h-[60vh] overflow-y-auto pe-2">
            <div className="sm:col-span-2">
              <Label>Name (EN)</Label>
              <Input
                value={form.name_en}
                onChange={(e) => setForm((f) => ({ ...f, name_en: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Name (FR)</Label>
              <Input value={form.name_fr} onChange={(e) => setForm((f) => ({ ...f, name_fr: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Name (AR)</Label>
              <Input value={form.name_ar} onChange={(e) => setForm((f) => ({ ...f, name_ar: e.target.value }))} className="mt-1" dir="rtl" />
            </div>
            <div className="sm:col-span-2">
              <Label>Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 font-mono" />
            </div>
            <div className="sm:col-span-2">
              <Label>Description (EN)</Label>
              <Textarea value={form.description_en} onChange={(e) => setForm((f) => ({ ...f, description_en: e.target.value }))} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>Description (FR)</Label>
              <Textarea value={form.description_fr} onChange={(e) => setForm((f) => ({ ...f, description_fr: e.target.value }))} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>Description (AR)</Label>
              <Textarea value={form.description_ar} onChange={(e) => setForm((f) => ({ ...f, description_ar: e.target.value }))} className="mt-1" rows={2} dir="rtl" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))} className="mt-1">
                {PRODUCT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{t.categories[c]}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Price (DZD)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="mt-1" />
            </div>
            <div>
              <Label>Duration (days)</Label>
              <Input type="number" value={form.duration_days} onChange={(e) => setForm((f) => ({ ...f, duration_days: Number(e.target.value) }))} className="mt-1" />
            </div>
            <div>
              <Label>Stock</Label>
              <Input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: Number(e.target.value) }))} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Logo URL</Label>
              <Input value={form.logo_url} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))} className="mt-1" placeholder="https://... or /uploads/..." />
              <div className="mt-2">
                <Label className="text-xs text-muted-foreground">Or upload</Label>
                <Input type="file" accept="image/*" className="mt-1" disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
              </div>
              {form.logo_url && (
                <img src={resolveMediaUrl(form.logo_url) || ''} alt="" className="mt-2 h-16 w-16 rounded object-contain bg-muted/40" />
              )}
            </div>
            <div className="sm:col-span-2">
              <Checkbox
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                label={t.admin.active}
              />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>{t.admin.cancel}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? t.common.loading : t.admin.save}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
