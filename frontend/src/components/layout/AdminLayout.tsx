import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Mail,
  Newspaper,
  ArrowLeft,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'dashboard' as const, permission: 'analytics' },
  { to: '/admin/products', icon: Package, labelKey: 'products' as const, permission: 'products' },
  { to: '/admin/orders', icon: ShoppingCart, labelKey: 'orders' as const, permission: 'orders' },
  { to: '/admin/users', icon: Users, labelKey: 'users' as const, permission: 'users' },
  { to: '/admin/contacts', icon: Mail, labelKey: 'contacts' as const, permission: 'contacts' },
  { to: '/admin/newsletter', icon: Newspaper, labelKey: 'newsletter' as const, permission: 'newsletter' },
];

export function AdminLayout() {
  const { t } = useI18n();
  const { user, logout, hasPermission } = useAuthStore();

  const visibleNav = navItems.filter((item) => hasPermission(item.permission));

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold">Aboni Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {t.admin[item.labelKey]}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.role}</p>
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
              {visibleNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) =>
                    cn(
                      'whitespace-nowrap rounded-md px-2 py-1 text-xs',
                      isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground',
                    )
                  }
                >
                  {t.admin[item.labelKey]}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={logout}>
              {t.nav.logout}
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
