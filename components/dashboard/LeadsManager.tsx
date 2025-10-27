'use client';

import { useTransition } from 'react';
import type { Lead } from '@prisma/client';
import { deleteLead } from '@/app/dashboard/actions';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/vehicles';

type LeadWithVehicle = Lead & {
  vehicle: { title: string | null; price: number | null } | null;
};

type Props = {
  leads: LeadWithVehicle[];
};

export default function LeadsManager({ leads }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete(id: string) {
    if (!confirm('Delete this lead?')) return;
    startTransition(async () => {
      try {
        await deleteLead(id);
        router.refresh();
      } catch (error) {
        console.error('Failed to delete lead', error);
      }
    });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl text-white">Lead Registry</h1>
        <p className="text-sm text-silver/70">Review inbound enquiries with direct contact details for rapid follow-up.</p>
      </div>
      <div className="surface-panel overflow-hidden rounded-3xl">
        <div className="hidden overflow-x-auto sm:block">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 uppercase tracking-[0.35em] text-silver/60">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {leads.map((lead) => (
                <tr key={lead.id} className="bg-black/60">
                  <td className="px-6 py-4 text-white">
                    <p className="font-heading text-lg">{lead.name}</p>
                    {lead.message && <p className="text-xs text-silver/60">{lead.message}</p>}
                  </td>
                  <td className="px-6 py-4 text-silver/70">
                    <p>{lead.phone}</p>
                    <p>{lead.email}</p>
                  </td>
                  <td className="px-6 py-4 text-silver/70">
                    <p>{lead.vehicle?.title ?? 'Unassigned'}</p>
                    {lead.vehicle?.price ? (
                      <p className="text-xs text-silver/50">{formatCurrency(lead.vehicle.price)}</p>
                    ) : null}
                  </td>
                  <td className="px-6 py-4 text-silver/60">{lead.createdAt.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-silver/70">
                      {lead.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleDelete(lead.id)}
                      disabled={isPending}
                      className="text-xs uppercase tracking-[0.3em] text-rose-300 transition hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
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
          {leads.map((lead) => (
            <div key={lead.id} className="surface-panel rounded-3xl p-5">
              <div className="flex flex-col gap-3">
                <div>
                  <p className="font-heading text-lg text-white">{lead.name}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-silver/60">{lead.type.replace('_', ' ')}</p>
                </div>
                <div className="text-sm text-silver/70">
                  <p>{lead.phone}</p>
                  <p>{lead.email}</p>
                </div>
                <div className="text-xs uppercase tracking-[0.3em] text-silver/60">
                  <p>{lead.vehicle?.title ?? 'Unassigned'}</p>
                  {lead.vehicle?.price ? (
                    <p className="text-silver/50">{formatCurrency(lead.vehicle.price)}</p>
                  ) : null}
                </div>
                <p className="text-xs text-silver/50">{lead.createdAt.toLocaleString()}</p>
                {lead.message && <p className="text-sm text-silver/70">{lead.message}</p>}
                <button
                  type="button"
                  onClick={() => handleDelete(lead.id)}
                  disabled={isPending}
                  className="text-left text-xs uppercase tracking-[0.3em] text-rose-300 transition hover:text-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {leads.length === 0 && <p className="p-8 text-center text-sm text-silver/60">No leads captured yet.</p>}
      </div>
    </div>
  );
}
