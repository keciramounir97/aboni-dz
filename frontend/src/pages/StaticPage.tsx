import { type ReactNode } from 'react';
import { PageContainer } from '@/components/ui/shared';

export function StaticPage({ title, subtitle, sections, children }: {
  title: string;
  subtitle?: string;
  sections?: { heading: string; body: ReactNode }[];
  children?: ReactNode;
}) {
  return (
    <PageContainer title={title} description={subtitle}>
      {children}
      {sections && (
        <div className="space-y-8">
          {sections.map((s, i) => (
            <section key={i} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold">{s.heading}</h2>
              <div className="mt-3 text-muted-foreground leading-relaxed">{s.body}</div>
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
