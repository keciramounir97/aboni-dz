import { useEffect, useState } from 'react';
import { api, unwrap } from '@/lib/api';
import type { User } from '@/lib/types';
import { useAuthStore } from '@/store/authStore';
import { Loading, SectionCard } from '@/components/ui/shared';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { KeyRound, Shield } from 'lucide-react';

const PERM_LABELS: Record<string, string> = { products: 'Products', orders: 'Orders', users: 'Users', contacts: 'Contacts', newsletter: 'Newsletter', analytics: 'Analytics' };

export default function SuperAdminRoles() {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [perms, setPerms] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const load = () => { unwrap(api.get('/users')).then((d) => setUsers(d as User[])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openEdit = (u: User) => { setEditing(u); setPerms(u.permissions || {}); };
  const save = async () => {
    setSaving(true);
    try { await unwrap(api.patch(`/users/${editing!.id}`, { permissions: perms })); setEditing(null); load(); }
    finally { setSaving(false); }
  };

  if (loading) return <Loading />;
  const admins = users.filter((u) => u.role === 'admin' || u.role === 'super_admin');

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Roles & Permissions</h1>
      <p className="mt-1 text-muted-foreground">Manage admin permissions and access control</p>

      <div className="mt-8">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5"><Shield className="h-6 w-6 text-rose-500" /><h3 className="mt-2 font-semibold">Super Admin</h3><p className="text-sm text-muted-foreground">Full access to all features and settings</p></div>
          <div className="rounded-xl border border-border bg-card p-5"><KeyRound className="h-6 w-6 text-primary" /><h3 className="mt-2 font-semibold">Admin</h3><p className="text-sm text-muted-foreground">Limited access based on assigned permissions</p></div>
          <div className="rounded-xl border border-border bg-card p-5"><Shield className="h-6 w-6 text-muted-foreground" /><h3 className="mt-2 font-semibold">User</h3><p className="text-sm text-muted-foreground">No admin panel access</p></div>
        </div>

        <SectionCard title="Admin Accounts & Permissions">
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Role</TableHead><TableHead colSpan={6}>Permissions</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {admins.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell><Badge variant={u.role === 'super_admin' ? 'default' : 'secondary'} className="capitalize">{u.role.replace(/_/g, ' ')}</Badge></TableCell>
                  {Object.keys(PERM_LABELS).map((key) => (
                    <TableCell key={key}>{u.role === 'super_admin' ? <Check className="h-4 w-4 text-emerald-500" /> : u.permissions?.[key as keyof typeof u.permissions] ? <Check className="h-4 w-4 text-emerald-500" /> : <span className="text-muted-foreground">—</span>}</TableCell>
                  ))}
                  <TableCell>{u.role === 'admin' && <Button variant="ghost" size="sm" onClick={() => openEdit(u)}><KeyRound className="me-1 h-4 w-4" /> Edit</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setEditing(null)}>
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-lg font-bold">Edit Permissions: {editing.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Select what this admin can access</p>
            <div className="mt-4 space-y-3">
              {Object.entries(PERM_LABELS).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <span className="text-sm font-medium">{label}</span>
                  <Checkbox checked={perms[key] || false} onChange={(e) => setPerms({ ...perms, [key]: e.target.checked })} />
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2"><Button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Permissions'}</Button><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button></div>
          </div>
        </div>
      )}
    </div>
  );
}
