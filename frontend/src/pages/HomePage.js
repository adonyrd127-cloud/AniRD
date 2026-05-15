import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';
import '../components/AnimeCard.js';

export default class HomePage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .hero {
          height: 80vh;
          position: relative;
          display: flex;
          align-items: flex-end; /* Alinear abajo para dar aire arriba */
          padding: 0 4% 100px;
          overflow: hidden;
          margin-bottom: 40px;
        }
        .hero-backdrop {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 20%;
          z-index: -1;
        }
        .hero-backdrop::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--bg-primary) 5%, rgba(0,0,0,0.1) 50%, transparent 100%),
                      linear-gradient(to right, var(--bg-primary) 5%, transparent 70%);
        }
        .hero-content {
          max-width: 650px;
          z-index: 1;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: 3.5rem;
          line-height: 1;
          margin-bottom: 20px;
          color: var(--text-primary);
          font-weight: 900;
          letter-spacing: -0.04em;
          text-transform: none;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 35px;
          font-weight: 500;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hero-actions {
          display: flex;
          gap: 15px;
        }
        .btn-crunchy {
          background: var(--accent);
          color: white;
          padding: 12px 30px;
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-crunchy:hover {
            background: var(--accent-hover);
            transform: scale(1.02);
        }

        .page-container {
          padding: 0 4% 80px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .section-wrapper {
            margin-bottom: 60px; /* Más espacio entre filas */
        }
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 1.75rem;
          color: var(--text-primary);
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.02em;
        }
        .view-all {
            color: var(--accent);
            text-transform: uppercase;
            font-size: 0.75rem;
            font-weight: 800;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: opacity 0.2s;
        }
        .view-all:hover { opacity: 0.8; }
        
        .horizontal-scroll {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
          scrollbar-width: none;
        }
        .horizontal-scroll::-webkit-scrollbar { display: none; }
        
        .horizontal-scroll.thumbnail-grid > * {
          flex: 0 0 320px;
        }
        .horizontal-scroll.poster-grid > * {
          flex: 0 0 200px;
        }

        @media (max-width: 768px) {
          .hero { height: 65vh; padding: 0 20px 60px; }
          .hero-title { font-size: 2.2rem; }
          .hero-subtitle { font-size: 0.9rem; }
          .hero-actions .btn-crunchy { width: 100%; justify-content: center; }
          .horizontal-scroll.thumbnail-grid > * { flex: 0 0 240px; }
          .horizontal-scroll.poster-grid > * { flex: 0 0 150px; }
          .section-title { font-size: 1.4rem; }
          .section-wrapper { margin-bottom: 40px; }
        }
      </style>
      <div id="hero-container"></div>
      <div class="page-container">
        <div id="continue-watching-section" class="section-wrapper" style="display:none;">
          <div class="section-header">
            <h2 class="section-title">Continuar Viendo</h2>
            <a href="/history" data-link class="view-all">Ver Historial ❯</a>
          </div>
          <div class="horizontal-scroll thumbnail-grid" id="continue-grid"></div>
        </div>

        <div class="section-wrapper">
            <div class="section-header">
                <h2 class="section-title">Populares este Verano</h2>
                <a href="/category/popular" data-link class="view-all">Ver Todo ❯</a>
            </div>
            <div class="horizontal-scroll poster-grid" id="trending-grid"></div>
        </div>

        <div class="section-wrapper">
            <div class="section-header">
                <h2 class="section-title">Películas Recomendadas</h2>
                <a href="/category/movies" data-link class="view-all">Ver Todo ❯</a>
            </div>
            <div class="horizontal-scroll poster-grid" id="movies-grid"></div>
        </div>

        <section class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">⚔️ Animes de Acción</h2>
            <a href="/category/action" data-link class="view-all">Ver todo ❯</a>
          </div>
          <div class="horizontal-scroll poster-grid" id="action-grid"></div>
        </section>

        <section class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">😂 Animes de Comedia</h2>
            <a href="/category/comedy" data-link class="view-all">Ver todo ❯</a>
          </div>
          <div class="horizontal-scroll poster-grid" id="comedy-grid"></div>
        </section>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const grid = document.getElementById('trending-grid');
    const movieGrid = document.getElementById('movies-grid');
    const actionGrid = document.getElementById('action-grid');
    const comedyGrid = document.getElementById('comedy-grid');
    const continueGrid = document.getElementById('continue-grid');
    const continueSection = document.getElementById('continue-watching-section');

    // 1. Load History (Recently Added)
    const history = await dbService.getContinueWatching();
    if (history.length > 0) {
      continueSection.style.display = 'block';
      for (const item of history.slice(0, 10)) {
        try {
          const animeRes = await apiService.getAnimeInfo(item.animeId);
          const anime = animeRes.data;
          const card = document.createElement('anime-card');
          card.setAttribute('mode', 'thumbnail');
          card.data = { ...anime, currentEpisode: item.episodeId };
          continueGrid.appendChild(card);
        } catch (e) { console.error(e); }
      }
    }

    // 2. Load Trending & Hero
    try {
        const res = await apiService.getTrending();
        if(res && res.data) {
            const trendingAnimes = res.data.slice(0, 5);
            const banners = await Promise.all(
              trendingAnimes.map(a => apiService.getAnilistBanner(a.mal_id))
            );

            let currentIndex = 0;
            const heroContainer = document.getElementById('hero-container');

            const renderHero = (index) => {
                const anime = trendingAnimes[index];
                const banner = banners[index] || anime.images?.jpg?.large_image_url;
                
                heroContainer.innerHTML = `
                  <div class="hero">
                    <div class="hero-backdrop" style="background-image: url('${banner}')"></div>
                    <div class="hero-content">
                      <h1 class="hero-title">${anime.title}</h1>
                      <p class="hero-subtitle">${anime.synopsis?.slice(0, 200)}...</p>
                      <div class="hero-actions">
                        <a href="/anime/${anime.mal_id}" data-link class="btn-crunchy">
                            <span>▶</span> VER AHORA
                        </a>
                      </div>
                    </div>
                  </div>
                `;
            };

            renderHero(0);
            if(this.heroInterval) clearInterval(this.heroInterval);
            this.heroInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % trendingAnimes.length;
                renderHero(currentIndex);
            }, 8000);

            // Populate Popular This Season
            grid.innerHTML = '';
            res.data.forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                grid.appendChild(card);
            });
        }
    } catch(e) { console.error(e); }

    // 3. Load Popular Movies
    try {
        const movieRes = await apiService.getMovies();
        if(movieRes && movieRes.data) {
            movieGrid.innerHTML = '';
            movieRes.data.forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                movieGrid.appendChild(card);
            });
        }
    } catch(e) { console.error(e); }

    // 4. Load Action
    try {
        const actionRes = await apiService.getByGenre(1);
        if(actionRes && actionRes.data) {
            actionGrid.innerHTML = '';
            actionRes.data.forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                actionGrid.appendChild(card);
            });
        }
    } catch(e) { console.error(e); }

    // 5. Load Comedy
    try {
        const comedyRes = await apiService.getByGenre(4);
        if(comedyRes && comedyRes.data) {
            comedyGrid.innerHTML = '';
            comedyRes.data.forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                comedyGrid.appendChild(card);
            });
        }
    } catch(e) { console.error(e); }
  }
}
