import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';

export default class AnimeDetailPage {
  constructor(params) {
    this.id = params.id;
  }

  async render() {
    this.container = document.createElement('div');
    this.container.innerHTML = `<div style="padding: 50px; text-align: center; color: white;">Cargando detalles...</div>`;
    return this.container;
  }

  async afterRender() {
    try {
      const res = await apiService.getAnimeInfo(this.id);
      const anime = res.data;
      
      const isFav = await dbService.isFavorite(this.id);

      this.container.innerHTML = `
        <style>
          .detail-hero {
            position: relative;
            height: 400px;
            display: flex;
            align-items: flex-end;
            padding: 4%;
          }
          .hero-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            filter: blur(10px) brightness(0.3);
            z-index: -1;
          }
          .detail-content {
            display: flex;
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }
          .poster {
            width: 200px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-card);
          }
          .info h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
          }
          .meta {
            display: flex;
            gap: 15px;
            color: var(--text-secondary);
            margin-bottom: 20px;
          }
          .synopsis {
            line-height: 1.6;
            color: var(--text-secondary);
            max-width: 800px;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .btn-play {
             background: var(--accent);
             color: white;
             padding: 10px 24px;
             border-radius: var(--radius-sm);
             font-weight: 600;
             margin-top: 20px;
             display: inline-block;
             border: none;
             cursor: pointer;
          }
          .btn-fav.active {
             background: #ff4757 !important;
             color: white !important;
          }
        </style>
        <div class="detail-hero">
          <div class="hero-bg" style="background-image: url('${anime.images?.jpg?.large_image_url}')"></div>
          <div class="detail-content">
            <img src="${anime.images?.jpg?.large_image_url}" class="poster" alt="${anime.title}" />
            <div class="info">
              <h1>${anime.title}</h1>
              <div class="meta">
                <span>⭐ ${anime.score || 'N/A'}</span>
                <span>${anime.type}</span>
                <span>${anime.year || '-'}</span>
                <span>${anime.episodes || '?'} EPS</span>
              </div>
              <p class="synopsis">${anime.synopsis}</p>
              <div style="display:flex; gap:10px; margin-top:20px;">
                <a href="/watch/${this.id}/1" data-link class="btn-play">▶ Ver Episodio 1</a>
                <button id="add-fav" class="btn-play btn-fav ${isFav ? 'active' : ''}" style="background:var(--surface); color:white;">
                  ${isFav ? '❤️ En Favoritos' : '⭐ Añadir a Favoritos'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div style="max-width:1400px; margin: 40px auto; padding: 0 4%;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 style="font-family:var(--font-display);">Episodios</h2>
            <div id="language-tabs" style="display:flex; gap:10px;">
               <button class="tab-btn active" data-lang="sub">Subtitulado</button>
               <button class="tab-btn" data-lang="latino">Latino</button>
            </div>
          </div>
          <div id="episodes-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:20px;">
             <p style="color:var(--text-secondary);">Cargando lista de episodios...</p>
          </div>

          <div id="relations-section" style="margin-top:60px;">
            <h2 style="margin-bottom:20px; font-family:var(--font-display);">Temporadas y Relacionados</h2>
            <div id="relations-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:20px;">
               <p style="color:var(--text-secondary);">Buscando otras temporadas...</p>
            </div>
          </div>
        </div>
        <style>
          .tab-btn {
            background: var(--surface);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }
          .tab-btn.active {
            background: var(--accent);
            color: black;
          }
        </style>
      `;

      // Favorite toggle
      const favBtn = document.getElementById('add-fav');
      favBtn.onclick = async () => {
        const added = await dbService.toggleFavorite(anime);
        favBtn.classList.toggle('active', added);
        favBtn.innerHTML = added ? '❤️ En Favoritos' : '⭐ Añadir a Favoritos';
      };

      // Fetch episodes from Local API
      this.loadEpisodes(anime);
      this.loadRelations(this.id);

    } catch(e) {
        console.error(e);
        this.container.innerHTML = `<div style="padding: 50px; text-align: center; color: white;">
          <h2 style="color:red;">Jikan Error: 404</h2>
          <p>No se pudo cargar la información de este anime. Es posible que el ID sea incorrecto o el servidor esté caído.</p>
        </div>`;
    }
  }

  async loadRelations(id) {
    const grid = document.getElementById('relations-grid');
    try {
      const res = await apiService.getAnimeRelations(id);
      const relations = res.data || [];
      const relevant = relations.filter(r => ['Prequel', 'Sequel', 'Parent Story', 'Side Story'].includes(r.relation));
      
      if (relevant.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-secondary);">No se encontraron otras temporadas relacionadas.</p>';
        return;
      }

      grid.innerHTML = '';
      for (const rel of relevant) {
        for (const entry of rel.entry) {
           if (entry.type !== 'anime') continue;
           const item = document.createElement('a');
           item.href = `/anime/${entry.mal_id}`;
           item.setAttribute('data-link', '');
           item.style.textDecoration = 'none';
           item.innerHTML = `
             <div style="background:var(--surface); border-radius:8px; overflow:hidden;">
               <div style="padding:10px;">
                 <div style="font-size:0.8rem; color:var(--accent); margin-bottom:4px;">${rel.relation}</div>
                 <div style="font-size:0.9rem; font-weight:600; color:white; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${entry.name}</div>
               </div>
             </div>
           `;
           grid.appendChild(item);
        }
      }
    } catch (e) {
      grid.innerHTML = '';
    }
  }

  async loadEpisodes(anime, lang = 'sub') {
    const grid = document.getElementById('episodes-grid');
    const tabs = document.querySelectorAll('.tab-btn');
    
    // UI Feedback for tabs
    tabs.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.onclick = () => this.loadEpisodes(anime, btn.dataset.lang);
    });

    try {
      grid.innerHTML = '<p style="color:var(--text-secondary);">Buscando episodios...</p>';
      
      const baseTitle = anime.title;
      const searchQuery = lang === 'latino' ? `${baseTitle} Latino` : baseTitle;
      
      const queries = [searchQuery];
      if (lang === 'latino') {
          if (anime.title_english) queries.push(`${anime.title_english} Latino`);
      } else {
          if (anime.title_english) queries.push(anime.title_english);
          if (anime.title_japanese) queries.push(anime.title_japanese);
      }

      let localAnime = null;
      for (const q of queries) {
        const searchRes = await apiService.searchLocal(q);
        // El scraper devuelve { success: true, data: { results: [...] } }
        localAnime = searchRes.data?.results?.[0];
        if (localAnime) break;
      }

      if (!localAnime) {
        grid.innerHTML = `<p style="color:var(--text-secondary);">No se encontraron episodios en ${lang === 'sub' ? 'Japonés' : 'Latino'} para este título.</p>`;
        return;
      }

      const infoRes = await apiService.getAnimeInfo(localAnime.url);
      const episodes = infoRes.data.episodes || [];

      if (episodes.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-secondary);">No hay episodios disponibles.</p>';
        return;
      }

      // Use Jikan image as fallback if scraper image is missing or broken
      const posterImg = anime.images?.jpg?.large_image_url || infoRes.data.image;

      grid.innerHTML = episodes.map(ep => `
        <div class="ep-card" style="background:var(--surface); border-radius:10px; overflow:hidden; cursor:pointer; transition:transform 0.2s;">
          <a href="/watch/${this.id}/${ep.number}" data-link style="text-decoration:none; color:white;">
            <div style="aspect-ratio:16/9; background:#1a1a2e; display:flex; align-items:center; justify-content:center; position:relative;">
               <img src="${posterImg}" style="width:100%; height:100%; object-fit:cover; opacity:0.6;">
               <span style="position:absolute; background:var(--accent); color:black; padding:4px 10px; border-radius:5px; font-weight:700; bottom:10px; left:10px;">EP ${ep.number}</span>
               <div style="position:absolute; font-size:24px; color:white; text-shadow:0 2px 10px rgba(0,0,0,0.5);">▶</div>
            </div>
            <div style="padding:12px;">
              <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${ep.title || `Episodio ${ep.number}`}</div>
            </div>
          </a>
        </div>
      `).join('');

    } catch (e) {
      console.error(e);
      grid.innerHTML = '<p style="color:red;">Error al cargar episodios.</p>';
    }
  }
}
