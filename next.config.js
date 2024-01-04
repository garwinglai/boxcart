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
    // Copy extension files to .next folder during build
    if (!isServer) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap("CopyExtensionFiles", () => {
            const filesToCopy = [
              "public/manifest.json",
              // Add other extension files or folders as needed
            ];

            filesToCopy.forEach((file) => {
              const sourcePath = path.resolve(__dirname, file);
              const destinationPath = path.resolve(
                __dirname,
                ".next",
                file.replace("public/", "")
              );

              require("fs").copyFileSync(sourcePath, destinationPath);
            });
          });
        },
      });
    }

    return config;
  },
};

module.exports = nextConfig;
