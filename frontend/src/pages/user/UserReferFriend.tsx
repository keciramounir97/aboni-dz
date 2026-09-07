import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { SectionCard } from '@/components/ui/shared';
import { Button } from '@/components/ui/button';
import { Gift, Users, Share2, Copy, Check, Star, ShoppingBag } from 'lucide-react';

export default function UserReferFriend() {
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const referralCode = `ABONI-${user?.id || 'USER'}-${(user?.name || '').slice(0, 3).toUpperCase()}`;
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  const copy = () => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const benefits = [
    { icon: Star, title: 'Get 50 DZD', desc: 'For every friend who makes their first order' },
    { icon: Users, title: 'No Limit', desc: 'Refer as many friends as you want' },
    { icon: Gift, title: 'Friend Gets 10%', desc: 'Your friend gets 10% off with code WELCOME10' },
    { icon: ShoppingBag, title: 'Easy Rewards', desc: 'Credits are applied automatically to your next order' },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Refer a Friend</h1>
      <p className="mt-1 text-muted-foreground">Invite friends and earn rewards</p>

      <div className="mt-8 max-w-2xl space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-primary to-primary/70 p-8 text-primary-foreground shadow-lg">
          <Gift className="h-10 w-10" />
          <h2 className="mt-4 font-display text-2xl font-bold">Give 10%, Get 50 DZD</h2>
          <p className="mt-1 text-primary-foreground/80">Share your referral link with friends. When they make their first order, you both earn rewards!</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <input value={referralLink} readOnly className="flex-1 rounded-md bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground backdrop-blur" />
            <Button onClick={copy} variant="secondary">{copied ? <Check className="me-1 h-4 w-4" /> : <Copy className="me-1 h-4 w-4" />} {copied ? 'Copied!' : 'Copy Link'}</Button>
          </div>
          <div className="mt-3 text-sm text-primary-foreground/70">Your code: <span className="font-mono font-bold">{referralCode}</span></div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((b) => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-5">
              <b.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-2 font-semibold">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <SectionCard title="How It Works">
          <div className="space-y-4">
            {[
              { step: '1', title: 'Share your link', desc: 'Send your unique referral link to friends via WhatsApp, email, or social media.' },
              { step: '2', title: 'Friend signs up', desc: 'Your friend creates an account using your referral link.' },
              { step: '3', title: 'Friend orders', desc: 'When your friend places and pays for their first order, the reward is triggered.' },
              { step: '4', title: 'You both earn', desc: 'You get 50 DZD credit and your friend gets 10% off. Rewards are applied automatically!' },
            ].map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">{s.step}</span>
                <div><p className="font-medium">{s.title}</p><p className="text-sm text-muted-foreground">{s.desc}</p></div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Your Referral Stats">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-3xl font-bold text-primary">0</p><p className="text-xs text-muted-foreground">Friends Referral</p></div>
            <div><p className="text-3xl font-bold text-primary">0</p><p className="text-xs text-muted-foreground">Orders Placed</p></div>
            <div><p className="text-3xl font-bold text-primary">0</p><p className="text-xs text-muted-foreground">DZD Earned</p></div>
          </div>
          <Button variant="outline" className="mt-4 w-full"><Share2 className="me-1 h-4 w-4" /> Share via WhatsApp</Button>
        </SectionCard>
      </div>
    </div>
  );
}
