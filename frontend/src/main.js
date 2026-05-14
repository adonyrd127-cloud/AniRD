import './styles/global.css';
import { AppRouter } from './app.js';
import { useAppStore } from './stores/appStore.js';

// Init router
const appContainer = document.getElementById('app');

import { SearchPalette } from './components/SearchPalette.js';
import { getRouter } from './app.js';

// Init router singleton
const router = getRouter(appContainer);

// Initialize Search Palette
const searchPalette = new SearchPalette(router);

// Navbar Netflix-style
const header = document.createElement('header');
header.innerHTML = `
  <style>
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 68px;
      display: flex;
      align-items: center;
      padding: 0 4%;
      background: transparent;
      transition: background var(--transition-smooth);
    }

    .navbar.scrolled {
      background: var(--bg-primary);
      box-shadow: 0 2px 20px rgba(0,0,0,0.5);
    }

    .navbar::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-navbar);
      opacity: 0;
      transition: opacity var(--transition-smooth);
      pointer-events: none;
    }

    .navbar.scrolled::after {
      opacity: 1;
    }

    .nav-content {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }

    .nav-left {
      display: flex;
      align-items: center;
    }

    .nav-logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.02em;
      margin-right: 32px;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 20px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-links a {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color var(--transition-fast);
      font-weight: 500;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: var(--text-primary);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-search-btn {
      background: transparent;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      padding: 8px;
      border-radius: var(--radius-sm);
      transition: background var(--transition-fast);
    }

    .nav-search-btn:hover {
      background: rgba(255,255,255,0.1);
    }

    .nav-search-btn kbd {
       padding: 2px 6px;
       background: rgba(255,255,255,0.1);
       border: 1px solid var(--glass-border);
       border-radius: var(--radius-sm);
       font-size: 0.7rem;
       color: var(--text-muted);
    }

    /* Mobile Nav */
    .mobile-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(18, 18, 26, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid var(--glass-border);
      justify-content: space-around;
      align-items: center;
      z-index: 1000;
      padding-bottom: env(safe-area-inset-bottom);
    }

    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: var(--text-muted);
      font-size: 0.65rem;
      text-decoration: none;
      transition: color var(--transition-fast);
      padding: 8px;
    }

    .mobile-nav-item.active {
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .mobile-nav { display: flex; }
      .navbar { padding: 0 16px; }
      .nav-search-btn kbd { display: none; }
    }
  </style>
  <nav class="navbar" id="main-navbar">
    <div class="nav-content">
      <div class="nav-left">
        <a href="/" data-link class="nav-logo">AniRD</a>
        <ul class="nav-links">
          <li><a href="/" data-link>Inicio</a></li>
          <li><a href="/category/popular" data-link>Populares</a></li>
          <li><a href="/category/movies" data-link>Películas</a></li>
          <li><a href="/category/dub" data-link>Latino</a></li>
          <li><a href="/calendar" data-link>Calendario</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <button class="nav-search-btn" id="open-search-btn">
          <span>🔍 Buscar</span>
          <kbd>Cmd+K</kbd>
        </button>
        <a href="/my-anird" data-link style="width: 32px; height: 32px; border-radius: 4px; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-weight: bold; font-size: 0.9rem;">
          Tú
        </a>
      </div>
    </div>
  </nav>

  <nav class="mobile-nav">
     <a href="/" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">🏠</span>
       <span>Inicio</span>
     </a>
     <a href="#" class="mobile-nav-item" id="mobile-search-btn">
       <span style="font-size: 1.2rem;">🔍</span>
       <span>Buscar</span>
     </a>
     <a href="/calendar" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">📅</span>
       <span>Emisiones</span>
     </a>
     <a href="/my-anird" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">👤</span>
       <span>Mi AniRD</span>
     </a>
  </nav>
`;
document.body.insertBefore(header, appContainer);

// Handle Navbar Scroll
const navbar = document.getElementById('main-navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Bind Search buttons
document.getElementById('open-search-btn').addEventListener('click', () => {
  searchPalette.open();
});
document.getElementById('mobile-search-btn').addEventListener('click', (e) => {
  e.preventDefault();
  searchPalette.open();
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}
