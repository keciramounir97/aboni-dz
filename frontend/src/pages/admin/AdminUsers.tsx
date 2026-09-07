import { useEffect, useState } from 'react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import type { User, UserPermissions, UserRole } from '@/lib/types';
import { PERMISSION_KEYS } from '@/lib/types';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const { t, locale } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState<number | null>(null);

  const load = () => {
    unwrap(api.get('/users')).then((d) => setUsers(d as User[])).catch(() => setUsers([]));
  };

  useEffect(() => { load(); }, []);

  const updateUser = async (id: number, patch: Partial<{ role: UserRole; permissions: UserPermissions; is_active: boolean }>) => {
    setSavingId(id);
    setError('');
    try {
      await unwrap(api.patch(`/users/${id}`, patch));
      load();
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSavingId(null);
    }
  };

  const togglePermission = (user: User, key: keyof UserPermissions) => {
    const perms = { ...(user.permissions || {}) };
    perms[key] = !perms[key];
    updateUser(user.id, { permissions: perms });
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">{t.admin.users}</h1>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <Card className="mt-6 overflow-x-auto">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{t.admin.role}</TableHead>
                <TableHead>{t.admin.permissions}</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onChange={(e) => updateUser(user.id, { role: e.target.value as UserRole })}
                      className="w-32"
                      disabled={savingId === user.id}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="super_admin">super_admin</option>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {user.role === 'super_admin' ? (
                      <Badge variant="success">All</Badge>
                    ) : user.role === 'admin' ? (
                      <div className="flex flex-wrap gap-2">
                        {PERMISSION_KEYS.map((key) => (
                          <Checkbox
                            key={key}
                            checked={Boolean(user.permissions?.[key])}
                            onChange={() => togglePermission(user, key)}
                            label={key}
                            disabled={savingId === user.id}
                          />
                        ))}
                      </div>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={user.is_active ? 'default' : 'outline'}
                      size="sm"
                      disabled={savingId === user.id}
                      onClick={() => updateUser(user.id, { is_active: !user.is_active })}
                    >
                      {user.is_active ? t.admin.active : t.admin.inactive}
                    </Button>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(user.created_at, locale)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
