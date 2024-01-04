const withCopyWebpackPlugin = require("next-copy-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = withCopyWebpackPlugin({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "files.stripe.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "static.gotprint.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "i.etsystatic.com",
        port: "",
      },
    ],
  },
  reactStrictMode: true,
});

module.exports = nextConfig;
