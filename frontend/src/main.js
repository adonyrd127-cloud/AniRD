import './styles/global.css';
import { AppRouter } from './app.js';
import { useAppStore } from './stores/appStore.js';
import { dbService } from './services/db.js';
import { SearchPalette } from './components/SearchPalette.js';
import { getRouter } from './app.js';
import { authService } from './services/auth.service.js';

// Init app container
const appContainer = document.getElementById('app');

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
      z-index: 9999;
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0 4%;
      background: transparent;
      transition: background 0.3s ease;
    }

    .navbar.scrolled {
      background: var(--bg-navbar, rgba(10, 10, 15, 0.95));
      backdrop-filter: blur(20px);
      box-shadow: var(--shadow);
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
      background: var(--surface);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.85rem;
      padding: 6px 14px;
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
      min-width: 160px;
      outline: none;
    }

    .nav-search-btn:hover {
      background: var(--surface-hover);
      border-color: var(--text-muted);
      color: var(--text-primary);
    }

    .nav-search-btn svg {
      opacity: 0.7;
    }

    .nav-search-btn kbd {
       margin-left: auto;
       padding: 2px 6px;
       background: rgba(0,0,0,0.1);
       border: 1px solid rgba(255,255,255,0.05);
       border-radius: 4px;
       font-size: 0.65rem;
       color: var(--text-muted);
       font-family: inherit;
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
      .navbar { padding: 0 16px; height: 60px; }
      .nav-logo { font-size: 1.2rem; margin-right: 15px; }
      .nav-search-btn span { display: none; }
      .nav-search-btn::before { content: '🔍'; font-size: 1.2rem; }
      .nav-search-btn kbd { display: none; }
      .nav-search-btn { padding: 8px; background: transparent; }
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
          <li><a href="/category/action" data-link>Acción</a></li>
          <li><a href="/category/comedy" data-link>Comedia</a></li>
          <li><a href="/category/romance" data-link>Romance</a></li>
          <li><a href="/category/supernatural" data-link>Sobrenatural</a></li>
          <li><a href="/calendar" data-link>Calendario</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <button class="nav-search-btn" id="open-search-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span>Buscar...</span>
          <kbd>Ctrl+K</kbd>
        </button>
        <a id="profile-link" href="/auth" data-link style="padding: 0 12px; height: 32px; border-radius: 4px; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-weight: bold; font-size: 0.8rem; white-space: nowrap;">
          Entrar
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
     <a id="mobile-profile-link" href="/auth" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">👤</span>
       <span>Entrar</span>
     </a>
  </nav>
`;
document.body.insertBefore(header, appContainer);

const updateNavbarAuth = () => {
  const profileLink = document.getElementById('profile-link');
  const mobileProfileLink = document.getElementById('mobile-profile-link');
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getUser();
  
  const targetPath = isLoggedIn ? '/profile' : '/auth';
  const targetText = isLoggedIn ? 'Mi Perfil' : 'Entrar';

  if (profileLink) {
    profileLink.setAttribute('href', targetPath);
    profileLink.textContent = targetText;
  }
  if (mobileProfileLink) {
    mobileProfileLink.setAttribute('href', targetPath);
    mobileProfileLink.querySelector('span:last-child').textContent = targetText;
  }
};

updateNavbarAuth();

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

// Initialize theme and sync if logged in
const initApp = async () => {
    const theme = await dbService.getSetting('theme', 'dark');
    if (theme === 'light') document.body.classList.add('light-theme');

    if (authService.isLoggedIn()) {
      try {
        const serverData = await authService.fetchFromServer();
        if (serverData) {
          await dbService.syncFromServer(serverData);
        }
      } catch (err) {
        console.error('Auto-sync failed', err);
      }
    }
};

initApp();
