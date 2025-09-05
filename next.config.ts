/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable if you need any experimental features
  },
  images: {
    domains: ['i.scdn.co'], // Spotify image domains
  },
  // Configure Next.js to work with 127.0.0.1
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
