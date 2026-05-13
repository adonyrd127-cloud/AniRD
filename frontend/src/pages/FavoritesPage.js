export default class FavoritesPage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="padding: 40px 4%; max-width: 1400px; margin: 0 auto;">
        <h1 style="margin-bottom: 20px;">Mis Favoritos</h1>
        <p style="color: var(--text-secondary);">Funcionalidad en desarrollo con Dexie.js</p>
      </div>
    `;
    return container;
  }
}
