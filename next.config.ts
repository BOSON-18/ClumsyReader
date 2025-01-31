import { hostname } from "os";

const nextConfig = {
  webpack: (config:any) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol:"https",
        hostname:"images.unsplash.com"
      }
    ],
  },
};

export default nextConfig;