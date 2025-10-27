// lib/vehicles.ts
import type { Vehicle } from '@prisma/client';

export type ShowroomVehicle = Vehicle & {
  primaryImage: string;
  secondaryImages: string[];
  audioSample: string | null;
};

export const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80';

export const DEFAULT_AUDIO = '/sounds/engine-start.mp3';

export function enrichVehicle(vehicle: Vehicle): ShowroomVehicle {
  const [primaryImage, ...rest] = (vehicle.images && vehicle.images.length > 0)
    ? vehicle.images
    : [DEFAULT_IMAGE];

  // Πάντα absolute path για αρχεία στο /public
  const firstAudio = vehicle.audio_urls?.[0] ?? null;
  const audioSample = firstAudio
    ? (firstAudio.startsWith('/') ? firstAudio : `/${firstAudio.replace(/^public\//, '')}`)
    : null;

  return {
    ...vehicle,
    primaryImage,
    secondaryImages: rest,
    audioSample
  };
}

export function getUniqueOptions(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter(Boolean) as string[])).sort();
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}
