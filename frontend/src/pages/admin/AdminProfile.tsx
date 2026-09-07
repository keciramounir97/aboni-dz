import { useAuthStore } from '@/store/authStore';
import { useRouter } from '@/lib/navigation';
import { SectionCard, InfoRow } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { User, Settings, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminProfile() {
  const { user } = useAuthStore();
  const navigate = useRouter();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">My Profile</h1>
      <p className="mt-1 text-muted-foreground">Admin account information</p>
      <div className="mt-8 max-w-2xl space-y-6">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">{user?.name?.charAt(0).toUpperCase()}</span>
          <div><h2 className="text-xl font-bold">{user?.name}</h2><p className="text-muted-foreground">{user?.email}</p><span className="mt-1 inline-block rounded-full bg-primary/15 px-3 py-0.5 text-xs font-medium capitalize text-primary">{user?.role.replace(/_/g, ' ')}</span></div>
        </div>
        <SectionCard title="Account Information">
          <InfoRow label="Full Name" value={user?.name} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Role" value={<span className="capitalize">{user?.role.replace(/_/g, ' ')}</span>} />
          <InfoRow label="Member Since" value={formatDate(user?.created_at || '')} />
          {user?.permissions && <InfoRow label="Permissions" value={Object.entries(user.permissions).filter(([_, v]) => v).map(([k]) => k).join(', ') || '—'} />}
        </SectionCard>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/account/profile" className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 hover:bg-muted/20">
            <User className="h-5 w-5 text-primary" /><div><p className="font-medium">View Public Profile</p><p className="text-xs text-muted-foreground">See your user profile</p></div>
          </Link>
          <button onClick={() => navigate('/account/edit-profile')} className="flex items-center gap-3 rounded-xl border border-border bg-card p-5 text-start hover:bg-muted/20">
            <Settings className="h-5 w-5 text-primary" /><div><p className="font-medium">Edit Profile</p><p className="text-xs text-muted-foreground">Update your name</p></div>
          </button>
        </div>
      </div>
    </div>
  );
}
