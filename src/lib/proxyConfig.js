import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let fileEnvCache = null;

function stripWrappingQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function normalizeEnvValue(value) {
  if (typeof value !== "string") {
    return "";
  }

  return stripWrappingQuotes(value.trim());
}

function ensureFileEnvLoaded() {
  if (fileEnvCache !== null) {
    return fileEnvCache;
  }

  const envPath = path.join(process.cwd(), "config", ".env");
  if (!fs.existsSync(envPath)) {
    fileEnvCache = {};
    return fileEnvCache;
  }

  const result = dotenv.config({ path: envPath });
  fileEnvCache = result.parsed ?? {};
  return fileEnvCache;
}

function readEnv(name) {
  const runtimeValue = normalizeEnvValue(process.env[name]);
  if (runtimeValue) {
    return runtimeValue;
  }

  const fileEnv = ensureFileEnvLoaded();
  return normalizeEnvValue(fileEnv[name]);
}

function normalizeBasePath(basePath) {
  const fallback = "/shield-web";
  let normalized = normalizeEnvValue(basePath);

  if (!normalized) {
    return fallback;
  }

  try {
    const parsedUrl = new URL(normalized);
    normalized = parsedUrl.pathname || "";
  } catch {
    // Keep raw path values such as /shield-web.
  }

  normalized = normalized.replace(/\/+$/, "");
  if (!normalized || normalized === "/") {
    return fallback;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizePrefix(prefix) {
  const fallback = "/api";
  const normalized = normalizeEnvValue(prefix).replace(/\/+$/, "");

  if (!normalized) {
    return fallback;
  }

  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

function normalizeTarget(target) {
  return normalizeEnvValue(target).replace(/\/+$/, "");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getProxyRuntimeConfig() {
  return {
    basePath: normalizeBasePath(readEnv("NEXT_PUBLIC_BASE_URL")),
    prefix: normalizePrefix(readEnv("APP_URL_PREFIX")),
    target: normalizeTarget(
      readEnv("SERVER_TARGET") || readEnv("NEXT_PUBLIC_API_BASE_URL")
    ),
  };
}

export function rewriteApiPath(url, basePath, prefix) {
  let nextUrl = url || "";

  if (basePath) {
    const baseApiPattern = new RegExp(`^${escapeRegExp(basePath)}/api`);
    nextUrl = nextUrl.replace(baseApiPattern, prefix);
  }

  nextUrl = nextUrl.replace(/^\/api/, prefix);

  if (!nextUrl.startsWith("/")) {
    nextUrl = `/${nextUrl}`;
  }

  return nextUrl;
}

export function rewriteFileApiPath(url, basePath, prefix) {
  const apiPath = rewriteApiPath(url, basePath, prefix);
  const filePrefixPattern = new RegExp(
    `^${escapeRegExp(prefix)}/file(?=/|$)`
  );

  return apiPath.replace(filePrefixPattern, prefix);
}

export function buildProxyTargetUrl(target, url, basePath, prefix) {
  return `${normalizeTarget(target)}${rewriteApiPath(url, basePath, prefix)}`;
}

export function buildFileProxyTargetUrl(target, url, basePath, prefix) {
  return `${normalizeTarget(target)}${rewriteFileApiPath(
    url,
    basePath,
    prefix
  )}`;
}

export function sendMissingProxyTarget(res, routeName) {
  return res.status(500).json({
    error: "Proxy target is not configured",
    route: routeName,
    message:
      "请在 shield-web/config/.env 中设置 SERVER_TARGET 或 NEXT_PUBLIC_API_BASE_URL。",
  });
}

const HOP_BY_HOP_HEADERS = new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
]);

export function buildForwardHeaders(headers = {}, overrides = {}) {
  const nextHeaders = {};

  for (const [key, value] of Object.entries(headers)) {
    if (value == null) {
      continue;
    }

    const normalizedKey = key.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(normalizedKey)) {
      continue;
    }

    nextHeaders[key] = value;
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value == null || value === "") {
      delete nextHeaders[key];
      continue;
    }

    nextHeaders[key] = value;
  }

  return nextHeaders;
}
