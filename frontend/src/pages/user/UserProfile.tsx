import { useAuthStore } from '@/store/authStore';
import { SectionCard, InfoRow } from '@/components/ui/shared';
import { formatDate } from '@/lib/utils';
import { User, Mail, Calendar, Shield, Check } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

export default function UserProfile() {
  const { user } = useAuthStore();
  const { locale } = useI18n();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">My Profile</h1>
      <p className="mt-1 text-muted-foreground">View and manage your account information</p>

      <div className="mt-8 max-w-2xl space-y-6">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-500">
              <Check className="h-3 w-3" /> Active Account
            </span>
          </div>
        </div>

        <SectionCard title="Account Information">
          <InfoRow label="Full Name" value={user?.name} />
          <InfoRow label="Email Address" value={user?.email} />
          <InfoRow label="Account Type" value={<span className="capitalize">{user?.role}</span>} />
          <InfoRow label="Member Since" value={formatDate(user?.created_at || '', locale)} />
          <InfoRow label="Last Updated" value={formatDate(user?.updated_at || '', locale)} />
        </SectionCard>

        <SectionCard title="Security Status">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">Email verified</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm">Password protected</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-emerald-500" />
              <span className="text-sm">Account is active</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
