'use server';

import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import type { BookingStatus, LeadType, Vehicle } from '@prisma/client';

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true' || value === '1' || value.toLowerCase() === 'yes';
  return false;
}

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    // Restrict state-changing operations to authenticated administrators only.
    throw new Error('Admin access required');
  }
  return session;
}

type VehiclePayload = {
  id?: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number | string;
  price: number | string;
  mileage: number | string;
  engine_cc: number | string;
  hp: number | string;
  fuel: string;
  transmission: string;
  body: string;
  color?: string | null;
  location?: string | null;
  description?: string | null;
  images: string[];
  audio_urls: string[];
  featured?: boolean | string;
};

export async function upsertVehicle(data: VehiclePayload): Promise<Vehicle> {
  await requireAdmin();

  const payload = {
    slug: data.slug.trim(),
    title: data.title.trim(),
    make: data.make.trim(),
    model: data.model.trim(),
    year: parseNumber(data.year),
    price: parseNumber(data.price),
    mileage: parseNumber(data.mileage),
    engine_cc: parseNumber(data.engine_cc),
    hp: parseNumber(data.hp),
    fuel: data.fuel.trim(),
    transmission: data.transmission.trim(),
    body: data.body.trim(),
    color: data.color?.trim() || null,
    location: data.location?.trim() || null,
    description: data.description?.trim() || null,
    images: data.images.filter(Boolean),
    audio_urls: data.audio_urls.filter(Boolean),
    featured: parseBoolean(data.featured)
  };

  if (!payload.slug) {
    throw new Error('Vehicle slug is required');
  }

  if (!payload.title) {
    throw new Error('Vehicle title is required');
  }

  const record = data.id
    ? await prisma.vehicle.update({
        where: { id: data.id },
        data: payload
      })
    : await prisma.vehicle.create({ data: payload });

  revalidatePath('/');
  revalidatePath('/showroom');
  revalidatePath('/showroom/[slug]');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/vehicles');

  return record;
}

export async function deleteVehicle(id: string): Promise<Vehicle | null> {
  await requireAdmin();

  const existing = await prisma.vehicle.findUnique({ where: { id } });

  await prisma.vehicle.delete({ where: { id } });

  revalidatePath('/');
  revalidatePath('/showroom');
  revalidatePath('/showroom/[slug]');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/vehicles');

  if (existing) {
    revalidatePath(`/showroom/${existing.slug}`);
  }

  return existing ?? null;
}

export async function toggleVehicleFeatured(id: string, featured: boolean): Promise<Vehicle> {
  await requireAdmin();

  const vehicle = await prisma.vehicle.update({
    where: { id },
    data: { featured }
  });

  revalidatePath('/');
  revalidatePath('/showroom');
  revalidatePath('/showroom/[slug]');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/vehicles');
  revalidatePath(`/showroom/${vehicle.slug}`);

  return vehicle;
}

type LeadPayload = {
  type: LeadType;
  vehicleId?: string | null;
  name: string;
  phone: string;
  email: string;
  message?: string | null;
  source?: string | null;
};

export async function createLead(data: LeadPayload) {
  await prisma.lead.create({
    data: {
      type: data.type,
      vehicleId: data.vehicleId ?? null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message ?? null,
      source: data.source ?? null
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
}

type BookingPayload = {
  vehicleId?: string | null;
  name: string;
  phone: string;
  email: string;
  date: Date | string;
  startTime: string;
  endTime: string;
  notes?: string | null;
  status?: BookingStatus;
};

export async function createBooking(data: BookingPayload) {
  const bookingDate = typeof data.date === 'string' ? new Date(data.date) : data.date;
  if (!bookingDate || Number.isNaN(bookingDate.getTime())) {
    throw new Error('Invalid booking date');
  }

  await prisma.booking.create({
    data: {
      vehicleId: data.vehicleId ?? null,
      name: data.name,
      phone: data.phone,
      email: data.email,
      date: bookingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      notes: data.notes ?? null,
      status: data.status ?? 'PENDING'
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await requireAdmin();

  await prisma.booking.update({
    where: { id },
    data: { status }
  });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
}

export async function deleteLead(id: string) {
  await requireAdmin();

  await prisma.lead.delete({ where: { id } });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/leads');
}

export async function deleteBooking(id: string) {
  await requireAdmin();

  await prisma.booking.delete({ where: { id } });

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/bookings');
}
