import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.ytimg.com', 'img.youtube.com'], // YouTubeのサムネイル用
  },
  experimental: {
    serverActions: true, // Server Actionsを有効化
  },
};

export default nextConfig;
