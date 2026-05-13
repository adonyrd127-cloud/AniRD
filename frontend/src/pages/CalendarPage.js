export default class CalendarPage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <div style="padding: 40px 4%; max-width: 1400px; margin: 0 auto;">
        <h1 style="margin-bottom: 20px;">Calendario de Emisiones</h1>
        <p style="color: var(--text-secondary);">Funcionalidad en desarrollo integrando schedule de Jikan.</p>
      </div>
    `;
    return container;
  }
}
