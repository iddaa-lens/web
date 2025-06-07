import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: [
      "r2.thesportsdb.com", 
      "upload.wikimedia.org",
      "media.api-sports.io",
      "lh3.googleusercontent.com", // Google profile images
    ],
  },
};

export default nextConfig;