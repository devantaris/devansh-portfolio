import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  // When deploying to GitHub Pages the site lives at /devansh-portfolio/
  // so we need basePath and assetPrefix set correctly.
  basePath: isGithubPages ? '/devansh-portfolio' : '',
  assetPrefix: isGithubPages ? '/devansh-portfolio/' : '',
  trailingSlash: true,
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
