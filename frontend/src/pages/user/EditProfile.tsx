import { useState } from 'react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionCard } from '@/components/ui/shared';

export default function EditProfile() {
  const { user, setUser } = useAuthStore();
  const navigate = useRouter();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const updated = await unwrap(api.patch('/auth/profile', { name }));
      setUser(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Edit Profile</h1>
      <p className="mt-1 text-muted-foreground">Update your account information</p>

      <div className="mt-8 max-w-lg">
        <SectionCard title="Personal Information">
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="Your name" />
            </div>
            <div>
              <Label>Email (cannot be changed)</Label>
              <Input value={user?.email || ''} disabled className="mt-1 bg-muted/40" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-500">Profile updated successfully!</p>}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || name === user?.name}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="outline" onClick={() => navigate('/account/profile')}>Cancel</Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
