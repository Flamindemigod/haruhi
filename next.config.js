/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["haruhi.flamindemigod.com", "haruhi-dev.flamindemigod.com", "s4.anilist.co"],
  },
  experimental: { images: { allowFutureImage: true } }
}

module.exports = nextConfig
