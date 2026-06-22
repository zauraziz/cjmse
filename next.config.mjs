/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  experimental: {
    serverActions: { bodySizeLimit: '4mb' },
  },
};
export default nextConfig;
