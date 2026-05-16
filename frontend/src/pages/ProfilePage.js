import { authService } from '../services/auth.service.js';
import { dbService, db } from '../services/db.js';
import '../components/AnimeCard.js';

export default class ProfilePage {
  constructor(params) {
    this.params = params;
    this.user = authService.getUser();
    this.activeTab = 'list'; // 'list', 'favs', 'settings'
    this.followedAnimes = [];
    this.favoriteAnimes = [];
    this.stats = { favs: 0, list: 0, epis: 0 };
  }

  async render() {
    if (!this.user) {
      window.location.href = '/auth';
      return document.createElement('div');
    }

    this.followedAnimes = await db.following.toArray();
    this.favoriteAnimes = await db.favorites.toArray();
    this.stats = {
      favs: this.favoriteAnimes.length,
      list: this.followedAnimes.length,
      epis: await db.history.count()
    };

    const container = document.createElement('div');
    container.className = 'page-container';
    
    container.innerHTML = `
      <style>
        .profile-hero-v5 {
          height: 350px;
          position: relative;
          background: #0a0a0a;
          display: flex;
          align-items: flex-end;
          padding: 0 5% 40px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .profile-hero-v5::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #ff0000 0%, #330000 100%);
          opacity: 0.15;
          filter: blur(50px);
        }
        .user-meta-v5 {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 30px;
          width: 100%;
        }
        .avatar-v5 {
          width: 120px; height: 120px;
          background: var(--accent);
          border-radius: 35px;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px; font-weight: 900; color: white;
          box-shadow: 0 20px 40px rgba(255,0,0,0.3);
          border: 4px solid rgba(255,255,255,0.1);
        }
        .user-info-v5 h1 { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 900; margin: 0; }
        .user-info-v5 p { color: var(--text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }

        .stats-row-v5 { display: flex; gap: 20px; margin-left: auto; }
        .stat-chip-v5 {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          padding: 15px 25px;
          border-radius: 20px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .stat-chip-v5 b { display: block; font-size: 20px; color: white; }
        .stat-chip-v5 span { font-size: 10px; color: var(--text-muted); font-weight: 800; }

        .profile-tabs-v5 {
          display: flex;
          gap: 40px;
          padding: 0 5%;
          margin-top: -1px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(5,5,5,0.5);
          backdrop-filter: blur(20px);
        }
        .tab-btn-v5 {
          padding: 20px 0;
          background: none; border: none;
          color: var(--text-muted);
          font-weight: 800; font-size: 13px;
          cursor: pointer;
          position: relative;
          transition: color 0.3s;
        }
        .tab-btn-v5.active { color: white; }
        .tab-btn-v5.active::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; background: var(--accent); border-radius: 10px 10px 0 0;
        }

        .tab-content-v5 { padding: 40px 5% 100px; }
        .grid-v5 { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 30px; }

        .settings-card-v5 {
          max-width: 600px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 40px;
        }

        @media (max-width: 900px) {
          .profile-hero-v5 { height: auto; padding: 100px 5% 40px; }
          .user-meta-v5 { flex-direction: column; text-align: center; }
          .stats-row-v5 { margin: 20px auto 0; }
          .profile-tabs-v5 { gap: 20px; justify-content: center; }
        }
      </style>

      <div class="profile-hero-v5">
        <div class="user-meta-v5">
          <div class="avatar-v5">${this.user.username.charAt(0).toUpperCase()}</div>
          <div class="user-info-v5">
            <p>Panel de Usuario</p>
            <h1>${this.user.username}</h1>
          </div>
          <div class="stats-row-v5">
            <div class="stat-chip-v5"><b>${this.stats.list}</b><span>SIGUIENDO</span></div>
            <div class="stat-chip-v5"><b>${this.stats.favs}</b><span>FAVORITOS</span></div>
            <div class="stat-chip-v5"><b>${this.stats.epis}</b><span>EPISODIOS</span></div>
          </div>
        </div>
      </div>

      <nav class="profile-tabs-v5">
        <button class="tab-btn-v5 active" data-tab="list">MI LISTA</button>
        <button class="tab-btn-v5" data-tab="favs">FAVORITOS</button>
        <button class="tab-btn-v5" data-tab="settings">AJUSTES</button>
      </nav>

      <div class="tab-content-v5" id="profile-tab-content">
        <!-- Contenido dinámico -->
      </div>
    `;

    return container;
  }

  async afterRender() {
    const tabContent = document.getElementById('profile-tab-content');
    const tabs = document.querySelectorAll('.tab-btn-v5');

    const renderTab = async (tabName) => {
      this.activeTab = tabName;
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));

      if (tabName === 'list') {
        tabContent.innerHTML = `<div class="grid-v5" id="grid-follow"></div>`;
        const grid = document.getElementById('grid-follow');
        if (this.followedAnimes.length > 0) {
          this.followedAnimes.forEach(a => {
            const card = document.createElement('anime-card');
            card.data = { mal_id: a.animeId, title: a.title, images: { jpg: { large_image_url: a.cover } } };
            grid.appendChild(card);
          });
        } else { tabContent.innerHTML = '<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'; }
      }

      if (tabName === 'favs') {
        tabContent.innerHTML = `<div class="grid-v5" id="grid-favs"></div>`;
        const grid = document.getElementById('grid-favs');
        if (this.favoriteAnimes.length > 0) {
          this.favoriteAnimes.forEach(a => {
            const card = document.createElement('anime-card');
            card.data = { mal_id: a.animeId, title: a.title, images: { jpg: { large_image_url: a.cover } } };
            grid.appendChild(card);
          });
        } else { tabContent.innerHTML = '<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'; }
      }

      if (tabName === 'settings') {
        const theme = await dbService.getSetting('theme', 'dark');
        const audio = await dbService.getSetting('audio_pref', 'sub');
        tabContent.innerHTML = `
          <div class="settings-card-v5 page-enter">
            <h3 style="margin-bottom:30px; font-family:'Outfit'">Configuración Premium</h3>
            <div class="settings-item-v4">
              <label>Audio por defecto</label>
              <select id="audio-pref" class="select-v4">
                <option value="sub" ${audio === 'sub' ? 'selected' : ''}>Subtitulado (Japonés)</option>
                <option value="dub" ${audio === 'dub' ? 'selected' : ''}>Latino (Doblaje)</option>
              </select>
            </div>
            <div class="settings-item-v4">
              <label>Tema visual</label>
              <select id="theme-pref" class="select-v4">
                <option value="dark" ${theme === 'dark' ? 'selected' : ''}>Modo Oscuro</option>
                <option value="light" ${theme === 'light' ? 'selected' : ''}>Modo Claro</option>
              </select>
            </div>
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.05); margin:30px 0">
            <div style="display:flex; gap:15px">
              <button id="sync-btn" class="btn-v4-primary" style="flex:1">Sincronizar Datos</button>
              <button id="logout-btn" class="btn-v4-secondary" style="flex:1; background:rgba(255,0,0,0.1); color:#ff4444">Cerrar Sesión</button>
            </div>
          </div>
        `;

        // Eventos de ajustes
        document.getElementById('audio-pref').addEventListener('change', async (e) => await dbService.setSetting('audio_pref', e.target.value));
        document.getElementById('theme-pref').addEventListener('change', async (e) => {
          const t = e.target.value;
          await dbService.setSetting('theme', t);
          document.body.classList.toggle('light-theme', t === 'light');
        });
        document.getElementById('sync-btn').addEventListener('click', async (e) => {
          e.target.textContent = 'Procesando...';
          const localData = await dbService.getAllData();
          await authService.syncWithServer(localData);
          window.location.reload();
        });
        document.getElementById('logout-btn').addEventListener('click', () => authService.logout());
      }
    };

    // Click en pestañas
    tabs.forEach(tab => {
      tab.addEventListener('click', () => renderTab(tab.dataset.tab));
    });

    // Render inicial
    await renderTab('list');
  }
}
