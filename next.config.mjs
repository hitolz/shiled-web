/** @type {import('next').NextConfig} */
import withAntdLess from 'next-plugin-antd-less';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeBasePath(basePath) {
    const fallback = '/shield-web';
    const rawValue = typeof basePath === 'string' ? basePath.trim() : '';

    if (!rawValue) {
      return fallback;
    }

    let normalized = rawValue;
    try {
      normalized = new URL(rawValue).pathname || '';
    } catch {
      // Keep relative paths such as /shield-web or /singa.
    }

    normalized = normalized.replace(/\/+$/, '');
    if (!normalized || normalized === '/') {
      return fallback;
    }

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

const CORS_HEADERS = [
    { 
      key: "Access-Control-Allow-Credentials", 
      value: "true" 
    },
    { 
      key: "Access-Control-Allow-Origin",
      value: "*" 
    },
    { 
      key: "Access-Control-Allow-Methods", 
      value: "GET,DELETE,PATCH,POST,PUT" 
    },
    {
      key: "Access-Control-Allow-Headers",
      value: "Content-Type, Authorization",
    },
];

const nextConfig = {
    // 通过 NEXT_PUBLIC_BASE_URL 配置 Ingress 子路径，未配置时默认 /shield-web
    basePath: normalizeBasePath(process.env.NEXT_PUBLIC_BASE_URL),
    env: {
      JWT_SECRET : process.env.JWT_SECRET,
      SERVER_TARGET : process.env.SERVER_TARGET,
      APP_URL_PREFIX : process.env.APP_URL_PREFIX
    },
    reactStrictMode: false,
    webpack: (config) => {
      // 配置路径别名，确保 Docker 构建时能正确解析
      // 使用绝对路径确保在不同环境下都能正确解析
      const projectRoot = path.resolve(__dirname);
      const srcPath = path.resolve(projectRoot, 'src');
      const apiPath = path.resolve(srcPath, 'api');
      
      // 配置别名：同时支持 @/ 和 @api/ 两种写法
      // webpack 别名匹配是按最长匹配原则
      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        '@': srcPath,           // 支持 @/api 和 @/xxx
        '@api': apiPath,        // 支持 @api/xxx
      };
      
      return config;
    },
    async headers() {
        // 跨域配置
        return [
          {
            source: "/favicon.ico",
            headers: [
              {
              key: "Cache-Control",
              value: "public, max-age=86400",
              },
            ],
          },
          {
              source: "/api/:path*", // 为访问 /api/** 的请求添加 CORS HTTP Headers
              headers: CORS_HEADERS
            },
          {
            source: "/specific", // 为特��路径的请求添加 CORS HTTP Headers,
            headers: CORS_HEADERS
          }
        ];
      }
};
export default withAntdLess(nextConfig);
