import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile Stacks packages for compatibility
  transpilePackages: [
    '@stacks/connect',
    '@stacks/transactions',
    '@stacks/common',
    '@stacks/network'
  ],

  // Disable strict ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors during build (temporary)
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
