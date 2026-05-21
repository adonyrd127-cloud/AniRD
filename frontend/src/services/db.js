import Dexie from 'dexie';
import { authService } from './auth.service.js';

export const db = new Dexie('AniRD_DB');

db.version(3).stores({
  history: '++id, animeId, episodeId, progress, duration, timestamp, updatedAt',
  favorites: 'animeId, title, cover, addedAt',
  following: 'animeId, title, cover, broadcast, addedAt',
  lists: '++id, name, animeIds, createdAt',
  cache: 'key, data, expiresAt',
  settings: 'key, value',
  notifications: '++id, animeId, isRead, timestamp'
});

db.open().catch(async (err) => {
  console.error('[Dexie] Error crítico al abrir la base de datos AniRD_DB:', err);
  try {
    console.log('[Dexie] Intentando restablecer base de datos local para auto-recuperación...');
    await Dexie.delete('AniRD_DB');
    console.log('[Dexie] Base de datos borrada con éxito. Recargando página...');
  } catch (deleteErr) {
    console.error('[Dexie] Fallo al borrar base de datos:', deleteErr);
  }
  window.location.reload();
});

export const dbService = {
  async triggerSync() {
    try {
      if (authService.isLoggedIn()) {
        const localData = await this.getAllData();
        await authService.syncWithServer(localData);
        console.log("[Sync] Sincronización en la nube exitosa.");
      }
    } catch (err) {
      console.error("[Sync] Error sincronizando con el servidor:", err);
    }
  },

  async addToHistory(animeId, episodeId, progress, duration) {
    const timestamp = Date.now();
    const existing = await db.history.where({ animeId, episodeId }).first();
    let result;

    if (existing) {
      result = await db.history.update(existing.id, { progress, duration, updatedAt: timestamp });
    } else {
      result = await db.history.add({ animeId, episodeId, progress, duration, timestamp, updatedAt: timestamp });
    }

    this.triggerSync();
    return result;
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
      this.triggerSync();
      return false; // Removed
    } else {
      await db.favorites.add({
        animeId: id,
        title: anime.title,
        cover: anime.images?.jpg?.large_image_url || anime.cover || '',
        type: anime.type || '',
        score: anime.score || '',
        episodes: anime.episodes || null,
        status: anime.status || '',
        broadcast: anime.broadcast || null,
        addedAt: Date.now()
      });
      this.triggerSync();
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
      this.triggerSync();
      return false; // Removed
    } else {
      await db.following.add({
        animeId: id,
        title: anime.title,
        cover: anime.images?.jpg?.large_image_url || anime.cover || '',
        status: anime.status || '',
        broadcast: anime.broadcast || null,
        addedAt: Date.now(),
        lastNotified: Date.now()
      });
      this.triggerSync();
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

  async syncFromServer(serverData) {
    if (!serverData) return;

    return await db.transaction('rw', [db.favorites, db.following, db.history], async () => {
      // --- 1. HISTORIAL DE REPRODUCCIÓN (HISTORY) ---
      const localHistory = await db.history.toArray();
      const serverHistory = serverData.history || [];
      
      const historyMap = new Map();
      localHistory.forEach(item => {
        const key = `${item.animeId}_${item.episodeId}`;
        historyMap.set(key, item);
      });
      
      let needsUpload = false;
      serverHistory.forEach(srvItem => {
        const key = `${srvItem.animeId}_${srvItem.episodeId}`;
        const locItem = historyMap.get(key);
        
        if (!locItem) {
          historyMap.set(key, srvItem);
        } else {
          const srvTime = srvItem.updatedAt || srvItem.timestamp || 0;
          const locTime = locItem.updatedAt || locItem.timestamp || 0;
          
          if (srvTime > locTime) {
            historyMap.set(key, srvItem);
          } else if (locTime > srvTime) {
            needsUpload = true;
          }
        }
      });
      
      if (localHistory.length !== historyMap.size) {
        needsUpload = true;
      }

      // --- 2. FAVORITOS (FAVORITES) ---
      const localFavs = await db.favorites.toArray();
      const serverFavs = serverData.favorites || [];
      const favsMap = new Map();
      
      localFavs.forEach(item => favsMap.set(Number(item.animeId), item));
      serverFavs.forEach(srvItem => {
        const id = Number(srvItem.animeId);
        const locItem = favsMap.get(id);
        if (!locItem) {
          favsMap.set(id, srvItem);
        } else {
          const srvTime = srvItem.addedAt || 0;
          const locTime = locItem.addedAt || 0;
          if (srvTime > locTime) {
            favsMap.set(id, srvItem);
          } else if (locTime > srvTime) {
            needsUpload = true;
          }
        }
      });
      
      if (localFavs.length !== favsMap.size) {
        needsUpload = true;
      }

      // --- 3. SIGUIENDO (FOLLOWING) ---
      const localFollowing = await db.following.toArray();
      const serverFollowing = serverData.following || [];
      const followingMap = new Map();
      
      localFollowing.forEach(item => followingMap.set(Number(item.animeId), item));
      serverFollowing.forEach(srvItem => {
        const id = Number(srvItem.animeId);
        const locItem = followingMap.get(id);
        if (!locItem) {
          followingMap.set(id, srvItem);
        } else {
          const srvTime = srvItem.addedAt || 0;
          const locTime = locItem.addedAt || 0;
          if (srvTime > locTime) {
            followingMap.set(id, srvItem);
          } else if (locTime > srvTime) {
            needsUpload = true;
          }
        }
      });
      
      if (localFollowing.length !== followingMap.size) {
        needsUpload = true;
      }

      // --- 4. APLICAR CAMBIOS ---
      await db.history.clear();
      const cleanHistory = Array.from(historyMap.values()).map(item => {
        const { id, ...rest } = item;
        return rest;
      });
      await db.history.bulkAdd(cleanHistory);

      await db.favorites.clear();
      await db.favorites.bulkAdd(Array.from(favsMap.values()));

      await db.following.clear();
      await db.following.bulkAdd(Array.from(followingMap.values()));

      // --- 5. SUBIR SI HAY CAMBIOS MÁS RECIENTES ---
      if (needsUpload) {
        console.log("[Sync] Detectados cambios locales más recientes. Subiendo fusión al servidor...");
        setTimeout(() => this.triggerSync(), 0);
      }
    });
  }
};
