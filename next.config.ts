import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_ASSET_VERSION:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || String(Date.now()),
  },
};

export default nextConfig;
