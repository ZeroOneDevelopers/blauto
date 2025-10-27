'use client';

import { useRef, useState, useTransition } from 'react';
import * as Papa from 'papaparse';
import GlowButton from '@/components/ui/GlowButton';
import { useRouter } from 'next/navigation';
import type { Vehicle } from '@prisma/client';

type ImportFormProps = {
  onImported?: (vehicles: Vehicle[]) => void;
};

export default function ImportForm({ onImported }: ImportFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatus(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const response = await fetch('/api/import-vehicles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(results.data)
          });

          if (!response.ok) {
            throw new Error('Import failed');
          }

          const payload = await response.json();
          setStatus(`Imported ${payload.created} new vehicles, updated ${payload.updated}.`);
          if (Array.isArray(payload.vehicles)) {
            const normalised = (payload.vehicles as Vehicle[]).map((vehicle) => ({
              ...vehicle,
              createdAt: new Date(vehicle.createdAt),
              updatedAt: new Date(vehicle.updatedAt)
            }));
            onImported?.(normalised);
          }
          startTransition(() => {
            router.refresh();
          });
        } catch (error) {
          console.error('Vehicle import failed', error);
          setStatus('Import failed. Please review the CSV and try again.');
        } finally {
          setIsLoading(false);
          event.target.value = '';
        }
      },
      error: (error) => {
        console.error('CSV parse error', error);
        setStatus('Unable to parse CSV file.');
        setIsLoading(false);
        event.target.value = '';
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-silver/60">
      <GlowButton
        type="button"
        variant="secondary"
        disabled={isLoading || isPending}
        onClick={() => inputRef.current?.click()}
      >
        {isLoading ? 'Importing…' : 'Import CSV'}
      </GlowButton>
      <input ref={inputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
      {status && <span className="text-[0.65rem] text-silver/60">{status}</span>}
    </div>
  );
}
