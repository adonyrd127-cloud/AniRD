/**
 * AniRD Custom Video Player
 * ─────────────────────────────────────────────────────────────────────────────
 * Reproductor HTML5 nativo con:
 *  • HLS via hls.js
 *  • AniSkip (saltar intro / outro / recap)
 *  • Controles personalizados estilo Netflix/Crunchyroll
 *  • Atajos de teclado (espacio, F, M, flechas, J/L)
 *  • Auto-hide cursor & controles tras 3s
 *  • Selector de calidad (niveles HLS)
 *  • Selector de velocidad de reproducción
 *  • Picture-in-Picture
 *  • Recordar posición (localStorage)
 *  • Manejo de errores premium
 */

// ── SVG Icon Library (inline para zero-dependency) ──────────────────────────
const ICONS = {
  play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
  pause: `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`,
  volumeHigh: `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
  volumeLow: `<svg viewBox="0 0 24 24"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>`,
  volumeMute: `<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
  fullscreenEnter: `<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>`,
  fullscreenExit: `<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>`,
  pip: `<svg viewBox="0 0 24 24"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/></svg>`,
  settings: `<svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>`,
  speed: `<svg viewBox="0 0 24 24"><path d="M10 8v8l6-4-6-4zm-2 4c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6H4v2h10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4H6z"/></svg>`,
  skipForward: `<svg viewBox="0 0 24 24"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>`,
  skipBack: `<svg viewBox="0 0 24 24"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>`,
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function isDirectStreamUrl(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  return lower.includes('.m3u8') || lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.ogg');
}

// ── HLS.js Loader ───────────────────────────────────────────────────────────
let hlsScriptLoaded = false;
let hlsScriptLoading = false;
const hlsLoadCallbacks = [];

function loadHlsScript() {
  return new Promise((resolve) => {
    if (window.Hls) { resolve(); return; }
    if (hlsScriptLoaded) { resolve(); return; }
    if (hlsScriptLoading) { hlsLoadCallbacks.push(resolve); return; }

    hlsScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
    script.onload = () => {
      hlsScriptLoaded = true;
      hlsScriptLoading = false;
      resolve();
      hlsLoadCallbacks.forEach(cb => cb());
      hlsLoadCallbacks.length = 0;
    };
    script.onerror = () => {
      hlsScriptLoading = false;
      console.error('[AniRD Player] Failed to load hls.js');
      resolve(); // resolve anyway, will fallback
    };
    document.head.appendChild(script);
  });
}

// ── AniSkip API ─────────────────────────────────────────────────────────────
async function fetchSkipData(malId, episodeNumber) {
  if (!malId || !episodeNumber) return null;
  try {
    const url = `https://api.aniskip.com/v2/skip-times/${malId}/${episodeNumber}?types[]=op&types[]=ed&types[]=recap&episodeLength=0`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.found || !data.results || data.results.length === 0) return null;
    const skipData = {};
    data.results.forEach(item => {
      skipData[item.skipType] = {
        start: item.interval.startTime,
        end: item.interval.endTime,
        type: item.skipType,
      };
    });
    return skipData;
  } catch (e) {
    console.warn('[AniRD Player] AniSkip fetch error:', e);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  VideoPlayer Class
// ═══════════════════════════════════════════════════════════════════════════════
export default class VideoPlayer {
  /**
   * @param {Object} options
   * @param {HTMLElement} options.container - Contenedor donde se montará el reproductor
   * @param {string} options.videoUrl - URL del stream (.m3u8, .mp4, o embebida)
   * @param {number} options.malId - MyAnimeList ID
   * @param {number} options.episodeNumber - Número del episodio
   * @param {string} [options.episodeTitle] - Título descriptivo del episodio
   * @param {Function} [options.onEpisodeEnd] - Callback al terminar el episodio
   * @param {Function} [options.onTimeUpdate] - Callback (currentTime, duration)
   */
  constructor(options) {
    this.container = options.container;
    this.videoUrl = options.videoUrl;
    this.malId = options.malId;
    this.episodeNumber = options.episodeNumber;
    this.episodeTitle = options.episodeTitle || `Episodio ${options.episodeNumber}`;
    this.onEpisodeEnd = options.onEpisodeEnd || null;
    this.onTimeUpdate = options.onTimeUpdate || null;

    // State
    this.hls = null;
    this.video = null;
    this.skipData = null;
    this.qualityLevels = [];
    this.currentQuality = -1; // -1 = Auto
    this.isFullscreen = false;
    this.hideControlsTimeout = null;
    this.savePositionInterval = null;
    this.destroyed = false;

    // UI Elements (set during build)
    this.els = {};

    this._init();
  }

  // ── Initialize ──────────────────────────────────────────────────────────
  async _init() {
    this._buildDOM();
    this._attachListeners();

    // Load HLS script in parallel with AniSkip
    const [, skipData] = await Promise.all([
      loadHlsScript(),
      fetchSkipData(this.malId, this.episodeNumber),
    ]);

    if (this.destroyed) return;

    this.skipData = skipData;
    this._renderSkipMarkers();
    this._loadVideo();
    this._checkResumePosition();
  }

  // ── Build DOM ───────────────────────────────────────────────────────────
  _buildDOM() {
    this.container.innerHTML = '';
    const playerEl = document.createElement('div');
    playerEl.className = 'anird-player controls-visible';
    playerEl.tabIndex = 0;

    playerEl.innerHTML = `
      <video id="anird-video" playsinline preload="auto"></video>

      <!-- Loading Spinner -->
      <div class="anird-player__loading" id="ap-loading" style="display:none">
        <div class="anird-player__spinner"></div>
      </div>

      <!-- Big Play Button (center) -->
      <div class="anird-player__big-play visible" id="ap-big-play">
        <div class="anird-player__big-play-icon">${ICONS.play}</div>
      </div>

      <!-- Top gradient with title -->
      <div class="anird-player__top-gradient">
        <span class="anird-player__episode-title">${this._escapeHtml(this.episodeTitle)}</span>
      </div>

      <!-- Seek feedback indicators -->
      <div class="anird-player__seek-indicator anird-player__seek-indicator--left" id="ap-seek-left">-10s</div>
      <div class="anird-player__seek-indicator anird-player__seek-indicator--right" id="ap-seek-right">+10s</div>

      <!-- Skip Intro/Outro buttons (hidden by default) -->
      <button class="anird-player__skip-btn hidden" id="ap-skip-intro" aria-label="Saltar Intro">Saltar Intro ▶</button>
      <button class="anird-player__skip-btn hidden" id="ap-skip-outro" aria-label="Saltar Outro">Saltar Outro ▶</button>

      <!-- Controls overlay -->
      <div class="anird-player__controls" id="ap-controls">
        <!-- Progress bar -->
        <div class="anird-player__progress-container" id="ap-progress-container">
          <div class="anird-player__progress-bar" id="ap-progress-bar">
            <div class="anird-player__progress-buffered" id="ap-progress-buffered"></div>
            <div class="anird-player__progress-played" id="ap-progress-played"></div>
            <div class="anird-player__progress-thumb" id="ap-progress-thumb"></div>
          </div>
          <div class="anird-player__progress-tooltip" id="ap-progress-tooltip">0:00</div>
        </div>

        <!-- Bottom row -->
        <div class="anird-player__bottom-row">
          <div class="anird-player__left-controls">
            <button class="anird-player__btn" id="ap-btn-play" aria-label="Reproducir">${ICONS.play}</button>
            <button class="anird-player__btn" id="ap-btn-skip-back" aria-label="-10s">${ICONS.skipBack}</button>
            <button class="anird-player__btn" id="ap-btn-skip-fwd" aria-label="+10s">${ICONS.skipForward}</button>
            <div class="anird-player__volume-group">
              <button class="anird-player__btn" id="ap-btn-volume" aria-label="Volumen">${ICONS.volumeHigh}</button>
              <div class="anird-player__volume-slider-container">
                <input type="range" class="anird-player__volume-slider" id="ap-volume-slider" min="0" max="1" step="0.05" value="1">
              </div>
            </div>
            <span class="anird-player__time" id="ap-time">0:00 / 0:00</span>
          </div>

          <div class="anird-player__right-controls">
            <!-- Speed -->
            <div style="position:relative">
              <button class="anird-player__btn" id="ap-btn-speed" aria-label="Velocidad">${ICONS.speed}</button>
              <div class="anird-player__menu" id="ap-menu-speed">
                <button class="anird-player__menu-item" data-speed="0.5">0.5x</button>
                <button class="anird-player__menu-item" data-speed="0.75">0.75x</button>
                <button class="anird-player__menu-item active" data-speed="1">Normal</button>
                <button class="anird-player__menu-item" data-speed="1.25">1.25x</button>
                <button class="anird-player__menu-item" data-speed="1.5">1.5x</button>
                <button class="anird-player__menu-item" data-speed="2">2x</button>
              </div>
            </div>
            <!-- Quality -->
            <div style="position:relative">
              <button class="anird-player__btn" id="ap-btn-quality" aria-label="Calidad">${ICONS.settings}</button>
              <div class="anird-player__menu" id="ap-menu-quality">
                <button class="anird-player__menu-item active" data-quality="-1">Auto</button>
              </div>
            </div>
            <button class="anird-player__btn" id="ap-btn-pip" aria-label="Picture-in-Picture">${ICONS.pip}</button>
            <button class="anird-player__btn" id="ap-btn-fullscreen" aria-label="Pantalla Completa">${ICONS.fullscreenEnter}</button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(playerEl);

    // Cache element references
    this.playerEl = playerEl;
    this.video = playerEl.querySelector('#anird-video');
    this.els = {
      loading: playerEl.querySelector('#ap-loading'),
      bigPlay: playerEl.querySelector('#ap-big-play'),
      seekLeft: playerEl.querySelector('#ap-seek-left'),
      seekRight: playerEl.querySelector('#ap-seek-right'),
      skipIntro: playerEl.querySelector('#ap-skip-intro'),
      skipOutro: playerEl.querySelector('#ap-skip-outro'),
      controls: playerEl.querySelector('#ap-controls'),
      progressContainer: playerEl.querySelector('#ap-progress-container'),
      progressBar: playerEl.querySelector('#ap-progress-bar'),
      progressBuffered: playerEl.querySelector('#ap-progress-buffered'),
      progressPlayed: playerEl.querySelector('#ap-progress-played'),
      progressThumb: playerEl.querySelector('#ap-progress-thumb'),
      progressTooltip: playerEl.querySelector('#ap-progress-tooltip'),
      btnPlay: playerEl.querySelector('#ap-btn-play'),
      btnSkipBack: playerEl.querySelector('#ap-btn-skip-back'),
      btnSkipFwd: playerEl.querySelector('#ap-btn-skip-fwd'),
      btnVolume: playerEl.querySelector('#ap-btn-volume'),
      volumeSlider: playerEl.querySelector('#ap-volume-slider'),
      time: playerEl.querySelector('#ap-time'),
      btnSpeed: playerEl.querySelector('#ap-btn-speed'),
      menuSpeed: playerEl.querySelector('#ap-menu-speed'),
      btnQuality: playerEl.querySelector('#ap-btn-quality'),
      menuQuality: playerEl.querySelector('#ap-menu-quality'),
      btnPip: playerEl.querySelector('#ap-btn-pip'),
      btnFullscreen: playerEl.querySelector('#ap-btn-fullscreen'),
    };
  }

  // ── Attach Event Listeners ──────────────────────────────────────────────
  _attachListeners() {
    const { video, playerEl, els } = this;

    // Play/Pause - button
    els.btnPlay.addEventListener('click', () => this.togglePlay());
    // Play/Pause - click on video
    video.addEventListener('click', () => this.togglePlay());
    // Big play button
    els.bigPlay.addEventListener('click', () => this.togglePlay());

    // Video events
    video.addEventListener('play', () => this._onPlayStateChange());
    video.addEventListener('pause', () => this._onPlayStateChange());
    video.addEventListener('timeupdate', () => this._onTimeUpdate());
    video.addEventListener('progress', () => this._onBufferUpdate());
    video.addEventListener('loadedmetadata', () => this._onMetadataLoaded());
    video.addEventListener('waiting', () => { els.loading.style.display = ''; });
    video.addEventListener('canplay', () => { els.loading.style.display = 'none'; });
    video.addEventListener('ended', () => this._onEnded());
    video.addEventListener('error', (e) => this._showError('Error de reproducción', 'No se pudo cargar el video. Intenta con otro servidor.'));
    video.addEventListener('volumechange', () => this._updateVolumeIcon());

    // Skip buttons
    els.skipIntro.addEventListener('click', () => {
      if (this.skipData?.op) { video.currentTime = this.skipData.op.end; }
    });
    els.skipOutro.addEventListener('click', () => {
      if (this.skipData?.ed) { video.currentTime = this.skipData.ed.end; }
    });

    // Progress bar seeking
    let isSeeking = false;
    els.progressContainer.addEventListener('mousedown', (e) => {
      isSeeking = true;
      this._seekToPosition(e);
    });
    document.addEventListener('mousemove', (e) => {
      if (isSeeking) this._seekToPosition(e);
      // Tooltip
      if (els.progressContainer.matches(':hover') || isSeeking) {
        this._updateTooltip(e);
      }
    });
    document.addEventListener('mouseup', () => { isSeeking = false; });

    // Touch seeking
    els.progressContainer.addEventListener('touchstart', (e) => {
      isSeeking = true;
      this._seekToPosition(e.touches[0]);
    }, { passive: true });
    els.progressContainer.addEventListener('touchmove', (e) => {
      if (isSeeking) this._seekToPosition(e.touches[0]);
    }, { passive: true });
    els.progressContainer.addEventListener('touchend', () => { isSeeking = false; });

    // Volume
    els.btnVolume.addEventListener('click', () => this.toggleMute());
    els.volumeSlider.addEventListener('input', (e) => {
      video.volume = parseFloat(e.target.value);
      video.muted = false;
    });

    // Skip ±10s buttons
    els.btnSkipBack.addEventListener('click', () => this.seek(-10));
    els.btnSkipFwd.addEventListener('click', () => this.seek(10));

    // Speed menu
    els.btnSpeed.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggleMenu('speed');
    });
    els.menuSpeed.querySelectorAll('.anird-player__menu-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const speed = parseFloat(item.dataset.speed);
        video.playbackRate = speed;
        els.menuSpeed.querySelectorAll('.anird-player__menu-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        this._closeMenus();
      });
    });

    // Quality menu
    els.btnQuality.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggleMenu('quality');
    });

    // PiP
    els.btnPip.addEventListener('click', () => this.togglePiP());

    // Fullscreen
    els.btnFullscreen.addEventListener('click', () => this.toggleFullscreen());

    // Close menus on click outside
    playerEl.addEventListener('click', () => this._closeMenus());

    // Auto-hide controls
    playerEl.addEventListener('mousemove', () => this._resetHideTimer());
    playerEl.addEventListener('mouseleave', () => {
      if (!video.paused) {
        this._startHideTimer(800);
      }
    });
    playerEl.addEventListener('touchstart', () => {
      this._resetHideTimer();
    }, { passive: true });

    // Keyboard shortcuts
    this._keyHandler = (e) => this._handleKeyboard(e);
    document.addEventListener('keydown', this._keyHandler);

    // Fullscreen change
    this._fullscreenHandler = () => this._onFullscreenChange();
    document.addEventListener('fullscreenchange', this._fullscreenHandler);
    document.addEventListener('webkitfullscreenchange', this._fullscreenHandler);

    // Save position every 10 seconds
    this.savePositionInterval = setInterval(() => this._savePosition(), 10000);
  }

  // ── Load Video ──────────────────────────────────────────────────────────
  _loadVideo() {
    const url = this.videoUrl;
    if (!url) {
      this._showError('Video no disponible', 'No se encontró una URL de stream válida para este episodio.');
      return;
    }

    this.els.loading.style.display = '';

    const isHls = url.toLowerCase().includes('.m3u8');

    if (isHls && window.Hls && window.Hls.isSupported()) {
      this.hls = new window.Hls({
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        startLevel: -1, // Auto
      });

      this.hls.loadSource(url);
      this.hls.attachMedia(this.video);

      this.hls.on(window.Hls.Events.MANIFEST_PARSED, (event, data) => {
        this.qualityLevels = data.levels;
        this._buildQualityMenu();
        this.els.loading.style.display = 'none';
      });

      this.hls.on(window.Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              console.error('[AniRD Player] HLS network error, attempting recovery...');
              this.hls.startLoad();
              break;
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              console.error('[AniRD Player] HLS media error, attempting recovery...');
              this.hls.recoverMediaError();
              break;
            default:
              this._showError('Error de reproducción', 'No se pudo cargar el stream de video.');
              this.hls.destroy();
              break;
          }
        }
      });

      this.hls.on(window.Hls.Events.LEVEL_SWITCHED, (event, data) => {
        this._updateQualityMenuActive(data.level);
      });

    } else if (this.video.canPlayType('application/vnd.apple.mpegurl') && isHls) {
      // Safari native HLS
      this.video.src = url;
    } else {
      // Direct MP4/WebM
      this.video.src = url;
    }
  }

  // ── Build Quality Menu ──────────────────────────────────────────────────
  _buildQualityMenu() {
    const menu = this.els.menuQuality;
    menu.innerHTML = '';

    // Auto option
    const autoItem = document.createElement('button');
    autoItem.className = 'anird-player__menu-item active';
    autoItem.dataset.quality = '-1';
    autoItem.textContent = 'Auto';
    autoItem.addEventListener('click', (e) => {
      e.stopPropagation();
      this._setQuality(-1);
      this._closeMenus();
    });
    menu.appendChild(autoItem);

    // Quality levels
    this.qualityLevels.forEach((level, index) => {
      const height = level.height;
      if (!height) return;
      const item = document.createElement('button');
      item.className = 'anird-player__menu-item';
      item.dataset.quality = index;
      item.textContent = `${height}p`;
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this._setQuality(index);
        this._closeMenus();
      });
      menu.appendChild(item);
    });
  }

  _setQuality(levelIndex) {
    if (this.hls) {
      this.hls.currentLevel = levelIndex;
      this.currentQuality = levelIndex;
      this._updateQualityMenuActive(levelIndex);
    }
  }

  _updateQualityMenuActive(activeIndex) {
    const items = this.els.menuQuality.querySelectorAll('.anird-player__menu-item');
    items.forEach(item => {
      const q = parseInt(item.dataset.quality);
      item.classList.toggle('active', q === activeIndex || (activeIndex === -1 && q === -1));
    });
  }

  // ── Skip Markers on progress bar ───────────────────────────────────────
  _renderSkipMarkers() {
    if (!this.skipData) return;
    // We render markers once duration is known, so defer if needed
    const tryRender = () => {
      const duration = this.video.duration;
      if (!duration || !isFinite(duration)) return;
      const bar = this.els.progressBar;
      // Remove existing markers
      bar.querySelectorAll('.anird-player__skip-marker').forEach(m => m.remove());

      Object.values(this.skipData).forEach(skip => {
        const marker = document.createElement('div');
        marker.className = 'anird-player__skip-marker';
        marker.style.left = `${(skip.start / duration) * 100}%`;
        marker.style.width = `${((skip.end - skip.start) / duration) * 100}%`;
        bar.appendChild(marker);
      });
    };

    if (this.video.duration) tryRender();
    else this.video.addEventListener('loadedmetadata', tryRender, { once: true });
  }

  // ── Resume Position ────────────────────────────────────────────────────
  _checkResumePosition() {
    const key = `anird_pos_${this.malId}_${this.episodeNumber}`;
    const saved = localStorage.getItem(key);
    if (!saved) return;

    const pos = parseFloat(saved);
    if (isNaN(pos) || pos < 10) return; // Ignore if < 10 seconds

    // Show resume overlay
    const resumeEl = document.createElement('div');
    resumeEl.className = 'anird-player__resume';
    resumeEl.innerHTML = `
      <span class="anird-player__resume-text">¿Continuar desde ${formatTime(pos)}?</span>
      <div class="anird-player__resume-actions">
        <button class="anird-player__resume-btn anird-player__resume-btn--primary" id="ap-resume-yes">Continuar</button>
        <button class="anird-player__resume-btn anird-player__resume-btn--secondary" id="ap-resume-no">Desde el inicio</button>
      </div>
    `;
    this.playerEl.appendChild(resumeEl);

    resumeEl.querySelector('#ap-resume-yes').addEventListener('click', () => {
      this.video.currentTime = pos;
      resumeEl.remove();
      this.video.play().catch(() => {});
    });
    resumeEl.querySelector('#ap-resume-no').addEventListener('click', () => {
      localStorage.removeItem(key);
      resumeEl.remove();
      this.video.play().catch(() => {});
    });
  }

  _savePosition() {
    if (!this.video || this.destroyed) return;
    const time = this.video.currentTime;
    const duration = this.video.duration;
    if (!time || !duration || isNaN(time)) return;
    // Don't save if near the end (last 30 seconds) or beginning
    if (time < 5 || time > duration - 30) return;
    const key = `anird_pos_${this.malId}_${this.episodeNumber}`;
    localStorage.setItem(key, time.toString());
  }

  // ── Playback Controls ─────────────────────────────────────────────────
  togglePlay() {
    if (this.video.paused) {
      this.video.play().catch(() => {});
    } else {
      this.video.pause();
    }
  }

  seek(seconds) {
    const newTime = Math.max(0, Math.min(this.video.duration || 0, this.video.currentTime + seconds));
    this.video.currentTime = newTime;

    // Visual feedback
    const indicator = seconds < 0 ? this.els.seekLeft : this.els.seekRight;
    indicator.textContent = `${seconds > 0 ? '+' : ''}${seconds}s`;
    indicator.classList.remove('show');
    void indicator.offsetWidth; // reflow
    indicator.classList.add('show');
  }

  toggleMute() {
    this.video.muted = !this.video.muted;
    if (!this.video.muted && this.video.volume === 0) {
      this.video.volume = 0.5;
    }
  }

  togglePiP() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    } else if (this.video.requestPictureInPicture) {
      this.video.requestPictureInPicture().catch(() => {});
    }
  }

  toggleFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    } else {
      const el = this.playerEl;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    }
  }

  // ── Event Handlers ────────────────────────────────────────────────────
  _onPlayStateChange() {
    const paused = this.video.paused;
    this.els.btnPlay.innerHTML = paused ? ICONS.play : ICONS.pause;
    this.els.btnPlay.setAttribute('aria-label', paused ? 'Reproducir' : 'Pausar');
    this.els.bigPlay.classList.toggle('visible', paused);

    if (paused) {
      this.playerEl.classList.add('controls-visible');
      this._clearHideTimer();
    } else {
      this._startHideTimer();
    }
  }

  _onTimeUpdate() {
    const { video, els } = this;
    const current = video.currentTime;
    const duration = video.duration;

    if (!duration || isNaN(duration)) return;

    // Update progress bar
    const pct = (current / duration) * 100;
    els.progressPlayed.style.width = `${pct}%`;
    els.progressThumb.style.left = `${pct}%`;

    // Update time display
    els.time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;

    // Check AniSkip skip buttons
    this._checkSkipButtons(current);

    // Callback
    if (this.onTimeUpdate) this.onTimeUpdate(current, duration);
  }

  _onBufferUpdate() {
    const { video, els } = this;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      if (duration > 0) {
        els.progressBuffered.style.width = `${(bufferedEnd / duration) * 100}%`;
      }
    }
  }

  _onMetadataLoaded() {
    // Re-render skip markers now that duration is known
    this._renderSkipMarkers();
  }

  _onEnded() {
    // Clear saved position since the episode is done
    const key = `anird_pos_${this.malId}_${this.episodeNumber}`;
    localStorage.removeItem(key);

    if (this.onEpisodeEnd) {
      this.onEpisodeEnd();
    }
  }

  _onFullscreenChange() {
    this.isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    this.els.btnFullscreen.innerHTML = this.isFullscreen ? ICONS.fullscreenExit : ICONS.fullscreenEnter;
    this.els.btnFullscreen.setAttribute('aria-label', this.isFullscreen ? 'Salir Pantalla' : 'Pantalla Completa');
  }

  // ── Skip Button Visibility ────────────────────────────────────────────
  _checkSkipButtons(currentTime) {
    if (!this.skipData) return;

    const { op, ed, recap } = this.skipData;

    // Intro (OP)
    if (op && currentTime >= op.start && currentTime < op.end) {
      this.els.skipIntro.classList.remove('hidden');
    } else {
      this.els.skipIntro.classList.add('hidden');
    }

    // Outro (ED)
    if (ed && currentTime >= ed.start && currentTime < ed.end) {
      this.els.skipOutro.classList.remove('hidden');
    } else {
      this.els.skipOutro.classList.add('hidden');
    }

    // Recap — auto-skip via Intro button label
    if (recap && currentTime >= recap.start && currentTime < recap.end) {
      this.els.skipIntro.textContent = 'Saltar Recap ▶';
      this.els.skipIntro.classList.remove('hidden');
      // Override intro skip temporarily
      this.els.skipIntro.onclick = () => { this.video.currentTime = recap.end; };
    } else if (op && currentTime >= op.start && currentTime < op.end) {
      this.els.skipIntro.textContent = 'Saltar Intro ▶';
      this.els.skipIntro.onclick = () => { this.video.currentTime = op.end; };
    }
  }

  // ── Volume Icon ───────────────────────────────────────────────────────
  _updateVolumeIcon() {
    const { video, els } = this;
    if (video.muted || video.volume === 0) {
      els.btnVolume.innerHTML = ICONS.volumeMute;
    } else if (video.volume < 0.5) {
      els.btnVolume.innerHTML = ICONS.volumeLow;
    } else {
      els.btnVolume.innerHTML = ICONS.volumeHigh;
    }
    els.volumeSlider.value = video.muted ? 0 : video.volume;
  }

  // ── Progress Seeking ──────────────────────────────────────────────────
  _seekToPosition(e) {
    const rect = this.els.progressContainer.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const duration = this.video.duration;
    if (duration && isFinite(duration)) {
      this.video.currentTime = pct * duration;
    }
  }

  _updateTooltip(e) {
    const rect = this.els.progressContainer.getBoundingClientRect();
    const x = (e.clientX || e.pageX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const duration = this.video.duration;
    if (duration && isFinite(duration)) {
      this.els.progressTooltip.textContent = formatTime(pct * duration);
      this.els.progressTooltip.style.left = `${x}px`;
    }
  }

  // ── Menu Toggle ───────────────────────────────────────────────────────
  _toggleMenu(type) {
    const menu = type === 'speed' ? this.els.menuSpeed : this.els.menuQuality;
    const other = type === 'speed' ? this.els.menuQuality : this.els.menuSpeed;
    other.classList.remove('open');
    menu.classList.toggle('open');
  }

  _closeMenus() {
    this.els.menuSpeed.classList.remove('open');
    this.els.menuQuality.classList.remove('open');
  }

  // ── Auto-hide Controls ────────────────────────────────────────────────
  _resetHideTimer() {
    this.playerEl.classList.remove('hide-cursor');
    this.playerEl.classList.add('controls-visible');
    this._clearHideTimer();
    if (!this.video.paused) {
      this._startHideTimer();
    }
  }

  _startHideTimer(delay = 3000) {
    this._clearHideTimer();
    this.hideControlsTimeout = setTimeout(() => {
      if (!this.video.paused && !this.destroyed) {
        this.playerEl.classList.add('hide-cursor');
        this.playerEl.classList.remove('controls-visible');
        this._closeMenus();
      }
    }, delay);
  }

  _clearHideTimer() {
    if (this.hideControlsTimeout) {
      clearTimeout(this.hideControlsTimeout);
      this.hideControlsTimeout = null;
    }
  }

  // ── Keyboard Shortcuts ────────────────────────────────────────────────
  _handleKeyboard(e) {
    // Only handle if player is visible in DOM
    if (!document.contains(this.playerEl)) {
      this.destroy();
      return;
    }

    // Don't intercept when typing in inputs
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    switch (e.key.toLowerCase()) {
      case ' ':
      case 'k':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'f':
        e.preventDefault();
        this.toggleFullscreen();
        break;
      case 'm':
        e.preventDefault();
        this.toggleMute();
        break;
      case 'arrowleft':
      case 'j':
        e.preventDefault();
        this.seek(-10);
        this._resetHideTimer();
        break;
      case 'arrowright':
      case 'l':
        e.preventDefault();
        this.seek(10);
        this._resetHideTimer();
        break;
      case 'arrowup':
        e.preventDefault();
        this.video.volume = Math.min(1, this.video.volume + 0.1);
        this._resetHideTimer();
        break;
      case 'arrowdown':
        e.preventDefault();
        this.video.volume = Math.max(0, this.video.volume - 0.1);
        this._resetHideTimer();
        break;
      case 'escape':
        if (this.isFullscreen) {
          this.toggleFullscreen();
        }
        break;
    }
  }

  // ── Error Overlay ─────────────────────────────────────────────────────
  _showError(title, message) {
    // Remove existing error if any
    this.playerEl.querySelectorAll('.anird-player__error').forEach(el => el.remove());

    const errorEl = document.createElement('div');
    errorEl.className = 'anird-player__error';
    errorEl.innerHTML = `
      <span class="anird-player__error-icon">⚠️</span>
      <span class="anird-player__error-title">${this._escapeHtml(title)}</span>
      <span class="anird-player__error-message">${this._escapeHtml(message)}</span>
      <button class="anird-player__error-retry" id="ap-error-retry">🔄 Reintentar</button>
    `;
    this.playerEl.appendChild(errorEl);

    errorEl.querySelector('#ap-error-retry').addEventListener('click', () => {
      errorEl.remove();
      this._loadVideo();
    });
  }

  // ── Utility ───────────────────────────────────────────────────────────
  _escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Change Source (for server switching) ───────────────────────────────
  changeSource(newUrl, episodeTitle) {
    // Save current position before switching
    this._savePosition();

    // Destroy HLS instance
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    // Update state
    this.videoUrl = newUrl;
    if (episodeTitle) {
      this.episodeTitle = episodeTitle;
      const titleEl = this.playerEl.querySelector('.anird-player__episode-title');
      if (titleEl) titleEl.textContent = episodeTitle;
    }

    // Clear error overlays
    this.playerEl.querySelectorAll('.anird-player__error').forEach(el => el.remove());
    this.playerEl.querySelectorAll('.anird-player__resume').forEach(el => el.remove());

    // Reload
    this.qualityLevels = [];
    this.currentQuality = -1;
    this._loadVideo();
  }

  // ── Cleanup ───────────────────────────────────────────────────────────
  destroy() {
    this.destroyed = true;
    this._savePosition();
    this._clearHideTimer();

    if (this.savePositionInterval) {
      clearInterval(this.savePositionInterval);
      this.savePositionInterval = null;
    }

    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
    }
    if (this._fullscreenHandler) {
      document.removeEventListener('fullscreenchange', this._fullscreenHandler);
      document.removeEventListener('webkitfullscreenchange', this._fullscreenHandler);
    }

    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
    }
  }
}

// ── Static helper for WatchPage integration ──────────────────────────────
export { isDirectStreamUrl };
