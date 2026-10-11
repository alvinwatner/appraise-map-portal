/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["www.paramitakonsultan.com", "paramitakonsultan.com"],
    },
  },
};

module.exports = nextConfig
