import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';
import '../components/AnimeCard.js';

export default class HomePage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .hero-v4 {
          height: 75vh;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 0 5% 80px;
          overflow: hidden;
          background: #000;
        }
        .hero-backdrop-v4 {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 20%;
          z-index: 0;
          transition: background-image 0.8s ease-in-out;
        }
        .hero-backdrop-v4::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #050505 5%, transparent 100%),
                      linear-gradient(to right, #050505 10%, transparent 70%);
        }
        .hero-content-v4 {
          position: relative;
          z-index: 10;
          max-width: 700px;
          padding: 40px 0;
        }
        .hero-title-v4 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 15px;
          letter-spacing: -0.04em;
          color: white;
        }
        .hero-subtitle-v4 {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 30px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hero-actions-v4 { display: flex; gap: 15px; }
        
        .btn-v4-primary {
          background: #ff0000;
          color: white;
          padding: 12px 35px;
          border-radius: 50px;
          font-weight: 800;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          box-shadow: 0 10px 20px rgba(255, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        .btn-v4-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255, 0, 0, 0.4); }

        .btn-v4-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          padding: 12px 25px;
          border-radius: 50px;
          font-weight: 700;
          text-decoration: none;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        .btn-v4-secondary:hover { background: rgba(255, 255, 255, 0.2); }

        .home-sections-v4 { padding: 60px 5% 100px; max-width: 1600px; margin: 0 auto; }
        .horizontal-scroll-v4 { display: flex; gap: 20px; overflow-x: auto; padding: 10px 0 30px; scrollbar-width: none; }
        .horizontal-scroll-v4::-webkit-scrollbar { display: none; }

        @media (max-width: 768px) {
          .hero-v4 { height: 60vh; padding: 0 20px 40px; align-items: center; }
          .hero-content-v4 { padding: 25px; border-radius: 20px; text-align: center; }
          .hero-actions-v4 { justify-content: center; }
        }
      </style>
      
      <div id="hero-container-v4"></div>

      <div class="home-sections-v4">
        <div id="continue-section" style="display:none;">
          <div class="section-header">
            <h2 class="section-title">CONTINUAR VIENDO</h2>
          </div>
          <div class="horizontal-scroll-v4" id="continue-grid"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">POPULARES ESTE VERANO</h2>
          </div>
          <div class="horizontal-scroll-v4" id="trending-grid"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">PELÍCULAS DESTACADAS</h2>
          </div>
          <div class="horizontal-scroll-v4" id="movies-grid"></div>
        </div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const heroContainer = document.getElementById('hero-container-v4');
    const trendingGrid = document.getElementById('trending-grid');
    const movieGrid = document.getElementById('movies-grid');
    const continueGrid = document.getElementById('continue-grid');
    const continueSection = document.getElementById('continue-section');

    try {
      const res = await apiService.getTrending();
      if (res && res.data) {
        const trendingAnimes = res.data.slice(0, 5);
        const banners = await Promise.all(trendingAnimes.map(a => apiService.getAnilistBanner(a.mal_id)));

        let currentIndex = 0;
        const renderHero = (index) => {
          const anime = trendingAnimes[index];
          const banner = banners[index] || anime.images?.jpg?.large_image_url;
          heroContainer.innerHTML = `
            <div class="hero-v4">
              <div class="hero-backdrop-v4" style="background-image: url('${banner}')"></div>
              <div class="hero-content-v4 page-enter">
                <h1 class="hero-title-v4">${anime.title}</h1>
                <p class="hero-subtitle-v4">${anime.synopsis?.slice(0, 180)}...</p>
                <div class="hero-actions-v4">
                  <a href="/anime/${anime.mal_id}" data-link class="btn-v4-primary"><span>▶</span> VER AHORA</a>
                  <a href="/anime/${anime.mal_id}" data-link class="btn-v4-secondary">MÁS INFO</a>
                </div>
              </div>
            </div>
          `;
        };

        renderHero(0);
        setInterval(() => {
          currentIndex = (currentIndex + 1) % trendingAnimes.length;
          renderHero(currentIndex);
        }, 8000);

        res.data.forEach(anime => {
          const card = document.createElement('anime-card');
          card.data = anime;
          trendingGrid.appendChild(card);
        });
      }

      // Movies
      const movieRes = await apiService.getMovies();
      if(movieRes.data) movieRes.data.forEach(a => {
        const card = document.createElement('anime-card');
        card.data = a;
        movieGrid.appendChild(card);
      });

      // Continue Watching
      const history = await dbService.getContinueWatching();
      if (history.length > 0) {
        continueSection.style.display = 'block';
        for (const item of history.slice(0, 8)) {
           const animeRes = await apiService.getAnimeInfo(item.animeId);
           const card = document.createElement('anime-card');
           card.setAttribute('mode', 'thumbnail');
           card.data = { ...animeRes.data, currentEpisode: item.episodeId };
           continueGrid.appendChild(card);
        }
      }
    } catch (e) { console.error(e); }
  }
}
