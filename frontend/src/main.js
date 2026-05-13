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
    .nav-links a:hover {
      color: white;
    }
  </style>
  <nav class="top-nav">
    <a href="/" data-link class="logo">AniRD</a>
    <div class="nav-links">
      <a href="/" data-link>Inicio</a>
      <a href="/calendar" data-link>Calendario</a>
      <a href="/history" data-link>Historial</a>
      <a href="/favorites" data-link>Favoritos</a>
    </div>
  </nav>
`;
document.body.insertBefore(header, appContainer);

const router = new AppRouter(appContainer);

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
