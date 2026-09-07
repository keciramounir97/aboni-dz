import { Search, ShoppingCart, Upload, Check, Clock } from 'lucide-react';
import { StaticPage } from './StaticPage';

export default function HowItWorksPage() {
  const steps = [
    { icon: Search, title: '1. Browse & Choose', desc: 'Explore our catalog of premium subscriptions. Find the service you want—Spotify, Netflix, PlayStation, and more.' },
    { icon: ShoppingCart, title: '2. Place Your Order', desc: 'Click "Order now" on any product. Create a free account or log in to proceed with your purchase.' },
    { icon: Upload, title: '3. Pay Locally', desc: 'Pay using CCP, Edahabia, BaridiMob, or cash. Upload your payment proof to your order page.' },
    { icon: Check, title: '4. Get Approved', desc: 'Our team verifies your payment within minutes and approves your order.' },
    { icon: Clock, title: '5. Receive Credentials', desc: 'Your subscription credentials are delivered instantly to your order page. Start enjoying!' },
  ];

  return (
    <StaticPage
      title="How It Works"
      subtitle="Get your digital subscriptions in 5 simple steps"
      sections={[{
        heading: 'The Aboni Process',
        body: (
          <div className="space-y-4">
            {steps.map((s) => (
              <div key={s.title} className="flex gap-4 rounded-lg border border-border p-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        ),
      }]}
    />
  );
}
