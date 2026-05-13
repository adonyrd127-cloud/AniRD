import Dexie from 'dexie';

export const db = new Dexie('AniRD_DB');

db.version(1).stores({
  history: '++id, animeId, episodeId, progress, duration, timestamp, updatedAt',
  favorites: 'animeId, title, cover, addedAt',
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
    // Ultimos 20 items no completados (>90% = completado)
    const history = await db.history.orderBy('updatedAt').reverse().toArray();
    return history.filter(item => {
      if (!item.duration || item.duration === 0) return true;
      const percentage = (item.progress / item.duration) * 100;
      return percentage < 90;
    }).slice(0, 20);
  },

  async toggleFavorite(anime) {
    const existing = await db.favorites.get(anime.id);
    if (existing) {
      await db.favorites.delete(anime.id);
      return false; // Removed
    } else {
      await db.favorites.add({
        animeId: anime.id,
        title: anime.title,
        cover: anime.cover,
        addedAt: Date.now()
      });
      return true; // Added
    }
  },

  async isFavorite(animeId) {
    const existing = await db.favorites.get(animeId);
    return !!existing;
  }
};
