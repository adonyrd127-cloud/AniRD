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

async function searchAnime(query) {
  if (!query) return { success: false, data: { results: [], count: 0 } };
  const { ANIME } = await getConsumet();
  
  const providersToTry = [
    { name: "Hianime", instance: new ANIME.Hianime() },
    { name: "AnimePahe", instance: new ANIME.AnimePahe() },
    { name: "AnimeSaturn", instance: new ANIME.AnimeSaturn() }
  ];

  for (const provider of providersToTry) {
    try {
      const res = await provider.instance.search(query);
      if (res && Array.isArray(res.results) && res.results.length > 0) {
        const results = res.results.map(item => ({
          title: item.title || item.name,
          url: item.id,
          slug: item.id,
          image: item.image || item.poster,
          type: item.type || "Anime",
          provider: "Consumet (" + provider.name + ")",
          source: "consumet"
        }));

        return {
          success: true,
          source: "consumet",
          data: {
            results,
            count: results.length
          }
        };
      }
    } catch (err) {
      console.warn(`[CONSUMET SEARCH] Error con ${provider.name}: ${err.message}`);
    }
  }

  return { success: false, data: { results: [], count: 0 } };
}

async function getAnimeInfo(animeId) {
  if (!animeId) throw new ApiError(400, "Se requiere animeId");
  const { ANIME } = await getConsumet();
  const hianime = new ANIME.Hianime();

  try {
    const info = await hianime.fetchAnimeInfo(animeId);
    if (info) {
      const episodes = (info.episodes || []).map(ep => ({
        number: ep.number,
        title: ep.title || `Episodio ${ep.number}`,
        url: ep.id,
        id: ep.id
      }));

      return {
        success: true,
        source: "consumet",
        data: {
          title: info.title || info.name,
          synopsis: info.description || "",
          image: info.image || info.poster,
          genres: info.genres || [],
          episodes,
          episodesCount: episodes.length,
          slug: animeId,
          url: animeId
        }
      };
    }
  } catch (err) {
    console.warn(`[CONSUMET INFO] Error obteniendo info de ${animeId}: ${err.message}`);
  }

  throw new ApiError(404, "No se pudo encontrar información en Consumet");
}

async function getEpisodeLinks(episodeId) {
  if (!episodeId) throw new ApiError(400, "Se requiere episodeId");
  const { ANIME } = await getConsumet();
  const hianime = new ANIME.Hianime();

  try {
    const sources = await hianime.fetchEpisodeSources(episodeId);
    if (sources && Array.isArray(sources.sources) && sources.sources.length > 0) {
      const servers = sources.sources.map((s, idx) => ({
        server: `HLS Directo ${idx + 1} (${s.quality || 'Auto'})`,
        url: s.url,
        isDirect: true,
        type: s.type || 'hls',
        headers: sources.headers || {}
      }));

      return {
        success: true,
        source: "consumet",
        data: {
          servers
        }
      };
    }
  } catch (err) {
    console.warn(`[CONSUMET EPISODE] Error obteniendo fuentes de ${episodeId}: ${err.message}`);
  }

  return {
    success: false,
    data: {
      servers: []
    }
  };
}

module.exports = {
  searchAnime,
  getAnimeInfo,
  getEpisodeLinks
};
