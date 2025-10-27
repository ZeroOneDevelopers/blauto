import TestDriveClient from '@/components/sections/TestDriveClient';
import { prisma } from '@/lib/prisma';
import { enrichVehicle } from '@/lib/vehicles';
import PageBackground from '@/components/layout/PageBackground';

export const revalidate = 0;

export default async function TestDrivePage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ featured: 'desc' }, { title: 'asc' }]
  });

  return (
    <section className="section-padding">
      <PageBackground page="test-drive" />
      <TestDriveClient vehicles={vehicles.map(enrichVehicle)} />
    </section>
  );
}
