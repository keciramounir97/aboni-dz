import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import type { Newsletter } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function AdminNewsletterPage() {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Newsletter[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    unwrap(api.get('/newsletter')).then((d) => setItems(d as Newsletter[])).catch(() => setItems([]));
  };

  useEffect(() => { load(); }, []);

  const toggleActive = async (item: Newsletter) => {
    try {
      await unwrap(api.patch(`/newsletter/${item.id}`, { is_active: !item.is_active }));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete subscriber?')) return;
    try {
      await unwrap(api.delete(`/newsletter/${id}`));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t.admin.newsletter}</h1>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant={item.is_active ? 'success' : 'destructive'}>
                      {item.is_active ? t.admin.active : t.admin.inactive}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(item.created_at, locale)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleActive(item)}>
                        {item.is_active ? t.admin.unsubscribe : t.admin.activate}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => remove(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
