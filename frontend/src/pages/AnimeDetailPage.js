import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';
import '../components/AnimeCard.js';

export default class AnimeDetailPage {
  constructor(params) {
    this.params = params;
    this.animeId = params.id;
    this.anime = null;
    this.isFavorite = false;
    this.isFollowing = false;
  }

  async render() {
    this.anime = (await apiService.getAnimeInfo(this.animeId)).data;
    this.isFavorite = await dbService.isFavorite(this.animeId);
    this.isFollowing = await dbService.isFollowing(this.animeId);
    const banner = await apiService.getAnilistBanner(this.animeId) || this.anime.images.jpg.large_image_url;

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <style>
        .animex-hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          padding: 100px 5% 60px;
          overflow: hidden;
          background: #050505;
        }
        .animex-banner {
          position: absolute;
          inset: 0;
          background: url('${banner}') center/cover no-repeat;
          filter: brightness(0.3) blur(5px);
          z-index: 0;
        }
        .animex-banner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #050505 10%, transparent 100%),
                      linear-gradient(to right, #050505 20%, transparent 80%);
        }

        .animex-content {
          position: relative;
          z-index: 10;
          display: flex;
          gap: 50px;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .animex-poster {
          width: 280px;
          flex-shrink: 0;
          border-radius: 25px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(0,0,0,0.8);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .animex-poster img { width: 100%; height: 100%; object-fit: cover; }

        .animex-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        
        .animex-badges { display: flex; gap: 10px; margin-bottom: 20px; }
        .animex-badge {
          background: rgba(255,255,255,0.1);
          color: white;
          padding: 6px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
        }

        .animex-title {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          color: white;
        }

        .animex-genres { display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap; }
        .genre-pill {
          background: rgba(255,255,255,0.05);
          padding: 6px 18px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .animex-synopsis {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255,255,255,0.7);
          margin-bottom: 40px;
          max-width: 800px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animex-actions { display: flex; gap: 15px; align-items: center; }
        
        /* Tabs */
        .animex-tabs { display: flex; gap: 40px; padding: 0 5%; border-bottom: 1px solid rgba(255,255,255,0.05); margin-top: 40px; }
        .tab-item { padding: 20px 0; color: var(--text-muted); font-weight: 800; cursor: pointer; position: relative; }
        .tab-item.active { color: white; }
        .tab-item.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: var(--accent); }

        /* Episodes Grid */
        .ep-grid-animex {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 25px;
          padding: 40px 5%;
        }
        .ep-card-animex {
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.05);
          transition: all 0.3s ease;
        }
        .ep-card-animex:hover { transform: translateY(-5px); border-color: var(--accent); }
        .ep-thumb { position: relative; aspect-ratio: 16/9; overflow: hidden; }
        .ep-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .ep-num {
          position: absolute; bottom: 10px; left: 10px;
          background: rgba(0,0,0,0.8); color: white;
          padding: 4px 12px; border-radius: 6px; font-weight: 900; font-size: 11px;
        }
        .ep-info { padding: 15px; font-weight: 700; color: white; font-size: 14px; }

        .recommendations-section { padding: 60px 5% 100px; }
        .horizontal-scroll-v5 { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; }
        .horizontal-scroll-v5::-webkit-scrollbar { display: none; }

        @media (max-width: 900px) {
          .animex-content { flex-direction: column; align-items: center; text-align: center; }
          .animex-poster { width: 200px; }
          .animex-badges, .animex-genres, .animex-actions { justify-content: center; }
          .ep-grid-animex { grid-template-columns: 1fr; }
        }
      </style>

      <div class="animex-hero">
        <div class="animex-banner"></div>
        <div class="animex-content">
          <div class="animex-poster"><img src="${this.anime.images.jpg.large_image_url}"></div>
          <div class="animex-info">
            <div class="animex-badges">
              <span class="animex-badge" style="background:var(--accent)">${this.anime.episodes || '?'} EP</span>
              <span class="animex-badge">${this.anime.type}</span>
              <span class="animex-badge">${this.anime.status === 'Currently Airing' ? 'EN EMISIÓN' : 'FINALIZADO'}</span>
              <span class="animex-badge">⭐ ${this.anime.score || '0.0'}</span>
            </div>
            <h1 class="animex-title">${this.anime.title}</h1>
            <div class="animex-genres">
              ${this.anime.genres.map(g => `<span class="genre-pill">${g.name}</span>`).join('')}
            </div>
            <p class="animex-synopsis">${this.anime.synopsis || 'Sin descripción disponible.'}</p>
            <div class="animex-actions">
              <a href="/watch/${this.animeId}/1/sub" data-link class="btn-v4-primary" style="padding: 15px 40px; font-size: 15px;">▶ WATCH NOW</a>
              <button id="fav-btn" class="btn-v4-secondary" style="width:50px; height:50px; border-radius:15px; padding:0">${this.isFavorite ? '❤️' : '🤍'}</button>
              <button id="follow-btn" class="btn-v4-secondary" style="width:50px; height:50px; border-radius:15px; padding:0">${this.isFollowing ? '🔔' : '🔕'}</button>
            </div>
          </div>
        </div>
      </div>

      <nav class="animex-tabs">
        <div class="tab-item active">EPISODES</div>
        <div class="tab-item">CHARACTERS</div>
      </nav>

      <div class="ep-grid-animex" id="episodes-container"></div>

      <div class="recommendations-section">
        <h2 class="section-title">PRECUELAS & SECUELAS</h2>
        <div class="horizontal-scroll-v5" id="relations-container">
          <p id="rel-status" style="color:var(--text-muted); font-size:12px;">Buscando relaciones...</p>
        </div>
      </div>
    `;

    return container;
  }

  async afterRender() {
    const epContainer = document.getElementById('episodes-container');
    const relContainer = document.getElementById('relations-container');
    const relStatus = document.getElementById('rel-status');

    // Cargar Episodios Estilo Animex
    const epCount = this.anime.episodes || 12;
    const banner = this.anime.images.jpg.large_image_url;
    
    epContainer.innerHTML = Array.from({length: epCount}, (_, i) => i + 1).map(num => `
      <a href="/watch/${this.animeId}/${num}/sub" data-link class="ep-card-animex page-enter">
        <div class="ep-thumb">
          <img src="${banner}" loading="lazy">
          <div class="ep-num">EPISODE ${num}</div>
        </div>
        <div class="ep-info">Episodio ${num}</div>
      </a>
    `).join('');

    // Cargar Relaciones (Precuelas/Secuelas)
    try {
      const rels = await apiService.getAnimeRelations(this.animeId);
      if (rels && rels.data && rels.data.length > 0) {
        relStatus.remove();
        rels.data.forEach(rel => {
          rel.entry.forEach(entry => {
            if (entry.type === 'anime') {
              const card = document.createElement('anime-card');
              card.data = { mal_id: entry.mal_id, title: entry.name, images: this.anime.images };
              relContainer.appendChild(card);
            }
          });
        });
      } else { relStatus.textContent = 'No se encontraron relaciones.'; }
    } catch (e) { if(relStatus) relStatus.textContent = 'Error al cargar relaciones.'; }

    // Botones
    document.getElementById('fav-btn').addEventListener('click', async (e) => {
      this.isFavorite = !this.isFavorite;
      e.target.textContent = this.isFavorite ? '❤️' : '🤍';
      await dbService.toggleFavorite(this.anime);
    });
    document.getElementById('follow-btn').addEventListener('click', async (e) => {
      this.isFollowing = !this.isFollowing;
      e.target.textContent = this.isFollowing ? '🔔' : '🔕';
      await dbService.toggleFollowing(this.anime);
    });
  }
}
