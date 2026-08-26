/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Next 16 rejects any quality value not listed here with a 400, so every
    // `quality={n}` used in the app has to appear in this list.
    qualities: [75, 90, 92, 95],
    // AVIF first: noticeably smaller than WebP at the same visual quality, which
    // buys back the bytes the higher quality settings cost. Browsers that don't
    // support it fall through to WebP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "http",
        hostname: "backend",
      },
      {
        // Cloudflare R2 public dev domains (pub-<hash>.r2.dev) — covers any bucket
        protocol: "https",
        hostname: "*.r2.dev",
      },
      // Add your production API domain / custom R2 domain here once deployed, e.g.:
      // { protocol: "https", hostname: "api.youragency.com" },
    ],
  },
};

module.exports = nextConfig;
