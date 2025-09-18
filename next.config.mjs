/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['lucide-react'],
  // không modularizeImports/optimizePackageImports cho 'lucide-react'
};
export default nextConfig;