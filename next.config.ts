import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@clerk/nextjs", "drizzle-orm", "pg"],
  },
};

export default nextConfig;
