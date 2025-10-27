/** @type {import('next').NextConfig} */
const nextConfig = {
  // αφαιρέσε κι αυτό αν υπάρχει: experimental: { serverActions: true }  // δεν χρειάζεται πλέον

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'static.car.gr' },
      { protocol: 'https', hostname: 'images.car.gr' },
      { protocol: 'https', hostname: 'car.gr' },
      { protocol: 'https', hostname: 'www.car.gr' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }
      // πρόσθεσε ό,τι άλλο χρησιμοποιείς (imgur, cloudfront κ.λπ.)
    ],
    // προαιρετικό, για πιο καθαρές αποδόσεις σε retina:
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;

