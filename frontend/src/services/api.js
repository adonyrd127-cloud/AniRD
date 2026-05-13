class JikanClient {
  constructor() {
    this.baseUrl = 'https://api.jikan.moe/v4';
  }
  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const res = await fetch(url.toString());
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
    // Backend anime1v-api
    this.baseUrl = 'http://localhost:3000/api/v1';
    this.apiKey = 'dev-anime1v-key';
  }
  async request(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const res = await fetch(url.toString(), {
      headers: { 'X-API-Key': this.apiKey }
    });
    if (!res.ok) throw new Error(`Local API error: ${res.status}`);
    return res.json();
  }
}

export class AnimeAPI {
  constructor() {
    this.providers = {
      jikan: new JikanClient(),
      anilist: new AnilistClient(),
      local: new LocalApiClient()
    };
    this.cache = new Map(); // simple memory cache
  }

  async getAnimeSearch(query) {
    try {
      // Intentar primero local API
      return await this.providers.local.request('/anime/search', { q: query });
    } catch (e) {
      console.warn("Local API failed for search, trying Jikan", e);
      return await this.providers.jikan.request('/anime', { q: query, limit: 10 });
    }
  }

  async getAnimeInfo(urlOrId) {
    // Determina si usar local (URL) o Jikan/Anilist (ID)
    try {
      if(typeof urlOrId === 'string' && urlOrId.includes('http')) {
         return await this.providers.local.request('/anime/info', { url: urlOrId });
      }
      return await this.providers.jikan.request(`/anime/${urlOrId}/full`);
    } catch (e) {
      console.error("Error fetching anime info", e);
      throw e;
    }
  }

  async getEpisode(url) {
    return await this.providers.local.request('/anime/episode', { url });
  }

  async getTrending() {
    return await this.providers.jikan.request('/seasons/now', { limit: 12 });
  }

  async getSchedule() {
    return await this.providers.jikan.request('/schedules');
  }
}

export const apiService = new AnimeAPI();
