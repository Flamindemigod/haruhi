/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
    domains: ["storage.ko-fi.com", "s4.anilist.co"],
  },
};

module.exports = nextConfig;
