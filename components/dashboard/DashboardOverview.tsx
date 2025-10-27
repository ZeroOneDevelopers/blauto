'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';

type LeadSummary = {
  id: string;
  name: string;
  vehicle: string;
  createdAt: string;
  type: string;
};

type Props = {
  leads: LeadSummary[];
  stats: {
    totalVehicles: number;
    totalLeads: number;
    featuredVehicles: number;
    pendingBookings: number;
  };
};

const filters = [
  { label: 'All Leads', value: 'ALL', highlight: 'bg-white/10' },
  { label: 'Test Drives', value: 'TEST_DRIVE', highlight: 'bg-amber-500/10' },
  { label: 'General', value: 'GENERAL', highlight: 'bg-sky-500/10' },
  { label: 'Offers', value: 'OFFER', highlight: 'bg-emerald-500/10' }
] as const;

export default function DashboardOverview({ leads, stats }: Props) {
  const [filter, setFilter] = useState<(typeof filters)[number]['value']>('ALL');
  const [search, setSearch] = useState('');

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesType = filter === 'ALL' ? true : lead.type === filter;
      const matchesSearch = search
        ? lead.name.toLowerCase().includes(search.toLowerCase()) || lead.vehicle.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesType && matchesSearch;
    });
  }, [filter, leads, search]);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.55em] text-silver/60">Admin Control Centre</p>
        <h1 className="font-heading text-4xl text-white">Lead Intelligence Dashboard</h1>
        <p className="text-sm text-silver/70">
          Monitor incoming enquiries, coordinate test drives, and keep the team aligned with a cinematic cockpit view.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-4">
        <div className="surface-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.45em] text-silver/60">Total Vehicles</p>
          <p className="mt-4 font-heading text-3xl text-white">{stats.totalVehicles}</p>
        </div>
        <div className="surface-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.45em] text-silver/60">Featured</p>
          <p className="mt-4 font-heading text-3xl text-white">{stats.featuredVehicles}</p>
        </div>
        <div className="surface-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.45em] text-silver/60">Total Leads</p>
          <p className="mt-4 font-heading text-3xl text-white">{stats.totalLeads}</p>
        </div>
        <div className="surface-panel rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.45em] text-silver/60">Pending Bookings</p>
          <p className="mt-4 font-heading text-3xl text-white">{stats.pendingBookings}</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        {filters.map((card) => (
          <motion.button
            key={card.value}
            onClick={() => setFilter(card.value)}
            whileHover={{ y: -6 }}
            className={`rounded-3xl border border-white/15 bg-black/60 p-6 text-left transition-all duration-500 ${card.highlight} ${
              filter === card.value ? 'shadow-glow border-white/40' : 'shadow-innerGlow'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.45em] text-silver/60">{card.label}</p>
            <p className="mt-4 font-heading text-3xl text-white">
              {card.value === 'ALL' ? stats.totalLeads : leads.filter((lead) => lead.type === card.value).length}
            </p>
          </motion.button>
        ))}
      </div>
      <div className="surface-panel rounded-3xl p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by client or vehicle"
            className="w-full rounded-full border border-white/25 bg-black/60 px-5 py-3 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none sm:max-w-xs min-h-12"
          />
          <GlowButton variant="secondary">Export Leads</GlowButton>
        </div>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-white/12 bg-black/50">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 uppercase tracking-[0.35em] text-silver/60">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Vehicle</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="bg-black/60">
                  <td className="px-6 py-4 text-white">{lead.name}</td>
                  <td className="px-6 py-4 text-silver/80">{lead.vehicle}</td>
                  <td className="px-6 py-4 text-silver/60">{new Date(lead.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-silver/70">
                      {lead.type.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
            <p className="p-8 text-center text-sm text-silver/60">No leads found with the current filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
