const { URL } = require("node:url");
const { ApiError } = require("../utils/api-error");
const consumetService = require("./consumet.service");
const jkanimeService = require("./jkanime.service");
const animeflvService = require("./animeflv.service");
const hentailaService = require("./hentaila.service");
const tioanimeService = require("./tioanime.service");
const monoschinosService = require("./monoschinos.service");

// ============================================================
// PROVIDERS
// Consumet (Hianime/AnimePahe) is now the PRIMARY provider.
// Legacy web scrapers are kept as optional secondary providers
// for catalog/search endpoints, but NOT for episode streaming.
// ============================================================
const PROVIDERS = [
  {
    id: "consumet",
    label: "Consumet (HiAnime / AnimePahe — Streams HLS)",
    domains: ["hianime.to", "aniwatch.to", "consumet", "consumet.org", "animepahe.ru", "animepahe.com"],
    service: consumetService,
    isPrimary: true
  },
  {
    id: "jkanime",
    label: "JKAnime",
    domains: ["jkanime.net", "www.jkanime.net"],
    service: jkanimeService
  },
  {
    id: "animeflv",
    label: "AnimeFLV",
    domains: ["animeflv.net", "www.animeflv.net", "www4.animeflv.net"],
    service: animeflvService
  },
  {
    id: "hentaila",
    label: "HentaiLA",
    domains: ["hentaila.com", "www.hentaila.com"],
    service: hentailaService
  },
  {
    id: "tioanime",
    label: "TioAnime",
    domains: ["tioanime.com", "www.tioanime.com"],
    service: tioanimeService
  },
  {
    id: "monoschinos",
    label: "MonosChinos",
    domains: ["monoschinos2.com", "www.monoschinos2.com"],
    service: monoschinosService
  },
];

// The default streaming provider — always consumet
const PRIMARY_PROVIDER = PROVIDERS[0];

function normalizeDomain(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;
  try {
    if (trimmed.includes("://")) return new URL(trimmed).hostname.toLowerCase();
    return new URL(`https://${trimmed}`).hostname.toLowerCase();
  } catch (_error) {
    return trimmed.split("/")[0];
  }
}

function domainMatches(domain, candidate) {
  if (!domain || !candidate) return false;
  if (domain === candidate) return true;
  return domain.endsWith(`.${candidate}`);
}

function findProviderByDomain(domainCandidate) {
  const domain = normalizeDomain(domainCandidate);
  if (!domain) return null;
  return PROVIDERS.find((p) => p.domains.some((c) => domainMatches(domain, c))) || null;
}

function findProviderById(providerId) {
  if (!providerId || typeof providerId !== "string") return null;
  const normalized = providerId.trim().toLowerCase();
  return PROVIDERS.find((p) => p.id === normalized) || null;
}

function findProviderForUrl(urlCandidate) {
  if (!urlCandidate || typeof urlCandidate !== "string") return null;
  try {
    const host = new URL(urlCandidate).hostname;
    return findProviderByDomain(host);
  } catch (_error) {
    return null;
  }
}

// ============================================================
// SEARCH  — tries consumet first, then multi-provider fallback
// ============================================================
async function searchAnime(query, domainCandidate) {
  const forcedProvider = findProviderByDomain(domainCandidate) || findProviderById(domainCandidate);

  if (forcedProvider) {
    const result = await forcedProvider.service.searchAnime(query, forcedProvider.domains[0]);
    if (result && result.data && Array.isArray(result.data.results)) {
      result.data.results.forEach(item => {
        item.provider = forcedProvider.label;
        if (item.url) item.slug = item.url;
      });
    }
    return { ...result, source: result?.source || forcedProvider.id };
  }

  // Parallel search across ALL providers for instant response
  const searchPromises = PROVIDERS.map(async (provider) => {
    try {
      const result = await provider.service.searchAnime(query, provider.domains[0]);
      const results = result?.data?.results || [];
      results.forEach(item => {
        item.provider = provider.label;
        if (item.url) item.slug = item.url;
      });
      return { success: true, providerId: provider.id, providerLabel: provider.label, results, originalResult: result };
    } catch (error) {
      console.warn(`[SEARCH] Error en proveedor ${provider.id}:`, error.message);
      return { success: false, providerId: provider.id, error };
    }
  });

  const searchResults = await Promise.all(searchPromises);
  const allResults = [];
  const errors = [];
  let firstEmptyResult = null;

  for (const res of searchResults) {
    if (res.success) {
      if (res.results.length > 0) {
        allResults.push(...res.results);
      } else if (!firstEmptyResult) {
        firstEmptyResult = res.originalResult;
      }
    } else {
      errors.push(res.error);
    }
  }

  if (allResults.length > 0) {
    return { success: true, source: "Multi", data: { results: allResults, count: allResults.length } };
  }
  if (firstEmptyResult) return { ...firstEmptyResult, source: "Multi" };
  if (errors.length === PROVIDERS.length && errors[0]) throw errors[0];

  throw new ApiError(502, "No se pudo completar la búsqueda en ningún proveedor");
}

// ============================================================
// ANIME INFO
// Consumet is the primary provider. Other providers are
// matched only if the URL belongs to their known domain.
// ============================================================
async function getAnimeInfo(urlCandidate) {
  // If we can detect a specific legacy provider by domain, use it
  const urlProvider = findProviderForUrl(urlCandidate);
  if (urlProvider && !urlProvider.isPrimary) {
    try {
      const result = await urlProvider.service.getAnimeInfo(urlCandidate);
      if (result && result.data) {
        result.data.slug = urlCandidate;
        result.data.url = urlCandidate;
      }
      return { ...result, source: result?.source || urlProvider.id };
    } catch (e) {
      console.warn(`[INFO] Error en provider detectado ${urlProvider.id}:`, e.message);
    }
  }

  // Default: use Consumet
  try {
    const result = await consumetService.getAnimeInfo(urlCandidate);
    return result;
  } catch (e) {
    console.warn("[INFO] Consumet falló, intentando providers de respaldo:", e.message);
  }

  throw new ApiError(404, "No se pudo obtener información del anime en ningún proveedor");
}

// ============================================================
// EPISODE LINKS
// Consumet is the primary streaming source.
// ============================================================
async function getEpisodeLinks(urlCandidate, includeMega, excludeServers) {
  // If URL belongs to a specific legacy provider, use it
  const urlProvider = findProviderForUrl(urlCandidate);
  if (urlProvider && !urlProvider.isPrimary) {
    try {
      const result = await urlProvider.service.getEpisodeLinks(urlCandidate, includeMega, excludeServers);
      // Normalise legacy response to { servers: { sub, dub } }
      if (result && result.data) {
        if (!result.data.servers || !result.data.servers.sub) {
          // Wrap flat server array
          const flat = Array.isArray(result.data.servers)
            ? result.data.servers
            : Array.isArray(result.data)
            ? result.data
            : [];
          result.data = {
            ...result.data,
            servers: { sub: flat, dub: [] }
          };
        }
      }
      return { ...result, source: result?.source || urlProvider.id };
    } catch (e) {
      console.warn(`[EPISODE] Error en provider detectado ${urlProvider.id}:`, e.message);
    }
  }

  // Default: use Consumet (returns proper sub/dub structure)
  const consumetResult = await consumetService.getEpisodeLinks(urlCandidate);
  return consumetResult;
}

module.exports = {
  searchAnime,
  getAnimeInfo,
  getEpisodeLinks,
};
