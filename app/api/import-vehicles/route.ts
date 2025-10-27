import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

function parseNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function parseList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n|,|\|/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalised = value.toLowerCase();
    return normalised === 'true' || normalised === '1' || normalised === 'yes';
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return false;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await request.json();
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const slug = String(row.slug ?? '').trim();
    if (!slug) {
      continue;
    }

    const data = {
      slug,
      title: String(row.title ?? '').trim(),
      make: String(row.make ?? '').trim(),
      model: String(row.model ?? '').trim(),
      year: parseNumber(row.year),
      price: parseNumber(row.price),
      mileage: parseNumber(row.mileage),
      engine_cc: parseNumber(row.engine_cc),
      hp: parseNumber(row.hp),
      fuel: String(row.fuel ?? '').trim(),
      transmission: String(row.transmission ?? '').trim(),
      body: String(row.body ?? '').trim(),
      color: row.color ? String(row.color).trim() : null,
      location: row.location ? String(row.location).trim() : null,
      description: row.description ? String(row.description).trim() : null,
      images: parseList(row.images),
      audio_urls: parseList(row.audio_urls),
      featured: parseBoolean(row.featured)
    };

    if (!data.title) {
      continue;
    }

    const existing = await prisma.vehicle.findUnique({ where: { slug } });
    if (existing) {
      await prisma.vehicle.update({ where: { slug }, data });
      updated += 1;
    } else {
      await prisma.vehicle.create({ data });
      created += 1;
    }
  }

  revalidatePath('/');
  revalidatePath('/showroom');
  revalidatePath('/showroom/[slug]');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/vehicles');

  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } });

  return NextResponse.json({ created, updated, vehicles });
}
