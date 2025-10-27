// app/dashboard/login/LoginClient.tsx
'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import GlowButton from '@/components/ui/GlowButton';
import { useRouter, useSearchParams } from 'next/navigation';
import PageBackground from '@/components/layout/PageBackground';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      email: formState.email,
      password: formState.password,
      redirect: false
    });

    setIsLoading(false);

    if (result?.error) {
      setError('Invalid credentials');
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <section className="section-padding">
      <PageBackground page="dashboard" />
      <div className="mx-auto flex max-w-md flex-col gap-8 surface-panel p-10">
        <div className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.55em] text-silver/60">BL Auto Gallery Admin</p>
          <h1 className="font-heading text-3xl text-white">Secure Sign-In</h1>
          <p className="text-sm text-silver/70">
            Authenticate with your concierge credentials to access the control centre.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs uppercase tracking-[0.4em] text-silver/60">Email</label>
            <input
              required
              type="email"
              value={formState.email}
              onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
              className="mt-3 w-full min-h-12 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 text-sm text-white transition focus:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.4em] text-silver/60">Password</label>
            <input
              required
              type="password"
              value={formState.password}
              onChange={(e) => setFormState((p) => ({ ...p, password: e.target.value }))}
              className="mt-3 w-full min-h-12 rounded-2xl border border-white/20 bg-black/60 px-5 py-3 text-sm text-white transition focus:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            />
          </div>
          {error && <p className="text-xs uppercase tracking-[0.3em] text-rose-400">{error}</p>}
          <GlowButton type="submit" disabled={isLoading} className="w-full justify-center">
            {isLoading ? 'Signing In…' : 'Sign In'}
          </GlowButton>
        </form>
      </div>
    </section>
  );
}
