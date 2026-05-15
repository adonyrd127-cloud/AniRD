import { authService } from '../services/auth.service.js';
import { dbService } from '../services/db.js';

export default class ProfilePage {
  constructor(params) {
    this.params = params;
    this.user = authService.getUser();
  }

  async render() {
    if (!this.user) {
      window.location.href = '/auth';
      return document.createElement('div');
    }

    const container = document.createElement('div');
    container.className = 'profile-container page-enter';
    
    container.innerHTML = `
      <div class="profile-header">
        <div class="profile-avatar">
          ${this.user.username.charAt(0).toUpperCase()}
        </div>
        <h1>Hola, ${this.user.username}</h1>
        <p>Tu cuenta AniRD está activa y sincronizada con tu Orange Pi.</p>
      </div>

      <div class="profile-grid">
        <div class="profile-card">
          <div class="card-icon"><i class="fas fa-sync"></i></div>
          <h3>Sincronización</h3>
          <p>Tus datos se guardan automáticamente cada vez que realizas un cambio.</p>
          <button class="btn-secondary" id="force-sync">Sincronizar ahora</button>
        </div>

        <div class="profile-card">
          <div class="card-icon"><i class="fas fa-shield-alt"></i></div>
          <h3>Seguridad</h3>
          <p>Sesión activa desde este navegador.</p>
          <button class="btn-danger" id="logout-btn">Cerrar Sesión</button>
        </div>
      </div>

      <div class="profile-stats">
        <h2>Tus estadísticas</h2>
        <div class="stats-grid" id="stats-container">
          <div class="stat-item">Cargando...</div>
        </div>
      </div>
    `;

    return container;
  }

  async afterRender() {
    if (!this.user) return;

    const logoutBtn = document.getElementById('logout-btn');
    const syncBtn = document.getElementById('force-sync');
    const statsContainer = document.getElementById('stats-container');

    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        authService.logout();
      }
    });

    syncBtn.addEventListener('click', async () => {
      syncBtn.disabled = true;
      syncBtn.textContent = 'Sincronizando...';
      try {
        const localData = await dbService.getAllData();
        await authService.syncWithServer(localData);
        alert('¡Sincronización completada!');
      } catch (err) {
        alert('Error al sincronizar: ' + err.message);
      } finally {
        syncBtn.disabled = false;
        syncBtn.textContent = 'Sincronizar ahora';
      }
    });

    // Cargar estadísticas reales
    const stats = await dbService.getAllData();
    statsContainer.innerHTML = `
      <div class="stat-item">
        <span class="stat-value">${stats.favorites.length}</span>
        <span class="stat-label">Favoritos</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.following.length}</span>
        <span class="stat-label">Siguiendo</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${stats.history.length}</span>
        <span class="stat-label">Episodios vistos</span>
      </div>
    `;
  }
}
