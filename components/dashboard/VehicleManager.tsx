'use client';

import { Fragment, useEffect, useMemo, useState, useTransition } from 'react';
import type { Vehicle } from '@prisma/client';
import GlowButton from '@/components/ui/GlowButton';
import { deleteVehicle, toggleVehicleFeatured, upsertVehicle } from '@/app/dashboard/actions';
import ImportForm from '@/app/dashboard/(admin)/vehicles/ImportForm';
import { Dialog, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';

type Props = { vehicles: Vehicle[] };
type FormState = Omit<Vehicle, 'createdAt' | 'updatedAt'>;

const emptyVehicle: FormState = {
  id: '',
  slug: '',
  title: '',
  make: '',
  model: '',
  year: 2024,
  price: 0,
  mileage: 0,
  engine_cc: 0,
  hp: 0,
  fuel: '',
  transmission: '',
  body: '',
  color: null,
  location: null,
  description: null,
  images: [],
  audio_urls: [],
  featured: false
};

function formatEuro(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
}

export default function VehicleManager({ vehicles }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState<FormState>({ ...emptyVehicle });
  const [isPending, startTransition] = useTransition();
  const [filterFeatured, setFilterFeatured] = useState<'ALL' | 'FEATURED'>('ALL');
  const [search, setSearch] = useState('');
  const router = useRouter();
  const [inventory, setInventory] = useState<Vehicle[]>(vehicles);

  // Lock body scroll όταν το modal είναι ανοιχτό
  useEffect(() => {
    if (!isModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isModalOpen]);

  useEffect(() => {
    setInventory(vehicles);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return inventory.filter((vehicle) => {
      const matchesFeatured = filterFeatured === 'ALL' ? true : vehicle.featured;
      const matchesSearch = search
        ? vehicle.title.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.make.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesFeatured && matchesSearch;
    });
  }, [filterFeatured, search, inventory]);

  function openCreateModal() {
    setCurrent({ ...emptyVehicle });
    setIsModalOpen(true);
  }

  function openEditModal(vehicle: Vehicle) {
    const { createdAt, updatedAt, ...rest } = vehicle;
    setCurrent({
      ...rest,
      color: vehicle.color ?? '',
      location: vehicle.location ?? '',
      description: vehicle.description ?? ''
    });
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function parseList(input: string): string[] {
    return input
      .split(/\r?\n|,|\|/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      id: current.id || undefined,
      slug: String(formData.get('slug') ?? ''),
      title: String(formData.get('title') ?? ''),
      make: String(formData.get('make') ?? ''),
      model: String(formData.get('model') ?? ''),
      year: Number(formData.get('year') ?? 0),
      price: Number(formData.get('price') ?? 0),
      mileage: Number(formData.get('mileage') ?? 0),
      engine_cc: Number(formData.get('engine_cc') ?? 0),
      hp: Number(formData.get('hp') ?? 0),
      fuel: String(formData.get('fuel') ?? ''),
      transmission: String(formData.get('transmission') ?? ''),
      body: String(formData.get('body') ?? ''),
      color: String(formData.get('color') ?? ''),
      location: String(formData.get('location') ?? ''),
      description: String(formData.get('description') ?? ''),
      images: parseList(String(formData.get('images') ?? '')),
      audio_urls: parseList(String(formData.get('audio_urls') ?? '')),
      featured: formData.get('featured') === 'on'
    };

    startTransition(async () => {
      try {
        const record = await upsertVehicle(payload);
        setInventory((prev) => {
          const exists = prev.some((item) => item.id === record.id);
          if (exists) {
            return prev.map((item) => (item.id === record.id ? record : item));
          }
          return [record, ...prev];
        });
        router.refresh();
        closeModal();
      } catch (error) {
        console.error('Failed to save vehicle', error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this vehicle?')) return;
    startTransition(async () => {
      try {
        await deleteVehicle(id);
        setInventory((prev) => prev.filter((vehicle) => vehicle.id !== id));
        router.refresh();
      } catch (error) {
        console.error('Failed to delete vehicle', error);
      }
    });
  }

  function handleToggleFeatured(vehicle: Vehicle) {
    startTransition(async () => {
      try {
        const record = await toggleVehicleFeatured(vehicle.id, !vehicle.featured);
        setInventory((prev) => prev.map((item) => (item.id === record.id ? record : item)));
        router.refresh();
      } catch (error) {
        console.error('Failed to toggle featured flag', error);
      }
    });
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-white">Vehicle Inventory</h1>
          <p className="text-sm text-silver/70">Manage the digital fleet, update hero assets and control featured highlights.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <GlowButton variant="secondary" onClick={() => setFilterFeatured(filterFeatured === 'ALL' ? 'FEATURED' : 'ALL')}>
            {filterFeatured === 'ALL' ? 'Show Featured' : 'Show All'}
          </GlowButton>
          <GlowButton onClick={openCreateModal}>Add Vehicle</GlowButton>
        </div>
      </div>

      <div className="surface-panel rounded-3xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search inventory"
            className="min-h-12 w-full rounded-full border border-white/25 bg-black/60 px-5 py-3 text-sm text-white placeholder:text-silver/40 focus:border-white/60 focus:outline-none sm:max-w-sm"
          />
          <ImportForm
            onImported={(nextVehicles) => {
              if (Array.isArray(nextVehicles)) {
                setInventory(nextVehicles);
              }
            }}
          />
        </div>

        {/* Desktop table */}
        <div className="mt-6 overflow-x-auto hidden sm:block">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 uppercase tracking-[0.3em] text-silver/60">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Fuel</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="bg-black/60">
                  <td className="px-4 py-4 text-white">
                    <p className="font-heading text-lg">{vehicle.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-silver/60">{vehicle.make} · {vehicle.model}</p>
                  </td>
                  <td className="px-4 py-4 text-silver/70">{vehicle.year}</td>
                  <td className="px-4 py-4 text-silver/70">{formatEuro(vehicle.price)}</td>
                  <td className="px-4 py-4 text-silver/70">{vehicle.fuel}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(vehicle)}
                      className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em] transition ${
                        vehicle.featured ? 'bg-emerald-500/10 text-emerald-200' : 'bg-white/10 text-silver/70'
                      }`}
                    >
                      {vehicle.featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(vehicle)}
                        className="text-xs uppercase tracking-[0.3em] text-silver/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(vehicle.id)}
                        className="text-xs uppercase tracking-[0.3em] text-rose-400 transition hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200/60"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-6 space-y-4 sm:hidden">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="surface-panel rounded-3xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-heading text-lg text-white">{vehicle.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-silver/60">{vehicle.make} · {vehicle.model}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleFeatured(vehicle)}
                  className={`rounded-full px-4 py-1 text-xs uppercase tracking-[0.3em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                    vehicle.featured ? 'bg-emerald-500/10 text-emerald-200' : 'bg-white/10 text-silver/70'
                  }`}
                >
                  {vehicle.featured ? 'Featured' : 'Standard'}
                </button>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs uppercase tracking-[0.3em] text-silver/60">
                <span>Year</span><span className="text-right text-silver/70">{vehicle.year}</span>
                <span>Price</span><span className="text-right text-silver/70">{formatEuro(vehicle.price)}</span>
                <span>Fuel</span><span className="text-right text-silver/70">{vehicle.fuel}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openEditModal(vehicle)}
                  className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-silver/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(vehicle.id)}
                  className="rounded-full border border-rose-400/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-rose-200 transition hover:text-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200/60"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <p className="p-8 text-center text-sm text-silver/60">No vehicles found. Adjust your filters.</p>
        )}
      </div>

      {/* ΜΟΝΟ Headless UI modal (το παλιό modal αφαιρέθηκε) */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[70]" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="surface-panel-strong w-full max-w-3xl rounded-t-3xl p-6 shadow-glow max-h-[80vh] overflow-y-auto sm:rounded-3xl sm:p-8 sm:max-h-[90vh]">
                  <div className="flex items-center justify-between gap-4">
                    <Dialog.Title className="font-heading text-2xl text-white">
                      {current.id ? 'Edit Vehicle' : 'New Vehicle'}
                    </Dialog.Title>
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.3em] text-silver/60 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
                    {[
                      { name: 'title', label: 'Title', type: 'text', value: current.title },
                      { name: 'slug', label: 'Slug', type: 'text', value: current.slug },
                      { name: 'make', label: 'Make', type: 'text', value: current.make },
                      { name: 'model', label: 'Model', type: 'text', value: current.model },
                      { name: 'year', label: 'Year', type: 'number', value: current.year },
                      { name: 'price', label: 'Price', type: 'number', value: current.price },
                      { name: 'mileage', label: 'Mileage', type: 'number', value: current.mileage },
                      { name: 'engine_cc', label: 'Engine CC', type: 'number', value: current.engine_cc },
                      { name: 'hp', label: 'Horsepower', type: 'number', value: current.hp },
                      { name: 'fuel', label: 'Fuel', type: 'text', value: current.fuel },
                      { name: 'transmission', label: 'Transmission', type: 'text', value: current.transmission },
                      { name: 'body', label: 'Body Style', type: 'text', value: current.body }
                    ].map((field) => (
                      <label key={field.name} className="text-xs uppercase tracking-[0.3em] text-silver/60">
                        {field.label}
                        <input
                          required
                          name={field.name}
                          type={field.type}
                          defaultValue={field.value ?? ''}
                          className="mt-3 w-full rounded-full border border-white/25 bg-black/60 px-4 py-3 text-sm text-white focus:border-white/60 focus:outline-none min-h-12"
                        />
                      </label>
                    ))}

                    <label className="text-xs uppercase tracking-[0.3em] text-silver/60 md:col-span-2">
                      Description
                      <textarea
                        name="description"
                        defaultValue={current.description ?? ''}
                        rows={3}
                        className="mt-3 w-full rounded-3xl border border-white/25 bg-black/60 px-4 py-3 text-sm text-white focus:border-white/60 focus:outline-none"
                      />
                    </label>

                    <label className="text-xs uppercase tracking-[0.3em] text-silver/60">
                      Color
                      <input
                        name="color"
                        defaultValue={current.color ?? ''}
                        className="mt-3 w-full rounded-full border border-white/25 bg-black/60 px-4 py-3 text-sm text-white focus:border-white/60 focus:outline-none min-h-12"
                      />
                    </label>

                    <label className="text-xs uppercase tracking-[0.3em] text-silver/60">
                      Location
                      <input
                        name="location"
                        defaultValue={current.location ?? ''}
                        className="mt-3 w-full rounded-full border border-white/25 bg-black/60 px-4 py-3 text-sm text-white focus:border-white/60 focus:outline-none min-h-12"
                      />
                    </label>

                    <label className="text-xs uppercase tracking-[0.3em] text-silver/60 md:col-span-2">
                      Image URLs (newline, comma or pipe separated)
                      <textarea
                        name="images"
                        defaultValue={current.images.join('\n')}
                        rows={3}
                        className="mt-3 w-full rounded-3xl border border-white/25 bg-black/60 px-4 py-3 text-sm text-white focus:border-white/60 focus:outline-none"
                      />
                    </label>

                    <label className="text-xs uppercase tracking-[0.3em] text-silver/60 md:col-span-2">
                      Audio URLs (newline, comma or pipe separated)
                      <textarea
                        name="audio_urls"
                        defaultValue={current.audio_urls.join('\n')}
                        rows={3}
                        className="mt-3 w-full rounded-3xl border border-white/25 bg-black/60 px-4 py-3 text-sm text-white focus:border-white/60 focus:outline-none"
                      />
                    </label>

                    <label className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-silver/60">
                      <input type="checkbox" name="featured" defaultChecked={current.featured} />
                      Featured Vehicle
                    </label>

                    <div className="md:col-span-2 flex justify-end gap-4">
                      <GlowButton type="button" variant="secondary" onClick={closeModal}>
                        Cancel
                      </GlowButton>
                      <GlowButton type="submit" disabled={isPending}>
                        {isPending ? 'Saving…' : 'Save Vehicle'}
                      </GlowButton>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
