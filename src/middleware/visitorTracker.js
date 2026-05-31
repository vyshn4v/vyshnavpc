import { getRedisClient } from "../config/initializeRedis.js";

// ─── Constants ────────────────────────────────────────────────────────────────
const TWO_DAYS_IN_SECONDS = 2 * 24 * 60 * 60; // 172 800 s
const VISITOR_HASH_KEY = (cacheKey, visitorId) =>
  `${cacheKey}:visitor:${visitorId}`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract the real client IP, honoring common proxy headers.
 */
export function extractIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; first entry is client
    return forwarded.split(",")[0].trim();
  }
  return (
    req.headers["x-real-ip"] ||
    req.headers["cf-connecting-ip"] || // Cloudflare
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    "unknown"
  );
}

/**
 * Parse basic OS / browser / device info from a User-Agent string.
 * Keeps things dependency-free with simple regex heuristics.
 */
export function parseUserAgent(ua = "") {
  // ── OS ──────────────────────────────────────────────────────────────────
  let os = "Unknown OS";
  if (/windows nt 10/i.test(ua)) os = "Windows 10/11";
  else if (/windows nt 6\.3/i.test(ua)) os = "Windows 8.1";
  else if (/windows nt 6\.2/i.test(ua)) os = "Windows 8";
  else if (/windows nt 6\.1/i.test(ua)) os = "Windows 7";
  else if (/windows/i.test(ua)) os = "Windows";
  else if (/android (\d+[\.\d]*)/i.test(ua)) os = `Android ${RegExp.$1}`;
  else if (/iphone os ([\d_]+)/i.test(ua))
    os = `iOS ${RegExp.$1.replace(/_/g, ".")}`;
  else if (/ipad; cpu os ([\d_]+)/i.test(ua))
    os = `iPadOS ${RegExp.$1.replace(/_/g, ".")}`;
  else if (/mac os x ([\d_]+)/i.test(ua))
    os = `macOS ${RegExp.$1.replace(/_/g, ".")}`;
  else if (/linux/i.test(ua)) os = "Linux";
  else if (/cros/i.test(ua)) os = "Chrome OS";

  // ── Browser ─────────────────────────────────────────────────────────────
  let browser = "Unknown Browser";
  let browserVersion = "";
  if (/edg\/([\d.]+)/i.test(ua)) {
    browser = "Microsoft Edge";
    browserVersion = RegExp.$1;
  } else if (/opr\/([\d.]+)/i.test(ua) || /opera\/([\d.]+)/i.test(ua)) {
    browser = "Opera";
    browserVersion = RegExp.$1;
  } else if (/chrome\/([\d.]+)/i.test(ua) && !/chromium/i.test(ua)) {
    browser = "Google Chrome";
    browserVersion = RegExp.$1;
  } else if (/firefox\/([\d.]+)/i.test(ua)) {
    browser = "Mozilla Firefox";
    browserVersion = RegExp.$1;
  } else if (/safari\/([\d.]+)/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Safari";
    browserVersion = RegExp.$1;
  } else if (/msie ([\d.]+)/i.test(ua) || /trident.*rv:([\d.]+)/i.test(ua)) {
    browser = "Internet Explorer";
    browserVersion = RegExp.$1;
  } else if (/chromium\/([\d.]+)/i.test(ua)) {
    browser = "Chromium";
    browserVersion = RegExp.$1;
  }

  // ── Device type ─────────────────────────────────────────────────────────
  let deviceType = "Desktop";
  if (/mobile/i.test(ua)) deviceType = "Mobile";
  else if (/tablet|ipad/i.test(ua)) deviceType = "Tablet";
  else if (/smart-?tv|smarttv|googletv|appletv|hbbtv|pov_tv/i.test(ua))
    deviceType = "Smart TV";
  else if (/bot|crawler|spider|crawling/i.test(ua)) deviceType = "Bot/Crawler";

  // ── Device brand / model (best-effort) ──────────────────────────────────
  let deviceBrand = "Unknown";
  if (/iphone/i.test(ua)) deviceBrand = "Apple iPhone";
  else if (/ipad/i.test(ua)) deviceBrand = "Apple iPad";
  else if (/samsung/i.test(ua)) deviceBrand = "Samsung";
  else if (/pixel/i.test(ua)) deviceBrand = "Google Pixel";
  else if (/huawei/i.test(ua)) deviceBrand = "Huawei";
  else if (/xiaomi|redmi/i.test(ua)) deviceBrand = "Xiaomi";
  else if (/oneplus/i.test(ua)) deviceBrand = "OnePlus";

  return {
    os,
    browser,
    browserVersion,
    deviceType,
    deviceBrand,
  };
}

/**
 * Attempt a free geo-IP lookup using ip-api.com (no API key needed, rate-limited).
 * Returns an object with country, region, city, ISP, etc.
 * Returns null on any failure so the middleware degrades gracefully.
 */
export async function fetchGeoInfo(ip) {
  if (!ip || ip === "unknown" || ip === "::1" || ip.startsWith("127.")) {
    // Loopback — skip lookup
    return { country: "Localhost", region: "-", city: "-", isp: "-", timezone: "-" };
  }

  try {
    // ip-api.com free endpoint — JSON, no key, 45 req/min
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,countryCode,regionName,city,zip,lat,lon,timezone,isp,org,as`,
      { signal: AbortSignal.timeout(3000) } // 3 s timeout
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== "success") return null;
    return {
      country: data.country,
      countryCode: data.countryCode,
      region: data.regionName,
      city: data.city,
      zip: data.zip,
      latitude: data.lat,
      longitude: data.lon,
      timezone: data.timezone,
      isp: data.isp,
      org: data.org,
      asn: data.as,
    };
  } catch {
    return null; // Network error / timeout — fail silently
  }
}

/**
 * Generate a deterministic visitor ID from IP + User-Agent (no PII stored as key).
 * Uses a simple hash so the same user always maps to the same bucket.
 */
function generateVisitorId(ip, ua) {
  let hash = 0;
  const str = `${ip}|${ua}`;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  // Convert to an unsigned hex string
  return (hash >>> 0).toString(16).padStart(8, "0");
}

// ─── Middleware ───────────────────────────────────────────────────────────────

/**
 * Express middleware that records visitor details into Redis and caches them
 * for two days (172 800 seconds).
 *
 * Stored data per visitor (Redis Hash):
 *   - ip, visitorId, firstSeen, lastSeen, visitCount
 *   - userAgent (raw)
 *   - os, browser, browserVersion, deviceType, deviceBrand
 *   - country, countryCode, region, city, zip, latitude, longitude, timezone, isp, org, asn
 *   - referrer, acceptLanguage, screenHint (from headers)
 *   - path (current request path)
 *
 * A sorted-set key keeps an index of all visitors for easy retrieval.
 */
export async function visitorTracker(req, res, next) {
  // Fire-and-forget — never block the request
  trackVisitor(req).catch((err) => {
    console.error("[visitorTracker] Error:", err?.message ?? err);
  });
  next();
}

async function trackVisitor(req) {
  let redis;
  try {
    redis = getRedisClient();
  } catch {
    // Redis not ready yet — skip silently
    return;
  }

  const ip = extractIp(req);
  const ua = req.headers["user-agent"] || "";
  const visitorId = generateVisitorId(ip, ua);
  const cacheKey = process.env.REDIS_CACHE_KEY || "Portfolio";
  const hashKey = VISITOR_HASH_KEY(cacheKey, visitorId);
  const now = new Date().toISOString();

  // ── Check if visitor already exists ──────────────────────────────────────
  const existing = await redis.hGetAll(hashKey);

  if (existing && Object.keys(existing).length > 0) {
    // Visitor seen before — just bump counters and refresh TTL
    await redis.hSet(hashKey, {
      lastSeen: now,
      visitCount: String(Number(existing.visitCount || 0) + 1),
      path: req.path,
    });
    await redis.expire(hashKey, TWO_DAYS_IN_SECONDS);
    return;
  }

  // ── New visitor — collect all details ────────────────────────────────────
  const uaParsed = parseUserAgent(ua);
  const geo = await fetchGeoInfo(ip);

  const visitorData = {
    visitorId,
    ip,
    firstSeen: now,
    lastSeen: now,
    visitCount: "1",
    path: req.path,

    // Raw User-Agent
    userAgent: ua,

    // Parsed device / browser info
    os: uaParsed.os,
    browser: uaParsed.browser,
    browserVersion: uaParsed.browserVersion,
    deviceType: uaParsed.deviceType,
    deviceBrand: uaParsed.deviceBrand,

    // Geo info (may be empty strings if lookup failed)
    country: geo?.country ?? "Unknown",
    countryCode: geo?.countryCode ?? "",
    region: geo?.region ?? "",
    city: geo?.city ?? "",
    zip: geo?.zip ?? "",
    latitude: String(geo?.latitude ?? ""),
    longitude: String(geo?.longitude ?? ""),
    timezone: geo?.timezone ?? "",
    isp: geo?.isp ?? "",
    org: geo?.org ?? "",
    asn: geo?.asn ?? "",

    // Request headers
    referrer: req.headers["referer"] || req.headers["referrer"] || "",
    acceptLanguage: req.headers["accept-language"] || "",
    acceptEncoding: req.headers["accept-encoding"] || "",
    dnt: req.headers["dnt"] || "", // Do-Not-Track header
    secChUaPlatform: req.headers["sec-ch-ua-platform"] || "", // Client Hints: platform
    secChUaMobile: req.headers["sec-ch-ua-mobile"] || "",    // Client Hints: mobile
    secChUa: req.headers["sec-ch-ua"] || "",                 // Client Hints: browser list
    host: req.headers["host"] || "",
    protocol: req.protocol,
    method: req.method,
  };

  // ── Persist to Redis ──────────────────────────────────────────────────────
  // Store visitor data as a Redis Hash
  await redis.hSet(hashKey, visitorData);
  await redis.expire(hashKey, TWO_DAYS_IN_SECONDS);
}
