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
    <div class="nav-logo">AniRD ☁️</div>
    
    <ul class="nav-links">
      <li><a href="/" data-link>Inicio</a></li>
      <li><a href="/category/popular" data-link>Populares</a></li>
      <li><a href="/category/movies" data-link>Películas</a></li>
      <li><a href="/category/dub" data-link>Latino</a></li>
      <li><a href="/category/action" data-link>Acción</a></li>
      <li><a href="/category/comedy" data-link>Comedia</a></li>
      <li><a href="/calendar" data-link>Calendario</a></li>
    </ul>

    <div class="nav-right">
      <div class="search-pill" id="open-search-btn">
        <span>🔍 Buscar...</span>
        <kbd style="opacity:0.5; font-size:9px; margin-left:5px">Ctrl K</kbd>
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

const initApp = async () => {
    const theme = await dbService.getSetting('theme', 'dark');
    if (theme === 'light') document.body.classList.add('light-theme');
    if (authService.isLoggedIn()) {
      try {
        const serverData = await authService.fetchFromServer();
        if (serverData) await dbService.syncFromServer(serverData);
      } catch (err) { console.error('Sync fail'); }
    }
};

initApp();
