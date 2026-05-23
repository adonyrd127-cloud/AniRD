import './styles/global.css';

// Desactivar y desinstalar cualquier Service Worker previo para evitar bloqueos agresivos de caché
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister().then((success) => {
        if (success) {
          console.log('🗑️ Service Worker desinstalado con éxito.');
          window.location.reload();
        }
      });
    }
  });
}

import { AppRouter } from './app.js';
import { useAppStore } from './stores/appStore.js';
import { dbService, db } from './services/db.js';
import { SearchPalette } from './components/SearchPalette.js';
import { getRouter } from './app.js';
import { authService } from './services/auth.service.js';
import { spatialNavigation } from './services/spatialNavigation.js';

const appContainer = document.getElementById('app');
const router = getRouter(appContainer);
const searchPalette = new SearchPalette(router);

// Navbar Premium UI v3.10
const header = document.createElement('header');
header.innerHTML = `
  <nav class="nav-v4" id="main-navbar">
    <!-- Contenedor izquierdo: Botón de colapsar, Logo y divisor para escritorio -->
    <div class="nav-left-container" style="display: flex; align-items: center; gap: 15px;">
      <button id="sidebar-collapse-btn" class="sidebar-collapse-btn" title="Colapsar Barra Lateral">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <a href="/" data-link class="nav-logo">AniRD <span class="logo-cloud">☁️</span></a>
      <div class="nav-divider-desktop"></div>
    </div>
    
    <!-- Contenedor de Categorías en Header (visible solo al colapsar barra lateral en PC) -->
    <div class="header-categories-v4" id="header-categories">
      <a href="/category/popular" data-link class="header-cat-link">🔥 Populares</a>
      <a href="/category/movies" data-link class="header-cat-link">🎬 Películas</a>
      <a href="/category/dub" data-link class="header-cat-link">🎙️ Latino</a>
      
      <!-- Dropdown de Géneros en Cabecera -->
      <div class="header-cat-dropdown">
        <button class="header-cat-btn" id="header-genres-trigger">
          Géneros <span style="font-size: 10px; margin-left: 4px;">▼</span>
        </button>
        <div class="header-cat-dropdown-content" id="header-genres-dropdown">
          <a href="/category/action" data-link class="header-genre-sublink">Acción</a>
          <a href="/category/adventure" data-link class="header-genre-sublink">Aventura</a>
          <a href="/category/comedy" data-link class="header-genre-sublink">Comedia</a>
          <a href="/category/drama" data-link class="header-genre-sublink">Drama</a>
          <a href="/category/fantasy" data-link class="header-genre-sublink">Fantasía</a>
          <a href="/category/music" data-link class="header-genre-sublink">Musical</a>
          <a href="/category/romance" data-link class="header-genre-sublink">Romance</a>
          <a href="/category/sci-fi" data-link class="header-genre-sublink">Ciencia Ficción</a>
          <a href="/category/seinen" data-link class="header-genre-sublink">Seinen</a>
          <a href="/category/shoujo" data-link class="header-genre-sublink">Shoujo</a>
          <a href="/category/shounen" data-link class="header-genre-sublink">Shounen</a>
          <a href="/category/slice-of-life" data-link class="header-genre-sublink">Recuentos de la Vida</a>
          <a href="/category/sports" data-link class="header-genre-sublink">Deportes</a>
          <a href="/category/supernatural" data-link class="header-genre-sublink">Sobrenatural</a>
          <a href="/category/thriller" data-link class="header-genre-sublink">Thriller</a>
        </div>
      </div>
    </div>

    <!-- Contenedor del centro: Barra de búsqueda simulada para escritorio -->
    <div class="nav-center-container">
      <div class="search-bar-desktop" id="desktop-search-trigger">
        <svg class="search-icon-desktop" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Buscar anime...</span>
      </div>
    </div>

    <!-- Contenedor derecho: Notificaciones y perfil dinámico -->
    <div class="nav-right" style="display: flex; align-items: center;">

      <!-- Campana de Notificaciones original intacta -->
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

      <!-- Barra de búsqueda clásica pill para móvil/compatibilidad -->
      <div class="search-pill" id="open-search-btn" style="display: none;">
        <span>🔍 Buscar...</span>
      </div>

      <!-- Botón de Perfil Premium (Escritorio y adaptado) -->
      <a id="profile-link" href="/auth" data-link class="header-profile-btn">
        <div class="header-profile-avatar-container" id="profile-avatar-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="header-profile-username" id="profile-username-text">Entrar</span>
      </a>
    </div>
  </nav>

  <!-- Navegación móvil bottom-nav intacta -->
  <nav class="mobile-nav bottom-nav" id="bottomNav">
     <a href="/" data-link class="nav-item">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
           <polyline points="9 22 9 12 15 12 15 22"/>
         </svg>
       </div>
       <div class="nav-label">Inicio</div>
     </a>
     <a href="#" class="nav-item" id="mobile-search-btn">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <circle cx="11" cy="11" r="8"/>
           <line x1="21" y1="21" x2="16.65" y2="16.65"/>
         </svg>
       </div>
       <div class="nav-label">Buscar</div>
     </a>
     <a href="/favorites" data-link class="nav-item">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
         </svg>
       </div>
       <div class="nav-label">Fav</div>
     </a>
     <a id="mobile-profile-link" href="/auth" data-link class="nav-item">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
           <circle cx="12" cy="7" r="4"/>
         </svg>
       </div>
       <div class="nav-label">Entrar</div>
     </a>
  </nav>
`;
document.body.insertBefore(header, appContainer);

// Inyectar Barra Lateral Premium de Escritorio
const sidebar = document.createElement('aside');
sidebar.className = 'desktop-sidebar';
sidebar.innerHTML = `
  <div class="sidebar-logo">
    <a href="/" data-link class="sidebar-logo-link">AniRD <span class="logo-cloud">☁️</span></a>
  </div>
  
  <ul class="sidebar-menu">
    <li>
      <a href="/" data-link class="sidebar-link" data-route="/">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Inicio</span>
      </a>
    </li>
    <li>
      <a href="#" class="sidebar-link" id="sidebar-search-btn">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span>Explorar</span>
      </a>
    </li>
    <li>
      <a href="/favorites" data-link class="sidebar-link" data-route="/favorites">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Favoritos</span>
      </a>
    </li>
    <li>
      <a href="/history" data-link class="sidebar-link" data-route="/history">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Historial</span>
      </a>
    </li>
    <li>
      <a href="/calendar" data-link class="sidebar-link" data-route="/calendar">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Calendario</span>
      </a>
    </li>
    <li>
      <a id="sidebar-profile-link" href="/auth" data-link class="sidebar-link" data-route="/profile">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Mi Perfil</span>
      </a>
    </li>
    <li class="sidebar-dropdown">
      <button class="sidebar-link sidebar-dropdown-trigger" id="sidebar-categories-trigger">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Categorías</span>
        <svg class="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="sidebar-dropdown-content" id="sidebar-categories-dropdown">
        <div class="sidebar-dropdown-inner">
          <a href="/category/popular" data-link class="sidebar-sublink">🔥 Populares</a>
          <a href="/category/movies" data-link class="sidebar-sublink">🎬 Películas</a>
          <a href="/category/dub" data-link class="sidebar-sublink">🎙️ Latino</a>
          <div class="sidebar-sublink-divider">GÉNEROS</div>
          <a href="/category/action" data-link class="sidebar-sublink">Acción</a>
          <a href="/category/adventure" data-link class="sidebar-sublink">Aventura</a>
          <a href="/category/comedy" data-link class="sidebar-sublink">Comedia</a>
          <a href="/category/drama" data-link class="sidebar-sublink">Drama</a>
          <a href="/category/fantasy" data-link class="sidebar-sublink">Fantasía</a>
          <a href="/category/music" data-link class="sidebar-sublink">Musical</a>
          <a href="/category/romance" data-link class="sidebar-sublink">Romance</a>
          <a href="/category/sci-fi" data-link class="sidebar-sublink">Ciencia Ficción</a>
          <a href="/category/seinen" data-link class="sidebar-sublink">Seinen</a>
          <a href="/category/shoujo" data-link class="sidebar-sublink">Shoujo</a>
          <a href="/category/shounen" data-link class="sidebar-sublink">Shounen</a>
          <a href="/category/slice-of-life" data-link class="sidebar-sublink">Recuentos de la Vida</a>
          <a href="/category/sports" data-link class="sidebar-sublink">Deportes</a>
          <a href="/category/supernatural" data-link class="sidebar-sublink">Sobrenatural</a>
          <a href="/category/thriller" data-link class="sidebar-sublink">Thriller</a>
        </div>
      </div>
    </li>
  </ul>

  <hr class="sidebar-divider">

  <div class="sidebar-section-title">SIGUIENDO</div>
  <div class="sidebar-following-list" id="sidebar-following-list">
    <div style="color: rgba(255,255,255,0.3); font-size: 11px; padding: 10px 20px; text-align: center;">Cargando lista...</div>
  </div>
`;
document.body.insertBefore(sidebar, appContainer);

const updateNavbarAuth = () => {
  const profileLink = document.getElementById('profile-link');
  const mobileProfileLink = document.getElementById('mobile-profile-link');
  const sidebarProfileLink = document.getElementById('sidebar-profile-link');
  const profileAvatarContainer = document.getElementById('profile-avatar-container');
  const profileUsernameText = document.getElementById('profile-username-text');
  
  const isLoggedIn = authService.isLoggedIn();
  const user = authService.getUser();
  
  const targetPath = isLoggedIn ? '/profile' : '/auth';
  const targetText = isLoggedIn ? 'Mi Perfil' : 'Entrar';

  if (profileLink) {
    profileLink.setAttribute('href', targetPath);
    if (isLoggedIn) {
      if (profileAvatarContainer) profileAvatarContainer.classList.add('active-border');
      if (profileUsernameText) profileUsernameText.textContent = user?.username || 'Perfil';
    } else {
      if (profileAvatarContainer) profileAvatarContainer.classList.remove('active-border');
      if (profileUsernameText) profileUsernameText.textContent = 'Entrar';
    }
  }
  if (mobileProfileLink) {
    mobileProfileLink.setAttribute('href', targetPath);
    const label = mobileProfileLink.querySelector('.nav-label');
    if (label) label.textContent = isLoggedIn ? 'Perfil' : 'Entrar';
  }
  if (sidebarProfileLink) {
    sidebarProfileLink.setAttribute('href', targetPath);
    const textSpan = sidebarProfileLink.querySelector('span');
    if (textSpan) textSpan.textContent = isLoggedIn ? 'Mi Perfil' : 'Entrar';
  }
};

const updateMobileNavActive = (route) => {
  const bottomNav = document.getElementById('bottomNav');
  if (!bottomNav) return;
  const items = bottomNav.querySelectorAll('.nav-item');
  items.forEach((item) => {
    item.classList.remove('active');
    const svg = item.querySelector('svg');
    if (svg) svg.setAttribute('stroke-width', '1.8');
  });

  let activeIndex = -1;
  if (route === '/' || route.startsWith('/anime/') || route.startsWith('/category/') || route.startsWith('/watch/') || route === '/calendar') {
    activeIndex = 0; // Inicio (o categorías/reproductor/calendario que pertenecen a la sección de Inicio/Exploración)
  } else if (route === '/favorites') {
    activeIndex = 2; // Fav
  } else if (route === '/profile' || route === '/auth') {
    activeIndex = 3; // Perfil / Entrar
  }

  if (activeIndex !== -1 && items[activeIndex]) {
    items[activeIndex].classList.add('active');
    const svg = items[activeIndex].querySelector('svg');
    if (svg) svg.setAttribute('stroke-width', '2.2');
  }
};

const updateSidebarActive = (route) => {
  const sidebarEl = document.querySelector('.desktop-sidebar');
  if (!sidebarEl) return;
  const links = sidebarEl.querySelectorAll('.sidebar-link');
  links.forEach(link => link.classList.remove('active'));

  let activeRoute = '/';
  if (route === '/' || route.startsWith('/anime/') || route.startsWith('/watch/') || route.startsWith('/category/') || route === '/calendar') {
    activeRoute = '/';
  } else if (route === '/favorites') {
    activeRoute = '/favorites';
  } else if (route === '/history' || route === '/my-anird') {
    activeRoute = '/history';
  } else if (route === '/profile' || route === '/auth') {
    activeRoute = '/profile';
  }

  const activeLink = sidebarEl.querySelector(`.sidebar-link[data-route="${activeRoute}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
};

const renderSidebarFollowing = async () => {
  const listContainer = document.getElementById('sidebar-following-list');
  if (!listContainer) return;

  try {
    const following = await dbService.getFollowing();
    if (following.length === 0) {
      listContainer.innerHTML = `
        <div class="sidebar-following-empty">
          Aún no sigues ningún anime. Haz clic en "Seguir" en la ficha del anime para agregarlo aquí.
        </div>
      `;
      return;
    }

    // Obtener el último episodio reproducido en el historial de forma rápida
    const history = await db.history.orderBy('updatedAt').reverse().toArray();
    const lastEpMap = new Map();
    history.forEach(item => {
      if (!lastEpMap.has(item.animeId)) {
        lastEpMap.set(item.animeId, item.episodeId);
      }
    });

    listContainer.innerHTML = following.slice(0, 5).map(anime => {
      const animeId = Number(anime.animeId);
      const lastEp = lastEpMap.get(animeId);
      const epText = lastEp ? `Ep. ${lastEp}` : 'Ver ahora';
      return `
        <a href="/anime/${animeId}" data-link class="sidebar-following-item">
          <img class="sidebar-following-cover" src="${anime.cover}" alt="${anime.title}" loading="lazy">
          <div class="sidebar-following-info">
            <div class="sidebar-following-title">${anime.title}</div>
            <div class="sidebar-following-ep">${epText}</div>
          </div>
        </a>
      `;
    }).join('');
  } catch (err) {
    console.error("Error al renderizar siguiendo en la barra lateral:", err);
  }
};

// Suscribirse a cambios de ruta de Zustand
useAppStore.subscribe((state) => {
  updateMobileNavActive(state.currentRoute);
  updateSidebarActive(state.currentRoute);
  renderSidebarFollowing();
  
  if (spatialNavigation.isActive) {
    setTimeout(() => {
      spatialNavigation.updateFocusables();
      spatialNavigation.focusFirstAvailable();
    }, 400); // Allow smooth page mounting
  }
});

window.updateNavbarAuth = updateNavbarAuth;
updateNavbarAuth();
updateMobileNavActive(window.location.pathname);
updateSidebarActive(window.location.pathname);
renderSidebarFollowing();

// Listeners de búsqueda simulada e interactiva
const triggerSearch = (e) => {
  if (e) e.preventDefault();
  searchPalette.open();
};

const desktopSearchTrigger = document.getElementById('desktop-search-trigger');
if (desktopSearchTrigger) {
  desktopSearchTrigger.addEventListener('click', triggerSearch);
}
const openSearchBtn = document.getElementById('open-search-btn');
if (openSearchBtn) {
  openSearchBtn.addEventListener('click', triggerSearch);
}
const mobileSearchBtn = document.getElementById('mobile-search-btn');
if (mobileSearchBtn) {
  mobileSearchBtn.addEventListener('click', triggerSearch);
}
const sidebarSearchBtn = document.getElementById('sidebar-search-btn');
if (sidebarSearchBtn) {
  sidebarSearchBtn.addEventListener('click', triggerSearch);
}

// Lógica interactiva para el acordeón de categorías colapsable de la barra lateral
const categoriesTrigger = document.getElementById('sidebar-categories-trigger');
const categoriesDropdown = document.getElementById('sidebar-categories-dropdown');
if (categoriesTrigger && categoriesDropdown) {
  categoriesTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    categoriesTrigger.classList.toggle('expanded');
    categoriesDropdown.classList.toggle('expanded');
  });
}

// Lógica para colapsar y ocultar la barra lateral en PC con persistencia
const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
if (sidebarCollapseBtn) {
  const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
  if (isCollapsed) {
    document.body.classList.add('sidebar-collapsed');
  }

  sidebarCollapseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const currentlyCollapsed = document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', currentlyCollapsed ? 'true' : 'false');
  });
}

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

const setupTVMode = () => {
  const toggleBtn = document.getElementById('tv-mode-toggle');
  const toggleText = document.getElementById('tv-mode-text');
  const headerToggleBtn = document.getElementById('header-tv-toggle');
  
  const updateToggleUI = (active) => {
    if (toggleText) {
      toggleText.textContent = active ? '📺 Modo TV: ON' : '📺 Modo TV: OFF';
    }
    if (toggleBtn) {
      if (active) {
        toggleBtn.classList.add('active');
      } else {
        toggleBtn.classList.remove('active');
      }
    }
    if (headerToggleBtn) {
      if (active) {
        headerToggleBtn.classList.add('active');
        headerToggleBtn.style.background = 'rgba(255, 0, 85, 0.2)';
        headerToggleBtn.style.boxShadow = '0 0 15px rgba(255, 0, 85, 0.4)';
        headerToggleBtn.style.border = '1px solid rgba(255, 0, 85, 0.4)';
      } else {
        headerToggleBtn.classList.remove('active');
        headerToggleBtn.style.background = 'rgba(255,255,255,0.05)';
        headerToggleBtn.style.boxShadow = 'none';
        headerToggleBtn.style.border = 'none';
      }
    }
  };

  const toggleTVMode = () => {
    if (spatialNavigation.isActive) {
      spatialNavigation.destroy();
      updateToggleUI(false);
    } else {
      spatialNavigation.init();
      updateToggleUI(true);
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTVMode();
    });
  }

  if (headerToggleBtn) {
    headerToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTVMode();
    });
  }

  const isSavedTV = localStorage.getItem('tvMode') === 'true';
  const isSmartTV = /AniRD-AndroidTV|SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon|Chromecast|DroidTV|TV\s+Box|Smart_TV|MiBox|Shield/i.test(navigator.userAgent) || navigator.userAgent.toLowerCase().includes('tv');
  
  if (isSavedTV || (localStorage.getItem('tvMode') === null && isSmartTV)) {
    spatialNavigation.init();
    updateToggleUI(true);
  } else {
    updateToggleUI(false);
  }
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
    
    // Initialize TV mode toggle and auto-detection
    setTimeout(setupTVMode, 200);
};

initApp();
