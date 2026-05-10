const fs = require("node:fs/promises");
const path = require("node:path");
const { ApiError } = require("../utils/api-error");

const DATA_DIR = path.join(process.cwd(), "data");
const USAGE_FILE = path.join(DATA_DIR, "rate-limit.json");

// Carga en memoria
let usageByDayAndKey = new Map();

async function loadUsage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      const raw = await fs.readFile(USAGE_FILE, "utf-8");
      const obj = JSON.parse(raw);
      usageByDayAndKey = new Map(Object.entries(obj));
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
      usageByDayAndKey = new Map();
    }
  } catch (_e) {
    usageByDayAndKey = new Map();
  }
}

async function saveUsage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const obj = Object.fromEntries(usageByDayAndKey);
    await fs.writeFile(USAGE_FILE, JSON.stringify(obj, null, 2), "utf-8");
  } catch (_e) {
    // Silencioso
  }
}

// Guardar cada 30 segundos
const saveInterval = setInterval(() => {
  saveUsage().catch(() => { /* Silencioso */ });
}, 30000);
// Guardar al cerrar
const handleExit = async () => {
  clearInterval(saveInterval);
  await saveUsage();
  process.exit(0);
};

process.on("SIGINT", handleExit);
process.on("SIGTERM", handleExit);

const initialLoadPromise = loadUsage();

function getUtcDayStamp(date) {
  return date.toISOString().slice(0, 10);
}

function getNextUtcMidnightEpochSeconds(now) {
  const resetDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return Math.floor(resetDate.getTime() / 1000);
}

function cleanupOldEntries(currentDayStamp) {
  if (usageByDayAndKey.size < 2000) return;
  for (const key of usageByDayAndKey.keys()) {
    if (!key.endsWith(`:${currentDayStamp}`)) {
      usageByDayAndKey.delete(key);
    }
  }
}

async function dailyRateLimit(req, res, next) {
  await initialLoadPromise;

  if (String(process.env.DISABLE_RATE_LIMIT).toLowerCase() === "true") {
    return next();
  }

  const now = new Date();
  const dayStamp = getUtcDayStamp(now);
  const limit = Number(process.env.DAILY_REQUEST_LIMIT || 100);
  const usageKey = `${req.apiKey || "anonymous"}:${dayStamp}`;

  cleanupOldEntries(dayStamp);

  const currentUsage = usageByDayAndKey.get(usageKey) || 0;
  const resetAt = getNextUtcMidnightEpochSeconds(now);

  res.setHeader("X-RateLimit-Limit", String(limit));
  res.setHeader("X-RateLimit-Reset", String(resetAt));

  if (currentUsage >= limit) {
    res.setHeader("X-RateLimit-Remaining", "0");
    return next(new ApiError(429, `Limite de requests alcanzado. Plan: ${limit} requests/dia.`));
  }

  const updatedUsage = currentUsage + 1;
  usageByDayAndKey.set(usageKey, updatedUsage);
  res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - updatedUsage)));

  return next();
}

module.exports = { dailyRateLimit };
