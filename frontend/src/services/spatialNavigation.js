/**
 * AniRD Smart TV Spatial Navigation Service
 * Handles D-Pad remote control events (ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Enter, Backspace)
 * dynamically finding visible focusable elements and moving the focus visually and smoothly.
 */

class SpatialNavigationService {
  constructor() {
    this.isActive = false;
    this.focusedElement = null;
    this.focusableElements = [];
    this.handleKeyDownBound = this.handleKeyDown.bind(this);
    this.mutationObserver = null;
  }

  init() {
    if (this.isActive) return;
    this.isActive = true;

    // Apply global CSS class to body
    document.body.classList.add('tv-mode');
    localStorage.setItem('tvMode', 'true');

    // Add keydown listener to window
    window.addEventListener('keydown', this.handleKeyDownBound, { capture: true });

    // Setup mutation observer to automatically re-scan when DOM changes
    this.setupMutationObserver();

    // Lock window scroll to prevent layout shifting on Smart TVs
    this.lockWindowScroll();

    // Perform initial scan and focus
    setTimeout(() => {
      this.updateFocusables();
      this.focusFirstAvailable();
    }, 300);

    console.log("📺 AniRD Spatial Navigation (Smart TV Mode) initialized.");
  }

  destroy() {
    if (!this.isActive) return;
    this.isActive = false;

    // Remove global CSS class from body
    document.body.classList.remove('tv-mode');
    localStorage.setItem('tvMode', 'false');

    // Remove keydown listener
    window.removeEventListener('keydown', this.handleKeyDownBound, { capture: true });

    // Unlock window scroll
    this.unlockWindowScroll();

    // Disconnect mutation observer
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }

    // Clear focused element styles
    if (this.focusedElement) {
      this.focusedElement.classList.remove('focused');
      this.focusedElement = null;
    }

    // Clean up focusable styles
    const allFocused = document.querySelectorAll('.focused');
    allFocused.forEach(el => el.classList.remove('focused'));

    console.log("📺 AniRD Spatial Navigation (Smart TV Mode) destroyed.");
  }

  lockWindowScroll() {
    this.scrollListener = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0 || document.documentElement.scrollTop !== 0 || document.body.scrollTop !== 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };
    window.addEventListener('scroll', this.scrollListener, { passive: true });
    
    // Snap scroll to top immediately upon initialization
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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
      // Throttle/debounce DOM updates slightly to prevent layout thrashing
      if (this.updateTimeout) clearTimeout(this.updateTimeout);
      this.updateTimeout = setTimeout(() => {
        if (this.isActive) {
          this.updateFocusables();
        }
      }, 200);
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateFocusables() {
    if (!this.isActive) return;

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
    
    // Filter to only visible, non-disabled, interactive elements
    this.focusableElements = elements.filter(el => {
      // Basic disabled check
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') return false;

      // TV Mode Toggle buttons should always be focusable
      if (el.id === 'tv-mode-toggle' || el.id === 'header-tv-toggle') return true;

      // Visibility and size check
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return false;

      // Styled visibility check
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;

      // Check if inside a display: none ancestor
      let parent = el.parentElement;
      while (parent) {
        const parentStyle = window.getComputedStyle(parent);
        if (parentStyle.display === 'none') return false;
        parent = parent.parentElement;
      }

      return true;
    });

    // If current focused element was removed or is no longer focusable, find a new one
    if (this.focusedElement && !this.focusableElements.includes(this.focusedElement)) {
      this.focusedElement.classList.remove('focused');
      this.focusedElement = null;
      this.focusFirstAvailable();
    }
  }

  focusFirstAvailable() {
    if (this.focusableElements.length > 0) {
      // Try to find a prominent element first (e.g. sidebar link or anime card)
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
      // If it is standard focusable element, blur it
      if (typeof this.focusedElement.blur === 'function') {
        this.focusedElement.blur();
      }
    }

    this.focusedElement = element;
    this.focusedElement.classList.add('focused');

    // Call native focus with preventScroll option so the browser doesn't automatically scroll
    if (typeof this.focusedElement.focus === 'function') {
      try {
        this.focusedElement.focus({ preventScroll: true });
      } catch (err) {
        this.focusedElement.focus();
      }
    }

    // Scroll centered or in nearest viewport space smoothly
    this.focusedElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  }

  handleKeyDown(e) {
    if (!this.isActive) return;

    // Check if user is typing inside an active text input/textarea
    const activeTagName = document.activeElement ? document.activeElement.tagName : '';
    const isTyping = activeTagName === 'INPUT' || activeTagName === 'TEXTAREA';

    // 1. D-Pad Directional Keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      // If typing in input, let Left/Right arrow work to move cursor inside input
      if (isTyping && ['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        return; // Don't preventDefault or move spatial focus
      }

      e.preventDefault();
      e.stopPropagation();

      const direction = e.key.replace('Arrow', '').toLowerCase(); // 'up', 'down', 'left', 'right'
      this.moveFocus(direction);
      return;
    }

    // 2. Select/Action Key (Enter)
    if (e.key === 'Enter') {
      // If we are typing in input, let Enter submit search or execute native behavior
      if (isTyping) {
        return;
      }

      if (this.focusedElement) {
        e.preventDefault();
        e.stopPropagation();

        console.log("📺 TV D-pad Select: Enter key triggered on element:", this.focusedElement);
        
        // Handle custom shadow DOM elements like <anime-card>
        if (this.focusedElement.tagName === 'ANIME-CARD') {
          const innerLink = this.focusedElement.shadowRoot?.querySelector('a');
          if (innerLink) {
            innerLink.click();
          } else {
            this.focusedElement.click();
          }
        } else if (this.focusedElement.classList.contains('video-wrapper-v5')) {
          const iframe = this.focusedElement.querySelector('iframe');
          if (iframe) {
            console.log("📺 TV D-pad: Transferring focus to video iframe.");
            iframe.focus();
            return;
          }
        } else {
          // Standard HTML click
          this.focusedElement.click();
        }
      }
      return;
    }

    // 3. Back/Escape Key (Backspace/Escape)
    if (e.key === 'Backspace' || e.key === 'Escape') {
      // If user is typing in an input, let backspace delete characters
      if (isTyping && e.key === 'Backspace') {
        return;
      }

      // If search palette overlay is active, let Escape close it
      const searchOverlay = document.getElementById('searchOverlay');
      if (searchOverlay && searchOverlay.classList.contains('active')) {
        return; // SearchPalette handles Escape
      }

      e.preventDefault();
      e.stopPropagation();
      console.log("📺 TV D-pad Back: navigating history back");
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
          if (dx > 5) { // Center is to the right
            primaryDist = dx;
            secondaryDist = Math.abs(dy);
            isValid = true;
          }
          break;
        case 'left':
          if (dx < -5) { // Center is to the left
            primaryDist = -dx;
            secondaryDist = Math.abs(dy);
            isValid = true;
          }
          break;
        case 'down':
          if (dy > 5) { // Center is below
            primaryDist = dy;
            secondaryDist = Math.abs(dx);
            isValid = true;
          }
          break;
        case 'up':
          if (dy < -5) { // Center is above
            primaryDist = -dy;
            secondaryDist = Math.abs(dx);
            isValid = true;
          }
          break;
      }

      if (isValid) {
        // Distance weight: Penalize secondary axis deviation (multiplier 3x)
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
      console.log(`📺 No focusable candidate found in direction: ${direction}`);
    }
  }
}

export const spatialNavigation = new SpatialNavigationService();
