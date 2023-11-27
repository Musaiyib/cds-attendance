/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Ignore specific module warnings
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      aws4: false,
    };

    return config;
  },
};

module.exports = nextConfig;
