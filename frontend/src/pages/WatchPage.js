import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';

export default class WatchPage {
  constructor(params) {
    this.params = params;
    this.animeId = params.id;
    this.episodeNum = parseInt(params.ep) || 1;
    this.lang = params.lang || 'sub';
    this.anime = null;
    this.localInfo = null;
    this.episodeData = null;
  }

  async render() {
    try {
      console.log("Iniciando carga de WatchPage para ID:", this.animeId, "Episodio:", this.episodeNum);
      
      // 1. Obtener info básica (Priorizar cache)
      const infoRes = await apiService.getAnimeInfo(this.animeId);
      if (infoRes && infoRes.data) {
        this.anime = infoRes.data;
      }

      // Obtener el título de la URL como garantía total
      const urlParams = new URLSearchParams(window.location.search);
      const titleHint = urlParams.get('title');
      const finalSearchTitle = this.anime ? this.anime.title : titleHint;

      if (!finalSearchTitle) {
        console.error("No hay título para buscar el anime localmente");
      } else {
        // 2. Buscar en servidor local (usar el título que ya funcionó)
        const searchRes = await apiService.searchLocal(finalSearchTitle);
        if (searchRes.success && searchRes.data.results.length > 0) {
          // Buscamos el que mejor coincida o el primero
          const localAnime = searchRes.data.results.find(a => 
            a.title.toLowerCase().includes(finalSearchTitle.toLowerCase())
          ) || searchRes.data.results[0];

          // Si no cargó Jikan, creamos un objeto base para que no rompa la UI
          if (!this.anime) {
            this.anime = { 
              title: localAnime.title, 
              images: { jpg: { large_image_url: localAnime.thumbnail } },
              genres: [], synopsis: "Cargado desde servidor local."
            };
          }

          // 3. Cargar detalles locales (Episodios)
          const localDetails = await apiService.getAnimeInfo(localAnime.url);
          if (localDetails.success) {
            this.localInfo = localDetails.data;
            // 4. Intentar cargar servidores del episodio
            // El backend espera la URL base del anime + "-episodio-" + número
            const epUrl = `${localAnime.url}-episodio-${this.episodeNum}`;
            console.log("Solicitando servidores para:", epUrl);
            const epRes = await apiService.getEpisode(epUrl);
            if (epRes.success && epRes.data) {
              this.episodeData = epRes.data;
              // El API v2 devuelve los servidores agrupados por idioma (sub / dub)
              const serverList = this.episodeData.servers[this.lang] || this.episodeData.servers.sub || [];
              this.episodeData.activeServers = serverList;
            } else {
              console.warn("No se encontraron servidores para este episodio");
            }
          }
        }
      }
    } catch (e) {
      console.error("Error crítico en WatchPage:", e);
    }

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    // Si no hay anime después de todos los intentos, mostrar error
    if (!this.anime) {
      container.innerHTML = `
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no encontrado</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con el servidor de video para "${this.params.id}".</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al inicio</a>
        </div>
      `;
      return container;
    }

    container.innerHTML = `
      <style>
        .watch-layout-v5 { display: grid; grid-template-columns: 1fr 350px; gap: 20px; padding: 100px 2% 40px; max-width: 1800px; margin: 0 auto; }
        .video-wrapper-v5 { aspect-ratio: 16/9; background: #000; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .video-wrapper-v5 iframe { width: 100%; height: 100%; border: none; }
        .ep-sidebar-v5 { background: rgba(255,255,255,0.03); border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); height: calc(100vh - 140px); position: sticky; top: 100px; display: flex; flex-direction: column; overflow: hidden; }
        .sidebar-header-v5 { padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .ep-list-v5 { flex: 1; overflow-y: auto; padding: 10px; }
        .ep-item-v5 { display: flex; gap: 15px; padding: 10px; border-radius: 15px; text-decoration: none; color: white; margin-bottom: 5px; transition: 0.3s; }
        .ep-item-v5.active { background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); }
        .watch-controls-v5 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; }
        .control-box-v5 { background: rgba(255,255,255,0.03); padding: 25px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); }
        @media (max-width: 1100px) { .watch-layout-v5 { grid-template-columns: 1fr; } .ep-sidebar-v5 { height: 400px; position: static; } }
      </style>

      <div class="watch-layout-v5">
        <main>
          <div class="video-wrapper-v5" id="video-container">
            ${this.episodeData && this.episodeData.activeServers && this.episodeData.activeServers.length > 0 ? `<iframe src="${this.episodeData.activeServers[0].url}" allowfullscreen></iframe>` : `<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111"><h3 style="margin-bottom:10px">Video no disponible</h3><p style="color:var(--text-muted); font-size:12px">El episodio ${this.episodeNum} aún no tiene enlaces de reproducción.</p></div>`}
          </div>
          
          <div style="padding:0 10px; margin-bottom:30px">
            <h1 style="font-family:'Outfit'; font-size:1.5rem; font-weight:800; margin:0">${this.anime.title}</h1>
            <p style="color:var(--text-muted); font-size:13px; font-weight:600">Episodio ${this.episodeNum} • ${this.lang.toUpperCase()}</p>
          </div>

          <div class="watch-controls-v5">
            <div class="control-box-v5">
              <label style="font-size:10px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:10px">SERVIDOR</label>
              <select id="server-select" class="select-v4">
                ${this.episodeData && this.episodeData.activeServers && this.episodeData.activeServers.length > 0 ? this.episodeData.activeServers.map(s => `<option value="${s.url}">${s.server}</option>`).join('') : '<option>Sin servidores</option>'}
              </select>
            </div>
            <div class="control-box-v5">
              <label style="font-size:10px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:10px">IDIOMA</label>
              <select id="lang-select" class="select-v4">
                <option value="sub" ${this.lang === 'sub' ? 'selected' : ''}>Subtitulado</option>
                <option value="dub" ${this.lang === 'dub' ? 'selected' : ''}>Latino (Doblaje)</option>
              </select>
            </div>
          </div>
        </main>

        <aside class="ep-sidebar-v5">
          <div class="sidebar-header-v5"><h3 style="font-size:15px; font-weight:800">Episodios Disponibles</h3></div>
          <div class="ep-list-v5" id="sidebar-ep-list"></div>
        </aside>
      </div>
    `;

    return container;
  }

  async afterRender() {
    const serverSelect = document.getElementById('server-select');
    const epList = document.getElementById('sidebar-ep-list');
    const iframe = document.querySelector('iframe');
    const langSelect = document.getElementById('lang-select');

    if (serverSelect && iframe) {
      serverSelect.addEventListener('change', (e) => {
        iframe.src = e.target.value;
      });
    }

    if (this.localInfo && this.localInfo.episodes) {
      const thumb = this.anime.images?.jpg?.large_image_url || '';
      const titleParam = `?title=${encodeURIComponent(this.anime.title)}`;
      epList.innerHTML = this.localInfo.episodes.map(ep => `
        <a href="/watch/${this.animeId}/${ep.number}/${this.lang}${titleParam}" data-link class="ep-item-v5 ${ep.number === this.episodeNum ? 'active' : ''}">
          <div style="width:100px; aspect-ratio:16/9; border-radius:10px; overflow:hidden; flex-shrink:0"><img src="${thumb}" style="width:100%; height:100%; object-fit:cover"></div>
          <div style="display:flex; align-items:center; overflow:hidden">
            <span style="font-size:12px; font-weight:800; white-space:nowrap">Episodio ${ep.number}</span>
          </div>
        </a>
      `).join('');
    }

    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        window.location.href = `/watch/${this.animeId}/${this.episodeNum}/${e.target.value}?title=${encodeURIComponent(this.anime.title)}`;
      });
    }

    if (this.anime) {
      await dbService.saveToHistory({
        animeId: this.animeId,
        episodeId: this.episodeNum,
        title: this.anime.title,
        thumbnail: this.anime.images?.jpg?.large_image_url || '',
        timestamp: Date.now()
      });
    }
  }
}
