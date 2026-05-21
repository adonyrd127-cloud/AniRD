import './styles/global.css';
import { AppRouter } from './app.js';
import { useAppStore } from './stores/appStore.js';
import { dbService } from './services/db.js';
import { SearchPalette } from './components/SearchPalette.js';
import { getRouter } from './app.js';
import { authService } from './services/auth.service.js';

const appContainer = document.getElementById('app');
const router = getRouter(appContainer);
const searchPalette = new SearchPalette(router);

// Navbar Premium UI v3.5
const header = document.createElement('header');
header.innerHTML = `
  <nav class="nav-v4" id="main-navbar">
    <a href="/" data-link class="nav-logo">AniRD ☁️</a>
    
    <ul class="nav-links">
      <li><a href="/" data-link>Inicio</a></li>
      <li><a href="/category/popular" data-link>Populares</a></li>
      <li><a href="/category/movies" data-link>Películas</a></li>
      <li><a href="/category/dub" data-link>Latino</a></li>
      <li class="nav-dropdown">
        <a>
          Categorías <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="nav-dropdown-content">
          <div class="dropdown-grid">
            <div class="dropdown-column">
              <span class="dropdown-title">GÉNEROS</span>
              <a href="/category/action" data-link>Acción</a>
              <a href="/category/adventure" data-link>Aventura</a>
              <a href="/category/comedy" data-link>Comedia</a>
              <a href="/category/drama" data-link>Drama</a>
              <a href="/category/fantasy" data-link>Fantasía</a>
            </div>
            <div class="dropdown-column" style="padding-top:28px">
              <a href="/category/music" data-link>Musical</a>
              <a href="/category/romance" data-link>Romance</a>
              <a href="/category/sci-fi" data-link>Ciencia Ficción</a>
              <a href="/category/seinen" data-link>Seinen</a>
              <a href="/category/shoujo" data-link>Shoujo</a>
            </div>
            <div class="dropdown-column" style="padding-top:28px">
              <a href="/category/shounen" data-link>Shounen</a>
              <a href="/category/slice-of-life" data-link>Recuentos de la Vida</a>
              <a href="/category/sports" data-link>Deportes</a>
              <a href="/category/supernatural" data-link>Sobrenatural</a>
              <a href="/category/thriller" data-link>Thriller</a>
            </div>
          </div>
        </div>
      </li>
      <li><a href="/calendar" data-link>Calendario</a></li>
    </ul>

    <div class="nav-right" style="display: flex; align-items: center;">
      <div class="search-pill" id="open-search-btn">
        <span>🔍 Buscar...</span>
        <kbd style="opacity:0.5; font-size:9px; margin-left:5px">Ctrl K</kbd>
      </div>
      
      <div class="nav-notifications" id="nav-notifications" style="position: relative; margin-right: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); transition: all 0.3s ease;">
        <span style="font-size: 18px; filter: grayscale(1) contrast(2);">🔔</span>
        <span id="notif-badge" style="display:none; position: absolute; top: 8px; right: 8px; background: #ff0000; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px #ff0000;"></span>
        
        <div id="notif-dropdown" style="display:none; position: absolute; top: 50px; right: 0; width: 320px; background: rgba(15,15,15,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 15px; z-index: 100; cursor: default; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
           <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
             <h4 style="margin: 0; color: white; font-family: 'Outfit';">Notificaciones</h4>
             <span id="mark-read-btn" style="font-size: 11px; color: var(--accent); cursor: pointer; font-weight: 800;">Marcar Leídas</span>
           </div>
           <div id="notif-list" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
             <div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>
           </div>
        </div>
      </div>

      <a id="profile-link" href="/auth" data-link class="btn-profile">
        Entrar
      </a>
    </div>
  </nav>

  <nav class="mobile-nav">
     <a href="/" data-link class="mobile-nav-item">🏠<span>Inicio</span></a>
     <a href="#" class="mobile-nav-item" id="mobile-search-btn">🔍<span>Buscar</span></a>
     <a href="/calendar" data-link class="mobile-nav-item">📅<span>Emisiones</span></a>
     <a id="mobile-profile-link" href="/auth" data-link class="mobile-nav-item">👤<span>Entrar</span></a>
  </nav>
`;
document.body.insertBefore(header, appContainer);

const updateNavbarAuth = () => {
  const profileLink = document.getElementById('profile-link');
  const mobileProfileLink = document.getElementById('mobile-profile-link');
  const isLoggedIn = authService.isLoggedIn();
  
  const targetPath = isLoggedIn ? '/profile' : '/auth';
  const targetText = isLoggedIn ? 'Mi Perfil' : 'Entrar';

  if (profileLink) {
    profileLink.setAttribute('href', targetPath);
    profileLink.textContent = targetText;
  }
  if (mobileProfileLink) {
    mobileProfileLink.setAttribute('href', targetPath);
    const span = mobileProfileLink.querySelector('span:last-child');
    if (span) span.textContent = targetText;
  }
};

window.updateNavbarAuth = updateNavbarAuth;
updateNavbarAuth();

document.getElementById('open-search-btn').addEventListener('click', () => searchPalette.open());
document.getElementById('mobile-search-btn').addEventListener('click', (e) => {
  e.preventDefault();
  searchPalette.open();
});

import { notificationService } from './services/notifications.js';

const initNotifications = async () => {
  const notifBtn = document.getElementById('nav-notifications');
  const notifBadge = document.getElementById('notif-badge');
  const notifDropdown = document.getElementById('notif-dropdown');
  const notifList = document.getElementById('notif-list');
  const markReadBtn = document.getElementById('mark-read-btn');

  if (!notifBtn) return;

  const updateUI = async () => {
    const unreadCount = await notificationService.getUnreadCount();
    if (unreadCount > 0) {
      notifBadge.style.display = 'block';
      notifBtn.style.color = '#ff0000';
    } else {
      notifBadge.style.display = 'none';
      notifBtn.style.color = 'inherit';
    }
  };

  const renderDropdown = async () => {
    const notifs = await notificationService.getNotifications();
    if (notifs.length === 0) {
      notifList.innerHTML = '<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';
      return;
    }

    notifList.innerHTML = notifs.map(n => `
      <a href="/anime/${n.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${n.isRead ? 'opacity: 0.6;' : 'background: rgba(255,0,0,0.05);'}">
        <img src="${n.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${n.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(n.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join('');
  };

  notifBtn.addEventListener('click', async (e) => {
    if (e.target === markReadBtn) return;
    const isVisible = notifDropdown.style.display === 'block';
    notifDropdown.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
      await renderDropdown();
    }
  });

  markReadBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await notificationService.markAllAsRead();
    await updateUI();
    await renderDropdown();
  });

  document.addEventListener('click', (e) => {
    if (!notifBtn.contains(e.target)) {
      notifDropdown.style.display = 'none';
    }
  });

  // Check for new episodes silently
  if (authService.isLoggedIn()) {
    await notificationService.checkNewEpisodes();
  }
  await updateUI();
};

const initApp = async () => {
    const theme = await dbService.getSetting('theme', 'dark');
    if (theme === 'light') document.body.classList.add('light-theme');
    if (authService.isLoggedIn()) {
      try {
        const serverData = await authService.fetchFromServer();
        if (serverData) await dbService.syncFromServer(serverData);
      } catch (err) { console.error('Sync fail'); }
    }
    await initNotifications();
};

initApp();
