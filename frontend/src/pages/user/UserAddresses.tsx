import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SectionCard, EmptyState } from '@/components/ui/shared';
import { MapPin, Plus, Trash2, Home, Briefcase } from 'lucide-react';

type Address = { id: string; label: string; name: string; phone: string; address: string; city: string; wilaya: string };

export default function UserAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: 'Home', name: '', phone: '', address: '', city: '', wilaya: '' });

  useEffect(() => {
    const stored = localStorage.getItem('aboni_addresses');
    if (stored) setAddresses(JSON.parse(stored));
  }, []);

  const save = (list: Address[]) => { setAddresses(list); localStorage.setItem('aboni_addresses', JSON.stringify(list)); };

  const add = () => {
    if (!form.name || !form.address) return;
    save([...addresses, { ...form, id: Date.now().toString() }]);
    setForm({ label: 'Home', name: '', phone: '', address: '', city: '', wilaya: '' });
    setShowForm(false);
  };

  const remove = (id: string) => save(addresses.filter((a) => a.id !== id));

  const labelIcons: Record<string, any> = { Home, Briefcase, MapPin };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">My Addresses</h1>
      <p className="mt-1 text-muted-foreground">Manage your saved addresses</p>

      <div className="mt-8 max-w-2xl space-y-6">
        <div className="flex justify-end">
          <Button onClick={() => setShowForm(!showForm)}><Plus className="me-1 h-4 w-4" /> Add Address</Button>
        </div>

        {showForm && (
          <SectionCard title="New Address">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Label</Label><select value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 flex h-10 w-full rounded-md border border-input bg-muted/40 px-3 text-sm"><option>Home</option><option>Work</option><option>Other</option></select></div>
              <div><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
              <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
              <div><Label>Wilaya</Label><Input value={form.wilaya} onChange={(e) => setForm({ ...form, wilaya: e.target.value })} className="mt-1" placeholder="e.g. Alger" /></div>
              <div className="sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-1" /></div>
              <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1" /></div>
            </div>
            <div className="mt-4 flex gap-2"><Button onClick={add}>Save Address</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
          </SectionCard>
        )}

        {addresses.length === 0 && !showForm ? (
          <EmptyState icon={MapPin} title="No saved addresses" message="Add addresses for faster checkout." />
        ) : (
          <div className="space-y-3">
            {addresses.map((a) => {
              const Icon = labelIcons[a.label] || MapPin;
              return (
                <div key={a.id} className="flex items-start gap-3 rounded-xl border border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><p className="font-medium">{a.name}</p><span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">{a.label}</span></div>
                    <p className="text-sm text-muted-foreground">{a.address}, {a.city}, {a.wilaya}</p>
                    {a.phone && <p className="text-sm text-muted-foreground">{a.phone}</p>}
                  </div>
                  <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
