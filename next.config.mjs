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
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.wordpress.com' },
      { protocol: 'https', hostname: 'i0.wp.com' },        // WordPress CDN (αν το χρησιμοποιεί)
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'amian-collectioncars.com' },
      { protocol: 'https', hostname: 'www.dnews.gr' },
      { protocol: 'https', hostname: 'andys-motors.com' },
      { protocol: 'https', hostname: 'www.networkoptix.com' },
      { protocol: 'https', hostname: 's23226.pcdn.co' }
      // πρόσθεσε ό,τι άλλο χρησιμοποιείς (imgur, cloudfront κ.λπ.)
    ],
    // προαιρετικό, για πιο καθαρές αποδόσεις σε retina:
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;

