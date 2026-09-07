import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useI18n();
  const { token, user, logout, isAdmin } = useAuthStore();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/shop', label: t.nav.shop },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Zap className="h-4 w-4" />
          </span>
          Aboni
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          {token && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {t.nav.orders}
            </NavLink>
          )}
          {token && isAdmin() && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-primary',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                )
              }
            >
              {t.nav.admin}
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {token ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground lg:inline">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                {t.nav.logout}
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">{t.nav.login}</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">{t.nav.signup}</Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
            {token && (
              <Link to="/orders" className="rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                {t.nav.orders}
              </Link>
            )}
            {token && isAdmin() && (
              <Link to="/admin" className="rounded-md px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                {t.nav.admin}
              </Link>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
              <LanguageSwitcher />
              {token ? (
                <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }}>
                  {t.nav.logout}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    <Button variant="ghost" size="sm">{t.nav.login}</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)}>
                    <Button size="sm">{t.nav.signup}</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
