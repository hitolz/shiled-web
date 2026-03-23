// pages/api/[...all].js
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
  buildForwardHeaders,
  buildProxyTargetUrl,
  getProxyRuntimeConfig,
  rewriteApiPath,
  sendMissingProxyTarget,
} from "../../lib/proxyConfig";

export default async function handler(req, res) {
  const runtimeConfig = getProxyRuntimeConfig();
  if (!runtimeConfig.target) {
    return sendMissingProxyTarget(res, "api");
  }

  // 创建代理中间件
  if(req.method == 'GET'){
    const proxy = createProxyMiddleware({
      target: runtimeConfig.target, // 设置代理目标地址
      changeOrigin: true, // 设置请求头中的 Host 为目标地址的 Host
      pathRewrite: (path) => rewriteApiPath(path, runtimeConfig.basePath, runtimeConfig.prefix),
      headers: buildForwardHeaders(req.headers),
      onProxyReq: (proxyReq, req, res) => {
        // Add debug logs
        // console.log('Proxy Request Headers:', proxyReq.getHeaders());
      },
      onProxyRes: (proxyRes, req, res) => {
        // Add debug logs
        // console.log('Proxy Response Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        // Handle errors
        console.error('Proxy error:', err);
        res.status(502).send('Proxy error');
      },
    });
    return proxy(req, res);
  }
  try {
    const url = getTargetUrl(req.url, runtimeConfig);
    console.log("request url is ", url);
    const response = await request(url, req);
    forwardResponse(res, response);
  } catch (error) {
    console.error("Error forwarding request:", error);
    res.status(502).json({
      error: "Proxy request failed",
      message: error instanceof Error ? error.message : "Unknown proxy error",
    });
  }
}

async function request(url, req){
  const method = req.method;
  const headers = buildForwardHeaders(req.headers);
  const config = {
    headers,
    validateStatus: () => true,
  };
  if(method === 'POST'){
    return await axios.post(url, req.body, config);
  }
  if(method === 'PUT'){
    return await axios.put(url, req.body, config);
  }
  if(method === 'DELETE'){
    return await axios.delete(url, { ...config, data: req.body });
  }
  return null;
}

function getTargetUrl(url, runtimeConfig){
  return buildProxyTargetUrl(
    runtimeConfig.target,
    url,
    runtimeConfig.basePath,
    runtimeConfig.prefix
  );
}

function forwardResponse(res, response) {
  if (!response) {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const contentType = response.headers?.["content-type"];
  if (contentType) {
    res.setHeader("content-type", contentType);
  }

  return res.status(response.status).send(response.data);
}
