export const runtime = 'nodejs';
import ShowroomClient from '@/components/sections/ShowroomClient';
import { prisma } from '@/lib/prisma';
import { enrichVehicle, getUniqueOptions } from '@/lib/vehicles';
import PageBackground from '@/components/layout/PageBackground';

export const revalidate = 0;

export default async function ShowroomPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' }
    ]
  });
  const showroomVehicles = vehicles.map(enrichVehicle);
  const brandOptions = getUniqueOptions(vehicles.map((vehicle) => vehicle.make));
  const fuelOptions = getUniqueOptions(vehicles.map((vehicle) => vehicle.fuel));
  const transmissionOptions = getUniqueOptions(vehicles.map((vehicle) => vehicle.transmission));

  return (
    <section className="section-padding">
      <PageBackground page="showroom" />
      <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.55em] text-silver/60">The Digital Atelier</p>
          <h1 className="font-heading text-4xl text-white md:text-5xl">Showroom Collection</h1>
          <p className="text-sm text-silver/70">
            Filter by marque, powertrain and investment bracket to uncover vehicles tailored to your driving philosophy.
          </p>
        </div>
        <ShowroomClient
          vehicles={showroomVehicles}
          brandOptions={brandOptions}
          fuelOptions={fuelOptions}
          transmissionOptions={transmissionOptions}
        />
      </div>
    </section>
  );
}
