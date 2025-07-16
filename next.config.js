// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 중 ESLint 오류 무시
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;