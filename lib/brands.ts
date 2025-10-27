const BRAND_LOGOS: Record<string, string> = {
  porsche: '/brands/porsche.svg',
  ferrari: '/brands/ferrari.svg',
  lamborghini: '/brands/lamborghini.svg',
  mercedes: '/brands/mercedes.svg',
  'mercedes-benz': '/brands/mercedes.svg',
  audi: '/brands/audi.svg',
  bmw: '/brands/bmw.svg',
  bentley: '/brands/bentley.svg',
  rollsroyce: '/brands/rolls-royce.svg',
  'rolls-royce': '/brands/rolls-royce.svg',
  maserati: '/brands/maserati.svg',
  astonmartin: '/brands/aston-martin.svg',
  'aston-martin': '/brands/aston-martin.svg'
};

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function getBrandLogo(make: string | null | undefined): string | null {
  if (!make) return null;
  const key = normalise(make);
  return BRAND_LOGOS[key] ?? null;
}

// REQUIRED ASSETS (not included):
// public/brands/porsche.svg
// public/brands/ferrari.svg
// public/brands/lamborghini.svg
// public/brands/mercedes.svg
// public/brands/audi.svg
// public/brands/bmw.svg
// public/brands/bentley.svg
// public/brands/rolls-royce.svg
// public/brands/maserati.svg
// public/brands/aston-martin.svg
