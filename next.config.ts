import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,   // Disable ESLint checks (big speed boost)
  },
  typescript: {
    ignoreBuildErrors: true,    // Disable TypeScript type checking in dev
  },
  experimental: {
    optimizePackageImports: ["react", "react-dom"], // Faster dev refresh
  },
  webpack(config, { dev }) {
    try {
      (config as any).parallelism = 1;
    } catch (e) {
    }

    if (dev) {
      (config as any).devtool = false;
    }

    return config;
  },
  output: "standalone",
};

export default nextConfig;
