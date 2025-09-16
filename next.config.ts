/** @type {import('next').NextConfig} */
const nextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gdqtsnemsqtdjvdofuih.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sujsltqymyjyrxboyalk.supabase.co',
        pathname: '/**',
      },
    ],
  },
  // This is to ignore the build errors in the typescript
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;