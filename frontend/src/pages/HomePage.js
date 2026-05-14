import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';
import '../components/AnimeCard.js';

export default class HomePage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .hero {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          padding: 0 4%;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .hero-backdrop {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.4);
          z-index: -1;
        }
        .hero-content {
          max-width: 800px;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: 3rem;
          margin-bottom: 15px;
          color: white;
        }
        .hero-desc {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 25px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .page-container {
          padding: 20px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin: 2rem 0 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: var(--accent);
            border-radius: 2px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
      </style>
      <div id="hero-container"></div>
      <div class="page-container">
        <div id="continue-watching-section" style="display:none;">
          <h2 class="section-title">Continuar Viendo</h2>
          <div class="anime-grid" id="continue-grid"></div>
        </div>

        <h2 class="section-title">Animes Populares</h2>
        <div class="anime-grid" id="trending-grid"></div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const grid = document.getElementById('trending-grid');
    const continueGrid = document.getElementById('continue-grid');
    const continueSection = document.getElementById('continue-watching-section');

    // Load History
    const history = await dbService.getContinueWatching();
    if (history.length > 0) {
      continueSection.style.display = 'block';
      for (const item of history.slice(0, 6)) {
        try {
          const animeRes = await apiService.getAnimeInfo(item.animeId);
          const anime = animeRes.data;
          const card = document.createElement('anime-card');
          card.data = anime;
          card.addEventListener('anime-click', () => {
            window.history.pushState(null, null, `/watch/${item.animeId}/${item.episodeId}`);
            window.dispatchEvent(new Event('popstate'));
          });
          continueGrid.appendChild(card);
        } catch (e) { console.error(e); }
      }
    }

    // Skeleton loaders
    for(let i=0; i<6; i++) {
        const card = document.createElement('anime-card');
        grid.appendChild(card);
    }

    try {
        const res = await apiService.getTrending();
        grid.innerHTML = ''; // clear skeletons
        if(res && res.data) {
            const trendingAnimes = res.data.slice(0, 5);
            
            // Intentar obtener banners horizontales de AniList para el Hero
            const banners = await Promise.all(
              trendingAnimes.map(a => apiService.getAnilistBanner(a.mal_id))
            );

            let currentIndex = 0;
            const heroContainer = document.getElementById('hero-container');

            const renderHero = (index) => {
                const anime = trendingAnimes[index];
                const banner = banners[index] || anime.images?.jpg?.large_image_url;
                
                heroContainer.innerHTML = `
                  <style>
                    .hero-fade-in { animation: fadeIn 0.8s ease-out; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    .hero {
                      position: relative;
                      height: 550px;
                      display: flex;
                      align-items: center;
                      padding: 0 6%;
                      overflow: hidden;
                      background: #0a0a14;
                    }
                    .hero-backdrop {
                      position: absolute;
                      inset: 0;
                      background-image: url('${banner}');
                      background-size: cover;
                      background-position: center 20%;
                      filter: brightness(0.4);
                      z-index: 1;
                    }
                    .hero::after {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: linear-gradient(90deg, #0a0a14 0%, rgba(10,10,20,0.6) 50%, transparent 100%);
                      z-index: 2;
                    }
                    .hero-content {
                      position: relative;
                      z-index: 3;
                      max-width: 700px;
                    }
                  </style>
                  <div class="hero hero-fade-in">
                    <div class="hero-backdrop"></div>
                    <div class="hero-content">
                      <h1 class="hero-title" style="text-shadow: 0 2px 10px rgba(0,0,0,0.5)">${anime.title}</h1>
                      <p class="hero-desc" style="text-shadow: 0 1px 5px rgba(0,0,0,0.5)">${anime.synopsis || 'Disfruta de este increíble anime en AniRD.'}</p>
                      <a href="/anime/${anime.mal_id}" data-link class="btn-play" style="background:var(--accent); color:black; padding:14px 35px; border-radius:8px; font-weight:700; text-decoration:none; display:inline-block; transition: transform 0.2s;">VER DETALLES</a>
                    </div>
                  </div>
                `;
            };

            renderHero(0);
            
            // Intervalo para cambiar el hero cada 7 segundos
            this.heroInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % trendingAnimes.length;
                renderHero(currentIndex);
            }, 7000);

            res.data.slice(0,12).forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                card.addEventListener('anime-click', (e) => {
                    const id = e.detail.mal_id;
                    window.history.pushState(null, null, `/anime/${id}`);
                    window.dispatchEvent(new Event('popstate'));
                });
                grid.appendChild(card);
            });
        }
    } catch(e) {
        console.error("Failed to load trending", e);
        grid.innerHTML = '<p>Error al cargar los animes.</p>';
    }
  }
}
