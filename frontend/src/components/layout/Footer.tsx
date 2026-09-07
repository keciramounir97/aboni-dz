import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-auto border-t border-border/60 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="text-center sm:text-start">
          <p className="font-display text-lg font-bold text-gradient">Aboni</p>
          <p className="mt-1 text-sm text-muted-foreground">Digital subscriptions for Algeria</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-primary">{t.nav.shop}</Link>
          <Link to="/contact" className="hover:text-primary">{t.nav.contact}</Link>
        </nav>
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Aboni</p>
      </div>
    </footer>
  );
}
