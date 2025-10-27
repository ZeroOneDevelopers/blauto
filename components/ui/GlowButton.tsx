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
    'bg-white text-graphite shadow-[0_25px_60px_-30px_rgba(231,233,238,0.65)] hover:bg-silver hover:shadow-[0_30px_80px_-35px_rgba(231,233,238,0.8)]',
  secondary:
    'border border-white/40 bg-white/5 text-white backdrop-blur px-6 hover:border-white/80 hover:bg-white/10'
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
        'relative inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl px-6 py-3 text-xs uppercase tracking-[0.4em] transition-all duration-500 whitespace-normal text-center sm:w-auto sm:px-8',
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
