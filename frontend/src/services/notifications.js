import { db } from './db.js';

export const notificationService = {
  async checkNewEpisodes() {
    const followed = await db.following.toArray();
    let hasNew = false;
    
    for (const anime of followed) {
      if (anime.status === 'Currently Airing' && anime.broadcast && anime.broadcast.day && anime.broadcast.day !== 'Unknown') {
        const lastBroadcast = this.getLastBroadcast(anime.broadcast);
        
        // If lastBroadcast is valid and it happened AFTER our last notified timestamp
        if (lastBroadcast && (!anime.lastNotified || lastBroadcast > anime.lastNotified)) {
          // Verify we haven't already created a notification for this exact timestamp
          const existing = await db.notifications.where('animeId').equals(anime.animeId).and(n => n.timestamp === lastBroadcast).first();
          
          if (!existing) {
            await db.notifications.add({
              animeId: anime.animeId,
              isRead: 0,
              timestamp: lastBroadcast
            });
            hasNew = true;
          }
          
          await db.following.update(anime.animeId, { lastNotified: lastBroadcast });
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
    // Find the NEXT broadcast time
    if (dAdd < 0 || (dAdd === 0 && target <= tokyoNow)) dAdd += 7;
    target.setDate(target.getDate() + dAdd);
    
    // The LAST broadcast time is exactly 1 week before the next one
    const nextTarget = new Date(target);
    nextTarget.setDate(nextTarget.getDate() - 7);
    
    // Ignore if the last broadcast is in the future (should be impossible mathematically)
    if (nextTarget > tokyoNow) return null;

    // Convert back to real local ms
    const diffMs = nextTarget.getTime() - tokyoNow.getTime();
    return Date.now() + diffMs; 
  },

  async getUnreadCount() {
    return await db.notifications.where('isRead').equals(0).count();
  },

  async getNotifications() {
    const notifs = await db.notifications.orderBy('timestamp').reverse().toArray();
    // We need to hydrate them with anime data
    const hydrated = [];
    for (const n of notifs) {
      const anime = await db.following.get(n.animeId);
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
