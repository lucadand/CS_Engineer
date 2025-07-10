/** @type {import('next').NextConfig} */
const nextConfig = {
  // Server Actions are now stable in Next.js 14+
  experimental: {
    appDir: true,
  },
  
  // Configure webpack for WebContainer environment
  webpack: (config, { dev, isServer }) => {
    // Fallback for Node.js modules in client-side code
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    // Use JavaScript-based minification
    if (!dev && !isServer) {
      config.optimization.minimizer = config.optimization.minimizer.filter(
        (plugin) => plugin.constructor.name !== 'TerserPlugin'
      );
    }
    
    return config;
  },
}

module.exports = nextConfig