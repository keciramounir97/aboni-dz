import { Link } from 'react-router-dom';
import { SectionCard, InfoRow } from '@/components/ui/shared';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Shield, Lock, KeyRound, Smartphone, Eye, Check } from 'lucide-react';

export default function UserSecurity() {
  const { user } = useAuthStore();

  const securityItems = [
    { icon: Check, title: 'Email Verified', status: 'Active', desc: 'Your email is verified', color: 'text-emerald-500' },
    { icon: Lock, title: 'Password', status: 'Protected', desc: 'Last changed recently', color: 'text-primary' },
    { icon: Smartphone, title: 'Two-Factor Authentication', status: 'Not enabled', desc: 'Add an extra layer of security', color: 'text-amber-500' },
    { icon: Eye, title: 'Login Activity', status: 'Monitored', desc: 'We track login attempts', color: 'text-primary' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Security</h1>
      <p className="mt-1 text-muted-foreground">Manage your account security</p>

      <div className="mt-8 max-w-2xl space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {securityItems.map((item) => (
            <div key={item.title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-xs font-medium text-muted-foreground">{item.status}</span>
              </div>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        <SectionCard title="Security Actions">
          <div className="space-y-3">
            <Link to="/account/change-password" className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/20">
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-primary" />
                <div><p className="font-medium">Change Password</p><p className="text-xs text-muted-foreground">Update your account password</p></div>
              </div>
              <Button variant="outline" size="sm">Update</Button>
            </Link>
            <Link to="/account/activity" className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/20">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div><p className="font-medium">View Activity Log</p><p className="text-xs text-muted-foreground">See recent account activity</p></div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </Link>
            <Link to="/account/profile" className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-muted/20">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <div><p className="font-medium">Profile Information</p><p className="text-xs text-muted-foreground">Review your account details</p></div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </Link>
          </div>
        </SectionCard>

        <SectionCard title="Account Info">
          <InfoRow label="Account Status" value={<span className="text-emerald-500">Active</span>} />
          <InfoRow label="Member Since" value={formatDate(user?.created_at || '')} />
          <InfoRow label="Account Type" value={<span className="capitalize">{user?.role}</span>} />
        </SectionCard>
      </div>
    </div>
  );
}
