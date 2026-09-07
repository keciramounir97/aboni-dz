import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageContainer({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-7xl px-4 py-8 sm:px-6', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

const colorMap: Record<string, string> = {
  primary: 'bg-primary/15 text-primary',
  blue: 'bg-blue-500/15 text-blue-500',
  emerald: 'bg-emerald-500/15 text-emerald-500',
  amber: 'bg-amber-500/15 text-amber-500',
  purple: 'bg-purple-500/15 text-purple-500',
  rose: 'bg-rose-500/15 text-rose-500',
};

export function StatCard({ icon: Icon, label, value, hint, color = 'primary' }: {
  icon: any;
  label: string;
  value: string | number;
  hint?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${colorMap[color] || colorMap.primary}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, message, action }: {
  icon: any;
  title: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-end">{value || '—'}</span>
    </div>
  );
}

export function SectionCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="prose prose-sm max-w-none space-y-3 dark:prose-invert">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="mt-6 font-display text-xl font-bold">{line.slice(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={i} className="mt-6 font-display text-2xl font-bold">{line.slice(2)}</h1>;
        if (line.startsWith('- ')) return <li key={i} className="ms-4 list-disc text-muted-foreground">{line.slice(2)}</li>;
        if (line.trim() === '') return <div key={i} className="h-2" />;
        return <p key={i} className="text-muted-foreground leading-relaxed">{line}</p>;
      })}
    </div>
  );
}
