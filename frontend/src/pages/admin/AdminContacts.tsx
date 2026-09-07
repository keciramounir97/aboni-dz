import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import type { Contact } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function AdminContactsPage() {
  const { t, locale } = useI18n();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState('');

  const load = () => {
    unwrap(api.get('/contacts')).then((d) => setContacts(d as Contact[])).catch(() => setContacts([]));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: Contact['status']) => {
    try {
      await unwrap(api.patch(`/contacts/${id}/status`, { status }));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Delete contact?')) return;
    try {
      await unwrap(api.delete(`/contacts/${id}`));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const statusVariant: Record<Contact['status'], 'warning' | 'secondary' | 'success'> = {
    new: 'warning',
    read: 'secondary',
    replied: 'success',
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t.admin.contacts}</h1>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>{t.common.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell className="max-w-xs truncate">{c.message}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(c.created_at, locale)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Select value={c.status} onChange={(e) => updateStatus(c.id, e.target.value as Contact['status'])} className="w-28">
                        <option value="new">new</option>
                        <option value="read">read</option>
                        <option value="replied">replied</option>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => remove(c.id)}>
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
