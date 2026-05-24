const express = require("express");
const { requireApiKey } = require("../middlewares/auth");
const { dailyRateLimit } = require("../middlewares/rate-limit");
const animeService = require("../services/anime.service");
const downloadService = require("../services/download.service");
const { ApiError } = require("../utils/api-error");

const router = express.Router();

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// Sanitización y validación de inputs para prevenir abusos y SSRF
function sanitizeQuery(q) {
  if (!q || typeof q !== "string") return "";
  let cleaned = q.substring(0, 100); // Máximo 100 chars
  cleaned = cleaned.replace(/[\x00-\x1F\x7F\\\r\n]/g, ""); // Eliminar control chars y backslashes
  return cleaned.trim();
}

function validateScraperUrl(urlStr) {
  if (!urlStr || typeof urlStr !== "string") {
    throw new ApiError(400, "El parámetro url es requerido y debe ser texto");
  }
  
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    
    // Lista blanca estricta de dominios de anime permitidos
    const allowedHosts = [
      "animeav1.com", "www.animeav1.com",
      "jkanime.net", "www.jkanime.net",
      "animeflv.net", "www.animeflv.net", "www4.animeflv.net",
      "tioanime.com", "www.tioanime.com",
      "monoschinos2.com", "www.monoschinos2.com"
    ];
    
    const isAllowed = allowedHosts.some(allowed => host === allowed || host.endsWith(`.${allowed}`));
    if (!isAllowed) {
      throw new ApiError(400, "Dominio de URL de scraping no autorizado");
    }
    
    return parsed.toString();
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(400, "El formato de la URL es inválido");
  }
}

router.use(requireApiKey, dailyRateLimit);

router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const sanitizedQuery = sanitizeQuery(req.query.q);
    if (!sanitizedQuery) {
      throw new ApiError(400, "Se requiere un término de búsqueda válido");
    }
    const response = await animeService.searchAnime(sanitizedQuery, req.query.domain);
    res.status(200).json(response);
  })
);

router.get(
  "/info",
  asyncHandler(async (req, res) => {
    const validatedUrl = validateScraperUrl(req.query.url);
    const response = await animeService.getAnimeInfo(validatedUrl);
    res.status(200).json(response);
  })
);

router.get(
  "/episode",
  asyncHandler(async (req, res) => {
    const validatedUrl = validateScraperUrl(req.query.url);
    const response = await animeService.getEpisodeLinks(validatedUrl, req.query.includeMega, req.query.excludeServers);
    res.status(200).json(response);
  })
);

router.post(
  "/download",
  asyncHandler(async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = downloadService.createDownload(req.body || {}, baseUrl);

    res.status(200).json({
      success: true,
      data,
    });
  })
);

router.get(
  "/download/:id",
  asyncHandler(async (req, res) => {
    const data = downloadService.getDownload(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  })
);

router.post(
  "/batch-download",
  asyncHandler(async (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const data = downloadService.createBatch(req.body || {}, baseUrl);

    res.status(200).json({
      success: true,
      data,
    });
  })
);

router.get(
  "/batch/:id",
  asyncHandler(async (req, res) => {
    const data = downloadService.getBatch(req.params.id);

    res.status(200).json({
      success: true,
      data,
    });
  })
);

module.exports = router;
