// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Vercel에서 빌드할 때 ESLint 오류 무시
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;