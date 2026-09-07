import { Link, NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Mail, Newspaper, ArrowLeft, Zap,
  BarChart3, Star, Ticket, FileText, MessageSquare, Activity, UserCog, Type,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NavItem = { to: string; icon: any; labelKey: string; label: string; permission?: string; superOnly?: boolean };

const navItems: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'dashboard', label: 'Dashboard', permission: 'analytics' },
  { to: '/admin/analytics', icon: BarChart3, labelKey: 'analytics', label: 'Analytics', permission: 'analytics' },
  { to: '/admin/products', icon: Package, labelKey: 'products', label: 'Products', permission: 'products' },
  { to: '/admin/orders', icon: ShoppingCart, labelKey: 'orders', label: 'Orders', permission: 'orders' },
  { to: '/admin/reviews', icon: Star, labelKey: 'reviews', label: 'Reviews', permission: 'orders' },
  { to: '/admin/coupons', icon: Ticket, labelKey: 'coupons', label: 'Coupons', permission: 'products' },
  { to: '/admin/users', icon: Users, labelKey: 'users', label: 'Users', permission: 'users' },
  { to: '/admin/contacts', icon: Mail, labelKey: 'contacts', label: 'Contacts', permission: 'contacts' },
  { to: '/admin/newsletter', icon: Newspaper, labelKey: 'newsletter', label: 'Newsletter', permission: 'newsletter' },
  { to: '/admin/blog', icon: FileText, labelKey: 'blog', label: 'Blog', permission: 'products' },
  { to: '/admin/faqs', icon: Type, labelKey: 'faqs', label: 'FAQs', permission: 'contacts' },
  { to: '/admin/testimonials', icon: MessageSquare, labelKey: 'testimonials', label: 'Testimonials', permission: 'newsletter' },
  { to: '/admin/activity', icon: Activity, labelKey: 'activity', label: 'Activity Log', permission: 'analytics' },
  { to: '/admin/profile', icon: UserCog, labelKey: 'profile', label: 'Profile' },
];

export function AdminLayout() {
  const { user, logout, hasPermission, isAdmin } = useAuthStore();

  const isSuperAdmin = user?.role === 'super_admin';
  const visibleNav = navItems.filter((item) => {
    if (item.superOnly && !isSuperAdmin) return false;
    if (item.permission && !isSuperAdmin && !hasPermission(item.permission)) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-border bg-surface lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold">Aboni {isSuperAdmin ? 'Admin+' : 'Admin'}</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
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
              {item.label}
            </NavLink>
          ))}
          {isSuperAdmin && (
            <NavLink to="/superadmin" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/10">
              <LayoutDashboard className="h-4 w-4" /> Super Admin →
            </NavLink>
          )}
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
                <NavLink key={item.to} to={item.to} end={item.to === '/admin'} className={({ isActive }) => cn('whitespace-nowrap rounded-md px-2 py-1 text-xs', isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link to="/account"><Button variant="outline" size="sm">{isAdmin() ? 'My Account' : ''}</Button></Link>
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
