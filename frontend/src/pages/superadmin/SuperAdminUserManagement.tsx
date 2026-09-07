import { useEffect, useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import type { User } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { Loading } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, Ban, Check } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

export default function SuperAdminUserManagement() {
  const { user: currentUser } = useAuthStore();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<User | null>(null);
  const [role, setRole] = useState('user');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => { unwrap(api.get('/users')).then((d) => setUsers(d as User[])).catch((e) => setError(getErrorMessage(e))).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openEdit = (u: User) => { setEditing(u); setRole(u.role); setIsActive(u.is_active); };
  const save = async () => {
    setSaving(true); setError('');
    try { await unwrap(api.patch(`/users/${editing!.id}`, { role, is_active: isActive })); setEditing(null); load(); }
    catch (e) { setError(getErrorMessage(e)); } finally { setSaving(false); }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">User Management</h1>
      <p className="mt-1 text-muted-foreground">{users.length} users · Super admin can change roles and status</p>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <div className="mt-6">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead>Joined</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}{u.id === currentUser?.id && <span className="ms-2 text-xs text-muted-foreground">(You)</span>}</TableCell>
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell><Badge variant={u.role === 'super_admin' ? 'default' : u.role === 'admin' ? 'secondary' : 'outline'} className="capitalize">{u.role.replace(/_/g, ' ')}</Badge></TableCell>
                <TableCell><Badge variant={u.is_active ? 'success' : 'destructive'}>{u.is_active ? 'Active' : 'Disabled'}</Badge></TableCell>
                <TableCell className="text-xs text-muted-foreground">{formatDate(u.created_at)}</TableCell>
                <TableCell><Button variant="ghost" size="sm" onClick={() => openEdit(u)} disabled={u.id === currentUser?.id}><Lock className="me-1 h-4 w-4" /> Edit</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit User: {editing?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-sm font-medium">Role</label><select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm"><option value="user">User</option><option value="admin">Admin</option><option value="super_admin">Super Admin</option></select></div>
            <Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} label="Account Active" />
            {role === 'super_admin' && <p className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-500">⚠️ Super admin has full system access including settings and all data.</p>}
          </div>
          {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
