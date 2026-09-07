import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, getErrorMessage, unwrap } from '@/lib/api';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { t } = useI18n();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError('');
    setSuccess(false);
    try {
      await unwrap(api.post('/contacts', data));
      setSuccess(true);
      reset();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">{t.contact.title}</h1>
      <p className="mt-2 text-muted-foreground">{t.contact.sub}</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t.contact.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">{t.contact.name}</Label>
              <Input id="name" {...register('name')} className="mt-1" />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">{t.contact.email}</Label>
              <Input id="email" type="email" {...register('email')} className="mt-1" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="subject">{t.contact.subject}</Label>
              <Input id="subject" {...register('subject')} className="mt-1" />
              {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
            </div>
            <div>
              <Label htmlFor="message">{t.contact.message}</Label>
              <Textarea id="message" {...register('message')} className="mt-1" rows={5} />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
            </div>
            {success && <p className="text-sm text-emerald-400">{t.contact.success}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? t.common.loading : t.contact.send}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
