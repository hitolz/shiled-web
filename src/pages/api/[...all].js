// pages/api/[...all].js
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";
import {
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
      headers: req.headers,
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
        res.status(500).send('Proxy error');
      },
    });
    return proxy(req, res);
  }
  try {
    const url = getTargetUrl(req.url, runtimeConfig);
    console.log("request url is ", url);
    const response = await request(url, req)
    // 获取目标服务器的响应
    const data = response.data;
    // 将目标服务器的响应返回给客户端
    res.status(response.status).json(data);
  } catch (error) {
      console.error('Error forwarding request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function request(url, req){
  const method = req.method;
  const headers = req.headers;
  if(method === 'POST'){
    // 普通 POST
    console.log("request url is ", url);
    const response = await axios.post(url, req.body, { headers });
    return response;
  }
  if(method === 'PUT'){
    return await axios.put(url, req.body, {  headers});
  }
  if(method === 'DELETE'){
    return await axios.delete(url, { params: req.body, headers});
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
