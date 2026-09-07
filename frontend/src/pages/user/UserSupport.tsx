import { useState } from 'react';
import { api, unwrap, getErrorMessage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SectionCard } from '@/components/ui/shared';
import { LifeBuoy, Send, Mail, MessageSquare, Clock } from 'lucide-react';

export default function UserSupport() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    if (!subject || !message) return;
    setSending(true);
    setError('');
    try {
      await unwrap(api.post('/contacts', { name: '', email: '', subject, message }));
      setSuccess(true);
      setSubject(''); setMessage('');
      setTimeout(() => setSuccess(false), 5000);
    } catch (e) { setError(getErrorMessage(e)); }
    finally { setSending(false); }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Support Center</h1>
      <p className="mt-1 text-muted-foreground">Get help with your orders and account</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <Mail className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-semibold">Email Us</h3>
            <p className="text-sm text-muted-foreground">support@aboni.dz</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Clock className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-semibold">Response Time</h3>
            <p className="text-sm text-muted-foreground">Within 24 hours</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h3 className="mt-2 font-semibold">FAQ</h3>
            <p className="text-sm text-muted-foreground">Check our FAQ for quick answers</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <SectionCard title="Send a Support Request">
            <div className="space-y-4">
              <div>
                <Label>Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1" placeholder="What do you need help with?" />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} className="mt-1" placeholder="Describe your issue in detail..." rows={5} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-emerald-500">Request sent! We'll get back to you soon.</p>}
              <Button onClick={send} disabled={sending || !subject || !message}><Send className="me-1 h-4 w-4" /> {sending ? 'Sending...' : 'Send Request'}</Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
