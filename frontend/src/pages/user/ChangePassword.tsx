import { useState } from 'react';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import { useRouter } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionCard } from '@/components/ui/shared';
import { Lock, Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useRouter();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setError('');
    if (next.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (next !== confirm) { setError('Passwords do not match'); return; }
    setSaving(true);
    try {
      await unwrap(api.patch('/auth/password', { currentPassword: current, newPassword: next }));
      setSuccess(true);
      setCurrent(''); setNext(''); setConfirm('');
      setTimeout(() => navigate('/account/security'), 2000);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Change Password</h1>
      <p className="mt-1 text-muted-foreground">Keep your account secure with a strong password</p>

      <div className="mt-8 max-w-lg">
        <SectionCard title="Update Password">
          <div className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative mt-1">
                <Input type={show ? 'text' : 'password'} value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" />
                <button type="button" onClick={() => setShow(!show)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <Input type={show ? 'text' : 'password'} value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 6 characters" className="mt-1" />
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input type={show ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter new password" className="mt-1" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm text-emerald-500">Password changed! Redirecting...</p>}
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-primary" /> Choose a strong password with at least 6 characters.
            </div>
            <Button onClick={handleSave} disabled={saving || !current || !next}>{saving ? 'Updating...' : 'Update Password'}</Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
