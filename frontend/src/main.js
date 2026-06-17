import './styles/global.css';

// Desactivar y desinstalar cualquier Service Worker previo para evitar bloqueos agresivos de caché
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

// Navbar Premium UI v5
const header = document.createElement('header');
header.innerHTML = `
  <nav class="nav-v5 fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-white/[0.06]" style="position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(9,9,11,0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.06);">
    <div style="max-width: 1920px; margin: 0 auto; padding: 0 5%; height: 70px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 24px;">
        <a href="/" data-link style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #dc2626; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220,38,38,0.3);">
            <span style="color: white; font-weight: 900; font-size: 14px; font-family: 'Outfit';">A</span>
          </div>
          <span class="nav-logo-text" style="font-size: 20px; font-weight: 900; letter-spacing: -0.05em; color: white; font-family: 'Outfit'; display: block;">
            Ani<span style="color: #ef4444;">RD</span>
          </span>
        </a>
        <div class="nav-links-v5" style="display: flex; align-items: center; gap: 4px;">
          <a href="/" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Inicio</a>
          <a href="/category/popular" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>Populares</a>
          <a href="/category/movies" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7h4"/><path d="M3 17h4"/><path d="M17 3v18"/><path d="M17 7h4"/><path d="M17 17h4"/></svg>Películas</a>
          <a href="/category/dub" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>Latino</a>
          <a href="/calendar" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>Calendario</a>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 12px;">
        <button id="desktop-search-trigger" style="display: flex; align-items: center; justify-content: space-between; width: 220px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; color: #a1a1aa; font-size: 13px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Buscar anime...</span>
          </div>
          <kbd style="display: inline-flex; font-family: monospace; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 10px;">⌘K</kbd>
        </button>

        <div class="nav-notifications" id="nav-notifications" style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; transition: all 0.3s ease; color: #a1a1aa;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span id="notif-badge" style="display:none; position: absolute; top: 8px; right: 8px; background: #ef4444; width: 8px; height: 8px; border-radius: 50%;"></span>
          
          <div id="notif-dropdown" style="display:none; position: absolute; top: 45px; right: 0; width: 320px; background: rgba(9,9,11,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 15px; z-index: 100; cursor: default; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
               <h4 style="margin: 0; color: white; font-family: 'Outfit';">Notificaciones</h4>
               <span id="mark-read-btn" style="font-size: 11px; color: #ef4444; cursor: pointer; font-weight: 800;">Marcar Leídas</span>
             </div>
             <div id="notif-list" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
               <div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>
             </div>
          </div>
        </div>

        <a id="profile-link" href="/auth" data-link style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #b91c1c); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; box-shadow: 0 4px 14px rgba(220,38,38,0.2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="14" cy="7" r="4"/></svg>
        </a>
      </div>
    </div>
  </nav>

  <style>
    .nav-link-v5 {
      display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #a1a1aa; text-decoration: none; transition: all 0.2s;
    }
    .nav-link-v5 svg { width: 16px; height: 16px; }
    .nav-link-v5:hover, .nav-link-v5.active { background: rgba(255,255,255,0.05); color: white; }
    #desktop-search-trigger:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; color: white !important; }
    .nav-notifications:hover { background: rgba(255,255,255,0.1); color: white !important; }
    
    @media (max-width: 768px) {
      .nav-links-v5 { display: none !important; }
      #desktop-search-trigger { width: auto !important; padding: 8px !important; border-radius: 50% !important; justify-content: center !important; }
      #desktop-search-trigger span, #desktop-search-trigger kbd { display: none !important; }
      .nav-logo-text { display: none !important; }
    }
  </style>

  <nav class="mobile-nav bottom-nav" id="bottomNav" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(9,9,11,0.9); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-around; padding: 8px 16px; display: none;">
     <a href="/" data-link class="nav-item" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
       <span style="font-size: 10px; font-weight: 500;">Inicio</span>
     </a>
     <a href="#" class="nav-item" id="mobile-search-btn" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
       <span style="font-size: 10px; font-weight: 500;">Buscar</span>
     </a>
     <a href="/favorites" data-link class="nav-item" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
       <span style="font-size: 10px; font-weight: 500;">Favs</span>
     </a>
     <a id="mobile-profile-link" href="/auth" data-link class="nav-item" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="14" cy="7" r="4"/></svg>
       <span class="nav-label" style="font-size: 10px; font-weight: 500;">Perfil</span>
     </a>
  </nav>
`;
document.body.insertBefore(header, appContainer);

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



// Suscribirse a cambios de ruta de Zustand
useAppStore.subscribe((state) => {
  updateMobileNavActive(state.currentRoute);
  
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
  const isSmartTV = (/AniRD-AndroidTV|SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon|Chromecast|DroidTV|TV\s+Box|Smart_TV|MiBox|Shield/i.test(navigator.userAgent) || navigator.userAgent.toLowerCase().includes('tv')) && !navigator.userAgent.includes('AniRD-AndroidMobile');
  
  if (isSavedTV || (localStorage.getItem('tvMode') === null && isSmartTV)) {
    spatialNavigation.init();
    updateToggleUI(true);
  } else {
    updateToggleUI(false);
  }
};

const initApp = async () => {
    let theme = await dbService.getSetting('theme', null);
    if (!theme) {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme = systemDark ? 'dark' : 'light';
    }
    if (theme === 'light') document.body.classList.add('light-theme');
    else document.body.classList.remove('light-theme');
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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.warn);
}

// FASE B, C, E: AniRD Android & TV Bridge integration
window.AniRDBridge = {
  isPlaying: () => {
    const playerActive = document.body.classList.contains('player-active') || document.querySelector('.watch-container') !== null;
    const hasVideo = document.querySelector('video') !== null;
    const hasIframe = document.querySelector('#video-container iframe, iframe') !== null;
    return playerActive && (hasVideo || hasIframe);
  },
  enterPip: () => {
    document.body.classList.add('pip-mode');
  },
  exitPip: () => {
    document.body.classList.remove('pip-mode');
  },
  play: () => {
    const media = document.querySelector('video');
    if (media) {
      media.play().catch(e => console.error("Play error:", e));
    } else {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
      }
    }
  },
  pause: () => {
    const media = document.querySelector('video');
    if (media) {
      media.pause();
    } else {
      const iframe = document.querySelector('iframe');
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
      }
    }
  },
  togglePlayPause: () => {
    const media = document.querySelector('video');
    if (media) {
      if (media.paused) media.play().catch(e => console.error("Play error:", e));
      else media.pause();
    }
  },
  nextEpisode: () => {
    const nextBtn = document.querySelector('.next-episode-btn, #next-ep-btn, button[title*="Siguiente"], a[title*="Siguiente"]');
    if (nextBtn) nextBtn.click();
  },
  prevEpisode: () => {
    const prevBtn = document.querySelector('.prev-episode-btn, #prev-ep-btn, button[title*="Anterior"], a[title*="Anterior"]');
    if (prevBtn) prevBtn.click();
  },
  seekForward: (sec) => {
    const media = document.querySelector('video');
    if (media) {
      media.currentTime = Math.min(media.duration || 0, media.currentTime + sec);
    }
  },
  seekBack: (sec) => {
    const media = document.querySelector('video');
    if (media) {
      media.currentTime = Math.max(0, media.currentTime - sec);
    }
  },
  handleBack: () => {
    const modal = document.querySelector('.modal.active, .dropdown.open, #notif-dropdown[style*="block"]');
    if (modal) {
      if (modal.id === 'notif-dropdown') {
        modal.style.display = 'none';
      } else {
        modal.classList.remove('active', 'open');
      }
      return true;
    }
    return false;
  },
  loginWithToken: (token) => {
    if (token) {
      authService.loginWithToken(token).then(() => {
        if (window.updateNavbarAuth) window.updateNavbarAuth();
      }).catch(err => console.error("Auto login token error:", err));
    }
  },
  notifyPlayback: (title, isPlaying) => {
    if (window.Android && window.Android.onPlaybackChanged) {
      window.Android.onPlaybackChanged(title, isPlaying);
    }
  }
};

// Auto-detect player playback events and notify android
setInterval(() => {
  const video = document.querySelector('video');
  if (video && !video.dataset.hasAniRDListener) {
    video.dataset.hasAniRDListener = 'true';
    const notify = () => {
      const titleElement = document.querySelector('.watch-anime-title, .anime-title, h1, h2');
      const title = titleElement ? titleElement.textContent.trim() : 'AniRD Video';
      if (window.AniRDBridge && window.AniRDBridge.notifyPlayback) {
        window.AniRDBridge.notifyPlayback(title, !video.paused);
      }
    };
    video.addEventListener('play', notify);
    video.addEventListener('pause', notify);
    video.addEventListener('ended', () => {
      if (window.AniRDBridge && window.AniRDBridge.notifyPlayback) {
        window.AniRDBridge.notifyPlayback('AniRD', false);
      }
    });
  }
}, 1000);

