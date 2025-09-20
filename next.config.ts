import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    appDir: true,
    srcDir: 'src',   // <-- tell Next.js the app folder is inside src
  },
};

export default nextConfig;
