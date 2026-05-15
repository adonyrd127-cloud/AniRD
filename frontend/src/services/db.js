import Dexie from 'dexie';

export const db = new Dexie('AniRD_DB');

db.version(2).stores({
  history: '++id, animeId, episodeId, progress, duration, timestamp, updatedAt',
  favorites: 'animeId, title, cover, addedAt',
  following: 'animeId, title, cover, broadcast, addedAt',
  lists: '++id, name, animeIds, createdAt',
  cache: 'key, data, expiresAt',
  settings: 'key, value'
});

export const dbService = {
  async addToHistory(animeId, episodeId, progress, duration) {
    const timestamp = Date.now();
    const existing = await db.history.where({ animeId, episodeId }).first();

    if (existing) {
      return db.history.update(existing.id, { progress, duration, updatedAt: timestamp });
    } else {
      return db.history.add({ animeId, episodeId, progress, duration, timestamp, updatedAt: timestamp });
    }
  },

  async getContinueWatching() {
    // Obtener todo el historial ordenado por la fecha de actualización más reciente
    const history = await db.history.orderBy('updatedAt').reverse().toArray();
    
    // Usar un Map para quedarnos solo con la entrada más reciente de cada animeId
    const uniqueAnimes = new Map();
    history.forEach(item => {
      if (!uniqueAnimes.has(item.animeId)) {
        uniqueAnimes.set(item.animeId, item);
      }
    });

    const deduped = Array.from(uniqueAnimes.values());

    // Filtrar los que no han sido terminados (>90%) y limitar a 20
    return deduped.filter(item => {
      if (!item.duration || item.duration === 0) return true;
      const percentage = (item.progress / item.duration) * 100;
      return percentage < 90;
    }).slice(0, 20);
  },

  async toggleFavorite(anime) {
    const id = anime.mal_id || anime.id || anime.animeId;
    const existing = await db.favorites.get(id);
    
    if (existing) {
      await db.favorites.delete(id);
      return false; // Removed
    } else {
      await db.favorites.add({
        animeId: id,
        title: anime.title,
        cover: anime.images?.jpg?.large_image_url || anime.cover || '',
        type: anime.type || '',
        score: anime.score || '',
        episodes: anime.episodes || null,
        addedAt: Date.now()
      });
      return true; // Added
    }
  },

  async isFavorite(animeId) {
    if (!animeId) return false;
    const existing = await db.favorites.get(Number(animeId));
    return !!existing;
  },

  async getFavorites() {
    return await db.favorites.orderBy('addedAt').reverse().toArray();
  },

  async toggleFollowing(anime) {
    const id = anime.mal_id || anime.id || anime.animeId;
    const existing = await db.following.get(id);
    
    if (existing) {
      await db.following.delete(id);
      return false; // Removed
    } else {
      await db.following.add({
        animeId: id,
        title: anime.title,
        cover: anime.images?.jpg?.large_image_url || anime.cover || '',
        broadcast: anime.broadcast || null,
        addedAt: Date.now()
      });
      return true; // Added
    }
  },

  async isFollowing(animeId) {
    if (!animeId) return false;
    const existing = await db.following.get(Number(animeId));
    return !!existing;
  },

  async getFollowing() {
    return await db.following.orderBy('addedAt').reverse().toArray();
  },

  async getSetting(key, defaultValue = null) {
    const setting = await db.settings.get(key);
    return setting ? setting.value : defaultValue;
  },

  async setSetting(key, value) {
    return await db.settings.put({ key, value });
  },

  async getAllData() {
    return {
      favorites: await db.favorites.toArray(),
      following: await db.following.toArray(),
      history: await db.history.toArray(),
    };
  },

  async syncFromServer(data) {
    if (!data) return;
    
    // Usar transacciones para asegurar consistencia
    return await db.transaction('rw', [db.favorites, db.following, db.history], async () => {
      if (data.favorites) {
        await db.favorites.clear();
        await db.favorites.bulkAdd(data.favorites);
      }
      if (data.following) {
        await db.following.clear();
        await db.following.bulkAdd(data.following);
      }
      if (data.history) {
        await db.history.clear();
        await db.history.bulkAdd(data.history);
      }
    });
  }
};
