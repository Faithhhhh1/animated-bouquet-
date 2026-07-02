/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/animated-bouquet",
  assetPrefix: "/animated-bouquet/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
