import { StaticPage } from './StaticPage';
import { Briefcase, Mail, MapPin } from 'lucide-react';

export default function CareersPage() {
  return (
    <StaticPage
      title="Careers at Aboni"
      subtitle="Join the team building Algeria's digital subscription future"
      sections={[]}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <Briefcase className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-display text-lg font-bold">Customer Support Agent</h3>
          <p className="mt-1 text-sm text-muted-foreground">Help customers with orders, payments, and subscriptions. Multilingual (EN/FR/AR) required.</p>
          <span className="mt-3 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Full-time · Algiers</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <Briefcase className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-display text-lg font-bold">Delivery Specialist</h3>
          <p className="mt-1 text-sm text-muted-foreground">Manage subscription delivery and account credentials. Technical knowledge of streaming platforms preferred.</p>
          <span className="mt-3 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Full-time · Remote</span>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <Briefcase className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-display text-lg font-bold">Marketing Specialist</h3>
          <p className="mt-1 text-sm text-muted-foreground">Grow our social media presence and create content. Experience with digital marketing and social media management.</p>
          <span className="mt-3 inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">Part-time · Remote</span>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold">How to Apply</h2>
        <p className="mt-2 text-muted-foreground">Send your CV and a brief cover letter to our HR team. We review all applications carefully and respond within 5 business days.</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> careers@aboni.dz</span>
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Algiers, Algeria</span>
        </div>
      </div>
    </StaticPage>
  );
}
