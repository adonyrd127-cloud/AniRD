import { apiService } from '../services/api.js';
import { dbService, db } from '../services/db.js';
import '../components/AnimeCard.js';

export default class AnimeDetailPage {
  constructor(params) {
    this.params = params;
    this.animeId = params.id;
    this.anime = null;
    this.characters = [];
    this.recommendations = [];
    this.isFavorite = false;
    this.isFollowing = false;
  }

  async render() {
    const userLang = await dbService.getSetting('audio_pref', 'sub');
    
    // Fetch all data in parallel
    const [animeRes, charsRes, recsRes, isFav, isFoll] = await Promise.all([
      apiService.getAnimeInfo(this.animeId),
      apiService.providers.jikan.request(`/anime/${this.animeId}/characters`).catch(() => ({ data: [] })),
      apiService.providers.jikan.request(`/anime/${this.animeId}/recommendations`).catch(() => ({ data: [] })),
      dbService.isFavorite(this.animeId),
      dbService.isFollowing(this.animeId)
    ]);

    this.anime = animeRes.data;
    this.characters = charsRes?.data || [];
    this.recommendations = recsRes?.data || [];
    this.isFavorite = isFav;
    this.isFollowing = isFoll;
    
    const banner = await apiService.getAnilistBanner(this.animeId) || this.anime.images?.jpg?.large_image_url || '';

    // SEO: Dynamic title
    document.title = `${this.anime.title_english || this.anime.title} — AniRD`;

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    container.innerHTML = `
      <style>
        .page-bg {
          position: fixed; inset: 0; z-index: 0;
          background: url('${banner}') center/cover no-repeat;
          filter: brightness(0.3) blur(20px);
          transform: scale(1.1);
        }
        .sheet-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .sheet-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: 100%; max-width: 600px;
          background: rgba(9, 9, 11, 0.95); /* zinc-950 with slight transparency */
          backdrop-filter: blur(20px);
          box-shadow: -10px 0 40px rgba(0,0,0,0.5);
          z-index: 101;
          overflow-y: auto;
          scrollbar-width: none;
          transform: translateX(100%);
          animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          display: flex; flex-direction: column;
        }
        .sheet-panel::-webkit-scrollbar { display: none; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

        .sheet-banner {
          position: relative; height: 260px; flex-shrink: 0;
        }
        .sheet-banner img { width: 100%; height: 100%; object-fit: cover; }
        .sheet-banner-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, #09090b, rgba(9,9,11,0.4), transparent);
        }
        .sheet-close {
          position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s; z-index: 10;
        }
        .sheet-close:hover { background: rgba(0,0,0,0.7); }

        .sheet-title-container {
          position: absolute; bottom: 16px; left: 20px; right: 20px;
        }
        .sheet-title {
          font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 900; color: white;
          line-height: 1.1; margin: 0 0 8px 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .sheet-meta-badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .sheet-score { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: #fbbf24; }
        .sheet-type { font-size: 14px; color: #d4d4d8; }

        .sheet-actions {
          display: flex; gap: 12px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .btn-play-sheet {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #dc2626; color: white; padding: 12px; border-radius: 9999px; font-weight: 600;
          text-decoration: none; transition: transform 0.2s, background 0.2s; font-size: 14px;
        }
        .btn-play-sheet:hover { transform: scale(1.02); background: #b91c1c; }
        .btn-icon-sheet {
          width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; color: #a1a1aa; cursor: pointer; transition: all 0.2s;
        }
        .btn-icon-sheet:hover { color: white; border-color: rgba(255,255,255,0.2); }
        .btn-icon-sheet.active { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }

        .sheet-tabs {
          display: flex; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sheet-tab {
          padding: 12px 16px; font-size: 14px; font-weight: 500; color: #71717a; cursor: pointer; position: relative; transition: color 0.2s;
        }
        .sheet-tab.active { color: white; }
        .sheet-tab.active::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #ef4444; border-radius: 2px 2px 0 0;
        }

        .sheet-content { padding: 20px; flex: 1; }
        .tab-panel { display: none; animation: fadeIn 0.3s; }
        .tab-panel.active { display: block; }

        /* Info Grid */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; }
        .info-card-label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #71717a; margin-bottom: 4px; }
        .info-card-value { font-size: 14px; font-weight: 500; color: white; }

        .section-heading { font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; }
        .badge-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .badge-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #d4d4d8; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
        .badge-pill.status { background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2); }

        .synopsis-text { font-size: 14px; color: #a1a1aa; line-height: 1.6; }

        /* Characters Grid */
        .chars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .char-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px; }
        .char-img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .char-info { min-width: 0; }
        .char-name { font-size: 13px; font-weight: 500; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .char-role { font-size: 11px; color: #71717a; }

        /* Recommendations Grid */
        .recs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }

        /* Episodes */
        .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 16px; }
        .ep-card { position: relative; border-radius: 12px; overflow: hidden; text-decoration: none; display: block; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.2s; }
        .ep-card:hover { transform: translateY(-4px); border-color: rgba(220,38,38,0.3); }
        .ep-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .ep-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; align-items: flex-end; padding: 8px; }
        .ep-card-title { color: white; font-size: 11px; font-weight: 600; }
        .ep-watched-badge { position: absolute; top: 8px; right: 8px; background: #a855f7; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; }
      </style>

      <div class="page-bg"></div>
      <div class="sheet-overlay" id="sheet-overlay"></div>
      <div class="sheet-panel">
        <div class="sheet-banner">
          <img src="${banner}" alt="">
          <div class="sheet-banner-overlay"></div>
          <button class="sheet-close" id="sheet-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div class="sheet-title-container">
            <h1 class="sheet-title">${this.anime.title_english || this.anime.title}</h1>
            <div class="sheet-meta-badges">
              ${this.anime.score ? `<div class="sheet-score"><svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${this.anime.score}</div>` : ''}
              ${this.anime.type ? `<div class="sheet-type">${this.anime.type}</div>` : ''}
              ${this.anime.episodes ? `<div class="sheet-type">${this.anime.episodes} eps</div>` : ''}
            </div>
          </div>
        </div>

        <div class="sheet-actions">
          <a href="/watch/${this.animeId}/1/${userLang}?title=${encodeURIComponent(this.anime.title)}" data-link class="btn-play-sheet">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Reproducir
          </a>
          <button class="btn-icon-sheet ${this.isFavorite ? 'active' : ''}" id="fav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button class="btn-icon-sheet ${this.isFollowing ? 'active' : ''}" id="follow-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
        </div>

        <div class="sheet-tabs">
          <div class="sheet-tab active" data-tab="info">Información</div>
          <div class="sheet-tab" data-tab="episodes">Episodios</div>
          <div class="sheet-tab" data-tab="characters">Personajes</div>
          <div class="sheet-tab" data-tab="recommendations">Recomendados</div>
        </div>

        <div class="sheet-content">
          <!-- INFO TAB -->
          <div class="tab-panel active" id="tab-info">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Año</div>
                <div class="info-card-value">${this.anime.year || 'N/A'}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Tipo</div>
                <div class="info-card-value">${this.anime.type || 'N/A'}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Duración</div>
                <div class="info-card-value">${this.anime.duration || 'N/A'}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> Puntuación</div>
                <div class="info-card-value">${this.anime.score || 'N/A'}</div>
              </div>
            </div>

            <h4 class="section-heading">Estado</h4>
            <div class="badge-list">
              <div class="badge-pill ${this.anime.status === 'Currently Airing' ? 'status' : ''}">${this.anime.status === 'Currently Airing' ? 'En Emisión' : this.anime.status}</div>
              ${this.anime.rating ? `<div class="badge-pill">${this.anime.rating}</div>` : ''}
              ${this.anime.source ? `<div class="badge-pill">${this.anime.source}</div>` : ''}
            </div>

            ${this.anime.studios?.length > 0 ? `
              <h4 class="section-heading">Estudio</h4>
              <div class="badge-list">
                ${this.anime.studios.map(s => `<div class="badge-pill">${s.name}</div>`).join('')}
              </div>
            ` : ''}

            <h4 class="section-heading">Géneros</h4>
            <div class="badge-list">
              ${this.anime.genres.map(g => `<div class="badge-pill" style="background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2);">${g.name}</div>`).join('')}
            </div>

            <h4 class="section-heading" style="margin-top: 8px;">Sinopsis</h4>
            <p class="synopsis-text">${this.anime.synopsis || 'Sin sinopsis disponible.'}</p>
          </div>

          <!-- EPISODES TAB -->
          <div class="tab-panel" id="tab-episodes">
             <div id="episodes-container" style="text-align:center; color:#71717a; padding: 20px;">Cargando episodios...</div>
          </div>

          <!-- CHARACTERS TAB -->
          <div class="tab-panel" id="tab-characters">
            ${this.characters.length > 0 ? `
              <div class="chars-grid">
                ${this.characters.slice(0, 20).map(c => `
                  <div class="char-card">
                    <img class="char-img" src="${c.character.images?.jpg?.image_url}" alt="${c.character.name}">
                    <div class="char-info">
                      <div class="char-name">${c.character.name}</div>
                      <div class="char-role">${c.role}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : '<div style="color:#71717a;text-align:center;padding:20px;">No hay personajes disponibles.</div>'}
          </div>

          <!-- RECS TAB -->
          <div class="tab-panel" id="tab-recommendations">
            ${this.recommendations.length > 0 ? `
              <div class="recs-grid">
                ${this.recommendations.slice(0, 10).map(r => `
                  <anime-card data='${JSON.stringify({
                    mal_id: r.entry.mal_id,
                    title: r.entry.title,
                    images: r.entry.images,
                    score: '?.?'
                  }).replace(/'/g, "&#39;")}'></anime-card>
                `).join('')}
              </div>
            ` : '<div style="color:#71717a;text-align:center;padding:20px;">No hay recomendaciones.</div>'}
          </div>
        </div>
      </div>
    `;

    return container;
  }

  async afterRender() {
    // Actions
    const favBtn = document.getElementById('fav-btn');
    const followBtn = document.getElementById('follow-btn');
    
    if (favBtn) {
      favBtn.addEventListener('click', async () => {
        if (this.isFavorite) {
          await dbService.removeFavorite(this.animeId);
          this.isFavorite = false;
          favBtn.classList.remove('active');
        } else {
          await dbService.addFavorite({ ...this.anime, addedAt: Date.now() });
          this.isFavorite = true;
          favBtn.classList.add('active');
        }
      });
    }

    if (followBtn) {
      followBtn.addEventListener('click', async () => {
        if (this.isFollowing) {
          await dbService.removeFollowing(this.animeId);
          this.isFollowing = false;
          followBtn.classList.remove('active');
        } else {
          await dbService.addFollowing({ ...this.anime, addedAt: Date.now() });
          this.isFollowing = true;
          followBtn.classList.add('active');
        }
      });
    }

    // Tabs
    const tabs = document.querySelectorAll('.sheet-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      });
    });

    // Close slide-over handling
    const closeSlideOver = () => {
      // Simulate slide out animation before history back
      const panel = document.querySelector('.sheet-panel');
      const overlay = document.querySelector('.sheet-overlay');
      if (panel && overlay) {
         panel.style.animation = 'slideOut 0.3s forwards';
         overlay.style.animation = 'fadeOut 0.3s forwards';
         
         const style = document.createElement('style');
         style.innerHTML = \`
           @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
           @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
         \`;
         document.head.appendChild(style);
         
         setTimeout(() => {
           window.history.back();
         }, 300);
      } else {
         window.history.back();
      }
    };

    document.getElementById('sheet-close').addEventListener('click', closeSlideOver);
    document.getElementById('sheet-overlay').addEventListener('click', closeSlideOver);

    // Episodes Load
    this.loadEpisodes();
  }

  async loadEpisodes() {
    const epContainer = document.getElementById('episodes-container');
    const userLang = await dbService.getSetting('audio_pref', 'sub');
    let watchedSet = new Set();
    
    try {
      const watched = await db.history.where({ animeId: String(this.animeId) }).toArray();
      watchedSet = new Set(watched.map(w => Number(w.episodeId)));
    } catch (err) {}

    let epCount = null;
    
    try {
      const titlesToSearch = [
        this.anime.title,
        this.anime.title_english,
        this.anime.title_japanese,
        ...(this.anime.title_synonyms || [])
      ].filter(Boolean);

      let searchRes = null;
      for (const title of titlesToSearch) {
        const res = await apiService.searchLocal(title);
        if (res?.success && res.data?.results?.length > 0) {
          searchRes = res; break;
        }
      }

      if (searchRes) {
        const bestMatch = searchRes.data.results.find(a => 
          titlesToSearch.some(t => a.title.toLowerCase().includes(t.toLowerCase()))
        ) || searchRes.data.results[0];

        const infoRes = await apiService.getAnimeInfo(bestMatch.url);
        if (infoRes?.data?.episodes) epCount = infoRes.data.episodes.length;
      }
    } catch (e) {}

    if (!epCount) {
      if (this.anime.status === 'Currently Airing') {
        try {
          const epRes = await apiService.providers.jikan.request(`/anime/${this.animeId}/episodes`);
          if (epRes?.data?.length > 0) {
            const lastPage = epRes.pagination.last_visible_page;
            if (lastPage > 1) {
              const lastPageRes = await apiService.providers.jikan.request(`/anime/${this.animeId}/episodes?page=${lastPage}`);
              epCount = lastPageRes.data[lastPageRes.data.length - 1].mal_id;
            } else {
              epCount = epRes.data[epRes.data.length - 1].mal_id;
            }
          }
        } catch (e) {}
      }
      if (!epCount) epCount = this.anime.episodes || 12;
    }

    const thumb = this.anime.images?.jpg?.large_image_url || '';
    const titleParam = `?title=${encodeURIComponent(this.anime.title)}`;
    
    epContainer.innerHTML = \`
      <div class="episodes-grid">
        \${Array.from({length: epCount}, (_, i) => i + 1).map(num => {
          const isWatched = watchedSet.has(num);
          return \`
            <a href="/watch/\${this.animeId}/\${num}/\${userLang}\${titleParam}" data-link class="ep-card">
              <img src="\${thumb}" loading="lazy" style="\${isWatched ? 'opacity: 0.5; filter: grayscale(1);' : ''}">
              <div class="ep-card-overlay">
                <span class="ep-card-title">Ep. \${num}</span>
              </div>
              \${isWatched ? '<div class="ep-watched-badge">Visto</div>' : ''}
            </a>
          \`;
        }).join('')}
      </div>
    \`;
  }
}
