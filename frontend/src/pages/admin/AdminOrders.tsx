import { useEffect, useState } from 'react';
import { Check, Eye, X, Truck } from 'lucide-react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import type { DeliveryAccount, Order, OrderStatus, ReviewOrderPayload } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatPrice, resolveMediaUrl } from '@/lib/utils';

const statusVariant: Record<OrderStatus, 'default' | 'warning' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  awaiting_payment: 'warning',
  payment_submitted: 'secondary',
  approved: 'success',
  rejected: 'destructive',
  delivered: 'success',
  cancelled: 'destructive',
};

export default function AdminOrdersPage() {
  const { t, locale } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [approveOrder, setApproveOrder] = useState<Order | null>(null);
  const [credentials, setCredentials] = useState<DeliveryAccount>({ username: '', email: '', password: '', extra: '' });
  const [adminNote, setAdminNote] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const q = statusFilter ? `?status=${statusFilter}` : '';
    unwrap(api.get(`/orders/admin/all${q}`))
      .then((d) => setOrders(d as Order[]))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const review = async (orderId: number, payload: ReviewOrderPayload) => {
    setSaving(true);
    setError('');
    try {
      await unwrap(api.patch(`/orders/admin/${orderId}/review`, payload));
      setApproveOrder(null);
      setCredentials({ username: '', email: '', password: '', extra: '' });
      setAdminNote('');
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  const handleReject = (order: Order) => {
    if (!confirm('Reject this order?')) return;
    review(order.id, { status: 'rejected', admin_note: adminNote || undefined });
  };

  const handleApproveSubmit = () => {
    if (!approveOrder) return;
    review(approveOrder.id, {
      status: 'approved',
      admin_note: adminNote || undefined,
      delivery_account: {
        username: credentials.username || undefined,
        email: credentials.email || undefined,
        password: credentials.password || undefined,
        extra: credentials.extra || undefined,
      },
    });
  };

  const handleDeliver = (order: Order) => {
    review(order.id, { status: 'delivered' });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold">{t.admin.orders}</h1>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="">All statuses</option>
          {(Object.keys(t.status) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>{t.status[s]}</option>
          ))}
        </Select>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const proof = resolveMediaUrl(order.payment_proof_url);
                  const productName = order.product ? getProductName(order.product, locale) : `#${order.product_id}`;
                  const canReview = ['payment_submitted', 'awaiting_payment', 'pending'].includes(order.status);

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                      <TableCell>
                        <div className="text-sm">{order.user?.name || order.user_id}</div>
                        <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                      </TableCell>
                      <TableCell>{productName}</TableCell>
                      <TableCell>{formatPrice(order.total_price)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[order.status]}>{t.status[order.status]}</Badge>
                      </TableCell>
                      <TableCell>
                        {proof ? (
                          <Button variant="ghost" size="sm" onClick={() => setProofUrl(proof)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {canReview && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-emerald-400 hover:text-emerald-300"
                                title={t.admin.approve}
                                onClick={() => { setApproveOrder(order); setAdminNote(''); }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive/80"
                                title={t.admin.reject}
                                onClick={() => handleReject(order)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {order.status === 'approved' && (
                            <Button variant="ghost" size="icon" title={t.admin.deliver} onClick={() => handleDeliver(order)}>
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!proofUrl} onOpenChange={(o) => !o && setProofUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t.admin.paymentProof}</DialogTitle>
          </DialogHeader>
          {proofUrl && (
            proofUrl.endsWith('.pdf') ? (
              <a href={proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">Open PDF</a>
            ) : (
              <img src={proofUrl} alt="Payment proof" className="max-h-[70vh] w-full rounded-lg object-contain" />
            )
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!approveOrder} onOpenChange={(o) => !o && setApproveOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.admin.deliveryCredentials}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>{t.orders.username}</Label>
              <Input value={credentials.username} onChange={(e) => setCredentials((c) => ({ ...c, username: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>{t.auth.email}</Label>
              <Input value={credentials.email} onChange={(e) => setCredentials((c) => ({ ...c, email: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>{t.orders.password}</Label>
              <Input value={credentials.password} onChange={(e) => setCredentials((c) => ({ ...c, password: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>{t.orders.extra}</Label>
              <Textarea value={credentials.extra} onChange={(e) => setCredentials((c) => ({ ...c, extra: e.target.value }))} className="mt-1" rows={2} />
            </div>
            <div>
              <Label>{t.orders.adminNote}</Label>
              <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="mt-1" rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOrder(null)}>{t.admin.cancel}</Button>
            <Button onClick={handleApproveSubmit} disabled={saving}>{saving ? t.common.loading : t.admin.approve}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
