/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["haruhi.flamindemigod.com", "haruhi-dev.flamindemigod.com", 'storage.ko-fi.com', "s4.anilist.co"],
  },
}

module.exports = nextConfig
