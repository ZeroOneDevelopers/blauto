import LeadsManager from '@/components/dashboard/LeadsManager';
import { prisma } from '@/lib/prisma';

export const revalidate = 0;

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    include: {
      vehicle: { select: { title: true, price: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return <LeadsManager leads={leads} />;
}
