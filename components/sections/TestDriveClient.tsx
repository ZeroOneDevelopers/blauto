'use client';

import { FormEvent, useMemo, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GlowButton from '@/components/ui/GlowButton';
import { motion, AnimatePresence } from 'framer-motion';
import type { ShowroomVehicle } from '@/lib/vehicles';
import { createBooking } from '@/app/dashboard/actions';
import { CalendarIcon, CheckBadgeIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

const DEFAULT_START = '10:00';
const DEFAULT_END = '11:00';

type Props = {
  vehicles: ShowroomVehicle[];
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  vehicleId: string;
  vehicleName: string;
  preferredDate: string;
};

export default function TestDriveClient({ vehicles }: Props) {
  const searchParams = useSearchParams();
  const preselected = searchParams.get('vehicle');
  const initialVehicle = preselected ? vehicles.find((vehicle) => vehicle.title === preselected) : undefined;
  const hasVehicles = vehicles.length > 0;
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    phone: '',
    email: '',
    vehicleId: initialVehicle?.id ?? '',
    vehicleName: initialVehicle?.title ?? preselected ?? '',
    preferredDate: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const calendarLink = useMemo(() => {
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const text = encodeURIComponent(`Test Drive - ${formState.vehicleName || 'BL Auto Gallery'}`);
    const details = encodeURIComponent(
      `Client: ${formState.fullName}\nPhone: ${formState.phone}\nEmail: ${formState.email}\nVehicle: ${formState.vehicleName}\nPreferred Date: ${formState.preferredDate}`
    );
    return `${base}&text=${text}&details=${details}`;
  }, [formState]);

  const whatsappLink = useMemo(() => {
    const message = encodeURIComponent(
      `Hello BL Auto Gallery,%0A%0AI would like to book a test drive.%0A%0AName: ${formState.fullName}%0APhone: ${formState.phone}%0AVehicle: ${formState.vehicleName}%0APreferred Date: ${formState.preferredDate}`
    );
    return `https://wa.me/302101234567?text=${message}`;
  }, [formState]);

  const emailLink = useMemo(() => {
    const subject = encodeURIComponent('Test Drive Request - BL Auto Gallery');
    const body = encodeURIComponent(
      `Name: ${formState.fullName}\nPhone: ${formState.phone}\nVehicle: ${formState.vehicleName}\nPreferred Date: ${formState.preferredDate}`
    );
    return `mailto:concierge@blautogallery.com?subject=${subject}&body=${body}`;
  }, [formState]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const currentVehicle = vehicles.find((vehicle) => vehicle.id === formState.vehicleId);
    setSubmitted(false);

    startTransition(async () => {
      try {
        await createBooking({
          vehicleId: formState.vehicleId || null,
          name: formState.fullName,
          phone: formState.phone,
          email: formState.email,
          date: formState.preferredDate,
          startTime: DEFAULT_START,
          endTime: DEFAULT_END,
          notes: currentVehicle ? `Requested vehicle: ${currentVehicle.title}` : null
        });
        router.refresh();
        setSubmitted(true);
      } catch (error) {
        console.error('Failed to create booking', error);
      }
    });
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="surface-panel-strong p-12">
        <p className="text-xs uppercase tracking-[0.55em] text-silver/60">Book A Private Experience</p>
        <h1 className="mt-5 font-heading text-4xl text-white">Test Drive Concierge</h1>
        <p className="mt-4 text-sm text-silver/70">
          Submit your details and our executive liaison team will coordinate a bespoke test drive or showroom preview.
        </p>
        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          {[
            { label: 'Full Name', field: 'fullName', type: 'text', placeholder: 'John Papadopoulos' },
            { label: 'Phone', field: 'phone', type: 'tel', placeholder: '+30 695 533 9579' },
            { label: 'Email', field: 'email', type: 'email', placeholder: 'vip@domain.com' }
          ].map((input) => (
            <div key={input.field}>
              <label className="text-xs uppercase tracking-[0.4em] text-silver/60">{input.label}</label>
              <input
                required
                type={input.type}
                value={formState[input.field as keyof FormState] as string}
                onChange={(event) => setFormState((prev) => ({ ...prev, [input.field]: event.target.value }))}
                placeholder={input.placeholder}
                className="mt-3 w-full min-h-12 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 text-sm text-white placeholder:text-silver/40 transition focus:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              />
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-[0.4em] text-silver/60">Vehicle</label>
            <select
              required={hasVehicles}
              value={formState.vehicleId}
              onChange={(event) => {
                const selected = vehicles.find((vehicle) => vehicle.id === event.target.value);
                setFormState((prev) => ({
                  ...prev,
                  vehicleId: event.target.value,
                  vehicleName: selected?.title ?? ''
                }));
              }}
              disabled={!hasVehicles}
              className="mt-3 w-full min-h-12 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 text-sm text-white transition focus:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                {hasVehicles ? 'Select a vehicle' : 'Inventory required'}
              </option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.4em] text-silver/60">Preferred Date</label>
            <input
              required={hasVehicles}
              type="date"
              value={formState.preferredDate}
              onChange={(event) => setFormState((prev) => ({ ...prev, preferredDate: event.target.value }))}
              disabled={!hasVehicles}
              className="mt-3 w-full min-h-12 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 text-sm text-white transition focus:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            />
          </div>
          <div className="flex flex-col gap-4 pt-2 sm:flex-row">
            <GlowButton type="submit" disabled={isPending || !hasVehicles}>
              {isPending ? 'Submitting…' : 'Submit Request'}
            </GlowButton>
            <GlowButton href={whatsappLink} variant="secondary">
              Send via WhatsApp
            </GlowButton>
          </div>
        </form>
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-10 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-7 text-sm text-emerald-200 shadow-[0_32px_80px_-45px_rgba(16,185,129,0.55)]"
            >
              <p className="font-heading text-lg text-white">Your test drive request has been sent.</p>
              <p className="mt-3 text-silver/70">
                Our team will contact you shortly to schedule the appointment. Add it to your calendar or follow up by email.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <GlowButton href={calendarLink} variant="secondary">
                  Add to Calendar
                </GlowButton>
                <GlowButton href={emailLink} variant="secondary">
                  Send Email Confirmation
                </GlowButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="space-y-6">
        <div className="surface-panel p-10">
          <h2 className="font-heading text-2xl text-white">Concierge Privileges</h2>
          <ul className="mt-5 space-y-4 text-sm text-silver/70">
            <li className="flex items-start gap-3">
              <CheckBadgeIcon className="mt-0.5 h-5 w-5 text-white" aria-hidden />
              <span>Private lounge reception in Athens with signature welcome ritual.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckBadgeIcon className="mt-0.5 h-5 w-5 text-white" aria-hidden />
              <span>Racetrack or coastal route options tailored to each vehicle.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckBadgeIcon className="mt-0.5 h-5 w-5 text-white" aria-hidden />
              <span>Chauffeur-driven collection and return on request.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckBadgeIcon className="mt-0.5 h-5 w-5 text-white" aria-hidden />
              <span>Opportunity to explore financing or trade-in packages.</span>
            </li>
          </ul>
        </div>
        <div className="surface-panel p-10 space-y-4">
          <h2 className="font-heading text-2xl text-white">Need Immediate Assistance?</h2>
          <p className="text-sm text-silver/70">
            Call our executive line or send us a note and we&apos;ll arrange your visit to the BL Auto Gallery lounge.
          </p>
          <div className="space-y-3 text-sm text-silver/70">
            <p className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-white" aria-hidden />
              <a href="tel:+306955339579" className="transition hover:text-white">
                +30 695 533 9579
              </a>
            </p>
            <p className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-white" aria-hidden />
              <a href="mailto:concierge@blautogallery.com" className="transition hover:text-white">
                concierge@blautogallery.com
              </a>
            </p>
            <p className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-white" aria-hidden />
              <span>Lasithiou 4, Glifada 166 74</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
