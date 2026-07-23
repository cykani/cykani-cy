import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/v1/:path*",
          destination: "http://localhost:3000/v1/:path*",
        },
      ];
    }
    return [];
  },
};

const withMDX = createMDX()(nextConfig);

export default withMDX;
