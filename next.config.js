/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['qedb.s3.amazonaws.com', 'adagiri-test-bucket.s3.amazonaws.com']
  },
};

module.exports = nextConfig;
