import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';

export default class WatchPage {
  constructor(params) {
    this.params = params; // id, ep, lang
    this.animeId = params.id;
    this.episodeNum = parseInt(params.ep);
    this.lang = params.lang || 'sub';
    this.anime = null;
    this.episodeData = null;
  }

  async render() {
    this.anime = (await apiService.getAnimeInfo(this.animeId)).data;
    // Intentar obtener datos del episodio (servidores)
    try {
      this.episodeData = await apiService.getEpisode(`${this.anime.url}-episodio-${this.episodeNum}`);
    } catch (e) { console.error("Error al cargar servidores", e); }

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <style>
        .watch-layout-v5 { display: grid; grid-template-columns: 1fr 350px; gap: 20px; padding: 100px 2% 40px; max-width: 1800px; margin: 0 auto; }
        
        /* Video Player Area */
        .player-main-v5 { width: 100%; }
        .video-wrapper-v5 { aspect-ratio: 16/9; background: #000; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .video-wrapper-v5 iframe { width: 100%; height: 100%; border: none; }

        .player-meta-v5 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding: 0 10px; }
        .player-title-v5 h1 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; margin: 0; }
        .player-title-v5 p { color: var(--text-muted); font-size: 13px; font-weight: 600; }

        .player-actions-v5 { display: flex; gap: 10px; }

        /* Sidebar Episodes */
        .ep-sidebar-v5 { background: rgba(255,255,255,0.03); border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); height: calc(100vh - 140px); position: sticky; top: 100px; display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-header-v5 { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .sidebar-header-v5 h3 { font-size: 15px; font-weight: 800; margin: 0; }
        .ep-list-v5 { flex: 1; overflow-y: auto; padding: 10px; scrollbar-width: thin; }
        
        .ep-item-v5 { display: flex; gap: 15px; padding: 10px; border-radius: 15px; text-decoration: none; color: white; transition: all 0.3s; margin-bottom: 5px; }
        .ep-item-v5:hover { background: rgba(255,255,255,0.05); }
        .ep-item-v5.active { background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); }
        .ep-item-thumb { width: 120px; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; flex-shrink: 0; position: relative; }
        .ep-item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ep-item-info { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
        .ep-item-info span { font-size: 12px; font-weight: 800; }
        .ep-item-info p { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 4px; }

        /* Controls Section */
        .watch-controls-v5 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .control-box-v5 { background: rgba(255,255,255,0.03); padding: 30px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); }

        /* Info Section */
        .watch-details-v5 { display: grid; grid-template-columns: 180px 1fr; gap: 30px; margin-top: 40px; padding: 0 10px; }
        .watch-poster-v5 { border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
        .watch-poster-v5 img { width: 100%; height: 100%; object-fit: cover; }
        .watch-info-text h2 { font-family: 'Outfit'; font-size: 1.8rem; font-weight: 900; margin-bottom: 10px; }

        @media (max-width: 1100px) {
          .watch-layout-v5 { grid-template-columns: 1fr; }
          .ep-sidebar-v5 { height: 400px; position: static; }
        }
      </style>

      <div class="watch-layout-v5">
        <main class="player-main-v5">
          <div class="video-wrapper-v5">
            <iframe id="main-player" src="" allowfullscreen></iframe>
          </div>

          <div class="player-meta-v5">
            <div class="player-title-v5">
              <h1>${this.anime.title}</h1>
              <p>Estás viendo el Episodio ${this.episodeNum}</p>
            </div>
            <div class="player-actions-v5">
              <button class="btn-v4-secondary">⬇ DOWNLOAD</button>
              <button class="btn-v4-secondary">🚩 REPORT</button>
            </div>
          </div>

          <div class="watch-controls-v5">
            <div class="control-box-v5">
              <p style="font-size:11px; font-weight:800; color:var(--text-muted); margin-bottom:15px; text-transform:uppercase">Selección de Servidor</p>
              <select id="server-select" class="select-v4"></select>
            </div>
            <div class="control-box-v5">
              <p style="font-size:11px; font-weight:800; color:var(--text-muted); margin-bottom:15px; text-transform:uppercase">Idioma / Audio</p>
              <select id="lang-select" class="select-v4">
                <option value="sub" ${this.lang === 'sub' ? 'selected' : ''}>Subtitulado (Japonés)</option>
                <option value="dub" ${this.lang === 'dub' ? 'selected' : ''}>Doblaje (Latino)</option>
              </select>
            </div>
          </div>

          <div class="watch-details-v5">
            <div class="watch-poster-v5"><img src="${this.anime.images.jpg.large_image_url}"></div>
            <div class="watch-info-text">
              <div class="animex-badges">
                <span class="animex-badge" style="background:var(--accent)">${this.anime.type}</span>
                <span class="animex-badge">${this.anime.status === 'Currently Airing' ? 'EN EMISIÓN' : 'FINALIZADO'}</span>
              </div>
              <h2>${this.anime.title}</h2>
              <p style="color:var(--text-muted); font-size:14px; line-height:1.6">${this.anime.synopsis?.slice(0, 300)}...</p>
              <div class="animex-genres" style="margin-top:20px">
                 ${this.anime.genres.map(g => `<span class="genre-pill">${g.name}</span>`).join('')}
              </div>
            </div>
          </div>
        </main>

        <aside class="ep-sidebar-v5">
          <div class="sidebar-header-v5">
            <h3>Lista de Episodios</h3>
            <span style="font-size:10px; background:var(--accent); padding:4px 8px; border-radius:6px; font-weight:800">${this.anime.episodes || '?'} TOTAL</span>
          </div>
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

    // 1. Cargar Servidores
    if (this.episodeData && this.episodeData.data && this.episodeData.data.servers) {
      const servers = this.episodeData.data.servers;
      serverSelect.innerHTML = servers.map(s => `<option value="${s.code}">${s.title}</option>`).join('');
      player.src = servers[0].code;
      
      serverSelect.addEventListener('change', (e) => {
        player.src = e.target.value;
      });
    } else {
      serverSelect.innerHTML = '<option>No hay servidores disponibles</option>';
      player.src = 'about:blank';
    }

    // 2. Cargar Lista de Episodios en Sidebar
    const epCount = this.anime.episodes || 12;
    const thumb = this.anime.images.jpg.large_image_url;
    
    epList.innerHTML = Array.from({length: epCount}, (_, i) => i + 1).map(num => `
      <a href="/watch/${this.animeId}/${num}/${this.lang}" data-link class="ep-item-v5 ${num === this.episodeNum ? 'active' : ''}">
        <div class="ep-item-thumb"><img src="${thumb}" loading="lazy"></div>
        <div class="ep-item-info">
          <span>Episodio ${num}</span>
          <p>Ver el capítulo ${num} de ${this.anime.title}</p>
        </div>
      </a>
    `).join('');

    // 3. Cambio de Idioma
    langSelect.addEventListener('change', (e) => {
      window.location.href = `/watch/${this.animeId}/${this.episodeNum}/${e.target.value}`;
    });

    // Guardar en Historial
    await dbService.saveToHistory({
      animeId: this.animeId,
      episodeId: this.episodeNum,
      title: this.anime.title,
      thumbnail: thumb,
      timestamp: Date.now()
    });
  }
}
