export const ASSET_VERSION =
  process.env.NEXT_PUBLIC_ASSET_VERSION ||
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ||
  String(Date.now());
