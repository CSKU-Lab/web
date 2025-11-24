import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions`` to include MDX files
  turbopack: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
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

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [["remark-gfm"]],
    rehypePlugins: [],
  },
});

// Wrap MDX and Next.js config with each other
export default withMDX(nextConfig);
