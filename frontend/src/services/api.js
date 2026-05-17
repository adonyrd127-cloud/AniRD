class JikanClient {
  constructor() {
    this.baseUrl = 'https://api.jikan.moe/v4';
    this.lastRequest = 0;
    this.minDelay = 500;
  }

  async request(endpoint, params = {}) {
    const now = Date.now();
    const wait = Math.max(0, this.lastRequest + this.minDelay - now);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    this.lastRequest = Date.now();

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    
    let res = await fetch(url.toString());
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 2000));
      res = await fetch(url.toString());
    }
    if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
    return res.json();
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

  async getAnimeSearch(query) {
    return await this.providers.jikan.request('/anime', { q: query, limit: 20 });
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
      const data = await this.providers.jikan.request(`/anime/${urlOrId}/full`);
      this.cache.set(urlOrId, data);
      return data;
    } catch (e) {
      return { success: false, data: null };
    }
  }

  async getEpisode(url) {
    return await this.providers.local.request('/anime/episode', { url });
  }

  async getTrending(page = 1) {
    return await this.providers.jikan.request('/top/anime', { filter: 'airing', limit: 24, page });
  }

  async getMovies(page = 1) {
    return await this.providers.jikan.request('/top/anime', { type: 'movie', filter: 'bypopularity', limit: 24, page });
  }

  async getLatest(page = 1) {
    return await this.providers.jikan.request('/seasons/now', { limit: 24, page });
  }

  async getDubbed(page = 1) {
    try {
      return await this.providers.jikan.request('/anime', { q: 'latino', limit: 24, page, status: 'airing', order_by: 'popularity', sort: 'desc' });
    } catch (e) { return { data: [] }; }
  }

  async getByGenre(genreId, page = 1) {
    return await this.providers.jikan.request('/anime', { genres: genreId, order_by: 'popularity', limit: 24, page });
  }

  async getSchedule() {
    return await this.providers.jikan.request('/seasons/now');
  }

  async getAnimeRelations(id) {
    return await this.providers.jikan.request(`/anime/${id}/relations`);
  }

  async getAnimeCharacters(id) {
    return await this.providers.jikan.request(`/anime/${id}/characters`);
  }

  async getAnilistBanner(malId) {
    const query = `query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }`;
    try {
      const data = await this.providers.anilist.request(query, { id: malId });
      return data.Media?.bannerImage;
    } catch (e) { return null; }
  }
}

export const apiService = new AnimeAPI();
