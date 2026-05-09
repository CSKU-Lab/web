import type { NextConfig } from "next";
import { RemotePattern } from "next/dist/shared/lib/image-config";

const env = process.env.NODE_ENV;

const isDev = env === "development";

const remotePatterns: RemotePattern[] = isDev
  ? [
      {
        hostname: "yt3.ggpht.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/cs-lab/**",
      },
    ]
  : [
      {
        hostname: "lh3.googleusercontent.com",
      },
    ];

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  output: "standalone",
  poweredByHeader: false,
  images: {
    dangerouslyAllowLocalIP: isDev, // need to be disable in production
    remotePatterns,
  },
};

export default nextConfig;
