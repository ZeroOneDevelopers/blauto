import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import DashboardNav from '@/components/dashboard/DashboardNav';
import SignOutButton from '@/components/dashboard/SignOutButton';
import PageBackground from '@/components/layout/PageBackground';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <section className="section-padding">
      <PageBackground page="dashboard" />
      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-silver/60">Administrator</p>
            <p className="text-sm text-white">{session?.user?.email ?? 'Unknown user'}</p>
          </div>
          <SignOutButton />
        </div>
        <DashboardNav />
        {children}
      </div>
    </section>
  );
}
