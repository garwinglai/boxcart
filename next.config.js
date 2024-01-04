const CopyPlugin = require("copy-webpack-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack: (config, { isServer }) => {
    // Copy public folder to .next folder during build
    if (!isServer) {
      config.plugins.push(
        new CopyPlugin({
          patterns: [
            {
              from: "public",
              to: ".next/public",
              globOptions: {
                ignore: ["**/_*.{js,json}", "**/_*/**"],
              },
            },
          ],
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
