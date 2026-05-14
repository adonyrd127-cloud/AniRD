import { useAppStore } from './stores/appStore.js';

const routes = {
  '/': () => import('./pages/HomePage.js'),
  '/anime': () => import('./pages/AnimeDetailPage.js'),
  '/watch': () => import('./pages/WatchPage.js'),
  '/history': () => import('./pages/HistoryPage.js'),
  '/favorites': () => import('./pages/FavoritesPage.js'),
  '/search': () => import('./pages/SearchPage.js'),
  '/category': () => import('./pages/CategoryPage.js'),
  '/calendar': () => import('./pages/CalendarPage.js'),
};

export class AppRouter {
  constructor(rootElement) {
    this.root = rootElement;
    this.init();
  }

  init() {
    window.addEventListener('popstate', () => this.handleRoute());
    document.body.addEventListener('click', e => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });
    this.handleRoute();
  }

  navigate(path) {
    window.history.pushState(null, null, path);
    this.handleRoute();
  }

  async handleRoute() {
    const url = new URL(window.location.href);
    const path = url.pathname;

    // Rutas dinámicas simples
    let routeKey = '/';
    let params = {};

    if (path.startsWith('/anime/')) {
       routeKey = '/anime';
       params.id = path.split('/')[2];
    } else if (path.startsWith('/watch/')) {
       routeKey = '/watch';
       const parts = path.split('/');
       params.animeId = parts[2];
       params.episodeId = parts[3];
    } else if (path.startsWith('/category/')) {
       routeKey = '/category';
       params.name = path.split('/')[2];
    } else if (path === '/search') {
       routeKey = '/search';
       params.q = url.searchParams.get('q');
    } else if (routes[path]) {
       routeKey = path;
    }

    useAppStore.getState().setCurrentRoute(path);

    const loadModule = routes[routeKey] || routes['/']; // fallback 404/home
    this.root.innerHTML = '<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';

    try {
      const module = await loadModule();
      const PageClass = module.default;
      const page = new PageClass(params);

      this.root.innerHTML = '';
      this.root.appendChild(await page.render());

      if(page.afterRender) page.afterRender();
    } catch(e) {
      console.error("Error loading route", e);
      this.root.innerHTML = '<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>';
    }
  }
}

// Singleton router
let routerInstance = null;
export const getRouter = (root) => {
  if (!routerInstance && root) {
    routerInstance = new AppRouter(root);
  }
  return routerInstance;
};
