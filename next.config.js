/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  turbopack: {
    // Set the root directory to your project folder
    root: path.join(__dirname),
  },
}

module.exports = nextConfig
