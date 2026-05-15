import { authService } from '../services/auth.service.js';
import { db } from '../services/db.js';

export const AuthPage = {
  render: async () => {
    return `
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <img src="/assets/favicon.png" alt="AniRD Logo" class="auth-logo">
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
              <input type="text" id="username" placeholder="Tu nombre de usuario" required>
            </div>
            <div class="form-group">
              <label for="password">Contraseña</label>
              <input type="password" id="password" placeholder="••••••••" required>
            </div>
            <div id="auth-error" class="auth-error hidden"></div>
            <button type="submit" class="btn-primary auth-submit">
              <span id="submit-text">Iniciar Sesión</span>
              <div class="loader-small hidden" id="auth-loader"></div>
            </button>
          </form>

          <div class="auth-footer">
            <p>Al entrar, tus favoritos e historial se guardarán de forma segura en tu Orange Pi.</p>
          </div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const form = document.getElementById('auth-form');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const submitText = document.getElementById('submit-text');
    const errorDiv = document.getElementById('auth-error');
    const loader = document.getElementById('auth-loader');
    
    let mode = 'login';

    tabLogin.addEventListener('click', () => {
      mode = 'login';
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      submitText.textContent = 'Iniciar Sesión';
      errorDiv.classList.add('hidden');
    });

    tabRegister.addEventListener('click', () => {
      mode = 'register';
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
        if (mode === 'login') {
          result = await authService.login(username, password);
        } else {
          result = await authService.register(username, password);
        }

        // Si tenemos datos en el servidor, sincronizarlos con local
        if (result.syncData) {
          await db.syncFromServer(result.syncData);
        } else {
          // Si es nuevo, subir lo que tengamos localmente
          const localData = await db.getAllData();
          await authService.syncWithServer(localData);
        }

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
};
