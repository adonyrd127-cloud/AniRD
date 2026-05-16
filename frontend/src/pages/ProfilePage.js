import { authService } from '../services/auth.service.js';
import { dbService, db } from '../services/db.js';
import '../components/AnimeCard.js';

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
    container.className = 'page-container';
    
    container.innerHTML = `
      <style>
        .profile-layout { display: grid; grid-template-columns: 350px 1fr; gap: 40px; padding: 40px 5%; }
        
        .user-card-v4 {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border-radius: 30px;
          padding: 40px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 100px;
        }

        .user-avatar-v4 {
          width: 80px; height: 80px;
          background: var(--accent);
          border-radius: 25px;
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: 900; color: white;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px var(--accent-glow);
        }

        .user-name-v4 { font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; margin-bottom: 5px; }
        .user-status-v4 { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }

        .stats-grid-v4 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 30px 0; }
        .stat-box-v4 { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 18px; text-align: center; }
        .stat-val-v4 { display: block; font-size: 18px; font-weight: 900; color: white; }
        .stat-lab-v4 { font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }

        .settings-item-v4 { margin-bottom: 20px; }
        .settings-item-v4 label { display: block; font-size: 11px; font-weight: 800; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; }
        .select-v4 {
          width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          color: white; padding: 12px; border-radius: 12px; font-size: 13px; font-weight: 600; outline: none;
        }

        .profile-list-v4 { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .profile-list-v4::-webkit-scrollbar { display: none; }
        .section-title-v4 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; margin: 40px 0 20px; border-left: 4px solid var(--accent); padding-left: 15px; }

        @media (max-width: 1000px) {
          .profile-layout { grid-template-columns: 1fr; }
          .user-card-v4 { position: static; }
        }
      </style>

      <div class="profile-layout">
        <aside class="user-card-v4 page-enter">
          <div class="user-avatar-v4">${this.user.username.charAt(0).toUpperCase()}</div>
          <h1 class="user-name-v4">${this.user.username}</h1>
          <p class="user-status-v4">Cuenta Sincronizada ☁️</p>

          <div class="stats-grid-v4">
            <div class="stat-box-v4"><span class="stat-val-v4">${this.stats.favorites}</span><span class="stat-lab-v4">FAVS</span></div>
            <div class="stat-box-v4"><span class="stat-val-v4">${this.stats.following}</span><span class="stat-lab-v4">LISTA</span></div>
            <div class="stat-box-v4"><span class="stat-val-v4">${this.stats.history}</span><span class="stat-lab-v4">EPIS</span></div>
          </div>

          <div class="settings-v4">
            <div class="settings-item-v4">
              <label>Preferencia de Audio</label>
              <select id="audio-pref" class="select-v4">
                <option value="sub" ${this.settings.audio === 'sub' ? 'selected' : ''}>Subtitulado</option>
                <option value="dub" ${this.settings.audio === 'dub' ? 'selected' : ''}>Latino (Doblaje)</option>
              </select>
            </div>
            <div class="settings-item-v4">
              <label>Tema de Interfaz</label>
              <select id="theme-pref" class="select-v4">
                <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Modo Oscuro</option>
                <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Modo Claro</option>
              </select>
            </div>
          </div>

          <button id="sync-btn" class="btn-v4-secondary" style="width:100%; margin-top:10px">Sincronizar Cloud</button>
          <button id="logout-btn" class="btn-v4-secondary" style="width:100%; margin-top:10px; background:rgba(255,0,0,0.1); color:#ff4444; border-color:rgba(255,0,0,0.1)">Cerrar Sesión</button>
        </aside>

        <main class="page-enter" style="animation-delay: 0.1s">
          <h2 class="section-title-v4">SIGUIENDO</h2>
          <div class="profile-list-v4" id="following-grid"></div>

          <h2 class="section-title-v4">MIS FAVORITOS</h2>
          <div class="profile-list-v4" id="favorites-grid"></div>
        </main>
      </div>
    `;

    return container;
  }

  async afterRender() {
    const followingGrid = document.getElementById('following-grid');
    const favoritesGrid = document.getElementById('favorites-grid');

    // Cargar Siguiendo
    if (this.followedAnimes.length > 0) {
      this.followedAnimes.forEach(anime => {
        const card = document.createElement('anime-card');
        card.data = { mal_id: anime.animeId, title: anime.title, images: { jpg: { large_image_url: anime.cover } } };
        followingGrid.appendChild(card);
      });
    } else { followingGrid.innerHTML = '<p style="color:var(--text-muted); font-size:12px">No estás siguiendo ningún anime aún.</p>'; }

    // Cargar Favoritos
    if (this.favoriteAnimes.length > 0) {
      this.favoriteAnimes.forEach(anime => {
        const card = document.createElement('anime-card');
        card.data = { mal_id: anime.animeId, title: anime.title, images: { jpg: { large_image_url: anime.cover } } };
        favoritesGrid.appendChild(card);
      });
    } else { favoritesGrid.innerHTML = '<p style="color:var(--text-muted); font-size:12px">Tu lista de favoritos está vacía.</p>'; }

    // Eventos
    document.getElementById('audio-pref').addEventListener('change', async (e) => {
      await dbService.setSetting('audio_pref', e.target.value);
    });

    document.getElementById('theme-pref').addEventListener('change', async (e) => {
      const theme = e.target.value;
      await dbService.setSetting('theme', theme);
      document.body.classList.toggle('light-theme', theme === 'light');
    });

    document.getElementById('sync-btn').addEventListener('click', async (e) => {
      e.target.textContent = 'Sincronizando...';
      const localData = await dbService.getAllData();
      await authService.syncWithServer(localData);
      window.location.reload();
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      if(confirm('¿Deseas cerrar sesión?')) authService.logout();
    });
  }
}
