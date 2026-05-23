import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/execute',
        destination: 'http://localhost:3001/execute',
      },
    ];
  },
};

export default nextConfig;
