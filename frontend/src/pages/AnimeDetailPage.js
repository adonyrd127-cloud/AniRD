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
      const isFollowing = await dbService.isFollowing(this.id);

      this.container.innerHTML = `
        <style>
          .detail-hero {
            position: relative;
            min-height: 50vh;
            display: flex;
            align-items: flex-end;
            padding: 40px 4%;
            overflow: hidden;
          }
          .hero-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center 20%;
            z-index: -1;
          }
          .hero-bg::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, var(--bg-primary) 0%, rgba(10,10,15,0.4) 100%);
          }
          .detail-content {
            display: flex;
            gap: 24px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
            z-index: 1;
          }
          .poster {
            width: 150px;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            flex-shrink: 0;
          }
          .info {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
          }
          .info h1 {
            font-size: 2.5rem;
            line-height: 1.1;
            margin-bottom: 12px;
          }
          .badge-row {
            display: flex;
            gap: 8px;
            margin-bottom: 15px;
          }
          .badge-item {
            background: #1abc9c;
            color: white;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
          }
          .badge-item.type { background: #3498db; }
          .badge-item.status { background: #e67e22; }

          .synopsis {
            font-size: 0.95rem;
            color: var(--text-secondary);
            line-height: 1.5;
            max-width: 600px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-bottom: 20px;
          }
          .actions {
            display: flex;
            gap: 12px;
            width: 100%;
          }
          .btn-play {
             background: white;
             color: black;
             padding: 12px 24px;
             border-radius: 8px;
             font-weight: 800;
             display: flex;
             align-items: center;
             gap: 10px;
             flex-grow: 1;
             justify-content: center;
             text-transform: uppercase;
             font-size: 0.9rem;
          }
          .btn-icon {
             width: 48px;
             height: 48px;
             background: rgba(255,255,255,0.1);
             border-radius: 8px;
             display: flex;
             align-items: center;
             justify-content: center;
             color: white;
             font-size: 1.2rem;
          }

          @media (max-width: 768px) {
            .detail-hero {
                padding-bottom: 20px;
            }
            .info h1 {
                font-size: 1.8rem;
            }
            .synopsis {
                display: none; /* Como en la captura de ANIMEX */
            }
            .poster {
                width: 120px;
            }
          }
        </style>
        <div class="detail-hero">
          <div class="hero-bg" style="background-image: url('${anime.images?.jpg?.large_image_url}')"></div>
          <div class="detail-content">
            <img src="${anime.images?.jpg?.large_image_url}" class="poster" alt="${anime.title}" />
            <div class="info">
              <div class="badge-row">
                <span class="badge-item">${anime.episodes || '?'} EP</span>
                <span class="badge-item type">${anime.type}</span>
                <span class="badge-item status">${anime.status === 'Currently Airing' ? 'RELEASING' : 'FINISHED'}</span>
              </div>
              <h1>${anime.title}</h1>
              <p class="synopsis">${anime.synopsis}</p>
              <div class="actions">
                <a href="/watch/${this.id}/1" data-link class="btn-play">▶ Ver Ahora</a>
                <button id="toggle-fav" class="btn-icon ${isFav ? 'active' : ''}" title="Favoritos">
                  ${isFav ? '❤️' : '🤍'}
                </button>
                <button id="toggle-follow" class="btn-icon ${isFollowing ? 'active' : ''}" title="Seguir">
                  ${isFollowing ? '🔔' : '🔕'}
                </button>
                <button id="share-btn" class="btn-icon">🔗</button>
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
            color: var(--text-primary);
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }
          .tab-btn.active {
            background: var(--accent);
            color: white;
          }
        </style>
      `;

      // Favorite toggle
      const favBtn = document.getElementById('toggle-fav');
      favBtn.onclick = async () => {
        const added = await dbService.toggleFavorite(anime);
        favBtn.classList.toggle('active', added);
        favBtn.innerHTML = added ? '❤️' : '🤍';
      };

      // Follow toggle
      const followBtn = document.getElementById('toggle-follow');
      followBtn.onclick = async () => {
        const added = await dbService.toggleFollowing(anime);
        followBtn.classList.toggle('active', added);
        followBtn.innerHTML = added ? '🔔' : '🔕';
      };

      // Fetch episodes from Local API based on user preference
      const preferredLang = await dbService.getSetting('lang', 'SUB');
      const initialLang = preferredLang === 'DUB' ? 'latino' : 'sub';
      this.loadEpisodes(anime, initialLang);
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
                  <div style="font-size:0.9rem; font-weight:600; color:var(--text-primary); display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${entry.name}</div>
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
          <a href="/watch/${this.id}/${ep.number}" data-link style="text-decoration:none; color:var(--text-primary);">
            <div style="aspect-ratio:16/9; background:var(--bg-tertiary); display:flex; align-items:center; justify-content:center; position:relative;">
               <img src="${posterImg}" style="width:100%; height:100%; object-fit:cover; opacity:0.6;">
               <span style="position:absolute; background:var(--accent); color:white; padding:4px 10px; border-radius:5px; font-weight:700; bottom:10px; left:10px;">EP ${ep.number}</span>
               <div style="position:absolute; font-size:24px; color:white; text-shadow:0 2px 10px rgba(0,0,0,0.5);">▶</div>
            </div>
            <div style="padding:12px;">
              <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:var(--text-primary);">${ep.title || `Episodio ${ep.number}`}</div>
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
