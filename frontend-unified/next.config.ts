import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  typescript: {
    tsconfigPath: "./tsconfig.json"
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "./src"
    };
    return config;
  }
};

export default nextConfig;
