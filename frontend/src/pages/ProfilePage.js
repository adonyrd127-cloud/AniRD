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
  }

  async render() {
    if (!this.user) {
      window.location.href = '/auth';
      return document.createElement('div');
    }

    // Cargar datos reales
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
            <!-- Sección de Ajustes -->
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
          ${this.renderSection('Siguiendo', this.followedAnimes)}
          ${this.renderSection('Tus Favoritos', this.favoriteAnimes)}
        </div>
      </div>
    `;

    return container;
  }

  renderSection(title, list) {
    if (list.length === 0) return '';
    return `
      <div class="library-section">
        <h2 class="section-title">${title}</h2>
        <div class="profile-anime-grid">
          ${list.map(anime => `
            <a href="/anime/${anime.animeId}" data-link class="profile-anime-card">
              <img src="${anime.cover}" alt="${anime.title}" loading="lazy">
              <div class="anime-info">
                <h3>${anime.title}</h3>
                ${anime.broadcast ? `<span class="broadcast-tag">${anime.broadcast.day || 'Emisión'}</span>` : ''}
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  async afterRender() {
    const audioSelect = document.getElementById('audio-pref');
    const themeSelect = document.getElementById('theme-pref');
    const syncBtn = document.getElementById('sync-now-btn');
    const logoutBtn = document.getElementById('logout-btn');

    audioSelect.addEventListener('change', async (e) => {
      await dbService.setSetting('audio_pref', e.target.value);
      alert('Preferencia de audio actualizada ✅');
    });

    themeSelect.addEventListener('change', async (e) => {
      await dbService.setSetting('theme', e.target.value);
      if (e.target.value === 'light') {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
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
        } catch (err) {
          alert('Error: ' + err.message);
        } finally {
          syncBtn.disabled = false;
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) authService.logout();
      });
    }
  }
}
