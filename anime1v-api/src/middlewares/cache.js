const DEFAULT_TTL_MS = Number(process.env.CACHE_TTL_MINUTES || 15) * 60 * 1000;

const cacheStore = new Map();

function generateKey(req) {
  const url = req.originalUrl || req.url;
  return `${req.method}:${url}`;
}

function cacheMiddleware(ttlMs = DEFAULT_TTL_MS) {
  return (req, res, next) => {
    // No cachear POST/PUT/DELETE
    if (req.method !== "GET") return next();

    const key = generateKey(req);
    const cached = cacheStore.get(key);

    if (cached && cached.expiry > Date.now()) {
      res.setHeader("X-Cache", "HIT");
      return res.status(200).json(cached.data);
    }

    // Sobreescribir res.json para interceptar respuesta
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, { data, expiry: Date.now() + ttlMs });
      }
      res.setHeader("X-Cache", "MISS");
      return originalJson(data);
    };

    next();
  };
}

function clearCache() {
  cacheStore.clear();
}

function clearCacheByPattern(pattern) {
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) cacheStore.delete(key);
  }
}

module.exports = { cacheMiddleware, clearCache, clearCacheByPattern };
