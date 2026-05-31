import { db } from './db.js';

export const notificationService = {
  async checkNewEpisodes() {
    const followed = await db.following.toArray();
    const favorites = await db.favorites.toArray();
    
    // Combinar listas únicas basadas en animeId para rastrear tanto favoritos como seguidos
    const trackedMap = new Map();
    favorites.forEach(a => trackedMap.set(a.animeId, a));
    followed.forEach(a => trackedMap.set(a.animeId, a));
    const tracked = Array.from(trackedMap.values());
    
    let hasNew = false;
    
    for (const anime of tracked) {
      if (anime.status === 'Currently Airing' && anime.broadcast && anime.broadcast.day && anime.broadcast.day !== 'Unknown') {
        const lastBroadcast = this.getLastBroadcast(anime.broadcast);
        
        // Si lastBroadcast es válido y ocurrió DESPUÉS de nuestro timestamp de última notificación
        if (lastBroadcast && (!anime.lastNotified || lastBroadcast > anime.lastNotified)) {
          // Verificar que no hayamos creado ya una notificación para este timestamp exacto
          const existing = await db.notifications.where('animeId').equals(anime.animeId).and(n => n.timestamp === lastBroadcast).first();
          
          if (!existing) {
            await db.notifications.add({
              animeId: anime.animeId,
              isRead: 0,
              timestamp: lastBroadcast
            });
            hasNew = true;
          }
          
          // Actualizar lastNotified en los almacenes correspondientes
          const isFav = await db.favorites.get(anime.animeId);
          if (isFav) {
            await db.favorites.update(anime.animeId, { lastNotified: lastBroadcast });
          }
          const isFol = await db.following.get(anime.animeId);
          if (isFol) {
            await db.following.update(anime.animeId, { lastNotified: lastBroadcast });
          }
        }
      }
    }
    
    return hasNew;
  },

  getLastBroadcast(b) {
    const days = { 'Sundays': 0, 'Mondays': 1, 'Tuesdays': 2, 'Wednesdays': 3, 'Thursdays': 4, 'Fridays': 5, 'Saturdays': 6 };
    if (days[b.day] === undefined) return null;
    const [h, m] = b.time.split(':').map(Number);
    const tokyoNow = new Date(new Date().toLocaleString("en-US", {timeZone: b.timezone || 'Asia/Tokyo'}));
    
    let target = new Date(tokyoNow);
    target.setHours(h, m, 0, 0);
    
    let dAdd = days[b.day] - tokyoNow.getDay();
    // Encontrar la próxima fecha de emisión
    if (dAdd < 0 || (dAdd === 0 && target <= tokyoNow)) dAdd += 7;
    target.setDate(target.getDate() + dAdd);
    
    // La última emisión fue exactamente 1 semana antes de la próxima
    const nextTarget = new Date(target);
    nextTarget.setDate(nextTarget.getDate() - 7);
    
    // Ignorar si la última emisión es en el futuro
    if (nextTarget > tokyoNow) return null;

    // Convertir de vuelta a ms locales reales
    const diffMs = nextTarget.getTime() - tokyoNow.getTime();
    return Date.now() + diffMs; 
  },

  async getUnreadCount() {
    return await db.notifications.where('isRead').equals(0).count();
  },

  async getNotifications() {
    const notifs = await db.notifications.orderBy('timestamp').reverse().toArray();
    const hydrated = [];
    for (const n of notifs) {
      // Buscar primero en seguidos, luego en favoritos
      let anime = await db.following.get(n.animeId);
      if (!anime) {
        anime = await db.favorites.get(n.animeId);
      }
      if (anime) {
        hydrated.push({ ...n, title: anime.title, cover: anime.cover });
      }
    }
    return hydrated;
  },

  async markAllAsRead() {
    await db.notifications.where('isRead').equals(0).modify({ isRead: 1 });
  }
};

