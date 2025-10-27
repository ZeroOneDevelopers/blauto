import DashboardOverview from '@/components/dashboard/DashboardOverview';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function DashboardPage() {
  const [vehicles, leads, pendingBookings] = await Promise.all([
    prisma.vehicle.findMany({ select: { featured: true } }),
    prisma.lead.findMany({
      include: {
        vehicle: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.booking.count({ where: { status: 'PENDING' } })
  ]);

  const stats = {
    totalVehicles: vehicles.length,
    totalLeads: leads.length,
    featuredVehicles: vehicles.filter((vehicle) => vehicle.featured).length,
    pendingBookings
  };

  const leadSummaries = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    vehicle: lead.vehicle?.title ?? 'Unassigned',
    createdAt: lead.createdAt.toISOString(),
    type: lead.type
  }));

  return <DashboardOverview leads={leadSummaries} stats={stats} />;
}
