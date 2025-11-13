import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Image optimization enabled by default for better performance
  // Next.js will automatically optimize images (WebP, AVIF, lazy loading)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'images-na.ssl-images-amazon.com',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: 'scontent.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**sephora.com'
      },
      {
        protocol: 'https',
        hostname: 'target.scene7.com'
      },
      {
        protocol: 'https',
        hostname: '**target.**'
      },
      {
        protocol: 'https',
        hostname: '**victoriassecret.com'
      }
    ],
    // Optimize with modern formats
    formats: ['image/webp', 'image/avif'],
    // Define responsive sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default withBundleAnalyzer(nextConfig);
