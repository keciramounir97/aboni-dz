import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { Order, DeliveryAccount, ReviewOrderPayload } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Loading, SectionCard, InfoRow } from '@/components/ui/shared';
import { formatPrice, formatDate, resolveMediaUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link as LinkIcon, ArrowLeft, Check, X, Truck, Eye } from 'lucide-react';

const statusVariant: Record<string, any> = { pending: 'warning', awaiting_payment: 'warning', payment_submitted: 'default', approved: 'success', rejected: 'destructive', delivered: 'success', cancelled: 'destructive' };

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { locale, t } = useI18n();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<DeliveryAccount>({ username: '', email: '', password: '', extra: '' });
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCreds, setShowCreds] = useState(false);

  useEffect(() => {
    if (id) unwrap(api.get(`/orders/admin/${id}`)).then((d) => setOrder(d as Order)).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false));
  }, [id]);

  const review = async (payload: ReviewOrderPayload) => {
    setSaving(true); setError('');
    try {
      const updated = await unwrap(api.patch(`/orders/admin/${id}/review`, payload));
      setOrder(updated as Order); setShowCreds(false);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  if (error || !order) return <div className="text-center py-16"><p className="text-destructive">{error || 'Not found'}</p><Link to="/admin/orders" className="mt-4 inline-block text-primary">← Back</Link></div>;

  const canReview = ['payment_submitted', 'awaiting_payment', 'pending'].includes(order.status);

  return (
    <div>
      <Link to="/admin/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to orders</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="font-display text-3xl font-bold">{order.order_number}</h1><p className="mt-1 text-muted-foreground">{formatDate(order.created_at, locale)} · {order.user?.name} ({order.user?.email})</p></div>
        <Badge variant={statusVariant[order.status]} className="text-sm capitalize">{order.status.replace(/_/g, ' ')}</Badge>
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <SectionCard title="Order Details">
          <div className="flex items-center gap-4 rounded-lg border border-border p-4 mb-4">
            {order.product?.logo_url && <img src={resolveMediaUrl(order.product.logo_url) || ''} alt="" className="h-12 w-12 rounded object-contain" />}
            <div className="flex-1"><p className="font-semibold">{order.product ? getProductName(order.product, locale) : 'Product'}</p><p className="text-sm text-muted-foreground">Qty: {order.quantity}</p></div>
            <span className="font-bold">{formatPrice(order.total_price, 'DZD')}</span>
          </div>
          <InfoRow label="Unit Price" value={formatPrice(order.unit_price, 'DZD')} />
          <InfoRow label="Quantity" value={order.quantity} />
          <InfoRow label="Total" value={<span className="font-bold">{formatPrice(order.total_price, 'DZD')}</span>} />
          <InfoRow label="Customer" value={order.user?.name} />
          <InfoRow label="Email" value={order.user?.email} />
          <InfoRow label="Date" value={formatDate(order.created_at, locale)} />
          {order.reviewed_at && <InfoRow label="Reviewed At" value={formatDate(order.reviewed_at, locale)} />}
        </SectionCard>

        <div className="space-y-6">
          {order.payment_proof_url && <SectionCard title="Payment Proof"><img src={resolveMediaUrl(order.payment_proof_url) || ''} alt="Proof" className="w-full rounded-lg border border-border" /><a href={resolveMediaUrl(order.payment_proof_url) || ''} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"><Eye className="h-4 w-4" /> Open full size</a></SectionCard>}

          {order.delivery_account && <SectionCard title="Delivery Credentials"><div className="space-y-2"><InfoRow label="Username" value={order.delivery_account.username} /><InfoRow label="Email" value={order.delivery_account.email} /><InfoRow label="Password" value={order.delivery_account.password} />{order.delivery_account.extra && <InfoRow label="Extra" value={order.delivery_account.extra} />}</div></SectionCard>}
          {order.admin_note && <SectionCard title="Admin Note"><p className="text-sm text-muted-foreground">{order.admin_note}</p></SectionCard>}

          {canReview && (
            <SectionCard title="Review Order">
              {!showCreds ? (
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => setShowCreds(true)}><Check className="me-1 h-4 w-4" /> Approve & Deliver</Button>
                  <Button variant="destructive" onClick={() => review({ status: 'rejected' })} disabled={saving}><X className="me-1 h-4 w-4" /> Reject</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div><Label>Username</Label><Input value={credentials.username} onChange={(e) => setCredentials((c) => ({ ...c, username: e.target.value }))} className="mt-1" /></div>
                  <div><Label>Email</Label><Input value={credentials.email} onChange={(e) => setCredentials((c) => ({ ...c, email: e.target.value }))} className="mt-1" /></div>
                  <div><Label>Password</Label><Input value={credentials.password} onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))} className="mt-1" /></div>
                  <div><Label>Extra Info</Label><Textarea value={credentials.extra} onChange={(e) => setCredentials((c) => ({ ...c, extra: e.target.value }))} className="mt-1" rows={2} /></div>
                  <div><Label>Admin Note</Label><Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="mt-1" rows={2} /></div>
                  <div className="flex gap-2"><Button onClick={() => review({ status: 'approved', admin_note: adminNote, delivery_account: credentials })} disabled={saving}>{saving ? 'Saving...' : 'Deliver Order'}</Button><Button variant="outline" onClick={() => setShowCreds(false)}>Cancel</Button></div>
                </div>
              )}
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
