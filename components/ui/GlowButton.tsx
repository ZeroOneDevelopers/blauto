'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';
import clsx from 'clsx';

type GlowButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const variants = {
  primary:
    'bg-white text-graphite hover:bg-silver shadow-[0_0_30px_rgba(231,233,238,0.35)] hover:shadow-[0_0_45px_rgba(231,233,238,0.55)]',
  secondary:
    'bg-transparent text-white border border-white/40 hover:border-white/80 hover:bg-white/10'
};

export default function GlowButton({
  href,
  onClick,
  children,
  variant = 'primary',
  className,
  type = 'button',
  disabled = false
}: GlowButtonProps) {
  const content = (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        'relative inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full px-6 py-3 text-sm uppercase tracking-[0.35em] transition-all duration-500 whitespace-normal text-center sm:w-auto sm:px-8',
        variants[variant],
        disabled && 'pointer-events-none opacity-60',
        className
      )}
    >
      <span className="block leading-relaxed">{children}</span>
    </motion.button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {content}
      </Link>
    );
  }

  return content;
}
