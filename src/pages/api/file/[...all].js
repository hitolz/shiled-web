// pages/api/[...all].js
import axios from "axios";
import { createProxyMiddleware } from "http-proxy-middleware";
import formidable from 'formidable';
import FormData from 'form-data';
import fs from 'fs';
import {
  buildForwardHeaders,
  buildFileProxyTargetUrl,
  getProxyRuntimeConfig,
  rewriteFileApiPath,
  sendMissingProxyTarget,
} from "../../../lib/proxyConfig";

// Next.js API 路由处理函数

// 添加这个配置来禁用默认的 body 解析
export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  const runtimeConfig = getProxyRuntimeConfig();
  if (!runtimeConfig.target) {
    return sendMissingProxyTarget(res, "file");
  }

  // 创建代理中间件
  if(req.method == 'GET'){
    const proxy = createProxyMiddleware({
      target: runtimeConfig.target, // 设置代理目标地址
      changeOrigin: true, // 设置请求头中的 Host 为目标地址的 Host
      pathRewrite: (path) => rewriteFileApiPath(path, runtimeConfig.basePath, runtimeConfig.prefix),
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
    const response = await request(url, req);
    forwardResponse(res, response);
  } catch (error) {
      console.error('Error forwarding request:', error);
      res.status(502).json({
        error: 'Proxy request failed',
        message: error instanceof Error ? error.message : 'Unknown proxy error',
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
    const contentType = headers['content-type'];
    const isMultiPart = contentType?.includes('multipart/form-data');
    if (isMultiPart) {
      // formidable 解析
      const form = formidable({ multiples: true });
      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      // 用 form-data 组装
      const formData = new FormData();

      // 添加文件
      for (const [key, value] of Object.entries(files)) {
        if (Array.isArray(value)) {
          value.forEach(file => {
            formData.append(key, fs.createReadStream(file.filepath), file.originalFilename);
          });
        } else {
          formData.append(key, fs.createReadStream(value.filepath), value.originalFilename);
        }
      }

      // 添加其他字段
      for (const [key, value] of Object.entries(fields)) {
        // formidable 解析出来的 value 可能是数组
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      }

      // 合并 headers
      const formHeaders = formData.getHeaders();
      const mergedHeaders = buildForwardHeaders(headers, formHeaders);
      // 发送
      const response = await axios.post(url, formData, {
        ...config,
        headers: mergedHeaders,
      });
      return response;
    }

    // 普通 POST
    const response = await axios.post(url, req.body, config);
    return response;
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
  return buildFileProxyTargetUrl(
    runtimeConfig.target,
    url,
    runtimeConfig.basePath,
    runtimeConfig.prefix
  );
}

function forwardResponse(res, response) {
  if (!response) {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const contentType = response.headers?.['content-type'];
  if (contentType) {
    res.setHeader('content-type', contentType);
  }

  return res.status(response.status).send(response.data);
}
