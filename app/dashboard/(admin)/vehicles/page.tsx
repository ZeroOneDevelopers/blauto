import VehicleManager from '@/components/dashboard/VehicleManager';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }]
  });

  return <VehicleManager vehicles={vehicles} />;
}
