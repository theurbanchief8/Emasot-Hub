/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.11.99', 'localhost', '*.local'],
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
