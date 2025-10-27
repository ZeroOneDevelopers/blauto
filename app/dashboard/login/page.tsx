// app/dashboard/login/page.tsx
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const revalidate = 0;            // προαιρετικό
export const dynamic = 'force-dynamic'; // προαιρετικό (αποφεύγει prerender στη login)

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-silver/70">Loading…</div>}>
      <LoginClient />
    </Suspense>
  );
}
