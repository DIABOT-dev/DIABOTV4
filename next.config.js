/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    // Removed optimizePackageImports for lucide-react to prevent vendor-chunks
  }
};
module.exports = nextConfig;