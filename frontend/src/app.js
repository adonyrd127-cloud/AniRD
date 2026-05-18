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
  '/my-anird': () => import('./pages/HistoryPage.js'),
  '/auth': () => import('./pages/AuthPage.js'),
  '/profile': () => import('./pages/ProfilePage.js'),
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

    // Category title map
    const categoryTitles = {
      popular: 'Animes Populares', movies: 'Películas', latest: 'Últimos Lanzamientos',
      dub: 'Anime Latino', action: 'Acción', comedy: 'Comedia',
      romance: 'Romance', supernatural: 'Sobrenatural'
    };

    if (path.startsWith('/anime/')) {
       routeKey = '/anime';
       params.id = path.split('/')[2];
       document.title = `Cargando... — AniRD`;
    } else if (path.startsWith('/watch/')) {
       routeKey = '/watch';
       const parts = path.split('/');
       params.id = parts[2];
       params.ep = parts[3];
       params.lang = parts[4] || 'sub';
       document.title = `Ep. ${params.ep} — AniRD`;
    } else if (path.startsWith('/category/')) {
       routeKey = '/category';
       params.name = path.split('/')[2];
       document.title = `${categoryTitles[params.name] || 'Explorar'} — AniRD`;
    } else if (path === '/search') {
       routeKey = '/search';
       params.q = url.searchParams.get('q');
       document.title = `Buscar "${params.q || ''}" — AniRD`;
    } else if (path === '/profile') {
       routeKey = '/profile';
       document.title = `Mi Perfil — AniRD`;
    } else if (path === '/auth') {
       routeKey = '/auth';
       document.title = `Iniciar Sesión — AniRD`;
    } else if (path === '/calendar') {
       routeKey = '/calendar';
       document.title = `Calendario — AniRD`;
    } else if (path === '/history' || path === '/my-anird') {
       routeKey = routes[path] ? path : '/';
       document.title = `Mi Historial — AniRD`;
    } else if (path === '/favorites') {
       routeKey = '/favorites';
       document.title = `Favoritos — AniRD`;
    } else if (routes[path]) {
       routeKey = path;
       document.title = `AniRD — Tu plataforma de anime`;
    } else {
       document.title = `AniRD — Tu plataforma de anime`;
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
