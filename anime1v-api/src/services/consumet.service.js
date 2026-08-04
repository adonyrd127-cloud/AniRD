const { ApiError } = require("../utils/api-error");

let consumetExtensions = null;
async function getConsumet() {
  if (!consumetExtensions) {
    try {
      consumetExtensions = await import("@consumet/extensions");
    } catch (err) {
      console.error("[CONSUMET] Error cargando @consumet/extensions:", err.message);
      throw new ApiError(500, "No se pudo cargar el módulo @consumet/extensions");
    }
  }
  return consumetExtensions;
}

function withTimeout(promise, ms = 3000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout de ${ms}ms excedido`));
    }, ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// ============================================================
// SEARCH
// ============================================================
async function searchAnime(query) {
  if (!query) return { success: false, data: { results: [], count: 0 } };
  const { ANIME } = await getConsumet();

  const providersToTry = [
    { name: "Hianime", instance: new ANIME.Hianime() },
    { name: "AnimePahe", instance: new ANIME.AnimePahe() },
  ];

  const searchResults = await Promise.all(
    providersToTry.map(async (provider) => {
      try {
        const res = await withTimeout(provider.instance.search(query), 2000);
        if (res && Array.isArray(res.results) && res.results.length > 0) {
          return res.results.map(item => ({
            title: item.title || item.name,
            url: item.id,
            slug: item.id,
            image: item.image || item.poster,
            type: item.type || "Anime",
            provider: "Consumet (" + provider.name + ")",
            source: "consumet",
            providerName: provider.name
          }));
        }
      } catch (err) {
        console.warn(`[CONSUMET SEARCH] Error con ${provider.name}: ${err.message}`);
      }
      return [];
    })
  );

  const flatResults = searchResults.flat();
  if (flatResults.length > 0) {
    return {
      success: true,
      source: "consumet",
      data: {
        results: flatResults,
        count: flatResults.length
      }
    };
  }

  return { success: false, data: { results: [], count: 0 } };
}

// ============================================================
// ANIME INFO
// ============================================================
async function getAnimeInfo(animeId) {
  if (!animeId) throw new ApiError(400, "Se requiere animeId");
  const { ANIME } = await getConsumet();

  // Try Hianime first
  try {
    console.log(`[CONSUMET INFO] Obteniendo info de Hianime para: ${animeId}`);
    const hianime = new ANIME.Hianime();
    const info = await hianime.fetchAnimeInfo(animeId);
    if (info) {
      const episodes = (info.episodes || []).map(ep => ({
        number: ep.number,
        title: ep.title || `Episodio ${ep.number}`,
        url: ep.id,
        id: ep.id,
        isFiller: ep.isFiller || false
      }));

      return {
        success: true,
        source: "consumet-hianime",
        data: {
          title: info.title || info.name,
          synopsis: info.description || "",
          image: info.image || info.poster,
          genres: info.genres || [],
          episodes,
          episodesCount: episodes.length,
          totalEpisodes: info.totalEpisodes || episodes.length,
          slug: animeId,
          url: animeId,
          providerName: "Hianime"
        }
      };
    }
  } catch (err) {
    console.warn(`[CONSUMET INFO] Error en Hianime para ${animeId}: ${err.message}`);
  }

  // Fallback to AnimePahe
  try {
    console.log(`[CONSUMET INFO] Fallback a AnimePahe para: ${animeId}`);
    const animePahe = new ANIME.AnimePahe();
    const info = await animePahe.fetchAnimeInfo(animeId);
    if (info) {
      const episodes = (info.episodes || []).map(ep => ({
        number: ep.number,
        title: ep.title || `Episodio ${ep.number}`,
        url: ep.id,
        id: ep.id
      }));

      return {
        success: true,
        source: "consumet-animepahe",
        data: {
          title: info.title || info.name,
          synopsis: info.description || "",
          image: info.image || info.poster,
          genres: info.genres || [],
          episodes,
          episodesCount: episodes.length,
          slug: animeId,
          url: animeId,
          providerName: "AnimePahe"
        }
      };
    }
  } catch (err) {
    console.warn(`[CONSUMET INFO] Error en AnimePahe para ${animeId}: ${err.message}`);
  }

  throw new ApiError(404, "No se pudo encontrar información en ningún proveedor de Consumet");
}

// ============================================================
// EPISODE LINKS — returns { sub: [...], dub: [...] }
// ============================================================
async function getEpisodeLinks(episodeId) {
  if (!episodeId) throw new ApiError(400, "Se requiere episodeId");
  const { ANIME } = await getConsumet();

  // ---- Hianime ----
  try {
    console.log(`[CONSUMET EPISODE] Obteniendo fuentes de Hianime para: ${episodeId}`);
    const hianime = new ANIME.Hianime();

    // Hianime separates sub/dub via server queries
    let subServers = [];
    let dubServers = [];

    try {
      const subSources = await hianime.fetchEpisodeSources(episodeId, "sub");
      if (subSources && Array.isArray(subSources.sources) && subSources.sources.length > 0) {
        subServers = subSources.sources.map((s, idx) => ({
          server: `HiAnime SUB ${s.quality || "Auto"} ${idx + 1}`,
          url: s.url,
          isDirect: true,
          type: s.type || "hls",
          headers: subSources.headers || {}
        }));
      }
    } catch (e) {
      console.warn(`[CONSUMET] Error sub sources para ${episodeId}: ${e.message}`);
    }

    try {
      const dubSources = await hianime.fetchEpisodeSources(episodeId, "dub");
      if (dubSources && Array.isArray(dubSources.sources) && dubSources.sources.length > 0) {
        dubServers = dubSources.sources.map((s, idx) => ({
          server: `HiAnime DUB ${s.quality || "Auto"} ${idx + 1}`,
          url: s.url,
          isDirect: true,
          type: s.type || "hls",
          headers: dubSources.headers || {}
        }));
      }
    } catch (e) {
      console.warn(`[CONSUMET] Error dub sources para ${episodeId}: ${e.message}`);
    }

    if (subServers.length > 0 || dubServers.length > 0) {
      return {
        success: true,
        source: "consumet-hianime",
        data: {
          servers: {
            sub: subServers,
            dub: dubServers.length > 0 ? dubServers : subServers
          }
        }
      };
    }
  } catch (err) {
    console.warn(`[CONSUMET EPISODE] Error en Hianime para ${episodeId}: ${err.message}`);
  }

  // ---- Fallback: AnimePahe ----
  try {
    console.log(`[CONSUMET EPISODE] Fallback a AnimePahe para: ${episodeId}`);
    const animePahe = new ANIME.AnimePahe();
    const sources = await animePahe.fetchEpisodeSources(episodeId);
    if (sources && Array.isArray(sources.sources) && sources.sources.length > 0) {
      const servers = sources.sources.map((s, idx) => ({
        server: `AnimePahe ${s.quality || "Auto"} ${idx + 1}`,
        url: s.url,
        isDirect: true,
        type: s.type || "hls",
        headers: sources.headers || {}
      }));
      return {
        success: true,
        source: "consumet-animepahe",
        data: {
          servers: {
            sub: servers,
            dub: []
          }
        }
      };
    }
  } catch (err) {
    console.warn(`[CONSUMET EPISODE] Error en AnimePahe para ${episodeId}: ${err.message}`);
  }

  return {
    success: false,
    data: {
      servers: { sub: [], dub: [] }
    }
  };
}

module.exports = {
  searchAnime,
  getAnimeInfo,
  getEpisodeLinks
};
