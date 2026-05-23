/**
 * AniRD Smart TV Spatial Navigation Service v4.2
 * ✅ FIX: Auto-detección de Android TV WebView (user-agent "AniRD-AndroidTV")
 * ✅ FIX: Scroll interno de #app en vez de window scroll
 * ✅ FIX: scrollIntoView apunta al contenedor scrollable correcto
 */

class SpatialNavigationService {
  constructor() {
    this.isActive = false;
    this.focusedElement = null;
    this.focusableElements = [];
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.mutationObserver = null;
    // ✅ FIX: referencia al contenedor scrollable real (#app en TV mode)
    this.scrollContainer = null;
    // ✅ FIX: tracking de foco en iframe del reproductor
    this.iframeFocused = false;
    this._onWindowBlur = this._onWindowBlur.bind(this);
    this._onWindowFocus = this._onWindowFocus.bind(this);
  }

  /**
   * ✅ NUEVO: Auto-detecta si debe activarse.
   * Se llama desde App.js o al iniciar la app.
   */
  autoDetect() {
    const ua = navigator.userAgent || '';
    const isAndroidTV = ua.includes('AniRD-AndroidTV');
    const wasActive = localStorage.getItem('tvMode') === 'true';
    
    if (isAndroidTV || wasActive) {
      console.log('📺 [AniRD] TV detectado, activando modo TV automáticamente...');
      // Pequeño delay para esperar que el DOM esté listo
      setTimeout(() => this.init(), 150);
    }
  }

  init() {
    if (this.isActive) return;
    this.isActive = true;

    document.body.classList.add('tv-mode');
    localStorage.setItem('tvMode', 'true');

    // ✅ FIX: Identificar el contenedor scrollable (#app en TV mode)
    this._updateScrollContainer();

    window.addEventListener('keydown', this.handleKeyDownBound, { capture: true });
    this.setupMutationObserver();

    // ✅ FIX: lockWindowScroll ahora NO resetea scroll de #app
    this.lockWindowScroll();

    // ✅ FIX: Monitorear foco del iframe para escapar del focus trap
    window.addEventListener('blur', this._onWindowBlur);
    window.addEventListener('focus', this._onWindowFocus);

    setTimeout(() => {
      this.updateFocusables();
      this.focusFirstAvailable();
    }, 350);

    console.log('📺 AniRD Spatial Navigation (Smart TV Mode) initialized.');
  }

  _updateScrollContainer() {
    // En TV mode el contenedor scrollable es #app (no window)
    this.scrollContainer = document.getElementById('app') || document.body;
  }

  destroy() {
    if (!this.isActive) return;
    this.isActive = false;

    document.body.classList.remove('tv-mode');
    localStorage.setItem('tvMode', 'false');

    window.removeEventListener('keydown', this.handleKeyDownBound, { capture: true });
    window.removeEventListener('blur', this._onWindowBlur);
    window.removeEventListener('focus', this._onWindowFocus);
    this.unlockWindowScroll();

    if (this._iframeEscapeInterval) {
      clearInterval(this._iframeEscapeInterval);
      this._iframeEscapeInterval = null;
    }

    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    if (this.focusedElement) {
      this.focusedElement.classList.remove('focused');
      this.focusedElement = null;
    }

    document.querySelectorAll('.focused').forEach(el => el.classList.remove('focused'));
    this.scrollContainer = null;
    this.iframeFocused = false;

    console.log('📺 AniRD Spatial Navigation (Smart TV Mode) destroyed.');
  }

  lockWindowScroll() {
    // ✅ FIX: Solo bloquea window scroll, NO afecta el scroll interno de #app
    this.scrollListener = (e) => {
      // Permitir scroll en contenedores con overflow-y: auto/scroll (como #app en TV mode)
      // Solo resetear el scroll del WINDOW, no de elementos internos
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement.scrollTop !== 0) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      }
    };
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.scrollTo(0, 0);
  }

  unlockWindowScroll() {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, { passive: true });
      this.scrollListener = null;
    }
  }

  setupMutationObserver() {
    if (this.mutationObserver) this.mutationObserver.disconnect();

    this.mutationObserver = new MutationObserver(() => {
      if (this.updateTimeout) clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        if (this.isActive) this.updateFocusables();
      }, 200);
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateFocusables() {
    if (!this.isActive) return;

    // ✅ Actualizar referencia al scroll container si cambió
    this._updateScrollContainer();

    const selectors = [
      'a[href]',
      'button',
      'input:not([type="hidden"])',
      'select',
      'textarea',
      '[tabindex]:not([tabindex="-1"])',
      'anime-card',
      '.anime-card',
      '.episode-btn',
      '.sidebar-link',
      '.search-bar-desktop',
      '.header-profile-btn',
      '#header-tv-toggle',
      '.server-btn',
      '.player-control-btn',
      '.category-item',
      '.sidebar-categories-trigger',
      '.control-btn-v5',
      '.server-pill-v5',
      '.lang-pill-v5',
      '.btn-more-v5',
      '.ep-search-input-v5',
      '.sidebar-icon-btn',
      '.ep-item-horizontal-v5',
      '.related-card-v5',
      '.video-wrapper-v5',
      '.tab-item',
      '[role="button"]'
    ].join(', ');

    const elements = Array.from(document.querySelectorAll(selectors));
    
    this.focusableElements = elements.filter(el => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;
      if (el.id === 'tv-mode-toggle' || el.id === 'header-tv-toggle') return true;

      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

      let parent = el.parentElement;
      while (parent) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.display === 'none') return false;
        parent = parent.parentElement;
      }

      return true;
    });

    if (this.focusedElement && !this.focusableElements.includes(this.focusedElement)) {
      this.focusedElement.classList.remove('focused');
      this.focusedElement = null;
      this.focusFirstAvailable();
    }
  }

  focusFirstAvailable() {
    if (this.focusableElements.length > 0) {
      let defaultFocus = this.focusableElements.find(el => 
        el.classList.contains('sidebar-link') || 
        el.tagName === 'ANIME-CARD' ||
        el.classList.contains('ep-item-horizontal-v5')
      );
      
      if (!defaultFocus) defaultFocus = this.focusableElements[0];
      this.focusElement(defaultFocus);
    }
  }

  focusElement(element) {
    if (!element) return;

    if (this.focusedElement) {
      this.focusedElement.classList.remove('focused');
      if (typeof this.focusedElement.blur === 'function') {
        this.focusedElement.blur();
      }
    }

    this.focusedElement = element;
    this.focusedElement.classList.add('focused');

    if (typeof this.focusedElement.focus === 'function') {
      try {
        this.focusedElement.focus({ preventScroll: true });
      } catch (err) {
        this.focusedElement.focus();
      }
    }

    // ✅ FIX CRÍTICO: Scroll dentro del contenedor #app, NO del window
    this._scrollElementIntoView(element);
  }

  /**
   * ✅ NUEVO: Scroll inteligente que usa el contenedor #app en TV mode,
   * en vez de scrollIntoView que puede causar conflictos con lockWindowScroll.
   */
  _scrollElementIntoView(element) {
    // En TV mode, usar #app como contenedor de scroll
    const container = this.scrollContainer;
    
    if (!container || container === document.body) {
      // Fallback a scrollIntoView estándar
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const elementTop = elementRect.top - containerRect.top + container.scrollTop;
    const elementBottom = elementTop + elementRect.height;
    const viewportBottom = container.scrollTop + container.clientHeight;

    const MARGIN = 80; // margen de visibilidad

    if (elementTop - MARGIN < container.scrollTop) {
      // Elemento está arriba del viewport del contenedor
      container.scrollTo({ top: elementTop - MARGIN, behavior: 'smooth' });
    } else if (elementBottom + MARGIN > viewportBottom) {
      // Elemento está abajo del viewport del contenedor
      container.scrollTo({ top: elementBottom + MARGIN - container.clientHeight, behavior: 'smooth' });
    }
    // Si está visible, no hacer nada
  }

  /**
   * ✅ FIX: Detectar cuando el foco se va al iframe (window pierde foco)
   * En caso de que el iframe obtenga foco por click accidental, lo recuperamos.
   */
  _onWindowBlur() {
    setTimeout(() => {
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        console.log('📺 [AniRD] Foco capturado por iframe — recuperando...');
        // Inmediatamente sacar el foco del iframe
        document.activeElement.blur();
        // Devolver foco a los controles del reproductor
        const firstControl = document.querySelector('.player-controls-v5 .control-btn-v5');
        if (firstControl) {
          this.focusElement(firstControl);
        }
      }
    }, 150);
  }

  /**
   * ✅ FIX: Detectar cuando el foco vuelve del iframe al window
   */
  _onWindowFocus() {
    // Si de alguna forma el iframe tenía foco, asegurarse de restaurar navegación
    if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
      document.activeElement.blur();
      const firstControl = document.querySelector('.player-controls-v5 .control-btn-v5');
      if (firstControl) {
        this.focusElement(firstControl);
      }
    }
  }

  handleKeyDown(e) {
    if (!this.isActive) return;

    const activeTagName = document.activeElement ? document.activeElement.tagName : '';
    const isTyping = activeTagName === 'INPUT' || activeTagName === 'TEXTAREA';

    // ✅ FIX: Si por algún motivo un iframe tiene foco, sacarlo inmediatamente
    if (activeTagName === 'IFRAME') {
      document.activeElement.blur();
      const firstControl = document.querySelector('.player-controls-v5 .control-btn-v5');
      if (firstControl) this.focusElement(firstControl);
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      if (isTyping && ['ArrowLeft', 'ArrowRight'].includes(e.key)) return;

      e.preventDefault();
      e.stopPropagation();
      const direction = e.key.replace('Arrow', '').toLowerCase();
      this.moveFocus(direction);
      return;
    }

    if (e.key === 'Enter') {
      if (isTyping) return;
      if (this.focusedElement) {
        e.preventDefault();
        e.stopPropagation();

        if (this.focusedElement.tagName === 'ANIME-CARD') {
          const innerLink = this.focusedElement.shadowRoot?.querySelector('a');
          if (innerLink) { innerLink.click(); } else { this.focusedElement.click(); }
        } else if (this.focusedElement.classList.contains('video-wrapper-v5')) {
          console.log('📺 [AniRD] Video seleccionado → Activando pantalla completa CSS');
          const videoContainer = document.getElementById('video-container');
          if (videoContainer) {
            videoContainer.classList.toggle('tv-fullscreen-active');
            const isFullscreen = videoContainer.classList.contains('tv-fullscreen-active');
            const btnText = document.querySelector('#btn-fullscreen-watch span');
            if (btnText) {
              btnText.textContent = isFullscreen ? 'Salir Pantalla' : 'Pantalla Completa';
            }
          }
          return;
        } else {
          this.focusedElement.click();
        }
      }
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Escape') {
      if (isTyping && e.key === 'Backspace') return;

      const searchOverlay = document.getElementById('searchOverlay');
      if (searchOverlay && searchOverlay.classList.contains('active')) return;

      // ✅ FIX: Si estamos en pantalla completa CSS en TV, salir de ella en vez de ir atrás
      const videoContainer = document.getElementById('video-container');
      if (videoContainer && videoContainer.classList.contains('tv-fullscreen-active')) {
        videoContainer.classList.remove('tv-fullscreen-active');
        const btnText = document.querySelector('#btn-fullscreen-watch span');
        if (btnText) btnText.textContent = 'Pantalla Completa';
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      window.history.back();
    }
  }

  moveFocus(direction) {
    this.updateFocusables();

    if (this.focusableElements.length === 0) return;

    if (!this.focusedElement || !this.focusableElements.includes(this.focusedElement)) {
      this.focusFirstAvailable();
      return;
    }

    const currentRect = this.focusedElement.getBoundingClientRect();
    const cx = currentRect.left + currentRect.width / 2;
    const cy = currentRect.top + currentRect.height / 2;

    let bestCandidate = null;
    let minDistance = Infinity;

    for (const candidate of this.focusableElements) {
      if (candidate === this.focusedElement) continue;

      const rect = candidate.getBoundingClientRect();
      const tcx = rect.left + rect.width / 2;
      const tcy = rect.top + rect.height / 2;

      const dx = tcx - cx;
      const dy = tcy - cy;

      let primaryDist = 0;
      let secondaryDist = 0;
      let isValid = false;

      switch (direction) {
        case 'right':
          if (dx > 5) { primaryDist = dx; secondaryDist = Math.abs(dy); isValid = true; }
          break;
        case 'left':
          if (dx < -5) { primaryDist = -dx; secondaryDist = Math.abs(dy); isValid = true; }
          break;
        case 'down':
          if (dy > 5) { primaryDist = dy; secondaryDist = Math.abs(dx); isValid = true; }
          break;
        case 'up':
          if (dy < -5) { primaryDist = -dy; secondaryDist = Math.abs(dx); isValid = true; }
          break;
      }

      if (isValid) {
        const distance = primaryDist + secondaryDist * 3;
        if (distance < minDistance) {
          minDistance = distance;
          bestCandidate = candidate;
        }
      }
    }

    if (bestCandidate) {
      this.focusElement(bestCandidate);
    } else {
      // ✅ FIX: Si no hay candidato en la dirección, scroll manual en #app
      if ((direction === 'down' || direction === 'up') && this.scrollContainer && this.scrollContainer !== document.body) {
        const scrollAmount = direction === 'down' ? 300 : -300;
        this.scrollContainer.scrollBy({ top: scrollAmount, behavior: 'smooth' });
      }
    }
  }
}

export const spatialNavigation = new SpatialNavigationService();

// ✅ FIX CRÍTICO: Auto-detectar Android TV y activar modo TV automáticamente
// Esto se ejecuta cuando el módulo se importa, sin necesitar intervención manual
if (typeof document !== 'undefined') {
  const _autoInit = () => spatialNavigation.autoDetect();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _autoInit, { once: true });
  } else {
    // DOM ya está listo
    setTimeout(_autoInit, 100);
  }
}
