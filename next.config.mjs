/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["example.com"], // 本番で使う場合サムネイル取得元ドメイン指定
  },
};

module.exports = nextConfig;
