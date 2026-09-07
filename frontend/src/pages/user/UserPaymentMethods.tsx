import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SectionCard, EmptyState } from '@/components/ui/shared';
import { CreditCard, Plus, Trash2, Banknote, Smartphone } from 'lucide-react';

type PaymentMethod = { id: string; type: 'ccp' | 'baridimob' | 'card'; label: string; details: string };

export default function UserPaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'ccp' as PaymentMethod['type'], label: '', details: '' });

  useEffect(() => {
    const stored = localStorage.getItem('aboni_payments');
    if (stored) setMethods(JSON.parse(stored));
  }, []);

  const save = (list: PaymentMethod[]) => { setMethods(list); localStorage.setItem('aboni_payments', JSON.stringify(list)); };
  const add = () => { if (!form.label || !form.details) return; save([...methods, { ...form, id: Date.now().toString() }]); setForm({ type: 'ccp', label: '', details: '' }); setShowForm(false); };
  const remove = (id: string) => save(methods.filter((m) => m.id !== id));

  const typeIcons: Record<string, any> = { ccp: Banknote, baridimob: Smartphone, card: CreditCard };
  const typeNames: Record<string, string> = { ccp: 'CCP / Edahabia', baridimob: 'BaridiMob', card: 'Bank Card' };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Payment Methods</h1>
      <p className="mt-1 text-muted-foreground">Save your payment details for faster checkout</p>

      <div className="mt-8 max-w-2xl space-y-6">
        <div className="flex justify-end"><Button onClick={() => setShowForm(!showForm)}><Plus className="me-1 h-4 w-4" /> Add Method</Button></div>

        {showForm && (
          <SectionCard title="New Payment Method">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="mb-4 flex h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm">
              <option value="ccp">CCP / Edahabia</option><option value="baridimob">BaridiMob</option><option value="card">Bank Card</option>
            </select>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Label (e.g. My CCP)" className="mb-3 flex h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm" />
            <input value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder={form.type === 'ccp' ? 'CCP account number' : form.type === 'baridimob' ? 'BaridiMob ID' : 'Card number (last 4 digits)'} className="mb-4 flex h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm" />
            <div className="flex gap-2"><Button onClick={add}>Save</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </SectionCard>
        )}

        {methods.length === 0 && !showForm ? (
          <EmptyState icon={CreditCard} title="No saved payment methods" message="Add your payment details for faster ordering." />
        ) : (
          <div className="space-y-3">
            {methods.map((m) => {
              const Icon = typeIcons[m.type];
              return (
                <div key={m.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><p className="font-medium">{m.label}</p><span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">{typeNames[m.type]}</span></div>
                    <p className="text-sm text-muted-foreground">{m.details}</p>
                  </div>
                  <button onClick={() => remove(m.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        )}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-sm text-muted-foreground">💡 Payment methods are stored locally on your device for convenience. We recommend using CCP or BaridiMob for the fastest delivery.</p>
        </div>
      </div>
    </div>
  );
}
