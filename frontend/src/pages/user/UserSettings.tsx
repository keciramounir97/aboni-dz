import { useState, useEffect } from 'react';
import { SectionCard } from '@/components/ui/shared';
import { Button } from '@/components/ui/button';
import { Globe, Bell, Moon, Mail } from 'lucide-react';

export default function UserSettings() {
  const [notifications, setNotifications] = useState({ email: true, orders: true, promotions: false, blog: false });
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aboni_settings');
    if (stored) { const s = JSON.parse(stored); setNotifications(s.notifications || notifications); setLanguage(s.language || 'en'); }
  }, []);

  const save = () => {
    localStorage.setItem('aboni_settings', JSON.stringify({ notifications, language }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-1 text-muted-foreground">Manage your preferences</p>

      <div className="mt-8 max-w-2xl space-y-6">
        <SectionCard title="Notification Preferences">
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email Notifications', desc: 'Receive emails about your account and orders', icon: Mail },
              { key: 'orders', label: 'Order Updates', desc: 'Get notified about order status changes', icon: Bell },
              { key: 'promotions', label: 'Promotions & Deals', desc: 'Receive emails about special offers and discounts', icon: Bell },
              { key: 'blog', label: 'Blog & Guides', desc: 'Get notified when new articles are published', icon: Bell },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <button onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))} className={`relative h-6 w-11 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-muted'}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Display Preferences">
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </SectionCard>

        {saved && <p className="text-sm text-emerald-500">Settings saved!</p>}
        <Button onClick={save}>Save Settings</Button>
      </div>
    </div>
  );
}
