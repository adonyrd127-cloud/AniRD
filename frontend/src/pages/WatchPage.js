export default class WatchPage {
  constructor(params) {
    this.animeId = params.animeId;
    this.episodeId = params.episodeId;
  }

  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .watch-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 4%;
        }
        .player-wrapper {
          aspect-ratio: 16/9;
          background: #000;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
        }
        .player-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .back-btn {
          color: var(--text-secondary);
          display: inline-block;
          margin-bottom: 20px;
        }
      </style>
      <div class="watch-container">
        <a href="/anime/${this.animeId}" data-link class="back-btn">← Volver al anime</a>
        <div class="player-wrapper">
           <p>Reproductor Placeholder (Integración futura con VideoPlayer Component)</p>
        </div>
        <div class="player-info">
          <h2>Episodio ${this.episodeId}</h2>
        </div>
      </div>
    `;
    return container;
  }

  afterRender() {
     // Aquí inicializaremos el VideoPlayer, cargaremos progreso, etc.
  }
}
