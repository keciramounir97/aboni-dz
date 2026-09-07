import { Globe } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';
import type { Locale } from '@/i18n/translations';
import { Select } from '@/components/ui/select';

const locales: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'fr', label: 'FR' },
  { value: 'ar', label: 'AR' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="h-8 w-[72px] border-none bg-transparent text-xs font-medium"
        aria-label="Language"
      >
        {locales.map((l) => (
          <option key={l.value} value={l.value}>
            {l.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
