/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "storage.ko-fi.com",
      "haruhi.flamindemigod.com",
      "haruhi-dev.flamindemigod.com",
      "s4.anilist.co",
      "136.243.175.33",
    ],
  },
};

module.exports = nextConfig;
