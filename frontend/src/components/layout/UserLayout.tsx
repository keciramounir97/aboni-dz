import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutGrid, ShoppingBag, Heart, Star, Activity, User, Settings, LifeBuoy, ArrowLeft, Zap, Bell, Shield, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/account', icon: LayoutGrid, label: 'Dashboard', end: true },
  { to: '/account/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/account/wishlist', icon: Heart, label: 'Wishlist' },
  { to: '/account/reviews', icon: Star, label: 'My Reviews' },
  { to: '/account/activity', icon: Activity, label: 'Activity Log' },
  { to: '/account/notifications', icon: Bell, label: 'Notifications' },
  { to: '/account/profile', icon: User, label: 'Profile' },
  { to: '/account/security', icon: Shield, label: 'Security' },
  { to: '/account/settings', icon: Settings, label: 'Settings' },
  { to: '/account/support', icon: LifeBuoy, label: 'Support' },
];

export function UserLayout() {
  const { user, logout, isAdmin } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <Zap className="h-4 w-4" />
            </span>
            Aboni
          </Link>
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
          {isAdmin() && (
            <NavLink to="/admin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <LayoutGrid className="h-4 w-4" /> Admin Panel
            </NavLink>
          )}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
          <Link to="/" className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Back to store
          </Link>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="lg:hidden">
              <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <Link to="/" className="hidden lg:inline-flex">
              <Button variant="outline" size="sm"><ArrowLeft className="me-1 h-4 w-4" /> Store</Button>
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
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="me-1 h-4 w-4" /> Exit
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
