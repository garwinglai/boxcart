/** @type {import('next').NextConfig} */
const nextConfig = {
  runtime: "edge",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        // pathname: "/account123/**",
      },
      {
        protocol: "https",
        hostname: "static.gotprint.com",
        port: "",
        // pathname: "/account123/**",
      },
    ],
  },
  reactStrictMode: true,
  // serverRuntimeConfig: ["@prisma/client, bcrypt"],
};

module.exports = nextConfig;
