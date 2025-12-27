import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration (required for Next.js 16+)
  turbopack: {
    // Empty config to acknowledge we're using Turbopack
  },

  // Transpile Stacks packages for compatibility
  transpilePackages: [
    '@stacks/connect',
    '@stacks/transactions',
    '@stacks/common',
    '@stacks/network'
  ],

  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@stacks/connect', '@stacks/transactions'],
  },
};

export default nextConfig;
