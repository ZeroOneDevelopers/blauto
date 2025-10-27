'use client';

import { useEffect, useMemo, useState } from 'react';
import ShowroomFilters, { FilterState } from '@/components/sections/ShowroomFilters';
import CarCard from '@/components/sections/CarCard';
import { motion } from 'framer-motion';
import GlowButton from '@/components/ui/GlowButton';
import type { ShowroomVehicle } from '@/lib/vehicles';

const initialFilters: FilterState = {
  brand: null,
  fuel: null,
  transmission: null,
  priceMin: null,
  priceMax: null,
  yearMin: null,
  yearMax: null
};

type Props = {
  vehicles: ShowroomVehicle[];
  brandOptions: string[];
  fuelOptions: string[];
  transmissionOptions: string[];
};

export default function ShowroomClient({ vehicles, brandOptions, fuelOptions, transmissionOptions }: Props) {
  const [draftFilters, setDraftFilters] = useState<FilterState>(initialFilters);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  useEffect(() => {
    const timeout = setTimeout(() => setFilters(draftFilters), 150);
    return () => clearTimeout(timeout);
  }, [draftFilters]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesBrand = filters.brand ? vehicle.make === filters.brand : true;
      const matchesFuel = filters.fuel ? vehicle.fuel === filters.fuel : true;
      const matchesTransmission = filters.transmission ? vehicle.transmission === filters.transmission : true;
      const matchesPriceMin = filters.priceMin !== null ? vehicle.price >= filters.priceMin : true;
      const matchesPriceMax = filters.priceMax !== null ? vehicle.price <= filters.priceMax : true;
      const matchesYearMin = filters.yearMin !== null ? vehicle.year >= filters.yearMin : true;
      const matchesYearMax = filters.yearMax !== null ? vehicle.year <= filters.yearMax : true;

      return (
        matchesBrand &&
        matchesFuel &&
        matchesTransmission &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesYearMin &&
        matchesYearMax
      );
    });
  }, [filters, vehicles]);

  return (
    <>
      <ShowroomFilters
        value={draftFilters}
        onChange={setDraftFilters}
        brandOptions={brandOptions}
        fuelOptions={fuelOptions}
        transmissionOptions={transmissionOptions}
      />
      <motion.div layout className="relative z-0 grid auto-rows-fr gap-6 overflow-visible sm:grid-cols-2 xl:grid-cols-3">
        {filteredVehicles.map((vehicle, index) => (
          <CarCard key={vehicle.id} vehicle={vehicle} index={index} />
        ))}
      </motion.div>
      {filteredVehicles.length === 0 && (
        <div className="surface-panel rounded-3xl p-12 text-center text-sm text-silver/60">
          No vehicles found for this combination. Our concierge can source it privately.
          <div className="mt-6 flex justify-center">
            <GlowButton href="mailto:liaison@iliadis.gr" variant="secondary" className="w-full max-w-xs sm:w-auto">
              Contact Concierge
            </GlowButton>
          </div>
        </div>
      )}
    </>
  );
}
