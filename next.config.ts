import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_ASSET_VERSION:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || String(Date.now()),
  },
  async headers() {
    const cacheHeader = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/:file(web_hero:path*.mp4)", headers: cacheHeader },
      { source: "/:file(web_hero:path*.jpg)", headers: cacheHeader },
    ];
  },
};

export default nextConfig;
