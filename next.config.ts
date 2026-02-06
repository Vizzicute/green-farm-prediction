import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "greenfarmprediction.t3.storage.dev",
      },
    ],
    unoptimized: true, // disables .webp transformation
  },
  allowedDevOrigins: [
    "http://10.14.248.252:3000"
  ]
};

export default nextConfig;
