import { Shield, Zap, Globe, Headphones, CreditCard, Clock } from 'lucide-react';
import { StaticPage } from './StaticPage';

export default function AboutPage() {
  const features = [
    { icon: Zap, title: 'Instant Delivery', desc: 'Most subscriptions delivered within minutes of payment approval.' },
    { icon: Globe, title: 'Multilingual', desc: 'Available in English, French, and Arabic for all Algerian customers.' },
    { icon: CreditCard, title: 'Local Payment', desc: 'Pay with CCP, Edahabia, BaridiMob, or cash via trusted agents.' },
    { icon: Shield, title: 'Secure & Trusted', desc: 'Your data is protected. Every order is tracked and verifiable.' },
    { icon: Headphones, title: '24/7 Support', desc: 'Our team is available around the clock to help with any issue.' },
    { icon: Clock, title: 'Fast Verification', desc: 'Payment proofs are reviewed and approved within minutes.' },
  ];

  return (
    <StaticPage
      title="About Aboni"
      subtitle="Algeria's premier digital subscription store"
      sections={[
        {
          heading: 'Our Story',
          body: <p>Aboni was founded with a simple mission: make premium digital subscriptions accessible to everyone in Algeria. We saw that many Algerians struggled to access Spotify, Netflix, PlayStation Plus, and other services due to payment barriers. By accepting local payment methods and providing instant delivery, we've made it easier than ever to enjoy the digital services you love.</p>,
        },
        {
          heading: 'Why Choose Us',
          body: (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="rounded-lg border border-border p-4">
                  <f.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-2 font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          ),
        },
        {
          heading: 'Our Commitment',
          body: <p>We are committed to providing the best prices, fastest delivery, and most reliable service in Algeria. If you ever have an issue with a subscription, our support team will resolve it quickly—whether that means a replacement, a refund, or technical assistance. Your satisfaction is our priority.</p>,
        },
      ]}
    />
  );
}
