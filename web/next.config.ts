import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production builds (SSR issues with @stacks/connect)
  // Turbopack only used in dev mode
  experimental: {
    // Use Webpack for production builds
  },
  // Transpile Stacks packages for compatibility
  transpilePackages: ['@stacks/connect', '@stacks/transactions'],
};

export default nextConfig;
