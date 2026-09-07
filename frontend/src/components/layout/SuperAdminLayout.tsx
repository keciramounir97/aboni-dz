import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  Shield, Users, KeyRound, Settings, ScrollText, Database, Flag, Mail, CreditCard,
  ArrowLeft, Zap, Lock, Code, HardDrive, BarChart3, Ticket, Server, Activity, ArrowLeftRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/superadmin', icon: Shield, label: 'Overview', end: true },
  { to: '/superadmin/analytics', icon: BarChart3, label: 'System Analytics' },
  { to: '/superadmin/users', icon: Users, label: 'User Management' },
  { to: '/superadmin/roles', icon: KeyRound, label: 'Roles & Permissions' },
  { to: '/superadmin/admin-users', icon: Lock, label: 'Admin Accounts' },
  { to: '/superadmin/settings', icon: Settings, label: 'System Settings' },
  { to: '/superadmin/audit-log', icon: ScrollText, label: 'Audit Log' },
  { to: '/superadmin/security', icon: Activity, label: 'Security Logs' },
  { to: '/superadmin/coupons', icon: Ticket, label: 'Coupons' },
  { to: '/superadmin/database', icon: Database, label: 'Database' },
  { to: '/superadmin/backups', icon: HardDrive, label: 'Backups' },
  { to: '/superadmin/feature-flags', icon: Flag, label: 'Feature Flags' },
  { to: '/superadmin/email-templates', icon: Mail, label: 'Email Templates' },
  { to: '/superadmin/payments', icon: CreditCard, label: 'Payment Integrations' },
  { to: '/superadmin/api-keys', icon: Code, label: 'API Keys' },
];

export function SuperAdminLayout() {
  const { user, logout, setUser } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-500">
            <Shield className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold">Super Admin</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
          <div className="my-2 border-t border-border" />
          <Link to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            <ArrowLeftRight className="h-4 w-4" /> Admin Panel
          </Link>
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-rose-500">{user?.role}</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="lg:hidden">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <Link to="/admin" className="hidden lg:inline-flex">
              <Button variant="outline" size="sm"><ArrowLeft className="me-1 h-4 w-4" /> Admin Panel</Button>
            </Link>
            <nav className="flex gap-1 overflow-x-auto lg:hidden">
              {navItems.slice(0, 6).map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('whitespace-nowrap rounded-md px-2 py-1 text-xs', isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
