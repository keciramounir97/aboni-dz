import { useEffect, useRef, useState } from 'react';
import { Eye, Upload, KeyRound } from 'lucide-react';
import { api, getErrorMessage, unwrap, uploadFile } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { getProductName } from '@/i18n/translations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatDate, formatPrice, resolveMediaUrl } from '@/lib/utils';

const statusVariant: Record<OrderStatus, 'default' | 'warning' | 'success' | 'destructive' | 'secondary'> = {
  pending: 'warning',
  awaiting_payment: 'warning',
  payment_submitted: 'secondary',
  approved: 'success',
  rejected: 'destructive',
  delivered: 'success',
  cancelled: 'destructive',
};

export default function OrdersPage() {
  const { t, locale } = useI18n();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const [credentialsOrder, setCredentialsOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const load = () => {
    unwrap(api.get('/orders/mine'))
      .then((data) => setOrders(data as Order[]))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (orderId: number, file: File) => {
    setUploadingId(orderId);
    setError('');
    try {
      const url = await uploadFile(file);
      await unwrap(api.patch(`/orders/mine/${orderId}/proof`, { payment_proof_url: url }));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setUploadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{t.orders.title}</h1>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      {orders.length === 0 ? (
        <p className="mt-12 text-center text-muted-foreground">{t.orders.empty}</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const productName = order.product ? getProductName(order.product, locale) : `#${order.product_id}`;
            const canUpload = ['pending', 'awaiting_payment', 'payment_submitted'].includes(order.status) && !order.payment_proof_url;
            const proof = resolveMediaUrl(order.payment_proof_url);

            return (
              <Card key={order.id}>
                <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2 pb-2">
                  <div>
                    <CardTitle className="text-lg">
                      {t.orders.orderNumber}
                      {order.order_number}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">{productName}</p>
                  </div>
                  <Badge variant={statusVariant[order.status]}>{t.status[order.status]}</Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span>
                      {t.orders.total}: <strong>{formatPrice(order.total_price)}</strong>
                    </span>
                    <span className="text-muted-foreground">{formatDate(order.created_at, locale)}</span>
                  </div>

                  {order.admin_note && (
                    <p className="rounded-lg bg-muted/40 p-3 text-sm">
                      {t.orders.adminNote}: {order.admin_note}
                    </p>
                  )}

                  {proof && (
                    <a href={proof} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      <Eye className="h-4 w-4" /> {t.orders.proofUploaded}
                    </a>
                  )}

                  {canUpload && (
                    <div>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        ref={(el) => { fileRefs.current[order.id] = el; }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(order.id, file);
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={uploadingId === order.id}
                        onClick={() => fileRefs.current[order.id]?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        {uploadingId === order.id ? t.orders.uploading : t.orders.uploadProof}
                      </Button>
                    </div>
                  )}

                  {order.status === 'delivered' && order.delivery_account && (
                    <Button variant="secondary" size="sm" onClick={() => setCredentialsOrder(order)}>
                      <KeyRound className="h-4 w-4" />
                      {t.orders.viewCredentials}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!credentialsOrder} onOpenChange={(o) => !o && setCredentialsOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.orders.credentials}</DialogTitle>
          </DialogHeader>
          {credentialsOrder?.delivery_account && (
            <dl className="space-y-2 text-sm">
              {credentialsOrder.delivery_account.username && (
                <div>
                  <dt className="text-muted-foreground">{t.orders.username}</dt>
                  <dd className="font-mono">{credentialsOrder.delivery_account.username}</dd>
                </div>
              )}
              {credentialsOrder.delivery_account.email && (
                <div>
                  <dt className="text-muted-foreground">{t.auth.email}</dt>
                  <dd className="font-mono">{credentialsOrder.delivery_account.email}</dd>
                </div>
              )}
              {credentialsOrder.delivery_account.password && (
                <div>
                  <dt className="text-muted-foreground">{t.orders.password}</dt>
                  <dd className="font-mono">{credentialsOrder.delivery_account.password}</dd>
                </div>
              )}
              {credentialsOrder.delivery_account.extra && (
                <div>
                  <dt className="text-muted-foreground">{t.orders.extra}</dt>
                  <dd className="whitespace-pre-wrap">{credentialsOrder.delivery_account.extra}</dd>
                </div>
              )}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
