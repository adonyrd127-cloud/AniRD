import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';

export default class WatchPage {
  constructor(params) {
    this.params = params;
    this.animeId = params.id;
    this.episodeNum = parseInt(params.ep);
    this.lang = params.lang || 'sub';
    this.anime = null;
    this.localInfo = null;
    this.episodeData = null;
  }

  async render() {
    try {
      // 1. Obtener info global
      const infoRes = await apiService.getAnimeInfo(this.animeId);
      this.anime = infoRes.data;

      // 2. Buscar en servidor local para obtener la URL de streaming
      const searchRes = await apiService.searchLocal(this.anime.title);
      if (searchRes.success && searchRes.data.results.length > 0) {
        const localAnime = searchRes.data.results[0];
        const localDetails = await apiService.getAnimeInfo(localAnime.url);
        if (localDetails.success) {
          this.localInfo = localDetails.data;
          // 3. Obtener servidores del episodio específico
          const epUrl = `${localAnime.url}-episodio-${this.episodeNum}`;
          const epRes = await apiService.getEpisode(epUrl);
          if (epRes.success) this.episodeData = epRes.data;
        }
      }
    } catch (e) { 
      console.error("Error crítico al cargar WatchPage", e);
      // No lanzamos error para que el HTML se renderice y muestre un mensaje amigable
    }

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    if (!this.anime) {
      container.innerHTML = '<div style="padding:100px; text-align:center"><h2>Error al cargar el anime</h2><a href="/" data-link>Volver al inicio</a></div>';
      return container;
    }

    container.innerHTML = `
      <style>
        .watch-layout-v5 { display: grid; grid-template-columns: 1fr 350px; gap: 20px; padding: 100px 2% 40px; max-width: 1800px; margin: 0 auto; }
        .player-main-v5 { width: 100%; }
        .video-wrapper-v5 { aspect-ratio: 16/9; background: #000; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .video-wrapper-v5 iframe { width: 100%; height: 100%; border: none; }
        .player-meta-v5 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
        .player-title-v5 h1 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; margin: 0; }
        .player-title-v5 p { color: var(--text-muted); font-size: 13px; }
        .ep-sidebar-v5 { background: rgba(255,255,255,0.03); border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); height: calc(100vh - 140px); position: sticky; top: 100px; display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-header-v5 { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .ep-list-v5 { flex: 1; overflow-y: auto; padding: 10px; scrollbar-width: thin; }
        .ep-item-v5 { display: flex; gap: 15px; padding: 10px; border-radius: 15px; text-decoration: none; color: white; transition: all 0.3s; margin-bottom: 5px; }
        .ep-item-v5.active { background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); }
        .ep-item-thumb { width: 100px; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; flex-shrink: 0; }
        .ep-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .watch-controls-v5 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .control-box-v5 { background: rgba(255,255,255,0.03); padding: 25px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); }
        @media (max-width: 1100px) { .watch-layout-v5 { grid-template-columns: 1fr; } .ep-sidebar-v5 { height: 400px; position: static; } }
      </style>

      <div class="watch-layout-v5">
        <main class="player-main-v5">
          <div class="video-wrapper-v5">
            <iframe id="main-player" src="" allowfullscreen></iframe>
          </div>

          <div class="player-meta-v5">
            <div class="player-title-v5">
              <h1>${this.anime.title}</h1>
              <p>Episodio ${this.episodeNum}</p>
            </div>
            <div class="player-actions-v5">
              <button class="btn-v4-secondary">⬇ DESCARGAR</button>
            </div>
          </div>

          <div class="watch-controls-v5">
            <div class="control-box-v5">
              <label style="font-size:10px; font-weight:800; color:var(--text-muted); margin-bottom:10px; display:block">SERVIDOR</label>
              <select id="server-select" class="select-v4"></select>
            </div>
            <div class="control-box-v5">
              <label style="font-size:10px; font-weight:800; color:var(--text-muted); margin-bottom:10px; display:block">IDIOMA</label>
              <select id="lang-select" class="select-v4">
                <option value="sub" ${this.lang === 'sub' ? 'selected' : ''}>Subtitulado</option>
                <option value="dub" ${this.lang === 'dub' ? 'selected' : ''}>Latino (Doblaje)</option>
              </select>
            </div>
          </div>
        </main>

        <aside class="ep-sidebar-v5">
          <div class="sidebar-header-v5"><h3>Episodios</h3></div>
          <div class="ep-list-v5" id="sidebar-ep-list"></div>
        </aside>
      </div>
    `;

    return container;
  }

  async afterRender() {
    const player = document.getElementById('main-player');
    const serverSelect = document.getElementById('server-select');
    const epList = document.getElementById('sidebar-ep-list');
    const langSelect = document.getElementById('lang-select');

    if (this.episodeData && this.episodeData.servers) {
      serverSelect.innerHTML = this.episodeData.servers.map(s => `<option value="${s.code}">${s.title}</option>`).join('');
      player.src = this.episodeData.servers[0].code;
      serverSelect.addEventListener('change', (e) => player.src = e.target.value);
    } else {
      serverSelect.innerHTML = '<option>No disponible</option>';
      player.src = 'about:blank';
    }

    // Lista de episodios lateral (Solo publicados)
    const thumb = this.anime.images.jpg.large_image_url;
    if (this.localInfo && this.localInfo.episodes) {
      epList.innerHTML = this.localInfo.episodes.map(ep => `
        <a href="/watch/${this.animeId}/${ep.number}/${this.lang}" data-link class="ep-item-v5 ${ep.number === this.episodeNum ? 'active' : ''}">
          <div class="ep-item-thumb"><img src="${thumb}" loading="lazy"></div>
          <div class="ep-item-info"><span>Episodio ${ep.number}</span></div>
        </a>
      `).join('');
    } else {
      epList.innerHTML = '<p style="padding:20px; color:var(--text-muted)">Cargando lista...</p>';
    }

    langSelect.addEventListener('change', (e) => {
      window.location.href = `/watch/${this.animeId}/${this.episodeNum}/${e.target.value}`;
    });

    await dbService.saveToHistory({
      animeId: this.animeId,
      episodeId: this.episodeNum,
      title: this.anime.title,
      thumbnail: thumb,
      timestamp: Date.now()
    });
  }
}
