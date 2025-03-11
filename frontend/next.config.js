/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "http://host.docker.internal:8080/auth/realms/myrealm/protocol/openid-connect/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
          },
        ],
      },
    ];
  },
  transpilePackages: [
    'antd',
    '@ant-design/icons',
    '@ant-design/compatible',
    '@ant-design/cssinjs'
  ],
  webpack: (config) => {
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.css': {
          loaders: ['postcss-loader'],
        },
        '*.module.css': {
          loaders: ['postcss-loader'],
        },
      },
    },
  },
};

module.exports = nextConfig; 