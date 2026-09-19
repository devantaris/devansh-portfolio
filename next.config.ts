import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/devansh-portfolio' : '';

const nextConfig: NextConfig = {
  output: 'export',
  // When deploying to GitHub Pages the site lives at /devansh-portfolio/
  // so we need basePath and assetPrefix set correctly.
  basePath,
  assetPrefix: isGithubPages ? '/devansh-portfolio/' : '',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: isGithubPages
      ? 'https://devantaris.github.io/devansh-portfolio'
      : 'http://localhost:3000',
  },
  images: {
    // Static export requires unoptimized images (no Next.js image server)
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        pathname: '/gh/devicons/**',
      },
    ],
  },
};

export default nextConfig;
