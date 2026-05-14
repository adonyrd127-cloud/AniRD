import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';

export default class WatchPage {
  constructor(params) {
    this.animeId = params.animeId;
    this.episodeId = parseInt(params.episodeId);
    this.currentLinks = [];
  }

  async render() {
    this.container = document.createElement('div');
    this.container.innerHTML = `
      <style>
        .watch-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 4%;
        }
        .player-wrapper {
          aspect-ratio: 16/9;
          background: #000;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          position: relative;
        }
        .player-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .server-selector {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        .server-btn {
          padding: 8px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .server-btn.active {
          background: var(--accent);
          color: black;
          font-weight: 600;
        }
        .player-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 20px;
        }
        .back-btn {
          color: var(--text-secondary);
          display: inline-block;
          margin-bottom: 20px;
          text-decoration: none;
        }
        .ep-nav {
          display: flex;
          gap: 10px;
        }
        .btn-nav {
          padding: 10px 20px;
          background: var(--surface);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .btn-nav:hover {
          background: var(--surface-hover);
        }
      </style>
      <div class="watch-container">
        <a href="/anime/${this.animeId}" data-link class="back-btn">← Volver al anime</a>
        <div id="player-area" class="player-wrapper">
           <div class="loader">Cargando episodio...</div>
        </div>
        
        <div class="player-info">
          <div>
            <h2 id="ep-title">Episodio ${this.episodeId}</h2>
            <div class="server-selector" id="server-list"></div>
          </div>
          <div class="ep-nav">
             <a href="/watch/${this.animeId}/${this.episodeId - 1}" data-link class="btn-nav" id="prev-ep" style="${this.episodeId <= 1 ? 'display:none' : ''}">← Anterior</a>
             <a href="/watch/${this.animeId}/${this.episodeId + 1}" data-link class="btn-nav" id="next-ep">Siguiente →</a>
          </div>
        </div>
      </div>
    `;
    return this.container;
  }

  async afterRender() {
    try {
      // Guardar en historial
      dbService.addToHistory(this.animeId, this.episodeId, 0, 0);

      // 1. Obtener info del anime para encontrar el slug/url
      const animeRes = await apiService.getAnimeInfo(this.animeId);
      const anime = animeRes.data;
      
      // Intentar buscar el anime en el API local usando varios nombres
      const queries = [anime.title, anime.title_english, anime.title_japanese].filter(Boolean);
      let localAnime = null;
      for (const q of queries) {
        const searchRes = await apiService.getAnimeSearch(q);
        localAnime = searchRes.data?.results?.[0];
        if (localAnime) break;
      }

      if (!localAnime) {
        throw new Error("No se encontró el anime en los servidores de streaming.");
      }

      // Obtener el info completo del local para ver la lista de episodios
      const localInfo = await apiService.getAnimeInfo(localAnime.url);
      const episodes = localInfo.data.episodes;
      
      // Buscar el episodio correspondiente
      const episode = episodes.find(e => parseInt(e.number) === this.episodeId);
      
      if (!episode) {
        throw new Error("Episodio no disponible.");
      }

      // 2. Obtener los links del episodio
      const linksRes = await apiService.getEpisode(episode.url);
      const servers = linksRes.data.servers.sub || linksRes.data.servers.dub || [];

      if (servers.length === 0) {
        throw new Error("No se encontraron servidores para este episodio.");
      }

      this.currentLinks = servers;
      this.renderServers();
      this.playServer(0);

    } catch (e) {
      console.error(e);
      document.getElementById('player-area').innerHTML = `<p style="color:red; padding: 20px;">${e.message}</p>`;
    }
  }

  renderServers() {
    const list = document.getElementById('server-list');
    list.innerHTML = this.currentLinks.map((s, i) => `
      <button class="server-btn ${i === 0 ? 'active' : ''}" data-index="${i}">${s.server}</button>
    `).join('');

    list.querySelectorAll('.server-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        list.querySelectorAll('.server-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.playServer(parseInt(btn.dataset.index));
      });
    });
  }

  playServer(index) {
    const link = this.currentLinks[index];
    const playerArea = document.getElementById('player-area');
    playerArea.innerHTML = `<iframe src="${link.url}" allowfullscreen sandbox="allow-forms allow-scripts allow-same-origin"></iframe>`;
  }
}

