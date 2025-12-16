import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "yt3.ggpht.com",
      },
      {
        hostname: "localhost",
        port: "9000",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.SERVER_API_URL}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
