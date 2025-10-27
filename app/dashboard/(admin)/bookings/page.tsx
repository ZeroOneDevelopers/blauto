import BookingsManager from '@/components/dashboard/BookingsManager';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      vehicle: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return <BookingsManager bookings={bookings} />;
}
