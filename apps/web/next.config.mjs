import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: "http://localhost:3000/v1/:path*",
      },
    ];
  },
};

const withMDX = createMDX()(nextConfig);

export default withMDX;
