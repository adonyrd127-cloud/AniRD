import './styles/global.css';
import { AppRouter } from './app.js';
import { useAppStore } from './stores/appStore.js';

// Init router
const appContainer = document.getElementById('app');

// Agregar navbar básico para navegación (simplificado, se puede extraer a componente)
const header = document.createElement('header');
header.innerHTML = `
  <style>
    .top-nav {
      background: rgba(10, 10, 15, 0.9);
      backdrop-filter: blur(10px);
      padding: 15px 4%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--surface);
    }
    .logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 15px;
    }
    .nav-links a {
      color: var(--text-secondary);
      font-weight: 500;
      transition: color 0.2s;
    }
    .search-form {
      position: relative;
      width: 250px;
    }
    .search-form input {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 8px 15px 8px 35px;
      border-radius: 20px;
      color: white;
      font-size: 0.9rem;
      outline: none;
      transition: all 0.3s;
    }
    .search-form input:focus {
      border-color: var(--accent);
      width: 300px;
    }
    .search-form i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
    }
  </style>
  <nav class="top-nav">
    <div style="display: flex; align-items: center; gap: 30px;">
      <a href="/" data-link class="logo">AniRD</a>
      <div class="nav-links">
        <a href="/" data-link>Inicio</a>
        <a href="/category/popular" data-link>Populares</a>
        <a href="/category/movies" data-link>Películas</a>
        <a href="/category/latest" data-link>Últimos</a>
        <a href="/category/dub" data-link>Latino</a>
        <a href="/calendar" data-link>Calendario</a>
        <a href="/history" data-link>Historial</a>
        <a href="/favorites" data-link>Favoritos</a>
      </div>
    </div>
    <form class="search-form" id="global-search">
      <span style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #666;">🔍</span>
      <input type="text" placeholder="Buscar anime..." id="search-input" autocomplete="off">
      <div id="search-results-dropdown"></div>
    </form>
  </nav>
  <style>
    #search-results-dropdown {
      position: absolute;
      top: 45px;
      left: 0;
      right: 0;
      background: #1a1a2e;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      z-index: 9999;
      display: none;
      border: 1px solid rgba(255,255,255,0.1);
      width: 300px;
    }
    .search-suggestion {
      display: flex;
      padding: 12px;
      gap: 15px;
      cursor: pointer;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      transition: all 0.2s;
    }
    .search-suggestion:hover {
      background: var(--accent);
    }
    .search-suggestion:hover .search-suggestion-title,
    .search-suggestion:hover .search-suggestion-meta {
      color: black;
    }
    .search-suggestion img {
      width: 45px;
      height: 65px;
      object-fit: cover;
      border-radius: 6px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .search-suggestion-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
    }
    .search-suggestion-title {
      font-size: 0.9rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: white;
      margin-bottom: 4px;
    }
    .search-suggestion-meta {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
  </style>
`;
document.body.insertBefore(header, appContainer);

// Init router singleton
import { getRouter } from './app.js';
const router = getRouter(appContainer);

// Handle global search
const searchForm = document.getElementById('global-search');
const searchInput = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-results-dropdown');

let searchTimeout;

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();
  
  clearTimeout(searchTimeout);
  if (query.length < 3) {
    searchDropdown.style.display = 'none';
    return;
  }

  searchTimeout = setTimeout(async () => {
    try {
      const res = await apiService.getAnimeSearch(query);
      // En Jikan v4 res.data es el array
      const results = (res.data || []).slice(0, 6);

      if (results.length > 0) {
        searchDropdown.innerHTML = results.map(anime => {
          const id = anime.mal_id || anime.id;
          const img = anime.images?.jpg?.image_url || anime.image || '';
          return `
            <div class="search-suggestion" data-id="${id}">
              <img src="${img}" alt="" referrerpolicy="no-referrer">
              <div class="search-suggestion-info">
                <div class="search-suggestion-title">${anime.title}</div>
                <div class="search-suggestion-meta">${anime.type || 'TV'} • ${anime.year || anime.status || ''}</div>
              </div>
            </div>
          `;
        }).join('');
        searchDropdown.style.display = 'block';

        searchDropdown.querySelectorAll('.search-suggestion').forEach(item => {
          item.onclick = (event) => {
            event.stopPropagation();
            const id = item.getAttribute('data-id');
            if (id && id !== 'undefined') {
                router.navigate(`/anime/${id}`);
                searchDropdown.style.display = 'none';
                searchInput.value = '';
            }
          };
        });
      } else {
        searchDropdown.style.display = 'none';
      }
    } catch (e) {
      console.error("Search suggestion error:", e);
      searchDropdown.style.display = 'none';
    }
  }, 500);
});

// Close dropdown on click outside
document.addEventListener('click', (e) => {
  if (!searchForm.contains(e.target)) {
    searchDropdown.style.display = 'none';
  }
});

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    router.navigate(`/search?q=${encodeURIComponent(query)}`);
    searchInput.value = '';
    searchDropdown.style.display = 'none';
  }
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
