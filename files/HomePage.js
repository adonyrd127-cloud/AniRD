import { apiService } from '../services/api.js';
import { dbService } from '../services/db.js';
import '../components/AnimeCard.js';

export default class HomePage {
  async render() {
    const container = document.createElement('div');
    // ✅ FIX #1: padding-top: 70px para que el hero no quede detrás del nav fijo
    container.className = 'home-page-wrapper';
    container.innerHTML = `
      <style>
        /* ✅ FIX CRÍTICO: wrapper que garantiza que el contenido empiece DEBAJO del nav fijo */
        .home-page-wrapper {
          padding-top: 70px;
          min-height: 100vh;
          background: var(--bg-dark);
        }

        /* En TV mode el #app ya empieza en top: 70px, así que quitamos el padding */
        body.tv-mode .home-page-wrapper {
          padding-top: 0 !important;
        }

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
        
        .home-sections-v4 { padding: 60px 5% 100px; max-width: 1600px; margin: 0 auto; }
        .horizontal-scroll-v4 { display: flex; gap: 20px; overflow-x: auto; padding: 10px 0 30px; scrollbar-width: none; }
        .horizontal-scroll-v4::-webkit-scrollbar { display: none; }

        /* ✅ FIX: Error state visible para cuando la API falla */
        .home-error-banner {
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.25);
          color: rgba(255,200,200,0.9);
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .hero-v4 { height: 60vh; padding: 0 20px 40px; align-items: center; }
          .hero-content-v4 { padding: 25px; border-radius: 20px; text-align: center; }
          .hero-actions-v4 { justify-content: center; }
        }
      </style>
      
      <div id="hero-container-v4">
        <!-- Skeleton Hero (visible hasta que carguen los datos reales) -->
        <div class="skeleton-hero">
          <div class="skeleton-hero-content">
            <div class="skeleton skeleton-hero-title"></div>
            <div class="skeleton skeleton-hero-text"></div>
            <div class="skeleton skeleton-hero-text" style="width:50%"></div>
            <div class="skeleton skeleton-hero-btn"></div>
          </div>
        </div>
      </div>

      <div class="home-sections-v4">
        <div id="api-error-banner" class="home-error-banner" style="display:none;">
          ⚠️ <span id="api-error-msg">Algunas secciones no pudieron cargar. Verificando conexión...</span>
        </div>

        <div id="continue-section" class="section-wrapper" style="display:none;">
          <div class="section-header">
            <h2 class="section-title">CONTINUAR VIENDO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('continue-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="continue-grid"></div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('continue-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ÚLTIMOS LANZAMIENTOS</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latest-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="latest-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latest-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">POPULARES ESTE VERANO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('trending-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="trending-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('trending-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ANIMES EN LATINO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latino-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="latino-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latino-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">PELÍCULAS DESTACADAS</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('movies-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="movies-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('movies-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>
        
        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ACCIÓN Y AVENTURA</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('action-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="action-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('action-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>
      </div>
    `;
    return container;
  }

  // ✅ Helper para generar skeleton cards
  _skeletonCards(count) {
    return Array.from({length: count}, () => `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `).join('');
  }

  async afterRender() {
    const heroContainer = document.getElementById('hero-container-v4');
    const trendingGrid = document.getElementById('trending-grid');
    const movieGrid = document.getElementById('movies-grid');
    const continueGrid = document.getElementById('continue-grid');
    const continueSection = document.getElementById('continue-section');
    const errorBanner = document.getElementById('api-error-banner');
    const errorMsg = document.getElementById('api-error-msg');

    let hasErrors = false;

    // ✅ FIX #2: Cada sección carga de forma INDEPENDIENTE.
    // Si una falla, las demás siguen funcionando normalmente.
    const safeLoad = async (fetchFn, gridEl, label) => {
      try {
        const res = await fetchFn();
        if (res && res.data && res.data.length > 0) {
          if (gridEl) this._renderGrid(gridEl, res.data);
        } else {
          // ✅ Mostrar mensaje "sin resultados" en lugar de skeleton vacío
          if (gridEl) gridEl.innerHTML = `<p style="color:rgba(255,255,255,0.3);padding:20px;font-size:13px;">Sin resultados para ${label}</p>`;
          hasErrors = true;
        }
        return res;
      } catch (e) {
        console.error(`[AniRD] Error cargando ${label}:`, e);
        if (gridEl) gridEl.innerHTML = `<p style="color:rgba(255,100,100,0.5);padding:20px;font-size:13px;">Error al cargar ${label}</p>`;
        hasErrors = true;
        return null;
      }
    };

    try {
      const latestGrid = document.getElementById('latest-grid');
      const latinoGrid = document.getElementById('latino-grid');
      const actionGrid = document.getElementById('action-grid');

      // ✅ Todas las secciones cargan en paralelo, pero cada una es independiente
      const [trendingRes] = await Promise.all([
        safeLoad(() => apiService.getTrending(), trendingGrid, 'Populares'),
        safeLoad(() => apiService.getMovies(), movieGrid, 'Películas'),
        safeLoad(() => apiService.getLatest(), latestGrid, 'Últimos'),
        safeLoad(() => apiService.getDubbed(), latinoGrid, 'Latino'),
        safeLoad(() => apiService.getByGenre('1,2'), actionGrid, 'Acción'),
      ]);

      // ✅ FIX: Mostrar banner de error solo si TODAS las secciones fallaron
      if (hasErrors && errorBanner) {
        errorBanner.style.display = 'flex';
        if (errorMsg) errorMsg.textContent = 'Algunas secciones no pudieron cargar. Verifica que el servidor esté activo.';
      }

      // ✅ Hero: solo si trending cargó correctamente
      if (trendingRes && trendingRes.data && trendingRes.data.length > 0) {
        const trendingAnimes = trendingRes.data.slice(0, 5);
        
        // ✅ Cargar banners con fallback por si AniList falla
        const banners = await Promise.all(
          trendingAnimes.map(a => 
            apiService.getAnilistBanner(a.mal_id)
              .then(b => b || a.images?.jpg?.large_image_url)
              .catch(() => a.images?.jpg?.large_image_url)
          )
        );

        let currentIndex = 0;
        const renderHero = (index) => {
          const anime = trendingAnimes[index];
          if (!anime) return;
          const banner = banners[index] || anime.images?.jpg?.large_image_url || '';
          heroContainer.innerHTML = `
            <div class="hero-v4">
              <div class="hero-backdrop-v4" style="background-image: url('${banner}')"></div>
              <div class="hero-content-v4 page-enter">
                <h1 class="hero-title-v4">${anime.title || 'Sin título'}</h1>
                <p class="hero-subtitle-v4">${(anime.synopsis || '').slice(0, 180)}${anime.synopsis ? '...' : ''}</p>
                <div class="hero-actions-v4">
                  <a href="/anime/${anime.mal_id}" data-link class="btn-v4-primary"><span>▶</span> VER AHORA</a>
                  <a href="/anime/${anime.mal_id}" data-link class="btn-v4-secondary">MÁS INFO</a>
                </div>
              </div>
            </div>
          `;
        };

        renderHero(0);
        // ✅ Guardar el intervalo para limpiarlo al navegar fuera
        this._heroInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % trendingAnimes.length;
          renderHero(currentIndex);
        }, 8000);
      } else {
        // ✅ FIX: Si trending falla, mostrar hero de error en vez de skeleton infinito
        heroContainer.innerHTML = `
          <div class="hero-v4" style="background: linear-gradient(135deg, #0a0a14 0%, #1a0510 100%);">
            <div class="hero-content-v4">
              <h1 class="hero-title-v4" style="color:rgba(255,255,255,0.5);">AniRD</h1>
              <p class="hero-subtitle-v4">Conectando con el servidor...</p>
            </div>
          </div>
        `;
      }

      // ✅ Continuar viendo
      try {
        const history = await dbService.getContinueWatching();
        if (history && history.length > 0) {
          continueSection.style.display = 'block';
          const items = history.slice(0, 8);
          
          await Promise.all(items.map(async (item) => {
            try {
              const card = document.createElement('anime-card');
              card.setAttribute('mode', 'thumbnail');
              continueGrid.appendChild(card);

              if (item.animeTitle && item.animeCover) {
                card.data = {
                  mal_id: item.animeId,
                  title: item.animeTitle,
                  images: { jpg: { large_image_url: item.animeCover } },
                  type: item.animeType || '',
                  score: item.animeScore || '',
                  currentEpisode: item.episodeId,
                  progress: item.progress || 0,
                  duration_watched: item.duration || 0
                };
                // Actualizar en segundo plano
                apiService.getAnimeInfo(item.animeId).then(r => {
                  if (r?.data) card.data = { ...r.data, currentEpisode: item.episodeId, progress: item.progress || 0 };
                }).catch(() => {});
              } else {
                const animeRes = await apiService.getAnimeInfo(item.animeId);
                if (animeRes?.data) {
                  card.data = { ...animeRes.data, currentEpisode: item.episodeId, progress: item.progress || 0 };
                }
              }
            } catch (e) { /* silencioso */ }
          }));
        }
      } catch (e) { /* silencioso */ }

    } catch (e) {
      console.error('[AniRD HomePage] Error general:', e);
      if (errorBanner) {
        errorBanner.style.display = 'flex';
        if (errorMsg) errorMsg.textContent = `Error de carga: ${e.message}. Verifica que el servidor esté activo en el puerto correcto.`;
      }
    }
  }

  // Limpiar el intervalo del hero al desmontar
  destroy() {
    if (this._heroInterval) {
      clearInterval(this._heroInterval);
      this._heroInterval = null;
    }
  }

  _renderGrid(gridEl, dataList) {
    if (!gridEl || !dataList) return;
    gridEl.innerHTML = '';
    dataList.forEach(a => {
      const card = document.createElement('anime-card');
      card.data = a;
      gridEl.appendChild(card);
    });
  }
}
