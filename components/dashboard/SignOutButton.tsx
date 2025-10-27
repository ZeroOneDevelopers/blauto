'use client';

import { signOut } from 'next-auth/react';
import GlowButton from '@/components/ui/GlowButton';

export default function SignOutButton() {
  return (
    <GlowButton
      type="button"
      variant="secondary"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Sign Out
    </GlowButton>
  );
}
