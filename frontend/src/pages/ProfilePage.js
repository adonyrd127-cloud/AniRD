import { authService } from '../services/auth.service.js';
import { dbService, db } from '../services/db.js';

export default class ProfilePage {
  constructor(params) {
    this.params = params;
    this.user = authService.getUser();
    this.stats = { favorites: 0, following: 0, history: 0 };
  }

  async render() {
    if (!this.user) {
      window.location.href = '/auth';
      return document.createElement('div');
    }

    // Cargar estadísticas reales usando db directamente
    const favorites = await db.favorites.count();
    const following = await db.following.count();
    const history = await db.history.count();
    this.stats = { favorites, following, history };

    const container = document.createElement('div');
    container.className = 'profile-page-container';
    
    container.innerHTML = `
      <div class="profile-hero">
        <div class="profile-card page-enter">
          <div class="profile-header">
            <div class="user-avatar">
              ${this.user.username.charAt(0).toUpperCase()}
            </div>
            <div class="user-info">
              <h1>Hola, ${this.user.username}</h1>
              <p class="status-badge">Cuenta Activa & Sincronizada</p>
            </div>
          </div>

          <div class="profile-stats-grid">
            <div class="stat-item">
              <span class="stat-value">${this.stats.favorites}</span>
              <span class="stat-label">Favoritos</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.stats.following}</span>
              <span class="stat-label">Siguiendo</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">${this.stats.history}</span>
              <span class="stat-label">Episodios</span>
            </div>
          </div>

          <div class="profile-actions">
            <div class="action-section">
              <h3>Sincronización</h3>
              <p>Tus datos se guardan automáticamente en tu Orange Pi.</p>
              <button id="sync-now-btn" class="btn-secondary">
                <span>🔄</span> Sincronizar Ahora
              </button>
            </div>

            <div class="action-section">
              <h3>Seguridad</h3>
              <p>Sesión activa en este navegador.</p>
              <button id="logout-btn" class="btn-danger">
                <span>🚪</span> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    return container;
  }

  async afterRender() {
    const syncBtn = document.getElementById('sync-now-btn');
    const logoutBtn = document.getElementById('logout-btn');

    if (syncBtn) {
      syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<span>⏳</span> Sincronizando...';
        try {
          const localData = await dbService.getAllData();
          await authService.syncWithServer(localData);
          alert('¡Sincronización completada con éxito! ✅');
        } catch (err) {
          alert('Error al sincronizar: ' + err.message);
        } finally {
          syncBtn.disabled = false;
          syncBtn.innerHTML = '<span>🔄</span> Sincronizar Ahora';
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
          authService.logout();
        }
      });
    }
  }
}
