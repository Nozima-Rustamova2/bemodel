/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
