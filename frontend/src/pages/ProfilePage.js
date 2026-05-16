import { authService } from '../services/auth.service.js';
import { dbService, db } from '../services/db.js';

export default class ProfilePage {
  constructor(params) {
    this.params = params;
    this.user = authService.getUser();
    this.stats = { favorites: 0, following: 0, history: 0 };
    this.settings = { theme: 'dark', audio: 'sub' };
    this.followedAnimes = [];
    this.favoriteAnimes = [];
    this.intervals = [];
  }

  async render() {
    if (!this.user) {
      window.location.href = '/auth';
      return document.createElement('div');
    }

    this.followedAnimes = await db.following.toArray();
    this.favoriteAnimes = await db.favorites.toArray();
    this.settings.theme = await dbService.getSetting('theme', 'dark');
    this.settings.audio = await dbService.getSetting('audio_pref', 'sub');
    
    this.stats = {
      favorites: this.favoriteAnimes.length,
      following: this.followedAnimes.length,
      history: await db.history.count()
    };

    const container = document.createElement('div');
    container.className = 'profile-page-container';
    
    container.innerHTML = `
      <div class="profile-hero">
        <div class="profile-card page-enter">
          <div class="profile-header">
            <div class="user-avatar">
              ${this.user.username.charAt(0).toUpperCase()}
            </div>
            <div class="user-info">
              <h1>Hola, ${this.user.username}</h1>
              <p class="status-badge">Cuenta Activa & Sincronizada</p>
            </div>
          </div>

          <div class="profile-stats-grid">
            <div class="stat-item">
              <span class="stat-value">${this.stats.favorites}</span>
              <span class="stat-label">Favoritos</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.stats.following}</span>
              <span class="stat-label">Siguiendo</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.stats.history}</span>
              <span class="stat-label">Episodios</span>
            </div>
          </div>

          <div class="profile-actions">
            <div class="action-section">
              <h3>Ajustes de Usuario</h3>
              <div class="settings-group">
                <label>Preferencia de Audio</label>
                <select id="audio-pref" class="settings-select">
                  <option value="sub" ${this.settings.audio === 'sub' ? 'selected' : ''}>Subtitulado (Japonés)</option>
                  <option value="dub" ${this.settings.audio === 'dub' ? 'selected' : ''}>Latino (Doblaje)</option>
                </select>
              </div>
              <div class="settings-group">
                <label>Tema Visual</label>
                <select id="theme-pref" class="settings-select">
                  <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Modo Oscuro (Noche)</option>
                  <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Modo Claro (Día)</option>
                </select>
              </div>
            </div>

            <div class="action-section">
              <h3>Sincronización</h3>
              <p>Tus datos se guardan en tu Orange Pi.</p>
              <button id="sync-now-btn" class="btn-secondary" style="width: 100%; margin-bottom: 10px;">
                <span>🔄</span> Sincronizar Ahora
              </button>
              <button id="logout-btn" class="btn-danger" style="width: 100%;">
                <span>🚪</span> Cerrar Sesión
              </button>
            </div>
          </div>

          <div class="profile-credits">
            <p>Powered by <b>Jikan API</b>, <b>AniList</b> & <b>Anime1v</b></p>
          </div>
        </div>

        <div class="profile-library page-enter" style="animation-delay: 0.2s">
          <div class="library-section">
            <h2 class="section-title">Siguiendo</h2>
            <div class="profile-anime-grid">
              ${this.followedAnimes.map(anime => this.renderAnimeCard(anime, true)).join('')}
            </div>
          </div>
          
          <div class="library-section">
            <h2 class="section-title">Tus Favoritos</h2>
            <div class="profile-anime-grid">
              ${this.favoriteAnimes.map(anime => this.renderAnimeCard(anime, false)).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  renderAnimeCard(anime, showCountdown) {
    return `
      <a href="/anime/${anime.animeId}" data-link class="profile-anime-card">
        <img src="${anime.cover}" alt="${anime.title}" loading="lazy">
        ${showCountdown && anime.broadcast ? `
          <div class="countdown-overlay" data-day="${anime.broadcast.day || ''}" data-time="${anime.broadcast.time || ''}" data-tz="${anime.broadcast.timezone || 'Asia/Tokyo'}">
            <span class="countdown-label">Cargando estreno...</span>
          </div>
        ` : ''}
        <div class="anime-info">
          <h3>${anime.title}</h3>
          ${anime.broadcast ? `<span class="broadcast-tag">${anime.broadcast.day || 'Emisión'}</span>` : ''}
        </div>
      </a>
    `;
  }

  calculateTimeRemaining(day, time, timezone) {
    if (!day || !time) return null;

    const daysMap = { 
      'mondays': 1, 'tuesdays': 2, 'wednesdays': 3, 'thursdays': 4, 
      'fridays': 5, 'saturdays': 6, 'sundays': 0 
    };

    const now = new Date();
    const targetDay = daysMap[day.toLowerCase().trim()];
    if (targetDay === undefined) return null;

    // Convertir hora de emisión (ej: 17:00 JST) a fecha local
    let [hours, minutes] = time.split(':').map(Number);
    
    // Ajuste simple de JST a Local (Aproximado si no hay librería de TZ completa)
    // JST es UTC+9. AdonyRD suele estar en -4/-5. Diferencia ~13-14h.
    let target = new Date();
    target.setUTCHours(hours - 9, minutes, 0, 0); // Convertir a UTC primero

    // Mover al día correcto de la semana
    let diff = (targetDay - now.getUTCDay() + 7) % 7;
    if (diff === 0 && target < now) diff = 7;
    target.setUTCDate(now.getUTCDate() + diff);

    const ms = target - now;
    if (ms < 0) return '¡Estreno Hoy!';

    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
    const h = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (d > 0) return `Faltan ${d}d ${h}h`;
    return `Estreno en ${h}h ${m}m`;
  }

  async afterRender() {
    // 1. Limpiar intervalos previos
    this.intervals.forEach(clearInterval);
    this.intervals = [];

    // 2. Iniciar Relojes de Cuenta Regresiva
    const overlays = document.querySelectorAll('.countdown-overlay');
    const updateAll = () => {
      overlays.forEach(overlay => {
        const { day, time, tz } = overlay.dataset;
        const text = this.calculateTimeRemaining(day, time, tz);
        if (text) overlay.querySelector('span').textContent = text;
        else overlay.style.display = 'none';
      });
    };

    updateAll();
    const timerId = setInterval(updateAll, 60000); // Actualizar cada minuto
    this.intervals.push(timerId);

    // 3. Otros eventos (Audio, Tema, Sinc, Logout)
    const audioSelect = document.getElementById('audio-pref');
    const themeSelect = document.getElementById('theme-pref');
    const syncBtn = document.getElementById('sync-now-btn');
    const logoutBtn = document.getElementById('logout-btn');

    audioSelect.addEventListener('change', async (e) => {
      await dbService.setSetting('audio_pref', e.target.value);
    });

    themeSelect.addEventListener('change', async (e) => {
      const theme = e.target.value;
      await dbService.setSetting('theme', theme);
      document.body.classList.toggle('light-theme', theme === 'light');
    });

    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<span>⏳</span> Sincronizando...';
        try {
          const localData = await dbService.getAllData();
          await authService.syncWithServer(localData);
          alert('¡Sincronización completada! ✅');
          window.location.reload();
        } catch (err) { alert('Error: ' + err.message); }
        finally { syncBtn.disabled = false; }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) authService.logout();
      });
    }
  }
}
