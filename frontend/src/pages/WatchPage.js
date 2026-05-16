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
      // 1. Obtener info global
      const infoRes = await apiService.getAnimeInfo(this.animeId);
      if (infoRes && infoRes.data) this.anime = infoRes.data;

      // 2. Búsqueda local con múltiples intentos (Nombre completo vs Primera palabra)
      const searchTerm = this.anime ? this.anime.title : this.animeId;
      let searchRes = await apiService.searchLocal(searchTerm);
      
      // Fallback: si no hay resultados, intentar con la primera palabra del título
      if ((!searchRes.success || searchRes.data.results.length === 0) && this.anime) {
        const firstWord = this.anime.title.split(' ')[0];
        console.log("Reintentando búsqueda con:", firstWord);
        searchRes = await apiService.searchLocal(firstWord);
      }

      if (searchRes.success && searchRes.data.results.length > 0) {
        // Encontrar la mejor coincidencia
        const localAnime = searchRes.data.results.find(a => 
          a.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) || searchRes.data.results[0];

        if (!this.anime) {
          this.anime = { title: localAnime.title, images: { jpg: { large_image_url: localAnime.thumbnail } }, genres: [], episodes: 0 };
        }

        const localDetails = await apiService.getAnimeInfo(localAnime.url);
        if (localDetails.success) {
          this.localInfo = localDetails.data;
          const epUrl = `${localAnime.url}-episodio-${this.episodeNum}`;
          const epRes = await apiService.getEpisode(epUrl);
          if (epRes.success) this.episodeData = epRes.data;
        }
      }
    } catch (e) { console.error("Error en WatchPage:", e); }

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    if (!this.anime) {
      container.innerHTML = `<div style="padding:150px 20px; text-align:center"><h2 style="font-family:'Outfit'">Anime no encontrado</h2><p style="color:var(--text-muted); margin:20px 0">No logramos localizar este título en el servidor.</p><a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al inicio</a></div>`;
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
          <div class="video-wrapper-v5">
            ${this.episodeData ? `<iframe src="${this.episodeData.servers[0].code}" allowfullscreen></iframe>` : `<div style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background:#111"><h3>Video no disponible</h3><p style="color:var(--text-muted); font-size:12px; margin-top:10px">El episodio aún no ha sido publicado.</p></div>`}
          </div>
          <div style="padding:0 10px; margin-bottom:30px">
            <h1 style="font-family:'Outfit'; font-size:1.5rem; font-weight:800; margin:0">${this.anime.title}</h1>
            <p style="color:var(--text-muted); font-size:13px; font-weight:600">Episodio ${this.episodeNum}</p>
          </div>
          <div class="watch-controls-v5">
            <div class="control-box-v5"><label style="font-size:10px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:10px">SERVIDOR</label><select id="server-select" class="select-v4">${this.episodeData ? this.episodeData.servers.map(s => `<option value="${s.code}">${s.title}</option>`).join('') : '<option>No disponible</option>'}</select></div>
            <div class="control-box-v5"><label style="font-size:10px; font-weight:800; color:var(--text-muted); display:block; margin-bottom:10px">IDIOMA</label><select id="lang-select" class="select-v4"><option value="sub" ${this.lang === 'sub' ? 'selected' : ''}>Subtitulado</option><option value="dub" ${this.lang === 'dub' ? 'selected' : ''}>Latino (Doblaje)</option></select></div>
          </div>
        </main>
        <aside class="ep-sidebar-v5">
          <div class="sidebar-header-v5"><h3 style="font-size:15px; font-weight:800">Episodios</h3></div>
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

    if (serverSelect && iframe) {
      serverSelect.addEventListener('change', (e) => iframe.src = e.target.value);
    }

    if (this.localInfo && this.localInfo.episodes) {
      const thumb = this.anime.images?.jpg?.large_image_url || '';
      epList.innerHTML = this.localInfo.episodes.map(ep => `
        <a href="/watch/${this.animeId}/${ep.number}/${this.lang}" data-link class="ep-item-v5 ${ep.number === this.episodeNum ? 'active' : ''}">
          <div style="width:100px; aspect-ratio:16/9; border-radius:10px; overflow:hidden; flex-shrink:0"><img src="${thumb}" style="width:100%; height:100%; object-fit:cover"></div>
          <div style="display:flex; align-items:center"><span>Episodio ${ep.number}</span></div>
        </a>
      `).join('');
    } else {
      epList.innerHTML = '<p style="padding:20px; color:var(--text-muted); font-size:12px">No hay más episodios publicados.</p>';
    }

    document.getElementById('lang-select').addEventListener('change', (e) => {
      window.location.href = `/watch/${this.animeId}/${this.episodeNum}/${e.target.value}`;
    });

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
