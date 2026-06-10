/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output settings
  output: 'standalone',
  
  // Disable TypeScript build errors
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
