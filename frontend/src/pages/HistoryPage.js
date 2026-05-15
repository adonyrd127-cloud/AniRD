import { dbService } from '../services/db.js';
import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class HistoryPage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .page-container {
          padding: 100px 4% 60px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .profile-section {
            margin-bottom: 60px;
        }
        .profile-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin-bottom: 30px;
          color: var(--text-primary);
          font-weight: 900;
          letter-spacing: -0.03em;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--glass-border);
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        .timer-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 10;
          border: 1px solid rgba(255,255,255,0.1);
          pointer-events: none;
        }
        .empty-state {
            padding: 40px;
            text-align: center;
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            color: var(--text-secondary);
            border: 1px border dashed rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
            .page-container { padding-top: 80px; }
            .profile-title { font-size: 1.8rem; }
            .anime-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        }
      </style>
      <div class="page-container">
        <div class="profile-section">
            <h2 class="profile-title">🕒 Mi Historial</h2>
            <div class="anime-grid" id="history-results-grid"></div>
        </div>

        <div class="profile-section">
            <h2 class="profile-title">⭐ Mis Favoritos</h2>
            <div class="anime-grid" id="favorites-results-grid"></div>
        </div>

        <div class="profile-section">
            <h2 class="profile-title">🔔 Siguiendo</h2>
            <div class="anime-grid" id="following-results-grid"></div>
        </div>

        <div class="profile-section">
            <h2 class="profile-title">⚙️ Ajustes</h2>
            <div class="settings-card">
                <style>
                    .settings-card {
                        background: var(--bg-secondary);
                        border-radius: var(--radius-lg);
                        padding: 30px;
                        border: 1px solid rgba(255,255,255,0.05);
                        display: grid;
                        gap: 25px;
                        max-width: 600px;
                    }
                    .setting-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .setting-info h4 {
                        margin: 0 0 5px 0;
                        color: var(--text-primary);
                    }
                    .setting-info p {
                        margin: 0;
                        font-size: 0.85rem;
                        color: var(--text-secondary);
                    }
                    .setting-control select, .setting-control input {
                        background: var(--bg-tertiary);
                        border: 1px solid var(--glass-border);
                        color: var(--text-primary);
                        padding: 8px 15px;
                        border-radius: 6px;
                        outline: none;
                        cursor: pointer;
                        font-family: inherit;
                    }
                    .setting-control select option {
                        background: var(--bg-tertiary);
                        color: var(--text-primary);
                    }
                </style>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Tema de la aplicación</h4>
                        <p>Cambia entre modo oscuro y claro.</p>
                    </div>
                    <div class="setting-control">
                        <select id="theme-select">
                            <option value="dark">Oscuro (Noche)</option>
                            <option value="light">Claro (Día)</option>
                        </select>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Idioma preferido</h4>
                        <p>Selección automática en el reproductor.</p>
                    </div>
                    <div class="setting-control">
                        <select id="lang-select">
                            <option value="SUB">Japonés (Subtitulado)</option>
                            <option value="DUB">Español Latino</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const historyGrid = document.getElementById('history-results-grid');
    const favoritesGrid = document.getElementById('favorites-results-grid');
    const themeSelect = document.getElementById('theme-select');
    const langSelect = document.getElementById('lang-select');

    // Load Settings
    const theme = await dbService.getSetting('theme', 'dark');
    const lang = await dbService.getSetting('lang', 'SUB');
    themeSelect.value = theme;
    langSelect.value = lang;

    themeSelect.addEventListener('change', async (e) => {
        const val = e.target.value;
        await dbService.setSetting('theme', val);
        if (val === 'light') document.body.classList.add('light-theme');
        else document.body.classList.remove('light-theme');
    });

    langSelect.addEventListener('change', async (e) => {
        await dbService.setSetting('lang', e.target.value);
    });

    // 1. Load History
    const history = await dbService.getContinueWatching();
    if (history.length === 0) {
      historyGrid.innerHTML = '<div class="empty-state">No tienes historial de reproducción aún.</div>';
    } else {
      historyGrid.innerHTML = '';
      for (const item of history) {
        try {
          const animeRes = await apiService.getAnimeInfo(item.animeId);
          const anime = animeRes.data;
          const card = document.createElement('anime-card');
          card.setAttribute('mode', 'thumbnail');
          card.data = { ...anime, currentEpisode: item.episodeId };
          historyGrid.appendChild(card);
        } catch (e) { console.error(e); }
      }
    }

    // 2. Load Favorites
    const favorites = await dbService.getFavorites();
    if (favorites.length === 0) {
      favoritesGrid.innerHTML = '<div class="empty-state">Aún no has guardado ningún anime en favoritos.</div>';
    } else {
      favoritesGrid.innerHTML = '';
      favorites.forEach(fav => {
        const card = document.createElement('anime-card');
        card.data = {
            mal_id: fav.animeId,
            title: fav.title,
            images: { jpg: { large_image_url: fav.cover } },
            type: fav.type,
            score: fav.score
        };
        favoritesGrid.appendChild(card);
      });
    }

    // 3. Load Following with Timers
    const followingGrid = document.getElementById('following-results-grid');
    const following = await dbService.getFollowing();
    if (following.length === 0) {
        followingGrid.innerHTML = '<div class="empty-state">No estás siguiendo ningún anime todavía.</div>';
    } else {
        followingGrid.innerHTML = '';
        following.forEach(item => {
            const cardContainer = document.createElement('div');
            cardContainer.style.position = 'relative';
            
            const card = document.createElement('anime-card');
            card.data = {
                mal_id: item.animeId,
                title: item.title,
                images: { jpg: { large_image_url: item.cover } }
            };

            const timerOverlay = document.createElement('div');
            timerOverlay.className = 'timer-overlay';
            timerOverlay.innerHTML = this.calculateCountdown(item.broadcast);
            
            cardContainer.appendChild(card);
            cardContainer.appendChild(timerOverlay);
            followingGrid.appendChild(cardContainer);
        });
    }
  }

  calculateCountdown(broadcast) {
    if (!broadcast || !broadcast.day || !broadcast.time) return '<span>Siguiente Ep: --:--</span>';
    
    try {
        const days = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
        const targetDay = days.indexOf(broadcast.day);
        const [hour, minute] = broadcast.time.split(':').map(Number);
        
        const now = new Date();
        // Convert current time to JST (Japan Standard Time, UTC+9)
        const jstOffset = 9 * 60; // minutes
        const localOffset = now.getTimezoneOffset(); // minutes (negative for UTC+)
        const nowJST = new Date(now.getTime() + (jstOffset + localOffset) * 60000);
        
        let diffDays = targetDay - nowJST.getDay();
        if (diffDays < 0) diffDays += 7;
        
        const targetDate = new Date(nowJST);
        targetDate.setDate(nowJST.getDate() + diffDays);
        targetDate.setHours(hour, minute, 0, 0);
        
        // If target time today is already passed
        if (diffDays === 0 && targetDate < nowJST) {
            targetDate.setDate(targetDate.getDate() + 7);
        }
        
        const diffMs = targetDate - nowJST;
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const remDays = Math.floor(totalHours / 24);
        const remHours = totalHours % 24;
        
        if (remDays > 0) {
            return `<span>⏳ ${remDays}d ${remHours}h</span>`;
        }
        return `<span>⏳ ${remHours}h</span>`;
    } catch(e) {
        return '<span>Pronto</span>';
    }
  }
}
