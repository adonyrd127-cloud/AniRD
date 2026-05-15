import { authService } from '../services/auth.service.js';
import { dbService } from './db.js';

export default class AuthPage {
  constructor(params) {
    this.params = params;
    this.mode = 'login';
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'auth-container page-enter';
    
    container.innerHTML = `
      <div class="auth-card">
        <div class="auth-header">
          <img src="/assets/favicon.png" alt="AniRD Logo" class="auth-logo" onerror="this.src='/favicon.ico'">
          <h1>AniRD Cloud</h1>
          <p>Sincroniza tus animes en todos tus dispositivos</p>
        </div>
        
        <div class="auth-tabs">
          <button class="auth-tab active" id="tab-login">Entrar</button>
          <button class="auth-tab" id="tab-register">Registrarse</button>
        </div>

        <form id="auth-form" class="auth-form">
          <div class="form-group">
            <label for="username">Usuario</label>
            <input type="text" id="username" placeholder="Tu nombre de usuario" required autocomplete="username">
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input type="password" id="password" placeholder="••••••••" required autocomplete="current-password">
          </div>
          <div id="auth-error" class="auth-error hidden"></div>
          <button type="submit" class="btn-primary auth-submit" style="width: 100%; padding: 12px; background: var(--accent); color: white; border-radius: 8px; font-weight: bold; cursor: pointer;">
            <span id="submit-text">Iniciar Sesión</span>
            <div class="loader-small hidden" id="auth-loader"></div>
          </button>
        </form>

        <div class="auth-footer">
          <p>Al entrar, tus favoritos e historial se guardarán de forma segura en tu Orange Pi.</p>
        </div>
      </div>
    `;

    return container;
  }

  async afterRender() {
    const form = document.getElementById('auth-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const submitText = document.getElementById('submit-text');
    const errorDiv = document.getElementById('auth-error');
    const loader = document.getElementById('auth-loader');
    
    tabLogin.addEventListener('click', () => {
      this.mode = 'login';
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      submitText.textContent = 'Iniciar Sesión';
      errorDiv.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
      this.mode = 'register';
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      submitText.textContent = 'Crear Cuenta';
      errorDiv.classList.add('hidden');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      errorDiv.classList.add('hidden');
      loader.classList.remove('hidden');
      submitText.classList.add('hidden');

      try {
        let result;
        if (this.mode === 'login') {
          result = await authService.login(username, password);
        } else {
          result = await authService.register(username, password);
        }

        // Si tenemos datos en el servidor, sincronizarlos con local
        if (result.syncData) {
          await dbService.syncFromServer(result.syncData);
        } else {
          // Si es nuevo, subir lo que tengamos localmente
          const localData = await dbService.getAllData();
          await authService.syncWithServer(localData);
        }

        // Actualizar navbar antes de irnos
        if (window.updateNavbarAuth) window.updateNavbarAuth();
        
        window.location.href = '/profile';
      } catch (err) {
        errorDiv.textContent = err.message;
        errorDiv.classList.remove('hidden');
      } finally {
        loader.classList.add('hidden');
        submitText.classList.remove('hidden');
      }
    });
  }
}
