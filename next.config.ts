import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  poweredByHeader: false,
  images: {
    dangerouslyAllowLocalIP: true, // need to be disable in production
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/cs-lab/**",
      },
    ],
  }
};

export default nextConfig;
