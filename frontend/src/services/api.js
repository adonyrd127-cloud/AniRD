class JikanClient {
  constructor() {
    this.baseUrl = 'https://api.jikan.moe/v4';
    this.queue = Promise.resolve();
    this.minDelay = 400; // 400ms delay between requests to prevent 429
    this.cache = new Map();       // TTL cache: key -> { data, expires }
    this.inflight = new Map();    // Dedup: key -> Promise
    this.cacheTTL = 10 * 60 * 1000; // 10 minutes
  }

  async request(endpoint, params = {}, options = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const cacheKey = url.toString();

    // Return cached if still valid
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expires > Date.now()) return cached.data;

    // Deduplicate concurrent identical requests
    if (this.inflight.has(cacheKey)) return this.inflight.get(cacheKey);

    const promise = (async () => {
      const execute = async () => {
        let attempts = 0;
        let maxAttempts = 2;
        
        while (attempts < maxAttempts) {
          attempts++;
          try {
            const res = await fetch(cacheKey, { signal: options.signal });
            if (res.status === 429) {
              await new Promise(r => setTimeout(r, 1500 * attempts));
              continue;
            }
            if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
            const data = await res.json();
            this.cache.set(cacheKey, { data, expires: Date.now() + this.cacheTTL });
            return data;
          } catch (err) {
            if (attempts >= maxAttempts) throw err;
            await new Promise(r => setTimeout(r, 800));
          }
        }
      };

      const queueTask = this.queue.then(async () => {
        const result = await execute();
        await new Promise(r => setTimeout(r, this.minDelay));
        return result;
      });

      this.queue = queueTask.catch(() => {});
      return await queueTask;
    })();

    this.inflight.set(cacheKey, promise);
    try {
      return await promise;
    } finally {
      this.inflight.delete(cacheKey);
    }
  }
}

class AnilistClient {
  constructor() {
    this.baseUrl = 'https://graphql.anilist.co';
  }

  async request(query, variables = {}) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    });
    if (!res.ok) throw new Error(`AniList error: ${res.status}`);
    const json = await res.json();
    return json.data;
  }

  async getAnimeList(variables = {}) {
    const query = `
      query ($format: MediaFormat, $genre: String, $sort: [MediaSort], $season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(format: $format, genre: $genre, sort: $sort, season: $season, seasonYear: $seasonYear, type: ANIME, isAdult: false) {
            id
            idMal
            title { romaji english native }
            coverImage { extraLarge large medium color }
            bannerImage
            format
            episodes
            meanScore
            seasonYear
            status
            genres
            description
          }
        }
      }
    `;
    const data = await this.request(query, { page: 1, perPage: 24, ...variables });
    return data?.Page?.media || [];
  }

  async getAnimeByIdMal(malId) {
    const query = `
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large medium color }
          bannerImage
          format
          episodes
          meanScore
          seasonYear
          status
          genres
          description
        }
      }
    `;
    try {
      const data = await this.request(query, { id: Number(malId) });
      return data?.Media || null;
    } catch (e) {
      return null;
    }
  }
}

class LocalApiClient {
  constructor() {
    const host = window.location.hostname || 'localhost';
    // El puerto expuesto en docker-compose es estrictamente 3005
    this.port = 3005;
    this.baseUrl = `http://${host}:${this.port}/api/v1`;
    this.apiKey = 'dev-anime1v-key';
  }

  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    try {
      const res = await fetch(url.toString(), {
        headers: { 'X-API-Key': this.apiKey }
      });
      if (!res.ok) throw new Error(`Local API error: ${res.status}`);
      return res.json();
    } catch (e) {
      console.error(`Error en petición local a ${endpoint}:`, e);
      return { success: false, message: e.message };
    }
  }
}

export class AnimeAPI {
  constructor() {
    this.providers = {
      jikan: new JikanClient(),
      anilist: new AnilistClient(),
      local: new LocalApiClient()
    };
    this.cache = new Map();
  }

  formatAniListMedia(media) {
    if (Array.isArray(media)) {
      return media.map(item => this.formatSingleAniList(item));
    }
    return this.formatSingleAniList(media);
  }

  formatSingleAniList(item) {
    if (!item) return null;
    return {
      mal_id: item.idMal || item.id,
      title: item.title?.english || item.title?.romaji || item.title?.native || 'Anime',
      title_english: item.title?.english || item.title?.romaji,
      images: {
        jpg: {
          large_image_url: item.coverImage?.extraLarge || item.coverImage?.large,
          image_url: item.coverImage?.large || item.coverImage?.medium
        },
        webp: {
          large_image_url: item.coverImage?.extraLarge || item.coverImage?.large,
          image_url: item.coverImage?.large || item.coverImage?.medium
        }
      },
      score: item.meanScore ? (item.meanScore / 10).toFixed(1) : null,
      type: item.format === 'TV' ? 'TV' : item.format === 'MOVIE' ? 'Movie' : item.format || 'TV',
      episodes: item.episodes,
      status: item.status === 'RELEASING' ? 'Currently Airing' : item.status,
      synopsis: item.description ? item.description.replace(/<[^>]*>?/gm, '') : ''
    };
  }

  async getAnimeSearch(query, options = {}) {
    return await this.providers.jikan.request('/anime', { q: query, limit: 20 }, options);
  }

  async searchLocal(query) {
    if (!query) return { success: false, data: { results: [] } };
    try {
      let res = await this.providers.local.request('/anime/search', { q: query });
      
      if ((!res.success || !res.data.results.length) && query.length > 5) {
        const clean = query.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();
        if (clean !== query) {
          res = await this.providers.local.request('/anime/search', { q: clean });
        }
      }

      if (!res.success || !res.data.results.length) {
        const firstWord = query.split(' ')[0];
        if (firstWord.length > 3) {
          res = await this.providers.local.request('/anime/search', { q: firstWord });
        }
      }
      return res;
    } catch (e) {
      return { success: false, data: { results: [] } };
    }
  }

  async getAnimeInfo(urlOrId) {
    try {
      if(typeof urlOrId === 'string' && (urlOrId.includes('http') || urlOrId.includes('anime/'))) {
         return await this.providers.local.request('/anime/info', { url: urlOrId });
      }
      if (this.cache.has(urlOrId)) return this.cache.get(urlOrId);

      try {
        const data = await this.providers.jikan.request(`/anime/${urlOrId}/full`);
        if (data?.data) {
          this.cache.set(urlOrId, data);
          return data;
        }
      } catch (e) {
        console.warn(`[API] Jikan info failed for ${urlOrId}, trying AniList fallback:`, e.message);
      }

      const aniMedia = await this.providers.anilist.getAnimeByIdMal(urlOrId);
      if (aniMedia) {
        const formatted = { data: this.formatSingleAniList(aniMedia) };
        this.cache.set(urlOrId, formatted);
        return formatted;
      }
      return { success: false, data: null };
    } catch (e) {
      return { success: false, data: null };
    }
  }

  async getEpisode(url) {
    return await this.providers.local.request('/anime/episode', { url });
  }

  async getTrending(page = 1) {
    try {
      const res = await this.providers.jikan.request('/top/anime', { filter: 'airing', limit: 24, page });
      if (res?.data?.length > 0) return res;
    } catch (e) { console.warn('[API] Jikan trending failed, using AniList:', e.message); }

    const media = await this.providers.anilist.getAnimeList({ sort: ['TRENDING_DESC', 'POPULARITY_DESC'], page });
    return { data: this.formatAniListMedia(media) };
  }

  async getMovies(page = 1) {
    try {
      const res = await this.providers.jikan.request('/top/anime', { filter: 'bypopularity', limit: 24, page });
      if (res?.data?.length > 0) {
        const movies = res.data.filter(a => a.type === 'Movie');
        if (movies.length > 0) return { data: movies };
      }
    } catch (e) { console.warn('[API] Jikan movies failed, using AniList:', e.message); }

    const media = await this.providers.anilist.getAnimeList({ format: 'MOVIE', sort: ['POPULARITY_DESC'], page });
    return { data: this.formatAniListMedia(media) };
  }

  async getLatest(page = 1) {
    try {
      const res = await this.providers.jikan.request('/seasons/now', { limit: 24, page });
      if (res?.data?.length > 0) return res;
    } catch (e) { console.warn('[API] Jikan latest failed, using AniList:', e.message); }

    const now = new Date();
    const month = now.getMonth();
    const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    const currentSeason = seasons[Math.floor(month / 3)];
    const media = await this.providers.anilist.getAnimeList({ season: currentSeason, seasonYear: now.getFullYear(), sort: ['POPULARITY_DESC'], page });
    return { data: this.formatAniListMedia(media) };
  }

  async getDubbed(page = 1) {
    try {
      const res = await this.providers.jikan.request('/top/anime', { limit: 24, page });
      if (res?.data?.length > 0) return res;
    } catch (e) { console.warn('[API] Jikan dubbed failed, using AniList:', e.message); }

    const media = await this.providers.anilist.getAnimeList({ sort: ['POPULARITY_DESC'], page });
    return { data: this.formatAniListMedia(media) };
  }

  async getByGenre(genreId, page = 1) {
    const genreMap = { '1': 'Action', '2': 'Adventure', '4': 'Comedy', '8': 'Drama', '10': 'Fantasy', '22': 'Romance', '24': 'Sci-Fi', '36': 'Slice of Life' };
    const genreName = genreMap[String(genreId)] || genreMap[String(genreId).split(',')[0]] || 'Action';

    try {
      const res = await this.providers.jikan.request('/top/anime', { limit: 24, page });
      if (res?.data?.length > 0) {
        const filtered = res.data.filter(a => a.genres?.some(g => g.name.toLowerCase() === genreName.toLowerCase() || g.mal_id == genreId));
        if (filtered.length > 0) return { data: filtered };
      }
    } catch (e) { console.warn('[API] Jikan genre failed, using AniList:', e.message); }

    const media = await this.providers.anilist.getAnimeList({ genre: genreName, sort: ['POPULARITY_DESC'], page });
    return { data: this.formatAniListMedia(media) };
  }

  async getSchedule() {
    try {
      const res = await this.providers.jikan.request('/seasons/now');
      if (res?.data?.length > 0) return res;
    } catch (e) {}
    return await this.getLatest();
  }

  async getAnimeRelations(id) {
    try {
      return await this.providers.jikan.request(`/anime/${id}/relations`);
    } catch (e) {
      return { data: [] };
    }
  }

  async getAnimeCharacters(id) {
    try {
      return await this.providers.jikan.request(`/anime/${id}/characters`);
    } catch (e) {
      return { data: [] };
    }
  }

  async getAnilistBanner(malId) {
    const query = `query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }`;
    try {
      const data = await this.providers.anilist.request(query, { id: Number(malId) });
      return data.Media?.bannerImage;
    } catch (e) { return null; }
  }

  async getAnimeRecommendations(id) {
    try {
      return await this.providers.jikan.request(`/anime/${id}/recommendations`);
    } catch (e) {
      return { data: [] };
    }
  }

  async getAnilistEpisodes(malId) {
    const query = `
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;
    try {
      const data = await this.providers.anilist.request(query, { id: Number(malId) });
      return data.Media?.streamingEpisodes || [];
    } catch (e) {
      console.warn("Error al cargar episodios desde AniList:", e);
      return [];
    }
  }
}

export const apiService = new AnimeAPI();
