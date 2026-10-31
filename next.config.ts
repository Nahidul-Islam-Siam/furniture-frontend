import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    '@ant-design/nextjs-registry',
    '@ant-design/cssinjs',
    'rc-util',
    'rc-pagination',
    'rc-picker',
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/logo-grid.png',
        destination: '/images/logo.png',
      },
      {
        source: '/hero-banner.jpg',
        destination: '/images/hero-banner.jpg',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-router-dom': path.resolve(__dirname, 'src/lib/router-compat.tsx'),
    };
    return config;
  },
};

export default nextConfig;
