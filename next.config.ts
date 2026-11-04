import type { NextConfig } from 'next';

const apiServer = process.env.API_SERVER_URL ?? 'http://localhost:5001';

const nextConfig: NextConfig = {
  agentRules: false,
  devIndicators: false,
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiServer}/api/:path*` }];
  },
};

export default nextConfig;
