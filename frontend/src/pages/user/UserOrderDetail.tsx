import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, unwrap, uploadFile, getErrorMessage } from '@/lib/api';
import type { Order } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Loading, SectionCard, InfoRow } from '@/components/ui/shared';
import { formatPrice, formatDate, resolveMediaUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, ArrowLeft, Copy, Check, User, Mail, Key } from 'lucide-react';

const statusVariant: Record<string, any> = {
  pending: 'warning', awaiting_payment: 'warning', payment_submitted: 'default', approved: 'success', rejected: 'destructive', delivered: 'success', cancelled: 'destructive',
};

export default function UserOrderDetail() {
  const { id } = useParams();
  const { locale, t } = useI18n();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) unwrap(api.get(`/orders/mine/${id}`)).then((d) => setOrder(d as Order)).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, [id]);

  const handleProof = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      const updated = await unwrap(api.patch(`/orders/mine/${id}/proof`, { payment_proof_url: url }));
      setOrder(updated as Order);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setUploading(false); }
  };

  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  if (loading) return <Loading />;
  if (error || !order) return <div className="text-center py-16"><p className="text-destructive">{error || 'Order not found'}</p><Link to="/account/orders" className="mt-4 inline-block text-primary">← Back to orders</Link></div>;

  return (
    <div>
      <Link to="/account/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to orders</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Order {order.order_number}</h1>
          <p className="mt-1 text-muted-foreground">{formatDate(order.created_at, locale)}</p>
        </div>
        <Badge variant={statusVariant[order.status]} className="text-sm capitalize">{order.status.replace(/_/g, ' ')}</Badge>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Order Details">
          <div className="flex items-center gap-4 rounded-lg border border-border p-4">
            {order.product?.logo_url && <img src={resolveMediaUrl(order.product.logo_url) || ''} alt="" className="h-12 w-12 rounded object-contain" />}
            <div className="flex-1">
              <p className="font-semibold">{order.product?.name_en}</p>
              <p className="text-sm text-muted-foreground">Qty: {order.quantity}</p>
            </div>
            <span className="font-bold">{formatPrice(order.total_price, 'DZD')}</span>
          </div>
          <div className="mt-4">
            <InfoRow label="Unit Price" value={formatPrice(order.unit_price, 'DZD')} />
            <InfoRow label="Quantity" value={order.quantity} />
            <InfoRow label="Total" value={<span className="font-bold">{formatPrice(order.total_price, 'DZD')}</span>} />
            <InfoRow label="Status" value={<span className="capitalize">{order.status.replace(/_/g, ' ')}</span>} />
          </div>
        </SectionCard>

        <div className="space-y-6">
          {order.status === 'delivered' && order.delivery_account && (
            <SectionCard title="Delivery Credentials" >
              <div className="space-y-3">
                {order.delivery_account.email && <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {order.delivery_account.email}</span>
                  <button onClick={() => copy(order.delivery_account!.email!)} className="text-muted-foreground hover:text-primary">{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}</button>
                </div>}
                {order.delivery_account.password && <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="flex items-center gap-2 text-sm"><Key className="h-4 w-4 text-muted-foreground" /> {order.delivery_account.password}</span>
                  <button onClick={() => copy(order.delivery_account!.password!)} className="text-muted-foreground hover:text-primary">{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}</button>
                </div>}
                {order.delivery_account.username && <div className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /> {order.delivery_account.username}</span>
                  <button onClick={() => copy(order.delivery_account!.username!)} className="text-muted-foreground hover:text-primary">{copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}</button>
                </div>}
                {order.delivery_account.extra && <p className="rounded-lg border border-border p-3 text-sm text-muted-foreground">{order.delivery_account.extra}</p>}
              </div>
            </SectionCard>
          )}

          {order.admin_note && <SectionCard title="Admin Note"><p className="text-sm text-muted-foreground">{order.admin_note}</p></SectionCard>}

          {['awaiting_payment', 'pending', 'rejected'].includes(order.status) && (
            <SectionCard title="Payment Proof">
              {order.payment_proof_url && <img src={resolveMediaUrl(order.payment_proof_url) || ''} alt="Proof" className="mb-3 w-full rounded-lg border border-border" />}
              <input type="file" accept="image/*" className="hidden" id="proof-upload" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleProof(f); }} />
              <Button onClick={() => document.getElementById('proof-upload')?.click()} disabled={uploading} variant="outline" className="w-full">
                <Upload className="me-1 h-4 w-4" /> {uploading ? 'Uploading...' : order.payment_proof_url ? 'Replace Proof' : 'Upload Payment Proof'}
              </Button>
              {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
