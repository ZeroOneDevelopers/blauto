// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        graphite: '#0b0c10',
        silver: '#e7e9ee',
        offwhite: '#f7f7f9',
        /** ✅ προσθήκη για 12% opacity σε border */
        white12: 'rgba(255,255,255,0.12)'
      },
      fontFamily: {
        heading: ['var(--font-heading)', ...fontFamily.sans],
        body: ['var(--font-body)', ...fontFamily.sans]
      },
      boxShadow: {
        glow: '0 0 35px rgba(231, 233, 238, 0.25)',
        innerGlow: 'inset 0 0 45px rgba(231, 233, 238, 0.15)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at 20% 20%, rgba(231, 233, 238, 0.1), transparent 45%), radial-gradient(circle at 80% 0%, rgba(231, 233, 238, 0.08), transparent 50%)'
      }
    }
  },
  plugins: []
};

export default config;

