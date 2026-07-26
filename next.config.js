/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, '.'),
      '@/components': require('path').resolve(__dirname, 'components'),
      '@/lib': require('path').resolve(__dirname, 'lib'),
      '@/models': require('path').resolve(__dirname, 'models'),
      '@/store': require('path').resolve(__dirname, 'store'),
      '@/types': require('path').resolve(__dirname, 'types'),
    };
    return config;
  },
}

module.exports = nextConfig
