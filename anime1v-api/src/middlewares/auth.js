const { ApiError } = require("../utils/api-error");

function getConfiguredApiKeys() {
  const raw = process.env.API_KEYS || "";
  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function requireApiKey(req, _res, next) {
  if (String(process.env.DISABLE_AUTH).toLowerCase() === "true") {
    req.apiKey = "local-dev";
    return next();
  }

  // SOLO header X-API-Key (mas seguro que query param)
  const apiKey = (req.header("x-api-key") || "").trim();

  if (!apiKey) {
    return next(new ApiError(401, "API Key requerida. Usa el header X-API-Key"));
  }

  const configuredKeys = getConfiguredApiKeys();
  if (configuredKeys.length === 0) {
    return next(new ApiError(500, "Servidor mal configurado: API_KEYS no definidas"));
  }
  if (!configuredKeys.includes(apiKey)) {
    return next(new ApiError(401, "API Key invalida o expirada"));
  }

  req.apiKey = apiKey;
  return next();
}

module.exports = { requireApiKey };
