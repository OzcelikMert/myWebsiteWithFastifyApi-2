import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    API_PROTOCOL: process.env.API_PROTOCOL,
    API_HOST: process.env.API_HOST,
    ...(process.env.API_PORT ? { API_PORT: process.env.API_PORT } : {}),
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: process.env.API_PROTOCOL,
        hostname: process.env.API_HOST,
        ...(process.env.API_PORT ? { port: process.env.API_PORT } : {}),
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return new Promise((resolve) => {
      resolve([
        /* Blog */
        {
            source: "/blog/:url",
            destination: "/blog",
        },
        /* Blogs */
        {
          source: "/blogs/page/:page",
          destination: "/blogs",
        },
        {
          source: "/blogs/author/:author",
          destination: "/blogs",
        },
        {
          source: "/blogs/author/:author/page/:page",
          destination: "/blogs",
        },
        {
          source: "/blogs/search/:search",
          destination: "/blogs",
        },
        {
          source: "/blogs/search/:search/page/:page",
          destination: "/blogs",
        },
        {
          source: "/blogs/category/:category",
          destination: "/blogs",
        },
        {
          source: "/blogs/category/:category/page/:page",
          destination: "/blogs",
        },
        /* Sitemaps */
        {
          source: "/sitemaps/post/:typeName/:page",
          destination: "/sitemaps",
        }
      ]);
    });
  },
};

export default nextConfig;
