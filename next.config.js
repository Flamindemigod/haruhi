/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /canvas\/build\/Release\/canvas\.node$/,
      loader: "node-loader",
    });

    config.module.rules.push({
      test: /\.(gif|png|jpe?g|svg|woff2?|ttf|eot)$/i,
      use: "raw-loader",
    });
    return config;
  },
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
