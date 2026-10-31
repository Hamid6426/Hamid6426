import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: false,
  },
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
};

export default nextConfig;
