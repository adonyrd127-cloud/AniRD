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
      dub: 'Anime Latino', action: 'Acción', comedy: 'Comedia', romance: 'Romance',
      supernatural: 'Sobrenatural', adventure: 'Aventura', drama: 'Drama',
      fantasy: 'Fantasía', music: 'Musical', 'sci-fi': 'Ciencia Ficción',
      seinen: 'Seinen', shoujo: 'Shoujo', shounen: 'Shounen',
      'slice-of-life': 'Recuentos de la Vida', sports: 'Deportes', thriller: 'Thriller'
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

    // Limpiar clases de ruta previas de forma compatible en Smart TVs
    const classesToRemove = [];
    for (let i = 0; i < document.body.classList.length; i++) {
      const cls = document.body.classList[i];
      if (cls && cls.startsWith('route-')) {
        classesToRemove.push(cls);
      }
    }
    classesToRemove.forEach(cls => document.body.classList.remove(cls));

    // Agregar la clase de la ruta activa
    const routeClass = `route-${routeKey.replace('/', '') || 'home'}`;
    document.body.classList.add(routeClass);

    useAppStore.getState().setCurrentRoute(path);

    const loadModule = routes[routeKey] || routes['/']; // fallback 404/home
    this.root.innerHTML = `
      <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        <div class="loader-small" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-family: 'Outfit'; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted);">CARGANDO PÁGINA...</div>
      </div>
    `;

    let module;
    try {
      module = await loadModule();
    } catch(e) {
      console.warn("⚠️ Error al cargar componente de ruta, reintentando en 500ms...", e);
      await new Promise(r => setTimeout(r, 500));
      try {
        module = await loadModule();
      } catch(retryError) {
        console.error("❌ Fallo crítico al cargar ruta después de reintentar:", retryError);
        this.root.innerHTML = `
          <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh;">
            <span style="font-size: 44px; display: block; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(255,0,85,0.4));">📶</span>
            <h3 style="font-family: 'Outfit'; font-size: 20px; font-weight: 800; margin-bottom: 10px;">Error de Conexión</h3>
            <p style="color: var(--text-muted); font-size: 13px; max-width: 420px; line-height: 1.5; margin: 0 auto 30px;">
              No pudimos descargar los componentes visuales necesarios. Revisa tu conexión a internet e inténtalo de nuevo.
            </p>
            <button onclick="window.location.reload()" class="btn-v4-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 50px;">
               🔄 Reintentar Cargar
            </button>
          </div>
        `;
        return;
      }
    }

    try {
      const PageClass = module.default;
      const page = new PageClass(params);

      this.root.innerHTML = '';
      this.root.appendChild(await page.render());

      if(page.afterRender) page.afterRender();

      // Prefetch inteligente de rutas probables (AnimeDetailPage y WatchPage)
      if (routeKey === '/') {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(() => {
            routes['/anime']().catch(() => {});
            routes['/watch']().catch(() => {});
          });
        } else {
          setTimeout(() => {
            routes['/anime']().catch(() => {});
            routes['/watch']().catch(() => {});
          }, 1500);
        }
      }

      // Reset scroll position on route change to start clean at the top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch(e) {
      console.error("Error al inicializar o renderizar la página:", e);
      this.root.innerHTML = '<div style="padding: 100px; text-align: center; color: red; font-family:\'Outfit\';"><h3>Error al renderizar el contenido</h3></div>';
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
