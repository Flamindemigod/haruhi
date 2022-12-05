/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: { domains: ["storage.ko-fi.com", "s4.anilist.co"] },
};

module.exports = nextConfig;
