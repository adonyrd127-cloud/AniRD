class AuthService {
  constructor() {
    this.tokenKey = 'anird_auth_token';
    this.userKey = 'anird_user';
    this.host = window.location.hostname || 'localhost';
    this.baseUrl = `http://${this.host}:3005/api/v1/auth`;
    this.userUrl = `http://${this.host}:3005/api/v1/user`;
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  getUser() {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  async login(username, password) {
    try {
      const res = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      throw new Error(`Error de conexión al servidor (${this.baseUrl}).`);
    }
  }

  async register(username, password) {
    try {
      const res = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      localStorage.setItem(this.tokenKey, data.token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      return data;
    } catch (err) {
      console.error('Fetch error:', err);
      throw new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`);
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    window.location.href = '/';
  }

  async syncWithServer(localData) {
    if (!this.isLoggedIn()) return null;

    const res = await fetch(`${this.userUrl}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(localData),
    });
    return await res.json();
  }

  async fetchFromServer() {
    if (!this.isLoggedIn()) return null;

    const res = await fetch(`${this.userUrl}/sync`, {
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      },
    });
    const data = await res.json();
    return data.success ? data.syncData : null;
  }
}

export const authService = new AuthService();
