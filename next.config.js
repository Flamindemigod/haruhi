/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["haruhi.flamindemigod.com", 'storage.ko-fi.com', "s4.anilist.co"],
  },
}

module.exports = nextConfig
