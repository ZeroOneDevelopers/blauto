'use client';

import { useTransition } from 'react';
import type { Booking, BookingStatus } from '@prisma/client';
import { deleteBooking, updateBookingStatus } from '@/app/dashboard/actions';
import { useRouter } from 'next/navigation';

const statuses: BookingStatus[] = ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];

type BookingWithVehicle = Booking & {
  vehicle: { title: string | null } | null;
};

type Props = {
  bookings: BookingWithVehicle[];
};

export default function BookingsManager({ bookings }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleStatusChange(id: string, status: BookingStatus) {
    startTransition(async () => {
      try {
        await updateBookingStatus(id, status);
        router.refresh();
      } catch (error) {
        console.error('Failed to update booking status', error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this booking?')) return;
    startTransition(async () => {
      try {
        await deleteBooking(id);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete booking', error);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-white">Test Drive Bookings</h1>
        <p className="text-sm text-silver/70">Coordinate appointments and mark progression through the concierge pipeline.</p>
      </div>
      <div className="surface-panel overflow-hidden rounded-3xl">
        <div className="hidden overflow-x-auto sm:block">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 uppercase tracking-[0.35em] text-silver/60">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bookings.map((booking) => (
                <tr key={booking.id} className="bg-black/60">
                  <td className="px-6 py-4 text-white">
                    <p className="font-heading text-lg">{booking.name}</p>
                    {booking.notes && <p className="text-xs text-silver/60">{booking.notes}</p>}
                  </td>
                  <td className="px-6 py-4 text-silver/70">
                    <p>{booking.phone}</p>
                    <p>{booking.email}</p>
                  </td>
                  <td className="px-6 py-4 text-silver/70">{booking.vehicle?.title ?? 'Unassigned'}</td>
                  <td className="px-6 py-4 text-silver/60">
                    <p>{new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-xs text-silver/50">{booking.startTime} – {booking.endTime}</p>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      defaultValue={booking.status}
                      onChange={(event) => handleStatusChange(booking.id, event.target.value as BookingStatus)}
                      disabled={isPending}
                      className="rounded-full border border-white/25 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-silver/70 focus:border-white/60 focus:outline-none min-h-12"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDelete(booking.id)}
                      disabled={isPending}
                      className="ml-3 text-xs uppercase tracking-[0.3em] text-rose-300 transition hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-4 p-6 sm:hidden">
          {bookings.map((booking) => (
            <div key={booking.id} className="surface-panel rounded-3xl p-5">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-heading text-lg text-white">{booking.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-silver/60">{booking.vehicle?.title ?? 'Unassigned'}</p>
                </div>
                <div className="text-sm text-silver/70">
                  <p>{booking.phone}</p>
                  <p>{booking.email}</p>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-silver/60">
                  <p>{new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-silver/50">{booking.startTime} – {booking.endTime}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    defaultValue={booking.status}
                    onChange={(event) => handleStatusChange(booking.id, event.target.value as BookingStatus)}
                    disabled={isPending}
                    className="mt-2 w-full rounded-full border border-white/25 bg-black/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-silver/70 focus:border-white/60 focus:outline-none min-h-12"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleDelete(booking.id)}
                    disabled={isPending}
                    className="mt-2 text-xs uppercase tracking-[0.3em] text-rose-300 transition hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {bookings.length === 0 && <p className="p-8 text-center text-sm text-silver/60">No bookings scheduled.</p>}
      </div>
    </div>
  );
}
