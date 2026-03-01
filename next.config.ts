import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // ── Content Security Policy ─────────────────────────────────────────────
  // Security: restricts the sources from which content can be loaded.
  // 'unsafe-inline' in script-src is required for Next.js App Router hydration scripts.
  // For stricter enforcement in production, use a nonce-based CSP with middleware.
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    const apiOrigin = new URL(process.env.NEXT_PUBLIC_PRODUCTS_API_URL).origin

    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`, // 'unsafe-eval' needed for Next.js HMR in dev
      "style-src 'self' 'unsafe-inline'",  // 'unsafe-inline' needed for Next.js CSS-in-JS
      "font-src 'self' data:",             // Allow fonts from self and data URIs
      "img-src 'self' data: blob: https:", // Allow images from self, data URIs, and https
      `connect-src 'self' ${apiOrigin}${isDev ? ' ws://localhost:* wss://localhost:*' : ''}`, // API + HMR websockets in dev
      "object-src 'none'",                 // Blocks Flash, Java applets, etc.
      "base-uri 'self'",                   // Prevents base tag hijacking
      "frame-ancestors 'none'",            // Clickjacking protection
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

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
      },
      {
        protocol: "https",
        hostname: "**static.nike.com"
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
