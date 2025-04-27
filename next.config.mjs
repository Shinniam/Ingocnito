/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['*'], // 画像ドメイン許可（将来用）
  },
};

export default nextConfig;
