/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  productionBrowserSourceMaps: true, //pour BestPractices sur lighthouse google (risque mineur de sécurité)
};

module.exports = nextConfig;
