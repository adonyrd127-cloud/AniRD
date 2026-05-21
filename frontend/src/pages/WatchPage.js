import { apiService } from '../services/api.js';
import { dbService, db } from '../services/db.js';

export default class WatchPage {
  constructor(params) {
    this.params = params;
    this.animeId = parseInt(params.id);
    this.episodeNum = parseInt(params.ep) || 1;
    this.lang = params.lang || 'sub';
    
    this.anime = null;
    this.localInfo = null;
    this.episodeData = null;
    this.relatedAnimes = [];
    this.anilistEpisodes = [];
    this.isFav = false;
    this.watchedEpisodes = new Set();
    
    // UI state
    this.isTheater = localStorage.getItem('watch-theater-mode') === 'true';
    this.sortDesc = false;
    this.searchQuery = '';
  }

  async render() {
    try {
      console.log("Iniciando carga de WatchPage Premium para ID:", this.animeId, "Episodio:", this.episodeNum);
      
      // 1. Obtener info básica del anime (Priorizar caché)
      const infoRes = await apiService.getAnimeInfo(this.animeId);
      if (infoRes && infoRes.data) {
        this.anime = infoRes.data;
      }

      // Obtener el título del anime como garantía de búsqueda local
      const urlParams = new URLSearchParams(window.location.search);
      const titleHint = urlParams.get('title');
      const finalSearchTitle = this.anime ? this.anime.title : titleHint;

      if (finalSearchTitle) {
        // 2. Buscar en el servidor local de streaming
        const searchRes = await apiService.searchLocal(finalSearchTitle);
        if (searchRes.success && searchRes.data.results.length > 0) {
          const localAnime = searchRes.data.results.find(a => 
            a.title.toLowerCase().includes(finalSearchTitle.toLowerCase())
          ) || searchRes.data.results[0];

          // Si Jikan falla en cargar, creamos objeto base para que no se rompa la UI
          if (!this.anime) {
            this.anime = { 
              title: localAnime.title, 
              images: { jpg: { large_image_url: localAnime.thumbnail } },
              genres: [], synopsis: "Cargado desde el servidor local de AniRD."
            };
          }

          // 3. Cargar episodios locales
          const localDetails = await apiService.getAnimeInfo(localAnime.url);
          if (localDetails.success) {
            this.localInfo = localDetails.data;
            
            // 4. Buscar y cargar servidores del episodio actual
            const targetEpisode = this.localInfo.episodes.find(ep => ep.number === this.episodeNum);
            
            if (targetEpisode && targetEpisode.url) {
              const epRes = await apiService.getEpisode(targetEpisode.url);
              if (epRes.success && epRes.data) {
                this.episodeData = epRes.data;
                const serverList = this.episodeData.servers[this.lang] || this.episodeData.servers.sub || [];
                this.episodeData.activeServers = serverList;
              }
            }
          }
        }
      }

      // Verificar si es favorito en IndexedDB
      this.isFav = await dbService.isFavorite(this.animeId);

      // Cargar episodios vistos de este anime
      const watched = await db.history.where({ animeId: String(this.animeId) }).toArray();
      this.watchedEpisodes = new Set(watched.map(w => Number(w.episodeId)));

    } catch (e) {
      console.error("Error crítico al renderizar WatchPage Premium:", e);
    }

    const container = document.createElement('div');
    container.className = 'page-enter';
    
    // Estado de error si no se encuentra el anime
    if (!this.anime) {
      container.innerHTML = `
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `;
      return container;
    }

    // Título SEO dinámico
    document.title = `${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;

    // Calcular si el episodio actual ya ha sido visto
    const isWatchedCurrent = this.watchedEpisodes.has(this.episodeNum);

    // Metadatos para enlaces externos
    const anilistLink = `https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`;
    const malLink = `https://myanimelist.net/anime/${this.anime.mal_id || ''}`;
    
    // Obtener Banner para resplandor y cabecera
    const coverUrl = this.anime.images?.jpg?.large_image_url || '';
    const bannerUrl = this.anime.images?.jpg?.large_image_url || coverUrl;

    // Calcular próximo estreno (live countdown)
    let nextEpBanner = '';
    if (this.anime.status === 'Currently Airing' && this.anime.broadcast && this.anime.broadcast.time) {
      const b = this.anime.broadcast;
      const days = { 'Sundays': 0, 'Mondays': 1, 'Tuesdays': 2, 'Wednesdays': 3, 'Thursdays': 4, 'Fridays': 5, 'Saturdays': 6 };
      if (days[b.day] !== undefined) {
        const [h, m] = b.time.split(':').map(Number);
        const tokyoNow = new Date(new Date().toLocaleString("en-US", {timeZone: b.timezone || 'Asia/Tokyo'}));
        let target = new Date(tokyoNow);
        target.setHours(h, m, 0, 0);
        let dAdd = days[b.day] - tokyoNow.getDay();
        if (dAdd < 0 || (dAdd === 0 && target < tokyoNow)) dAdd += 7;
        target.setDate(target.getDate() + dAdd);
        const diffMs = target - tokyoNow;
        if (diffMs > 0) {
          nextEpBanner = `
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `;
          this._startCountdownTimer(target, tokyoNow);
        }
      }
    }

    container.innerHTML = `
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${bannerUrl}')"></div>
      
      <!-- Capa de Luces Apagadas -->
      <div class="dim-overlay" id="dim-overlay"></div>

      <div class="watch-layout-v5 ${this.isTheater ? 'theater-active' : ''}" id="watch-layout">
        
        <!-- SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROLES -->
        <div class="player-section-v5" id="player-section">
          
          <!-- Reproductor de Video -->
          <div class="video-wrapper-v5" id="video-container">
            ${this.episodeData && this.episodeData.activeServers && this.episodeData.activeServers.length > 0 
              ? `<iframe src="${this.episodeData.activeServers[0].url}" allowfullscreen allow="autoplay; encrypted-media"></iframe>` 
              : `<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
                  <span style="font-size: 40px;">⚠️</span>
                  <h3 style="font-family:'Outfit'; font-size:18px;">Video no disponible</h3>
                  <p style="color:var(--text-muted); font-size:13px; max-width: 400px; margin: 0;">El episodio ${this.episodeNum} en idioma ${this.lang === 'sub' ? 'Subtitulado' : 'Latino'} no tiene enlaces disponibles actualmente.</p>
                 </div>`
            }
          </div>

          <!-- Barra de Controles Premium -->
          <div class="player-controls-v5">
            <div class="player-controls-left">
              <button class="control-btn-v5" id="btn-lights">
                💡 <span id="lights-text">Apagar Luces</span>
              </button>
              <button class="control-btn-v5 ${this.isTheater ? 'active' : ''}" id="btn-theater">
                🎬 <span id="theater-text">${this.isTheater ? 'Modo Normal' : 'Modo Cine'}</span>
              </button>
              <button class="control-btn-v5 ${isWatchedCurrent ? 'active' : ''}" id="btn-watched-status">
                👁️ <span id="watched-status-text">${isWatchedCurrent ? 'Visto' : 'Marcar Visto'}</span>
              </button>
            </div>
            <div class="player-controls-right">
              <button class="control-btn-v5 ${this.isFav ? 'active' : ''}" id="btn-favorite">
                ⭐ <span id="fav-text">${this.isFav ? 'Quitar Favorito' : 'Favorito'}</span>
              </button>
              <a href="${anilistLink}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${malLink}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
                <span class="badge-mal">MAL</span>
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN CENTRAL: METADATOS Y RECOMENDADOS -->
        <div class="watch-main-column-v5" id="main-column">
          
          <!-- Banner de cuenta regresiva si está en emisión -->
          ${nextEpBanner}

          <!-- Título del Episodio Actual -->
          <div style="margin-bottom: 30px;">
            <span style="color: var(--accent); font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">Estás Viendo:</span>
            <h1 class="details-title-v5" style="margin-top: 5px; font-size: 2rem;" id="active-episode-title">
              ${this.anime.title} — Episodio ${this.episodeNum}
            </h1>
            <p style="color: var(--text-muted); font-size: 13px; font-weight: 600; margin-top: 5px;">
              Formato: ${this.lang === 'sub' ? 'Subtitulado al Español' : 'Doblaje Latino'}
            </p>
          </div>

          <!-- Selectores Premium estilo Animex (Píldoras) -->
          <div class="selection-container-v5">
            <div class="server-selection-v5">
              <span class="selection-label-v5">Servidores Disponibles</span>
              <div class="server-pills-v5" id="server-pills">
                ${this.episodeData && this.episodeData.activeServers && this.episodeData.activeServers.length > 0 
                  ? this.episodeData.activeServers.map((s, idx) => `
                      <button class="server-pill-v5 ${idx === 0 ? 'active' : ''}" data-url="${s.url}">
                        🚀 ${s.server}
                      </button>
                    `).join('')
                  : `<span style="color:var(--text-muted); font-size:12px; font-weight:600;">Ninguno disponible</span>`
                }
              </div>
            </div>
            
            <div class="lang-selection-v5">
              <span class="selection-label-v5">Cambiar Idioma</span>
              <div class="lang-pills-v5">
                <button class="lang-pill-v5 ${this.lang === 'sub' ? 'active' : ''}" data-lang="sub">Subtitulado</button>
                <button class="lang-pill-v5 ${this.lang === 'dub' ? 'active' : ''}" data-lang="dub">Doblaje Latino</button>
              </div>
            </div>
          </div>

          <!-- Ficha Ampliada del Anime (Metadata) -->
          <div class="anime-details-card-v5">
            <div class="details-poster-v5">
              <img src="${coverUrl}" alt="${this.anime.title}">
            </div>
            <div class="details-info-v5">
              <span style="color: var(--accent); font-size: 9px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;">Ficha del Anime</span>
              <h2 class="details-title-v5" style="font-size: 1.5rem; margin-bottom: 15px;">${this.anime.title}</h2>
              
              <div class="details-meta-row-v5">
                <span class="meta-tag-v5 score">★ ${this.anime.score || 'N/A'}</span>
                <span class="meta-tag-v5">${this.anime.type || 'TV'}</span>
                <span class="meta-tag-v5">${this.anime.year || this.anime.season || 'N/A'}</span>
                <span class="meta-tag-v5">${this.anime.status === 'Currently Airing' ? 'En Emisión' : 'Finalizado'}</span>
              </div>

              <div class="details-grid-fields-v5">
                <div class="field-item-v5"><strong>Estudio:</strong> ${this.anime.studios?.map(s => s.name).join(', ') || 'Desconocido'}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration || '24 min por ep.'}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes || 'Desconocido'}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${this.anime.genres?.map(g => g.name).slice(0, 3).join(', ') || 'N/A'}</div>
              </div>

              <div class="synopsis-container-v5" id="synopsis-box">
                <div class="synopsis-text-v5" id="synopsis-text">
                  ${this.anime.synopsis || 'No hay sinopsis disponible para este anime.'}
                </div>
                <div class="synopsis-fade-v5"></div>
                <button class="btn-more-v5" id="btn-more-synopsis">... ver más</button>
              </div>
            </div>
          </div>

          <!-- Carrusel de Animes Recomendados (Related) -->
          <div class="related-section-v5">
            <h3 class="section-title">ANIMES RECOMENDADOS</h3>
            <div class="related-grid-v5" id="related-grid">
              <!-- Skeletons de carga -->
              ${Array.from({length: 3}, () => `
                <div class="related-card-v5" style="opacity:0.5; pointer-events:none;">
                  <div class="skeleton" style="width:55px; height:75px; border-radius:10px;"></div>
                  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:8px;">
                    <div class="skeleton" style="height:12px; width:80%;"></div>
                    <div class="skeleton" style="height:8px; width:40%;"></div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>

        <!-- SECCIÓN DERECHA: SIDEBAR DE EPISODIOS -->
        <div class="watch-side-column-v5" id="side-column">
          <aside class="ep-sidebar-v5">
            <div class="sidebar-header-v5">
              <div class="sidebar-title-row">
                <h3 class="sidebar-title-v5">Episodios</h3>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button id="btn-watched-all" class="sidebar-icon-btn" title="Marcar temporada como vista">✓✓</button>
                  <button id="btn-sort-ep" class="sidebar-icon-btn" title="Invertir orden">⇅</button>
                </div>
              </div>
              <div class="ep-search-container-v5">
                <input type="text" id="ep-search-input" placeholder="Buscar episodio..." class="ep-search-input-v5">
              </div>
            </div>
            
            <div class="ep-list-v5" id="sidebar-ep-list">
              <p style="color:var(--text-muted); text-align:center; padding:20px; font-size:12px;">Cargando episodios...</p>
            </div>
          </aside>
        </div>

      </div>
    `;

    return container;
  }

  async afterRender() {
    this._initPlayerControls();
    this._initServerPills();
    this._initSynopsisExpand();
    this._initWatchedToggleControls();
    
    // Iniciar cargas asíncronas en segundo plano para evitar bloqueos
    this._loadEnrichedEpisodesAndRecommendations();
    
    // Limpiar de forma segura cualquier temporizador activo previo para evitar fugas de memoria
    if (window.activeWatchInterval) {
      clearInterval(window.activeWatchInterval);
      window.activeWatchInterval = null;
    }
    
    // Configurar estado visual inicial e iniciar temporizador si no está visto
    if (this.anime) {
      const isWatched = this.watchedEpisodes.has(this.episodeNum);
      const btnWatchedStatus = document.getElementById('btn-watched-status');
      const watchedStatusText = document.getElementById('watched-status-text');

      if (isWatched) {
        if (btnWatchedStatus) btnWatchedStatus.classList.add('active');
        if (watchedStatusText) watchedStatusText.textContent = 'Visto';
      } else {
        if (btnWatchedStatus) btnWatchedStatus.classList.remove('active');
        if (watchedStatusText) watchedStatusText.textContent = 'Marcar Visto';

        // Inicializar el temporizador de 2 minutos de visualización activa
        this.watchTimeCounter = 0;

        window.activeWatchInterval = setInterval(async () => {
          // Autocleanup si el layout ya no está en el DOM (navegación SPA)
          const isStillInDOM = document.getElementById('watch-layout');
          if (!isStillInDOM) {
            clearInterval(window.activeWatchInterval);
            window.activeWatchInterval = null;
            return;
          }

          // Solo sumar segundos si la pestaña está activa/visible
          if (!document.hidden) {
            this.watchTimeCounter++;

            if (this.watchTimeCounter >= 120) {
              clearInterval(window.activeWatchInterval);
              window.activeWatchInterval = null;
              console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");

              await dbService.addToHistory(
                String(this.animeId),
                this.episodeNum,
                120,
                120
              );
              this.watchedEpisodes.add(this.episodeNum);

              if (btnWatchedStatus) btnWatchedStatus.classList.add('active');
              if (watchedStatusText) watchedStatusText.textContent = 'Visto';

              if (this.renderEpisodes) {
                this.renderEpisodes();
              }
            }
          }
        }, 1000);
      }
    }
  }

  // 1. Controles de Visualización (Modo Cine, Luces, Favoritos)
  _initPlayerControls() {
    const layout = document.getElementById('watch-layout');
    const playerSection = document.getElementById('player-section');
    const mainColumn = document.getElementById('main-column');
    const dimOverlay = document.getElementById('dim-overlay');
    
    const btnTheater = document.getElementById('btn-theater');
    const btnLights = document.getElementById('btn-lights');
    const btnFav = document.getElementById('btn-favorite');
    
    const lightsText = document.getElementById('lights-text');
    const theaterText = document.getElementById('theater-text');
    const favText = document.getElementById('fav-text');

    // MODO CINE
    const updateTheaterDOM = (active) => {
      if (active) {
        layout.classList.add('theater-active');
        layout.insertBefore(playerSection, layout.firstChild);
        if (theaterText) theaterText.textContent = 'Modo Normal';
      } else {
        layout.classList.remove('theater-active');
        mainColumn.insertBefore(playerSection, mainColumn.firstChild);
        if (theaterText) theaterText.textContent = 'Modo Cine';
      }
    };

    if (this.isTheater) updateTheaterDOM(true);

    if (btnTheater) {
      btnTheater.addEventListener('click', () => {
        this.isTheater = !this.isTheater;
        localStorage.setItem('watch-theater-mode', this.isTheater);
        btnTheater.classList.toggle('active', this.isTheater);
        updateTheaterDOM(this.isTheater);
      });
    }

    // APAGAR LUCES
    const toggleLights = (dim) => {
      const active = dim !== undefined ? dim : !dimOverlay.classList.contains('active');
      dimOverlay.classList.toggle('active', active);
      playerSection.classList.toggle('dimmed-active', active);
      btnLights.classList.toggle('active', active);
      if (lightsText) lightsText.textContent = active ? 'Encender Luces' : 'Apagar Luces';
    };

    if (btnLights) {
      btnLights.addEventListener('click', () => toggleLights());
    }
    if (dimOverlay) {
      dimOverlay.addEventListener('click', () => toggleLights(false));
    }

    // FAVORITO INDEXEDDB
    if (btnFav) {
      btnFav.addEventListener('click', async () => {
        if (!this.anime) return;
        const added = await dbService.toggleFavorite(this.anime);
        this.isFav = added;
        btnFav.classList.toggle('active', added);
        if (favText) favText.textContent = added ? 'Quitar Favorito' : 'Favorito';
      });
    }
  }

  // 2. Control de píldoras de servidor (iframe dinámico sin recargar)
  _initServerPills() {
    const pills = document.querySelectorAll('.server-pill-v5');
    const iframe = document.querySelector('.video-wrapper-v5 iframe');

    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        const videoUrl = pill.getAttribute('data-url');
        if (iframe && videoUrl) {
          iframe.src = videoUrl;
          
          // Micro-animación de carga en el reproductor
          const container = document.getElementById('video-container');
          container.style.opacity = '0.5';
          setTimeout(() => container.style.opacity = '1', 500);
        }
      });
    });

    // Idioma
    const langPills = document.querySelectorAll('.lang-pill-v5');
    langPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const selectedLang = pill.getAttribute('data-lang');
        const titleParam = this.anime ? `&title=${encodeURIComponent(this.anime.title)}` : '';
        window.location.href = `/watch/${this.animeId}/${this.episodeNum}/${selectedLang}?title=${encodeURIComponent(this.anime.title)}`;
      });
    });
  }

  // 3. Sinopsis expandible
  _initSynopsisExpand() {
    const box = document.getElementById('synopsis-box');
    const btn = document.getElementById('btn-more-synopsis');
    
    if (btn && box) {
      btn.addEventListener('click', () => {
        const isExpanded = box.classList.toggle('expanded');
        btn.textContent = isExpanded ? '... ver menos' : '... ver más';
      });
    }
  }

  // 4. Temporizador de cuenta regresiva en vivo
  _startCountdownTimer(targetDate, initialNow) {
    let diffMs = targetDate - initialNow;
    
    const interval = setInterval(() => {
      const el = document.getElementById('countdown-timer');
      if (!el) {
        clearInterval(interval);
        return;
      }
      
      diffMs -= 1000;
      if (diffMs <= 0) {
        el.textContent = "¡Disponible ya en Emisión!";
        clearInterval(interval);
        return;
      }

      const d = Math.floor(diffMs / 86400000);
      const h = Math.floor((diffMs % 86400000) / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);

      let text = '';
      if (d > 0) text += `${d}d `;
      if (h > 0 || d > 0) text += `${h}h `;
      text += `${m}m ${s}s`;

      el.textContent = text;
    }, 1000);
  }

  // 5. Carga asíncrona de recomendaciones y episodios enriquecidos (AniList + Jikan)
  async _loadEnrichedEpisodesAndRecommendations() {
    const relatedGrid = document.getElementById('related-grid');
    const epListEl = document.getElementById('sidebar-ep-list');
    
    // Cargas paralelas en segundo plano
    const [recRes, alEpisodes] = await Promise.all([
      apiService.getAnimeRecommendations(this.animeId).catch(() => null),
      apiService.getAnilistEpisodes(this.animeId).catch(() => [])
    ]);

    // RENDER: Recomendados
    if (relatedGrid) {
      if (recRes && recRes.data && recRes.data.length > 0) {
        const items = recRes.data.slice(0, 6);
        relatedGrid.innerHTML = items.map(item => `
          <a href="/anime/${item.entry.mal_id}" data-link class="related-card-v5">
            <img src="${item.entry.images?.jpg?.image_url}" class="related-img-v5" alt="${item.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${item.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `).join('');
      } else {
        relatedGrid.innerHTML = `<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>`;
      }
    }

    // ENRIQUECER EPISODIOS LOCALES
    if (this.localInfo && this.localInfo.episodes) {
      const episodes = this.localInfo.episodes;
      const thumb = this.anime.images?.jpg?.large_image_url || '';
      const titleHint = this.anime.title;

      const renderEpisodes = () => {
        let sortedList = [...episodes];
        if (this.sortDesc) sortedList.reverse();
        
        if (this.searchQuery.trim() !== '') {
          sortedList = sortedList.filter(ep => 
            String(ep.number).includes(this.searchQuery) ||
            (ep.title && ep.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
          );
        }

        if (sortedList.length === 0) {
          epListEl.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>`;
          return;
        }

        epListEl.innerHTML = sortedList.map(ep => {
          // Buscar thumbnail y título en AniList
          let epTitle = `Episodio ${ep.number}`;
          let epThumb = thumb;

          // AniList streamingEpisodes suele mapearse 1-1
          const alEp = alEpisodes[ep.number - 1];
          if (alEp) {
            if (alEp.title) epTitle = alEp.title.replace(/^Episode \d+\s*-?\s*/i, '');
            if (alEp.thumbnail) epThumb = alEp.thumbnail;
          }

          // Si es el activo, guardar título
          if (ep.number === this.episodeNum) {
            const activeTitleEl = document.getElementById('active-episode-title');
            if (activeTitleEl) activeTitleEl.textContent = `${this.anime.title} — ${epTitle}`;
          }

          const isActive = ep.number === this.episodeNum;
          const isWatched = this.watchedEpisodes.has(ep.number);
          const href = `/watch/${this.animeId}/${ep.number}/${this.lang}?title=${encodeURIComponent(titleHint)}`;

          const badgeHtml = isWatched ? `<div class="ep-watched-badge-v5">✓ Visto</div>` : '';
          const progressBarHtml = isWatched ? `<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>` : '';

          return `
            <a href="${href}" data-link class="ep-item-horizontal-v5 ${isActive ? 'active' : ''} ${isWatched ? 'watched' : ''}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${epThumb}" alt="Episodio ${ep.number}" loading="lazy">
                ${badgeHtml}
                ${progressBarHtml}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${ep.number}</span>
                <span class="ep-title-v5">${epTitle}</span>
              </div>
            </a>
          `;
        }).join('');

        // Actualizar botón de marcar temporada
        const btnWatchedAll = document.getElementById('btn-watched-all');
        if (btnWatchedAll && this.localInfo && this.localInfo.episodes) {
          const allEpNums = this.localInfo.episodes.map(e => e.number);
          const allWatched = allEpNums.every(num => this.watchedEpisodes.has(num));
          btnWatchedAll.classList.toggle('active', allWatched);
          btnWatchedAll.title = allWatched ? "Desmarcar toda la temporada" : "Marcar toda la temporada como vista";
        }
      };

      // Guardar referencia a renderEpisodes para actualizaciones reactivas
      this.renderEpisodes = renderEpisodes;

      // Iniciar render inicial de episodios
      renderEpisodes();

      // Buscador interactivo
      const searchInput = document.getElementById('ep-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value;
          renderEpisodes();
        });
      }

      // Orden inverso
      const sortBtn = document.getElementById('btn-sort-ep');
      if (sortBtn) {
        sortBtn.addEventListener('click', () => {
          this.sortDesc = !this.sortDesc;
          sortBtn.classList.toggle('active', this.sortDesc);
          renderEpisodes();
        });
      }
    }
  }

  _initWatchedToggleControls() {
    const btnWatchedStatus = document.getElementById('btn-watched-status');
    const watchedStatusText = document.getElementById('watched-status-text');
    const btnWatchedAll = document.getElementById('btn-watched-all');

    if (btnWatchedStatus) {
      btnWatchedStatus.addEventListener('click', async () => {
        const isCurrentlyWatched = this.watchedEpisodes.has(this.episodeNum);

        // Cancelar cualquier temporizador activo al interactuar manualmente
        if (window.activeWatchInterval) {
          clearInterval(window.activeWatchInterval);
          window.activeWatchInterval = null;
        }

        if (isCurrentlyWatched) {
          // Desmarcar: eliminar de IndexedDB history
          const existing = await db.history.where({ animeId: String(this.animeId), episodeId: this.episodeNum }).first();
          if (existing) {
            await db.history.delete(existing.id);
          }
          this.watchedEpisodes.delete(this.episodeNum);
          btnWatchedStatus.classList.remove('active');
          if (watchedStatusText) watchedStatusText.textContent = 'Marcar Visto';
          
          // Sincronizar desmarcado de inmediato con el servidor
          await dbService.triggerSync();
        } else {
          // Marcar: agregar a IndexedDB
          await dbService.addToHistory(String(this.animeId), this.episodeNum, 120, 120);
          this.watchedEpisodes.add(this.episodeNum);
          btnWatchedStatus.classList.add('active');
          if (watchedStatusText) watchedStatusText.textContent = 'Visto';
          // triggerSync se dispara automáticamente dentro de addToHistory()
        }

        // Refrescar reactivamente
        if (this.renderEpisodes) {
          this.renderEpisodes();
        }
      });
    }

    if (btnWatchedAll) {
      btnWatchedAll.addEventListener('click', async () => {
        if (!this.localInfo || !this.localInfo.episodes) return;
        const episodes = this.localInfo.episodes;
        const allEpNums = episodes.map(ep => ep.number);

        // Cancelar temporizador activo al interactuar en lote
        if (window.activeWatchInterval) {
          clearInterval(window.activeWatchInterval);
          window.activeWatchInterval = null;
        }

        // Verificar si todos están vistos
        const allWatched = allEpNums.every(num => this.watchedEpisodes.has(num));

        if (allWatched) {
          // Desmarcar todos
          await db.transaction('rw', db.history, async () => {
            for (const num of allEpNums) {
              const existing = await db.history.where({ animeId: String(this.animeId), episodeId: num }).first();
              if (existing) {
                await db.history.delete(existing.id);
              }
            }
          });
          allEpNums.forEach(num => this.watchedEpisodes.delete(num));
          
          // Sincronizar botón del reproductor
          if (this.watchedEpisodes.has(this.episodeNum)) {
            if (btnWatchedStatus) btnWatchedStatus.classList.add('active');
            if (watchedStatusText) watchedStatusText.textContent = 'Visto';
          } else {
            if (btnWatchedStatus) btnWatchedStatus.classList.remove('active');
            if (watchedStatusText) watchedStatusText.textContent = 'Marcar Visto';
          }
        } else {
          // Marcar todos
          const timestamp = Date.now();
          await db.transaction('rw', db.history, async () => {
            for (const num of allEpNums) {
              const existing = await db.history.where({ animeId: String(this.animeId), episodeId: num }).first();
              if (!existing) {
                await db.history.add({
                  animeId: String(this.animeId),
                  episodeId: num,
                  progress: 120,
                  duration: 120,
                  timestamp,
                  updatedAt: timestamp
                });
              }
            }
          });
          allEpNums.forEach(num => this.watchedEpisodes.add(num));

          // Sincronizar botón del reproductor
          if (this.watchedEpisodes.has(this.episodeNum)) {
            if (btnWatchedStatus) btnWatchedStatus.classList.add('active');
            if (watchedStatusText) watchedStatusText.textContent = 'Visto';
          } else {
            if (btnWatchedStatus) btnWatchedStatus.classList.remove('active');
            if (watchedStatusText) watchedStatusText.textContent = 'Marcar Visto';
          }
        }

        // Sincronizar lote completo con el servidor de inmediato
        await dbService.triggerSync();

        // Refrescar reactivamente
        if (this.renderEpisodes) {
          this.renderEpisodes();
        }
      });
    }
  }
}
