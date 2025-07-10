/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minifier and use Terser instead for WebContainer compatibility
  swcMinify: false,
  
  // Use JavaScript-based compiler instead of native binaries
  experimental: {
    forceSwcTransforms: false,
  },
  
  // Ensure compatibility with WebContainer environment
  webpack: (config, { dev, isServer }) => {
    // Fallback for Node.js modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
}

module.exports = nextConfig