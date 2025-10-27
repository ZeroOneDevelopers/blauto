'use client';

import { FormEvent, useState, useTransition } from 'react';
import GlowButton from '@/components/ui/GlowButton';
import { createLead } from '@/app/dashboard/actions';
import { useRouter } from 'next/navigation';

type Props = {
  vehicleId: string;
  vehicleTitle: string;
};

export default function VehicleEnquiryForm({ vehicleId, vehicleTitle }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('idle');
    startTransition(async () => {
      try {
        await createLead({
          type: 'OFFER',
          vehicleId,
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
          source: 'VEHICLE_DETAIL'
        });
        router.refresh();
        setStatus('success');
        setForm({ name: '', phone: '', email: '', message: '' });
      } catch (error) {
        console.error('Failed to submit enquiry', error);
        setStatus('error');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 surface-panel rounded-3xl p-8">
      <div>
        <h2 className="font-heading text-2xl text-white">Enquire About {vehicleTitle}</h2>
        <p className="mt-2 text-sm text-silver/70">
          Share your contact details and our liaison team will respond within the hour with tailored acquisition options.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.35em] text-silver/60" htmlFor="enquiry-name">
            Full Name
          </label>
          <input
            id="enquiry-name"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-2 w-full rounded-full border border-white/25 bg-black/60 px-5 py-3 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none min-h-12"
            placeholder="Alexandros Iliadis"
            type="text"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.35em] text-silver/60" htmlFor="enquiry-phone">
            Phone
          </label>
          <input
            id="enquiry-phone"
            required
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="mt-2 w-full rounded-full border border-white/25 bg-black/60 px-5 py-3 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none min-h-12"
            placeholder="+30 69 1234 5678"
            type="tel"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.35em] text-silver/60" htmlFor="enquiry-email">
            Email
          </label>
          <input
            id="enquiry-email"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-2 w-full rounded-full border border-white/25 bg-black/60 px-5 py-3 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none min-h-12"
            placeholder="vip@domain.com"
            type="email"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.35em] text-silver/60" htmlFor="enquiry-message">
            Message
          </label>
          <textarea
            id="enquiry-message"
            value={form.message}
            onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
            className="mt-2 w-full rounded-3xl border border-white/25 bg-black/60 px-5 py-4 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none"
            placeholder="Share desired configuration, trade-in details or bespoke requests."
            rows={4}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <GlowButton type="submit" disabled={isPending}>
          {isPending ? 'Sending…' : 'Submit Enquiry'}
        </GlowButton>
        {status === 'success' && <p className="text-sm text-emerald-300">Enquiry received. We will be in touch shortly.</p>}
        {status === 'error' && <p className="text-sm text-rose-300">Unable to submit. Please try again.</p>}
      </div>
    </form>
  );
}
