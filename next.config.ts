import type { NextConfig } from "next";

const pagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  devIndicators: false,
  ...(pagesBuild && {
    output: "export" as const,
    trailingSlash: true,
    basePath: process.env.NEXT_PUBLIC_PAGES_BASE_PATH || "/task-genie",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
