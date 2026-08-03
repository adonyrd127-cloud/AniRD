const axios = require("axios");
const { URL } = require("node:url");
const { ApiError } = require("../utils/api-error");
const animeav1Service = require("./animeav1.service");
const jkanimeService = require("./jkanime.service");
const animeflvService = require("./animeflv.service");
const hentailaService = require("./hentaila.service");
const tioanimeService = require("./tioanime.service");
const monoschinosService = require("./monoschinos.service");

/**
 * Transforma las URLs de servidores HLS (Zilla-Networks) y MP4Upload
 * para que apunten a nuestras rutas proxy internas en lugar de a los
 * servidores externos. Esto resuelve:
 *
 * 1. HLS (Zilla-Networks): Cloudflare WAF bloquea /play/{hash} con 403
 *    cuando se carga en iframe desde orígenes externos. Nuestro proxy
 *    descarga la playlist .m3u8 y segmentos .ts server-side.
 *
 * 2. MP4Upload: Las páginas embed incluyen scripts publicitarios.
 *    Nuestro proxy extrae el .mp4 directo y sirve un reproductor limpio.
 */
function transformServerUrl(serverItem, hostBase) {
  if (!serverItem || !serverItem.url || typeof serverItem.url !== "string") {
    return serverItem;
  }

  const url = serverItem.url;

  // HLS / Zilla Networks: /play/{hash} → /player/player/hls/{hash}
  if (url.includes("zilla-networks.com") && url.includes("/play/")) {
    const videoId = url.split("/play/")[1]?.split("/")[0]?.split("?")[0];
    if (videoId && /^[a-f0-9]+$/i.test(videoId)) {
      return {
        ...serverItem,
        url: `${hostBase}/player/hls/${videoId}`,
      };
    }
  }

  // MP4Upload: /embed-{id}.html → /player/player/mp4upload/{id}
  if (url.includes("mp4upload.com") && url.includes("embed-")) {
    const match = url.match(/embed-([a-z0-9]+)/i);
    if (match && match[1]) {
      return {
        ...serverItem,
        url: `${hostBase}/player/mp4upload/${match[1]}`,
      };
    }
  }

  return serverItem;
}

function processServersList(serversList, hostBase) {
  if (!Array.isArray(serversList)) return [];
  return serversList.map((item) => transformServerUrl(item, hostBase));
}

const DEFAULT_ANIME_DOMAIN = process.env.DEFAULT_ANIME_DOMAIN || "animeav1.com";

const PROVIDERS = [
  {
    id: "animeav1",
    label: "AnimeAV1",
    domains: [DEFAULT_ANIME_DOMAIN, "animeav1.com", "www.animeav1.com"],
    service: animeav1Service,
  },
  {
    id: "jkanime",
    label: "JKAnime",
    domains: ["jkanime.net", "www.jkanime.net"],
    service: jkanimeService,
  },
  {
    id: "animeflv",
    label: "AnimeFLV",
    domains: ["animeflv.net", "www.animeflv.net", "www4.animeflv.net"],
    service: animeflvService,
  },
  // HentaiLA desactivado permanentemente para asegurar un entorno familiar y libre de contenido inapropiado.
  /*
  {
    id: "hentaila",
    label: "HentaiLA",
    domains: ["hentaila.com", "www.hentaila.com"],
    service: hentailaService,
  },
  */
  {
    id: "tioanime",
    label: "TioAnime",
    domains: ["tioanime.com", "www.tioanime.com"],
    service: tioanimeService,
  },
  {
    id: "monoschinos",
    label: "MonosChinos",
    domains: ["monoschinos2.com", "www.monoschinos2.com"],
    service: monoschinosService,
  },
];

function normalizeDomain(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim().toLowerCase();
  if (!trimmed) {
    return null;
  }

  try {
    if (trimmed.includes("://")) {
      return new URL(trimmed).hostname.toLowerCase();
    }
    return new URL(`https://${trimmed}`).hostname.toLowerCase();
  } catch (_error) {
    return trimmed.split("/")[0];
  }
}

function domainMatches(domain, candidate) {
  if (!domain || !candidate) {
    return false;
  }

  if (domain === candidate) {
    return true;
  }

  return domain.endsWith(`.${candidate}`);
}

function findProviderByDomain(domainCandidate) {
  const domain = normalizeDomain(domainCandidate);
  if (!domain) {
    return null;
  }

  return (
    PROVIDERS.find((provider) => provider.domains.some((candidate) => domainMatches(domain, candidate))) || null
  );
}

function findProviderById(providerId) {
  if (!providerId || typeof providerId !== "string") {
    return null;
  }

  const normalized = providerId.trim().toLowerCase();
  return PROVIDERS.find((provider) => provider.id === normalized) || null;
}

function findProviderForUrl(urlCandidate) {
  if (!urlCandidate || typeof urlCandidate !== "string") {
    return null;
  }

  try {
    const host = new URL(urlCandidate).hostname;
    return findProviderByDomain(host);
  } catch (_error) {
    return null;
  }
}

// --- Caché Ultra-rápida en Memoria para Scraping ---
const scrapingCache = new Map();

function getFromCache(key) {
  const cached = scrapingCache.get(key);
  if (cached) {
    if (cached.expires > Date.now()) {
      return cached.data;
    }
    scrapingCache.delete(key);
  }
  return null;
}

function setToCache(key, data, ttlMs) {
  scrapingCache.set(key, {
    data,
    expires: Date.now() + ttlMs,
  });
}

async function searchAnime(query, domainCandidate) {
  const cacheKey = `search:${query}:${domainCandidate || ""}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const forcedProvider = findProviderByDomain(domainCandidate) || findProviderById(domainCandidate);
  const providersToTry = forcedProvider ? [forcedProvider] : PROVIDERS;

  let lastEmpty = null;
  const errors = [];

  for (const provider of providersToTry) {
    try {
      const result = await provider.service.searchAnime(query, provider.domains[0]);
      const count = result?.data?.count ?? 0;
      if (count > 0 || forcedProvider) {
        const finalResult = {
          ...result,
          source: result?.source || provider.id,
        };
        setToCache(cacheKey, finalResult, 3600 * 1000); // 1 hora de caché para búsquedas
        return finalResult;
      }

      if (!lastEmpty) {
        lastEmpty = {
          ...result,
          source: result?.source || provider.id,
        };
      }
    } catch (error) {
      errors.push({ provider: provider.id, error });
    }
  }

  if (lastEmpty) {
    setToCache(cacheKey, lastEmpty, 300 * 1000); // 5 minutos de caché para búsquedas vacías
    return lastEmpty;
  }

  if (errors.length === providersToTry.length && errors[0]?.error) {
    throw errors[0].error;
  }

  throw new ApiError(502, "No se pudo completar la busqueda en proveedores");
}

async function getAnimeInfo(urlCandidate) {
  const cacheKey = `info:${urlCandidate}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const provider = findProviderForUrl(urlCandidate) || PROVIDERS[0];
  if (!provider) {
    throw new ApiError(400, "Proveedor no soportado");
  }

  const result = await provider.service.getAnimeInfo(urlCandidate);
  const finalResult = {
    ...result,
    source: result?.source || provider.id,
  };
  setToCache(cacheKey, finalResult, 15 * 60 * 1000); // 15 minutos de caché para info detallada
  return finalResult;
}

async function getEpisodeLinks(urlCandidate, includeMega, excludeServers, apiBasePath) {
  const cacheKey = `episode:${urlCandidate}:${includeMega || ""}:${excludeServers || ""}:${apiBasePath || ""}`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const provider = findProviderForUrl(urlCandidate) || PROVIDERS[0];
  if (!provider) {
    throw new ApiError(400, "Proveedor no soportado");
  }

  const result = await provider.service.getEpisodeLinks(urlCandidate, includeMega, excludeServers);
  
  if (result && result.data && result.data.servers && apiBasePath) {
    if (result.data.servers.sub) {
      result.data.servers.sub = processServersList(result.data.servers.sub, apiBasePath);
    }
    if (result.data.servers.dub) {
      result.data.servers.dub = processServersList(result.data.servers.dub, apiBasePath);
    }
  }

  const finalResult = {
    ...result,
    source: result?.source || provider.id,
  };
  setToCache(cacheKey, finalResult, 5 * 60 * 1000); // 5 minutos de caché para enlaces del reproductor
  return finalResult;
}

module.exports = {
  searchAnime,
  getAnimeInfo,
  getEpisodeLinks,
};
