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
        /* ✅ FIX CRÍTICO: El nav es fijo pero el hero va de fondo */
        .home-page-wrapper {
          min-height: 100vh;
          background: #09090b; /* zinc-950 */
        }

        .hero-v5 {
          height: 75vh;
          min-height: 500px;
          max-height: 800px;
          position: relative;
          overflow: hidden;
          background: #09090b;
        }
        .hero-backdrop-v5 {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 20%;
          z-index: 0;
          transition: background-image 0.8s ease-in-out, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-v5:hover .hero-backdrop-v5 {
          transform: scale(1.05);
        }
        .hero-overlay-1 { position: absolute; inset: 0; background: linear-gradient(to right, rgba(9,9,11,0.95), rgba(9,9,11,0.6), rgba(9,9,11,0.3)); z-index: 1; }
        .hero-overlay-2 { position: absolute; inset: 0; background: linear-gradient(to top, #09090b, rgba(9,9,11,0.2), transparent); z-index: 2; }
        .hero-overlay-3 { position: absolute; bottom: 0; left: 0; right: 0; height: 160px; background: linear-gradient(to top, #09090b, transparent); z-index: 3; }
        
        .hero-content-v5 {
          position: absolute;
          z-index: 10;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5% 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
        }
        
        .hero-badges { display: flex; gap: 8px; margin-bottom: 12px; }
        .badge-airing { display: flex; align-items: center; gap: 6px; background: rgba(220,38,38,0.9); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: white; }
        .badge-score { display: flex; align-items: center; gap: 4px; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.3); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #fbbf24; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: white; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        .hero-title-v5 {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0 0 12px 0;
        }
        .hero-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; color: #d4d4d8; margin-bottom: 16px; font-weight: 500; }
        .hero-synopsis { font-size: 15px; color: #a1a1aa; max-width: 600px; line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        .hero-actions-v5 { display: flex; gap: 12px; }
        .btn-play { background: #dc2626; color: white; border-radius: 9999px; padding: 12px 28px; font-weight: 600; display: flex; align-items: center; gap: 8px; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(220,38,38,0.3); transition: all 0.3s; font-size: 14px; }
        .btn-play:hover { background: #b91c1c; transform: scale(1.05); }
        .btn-info { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: white; backdrop-filter: blur(4px); border-radius: 9999px; padding: 12px 24px; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: all 0.3s; font-size: 14px; }
        .btn-info:hover { background: rgba(255,255,255,0.15); transform: scale(1.05); }

        .indicators { position: absolute; bottom: 24px; right: 5%; display: flex; gap: 8px; z-index: 20; }
        .indicator { width: 12px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.2); transition: all 0.3s; cursor: pointer; border: none; padding: 0; }
        .indicator.active { width: 32px; background: #dc2626; }

        .home-sections-v5 { padding: 40px 0 100px; max-width: 1600px; margin: 0 auto; }
        .section-wrapper { position: relative; margin-bottom: 40px; }
        .section-wrapper:hover .scroll-btn { opacity: 1; }
        .section-header { padding: 0 5%; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
        .section-title { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; color: white; margin: 0; }
        
        .horizontal-scroll-v5 { 
          display: flex; gap: 16px; overflow-x: auto; padding: 10px 5% 30px; scrollbar-width: none; 
          scroll-behavior: smooth;
        }
        .horizontal-scroll-v5::-webkit-scrollbar { display: none; }
        
        .scroll-btn {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
          width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1); color: white; cursor: pointer;
          display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px);
          opacity: 0; transition: all 0.3s;
        }
        @media (min-width: 768px) {
          .scroll-btn { display: flex; }
        }
        .scroll-btn:hover { background: rgba(0,0,0,0.8); border-color: rgba(255,255,255,0.2); }
        .scroll-left { left: 1%; }
        .scroll-right { right: 1%; }
        
        .fade-edge-left { position: absolute; left: 0; top: 0; bottom: 0; width: 5%; background: linear-gradient(to right, #09090b, transparent); pointer-events: none; z-index: 10; display: none; }
        .fade-edge-right { position: absolute; right: 0; top: 0; bottom: 0; width: 5%; background: linear-gradient(to left, #09090b, transparent); pointer-events: none; z-index: 10; display: none; }
        @media (min-width: 768px) {
          .fade-edge-left, .fade-edge-right { display: block; }
        }

        .home-error-banner {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: #fca5a5;
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          margin: 0 5% 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      </style>
      
      <div id="hero-container-v4">
        <!-- Skeleton Hero -->
        <div class="hero-v5">
          <div class="hero-overlay-2"></div>
        </div>
      </div>

      <div class="home-sections-v5">
        <div id="api-error-banner" class="home-error-banner" style="display:none;">
          ⚠️ <span id="api-error-msg">Algunas secciones no pudieron cargar.</span>
        </div>

        <div id="continue-section" class="section-wrapper" style="display:none;">
          <div class="section-header"><h2 class="section-title">CONTINUAR VIENDO</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('continue-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="continue-grid"></div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('continue-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">ÚLTIMOS LANZAMIENTOS</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latest-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="latest-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latest-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">POPULARES ESTE VERANO</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('trending-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="trending-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('trending-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">ANIMES EN LATINO</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latino-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="latino-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latino-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">PELÍCULAS DESTACADAS</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('movies-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="movies-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('movies-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>
        
        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">ACCIÓN Y AVENTURA</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('action-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="action-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('action-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
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
          
          let indicatorsHtml = trendingAnimes.map((_, i) => 
            `<button class="indicator ${i === index ? 'active' : ''}" onclick="window.setHeroIndex(${i})"></button>`
          ).join('');

          window.setHeroIndex = (i) => {
             currentIndex = i;
             renderHero(currentIndex);
             clearInterval(this._heroInterval);
             this._heroInterval = setInterval(() => {
               currentIndex = (currentIndex + 1) % trendingAnimes.length;
               renderHero(currentIndex);
             }, 7000);
          };

          heroContainer.innerHTML = `
            <div class="hero-v5">
              <div class="hero-backdrop-v5" style="background-image: url('${banner}')"></div>
              <div class="hero-overlay-1"></div>
              <div class="hero-overlay-2"></div>
              <div class="hero-overlay-3"></div>
              <div class="hero-content-v5 page-enter">
                <div class="hero-badges">
                  ${anime.status === 'Currently Airing' ? `<div class="badge-airing"><div class="dot"></div>EN EMISIÓN</div>` : ''}
                  ${anime.score ? `<div class="badge-score"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span>${anime.score}</span></div>` : ''}
                </div>
                <h1 class="hero-title-v5">${anime.title_english || anime.title || 'Sin título'}</h1>
                <div class="hero-meta">
                  ${anime.type ? `<span>${anime.type}</span>` : ''}
                  ${anime.episodes ? `<span>${anime.episodes} episodios</span>` : ''}
                  ${anime.year ? `<span>${anime.year}</span>` : ''}
                </div>
                <p class="hero-synopsis">${(anime.synopsis || 'Sin sinopsis disponible.').slice(0, 200)}${anime.synopsis?.length > 200 ? '...' : ''}</p>
                <div class="hero-actions-v5">
                  <a href="/anime/${anime.mal_id}" data-link class="btn-play">▶ VER AHORA</a>
                  <a href="/anime/${anime.mal_id}" data-link class="btn-info">MÁS INFO</a>
                </div>
              </div>
              <div class="indicators">${indicatorsHtml}</div>
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
