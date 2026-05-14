import { dbService } from '../services/db.js';
import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class HistoryPage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .history-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 2rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        .history-item {
          position: relative;
        }
        .ep-badge {
          position: absolute;
          bottom: 80px;
          right: 10px;
          background: var(--accent);
          color: black;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
      </style>
      <div class="page-container">
        <h2 class="history-title">🕒 Mi Historial</h2>
        <div class="anime-grid" id="history-results-grid"></div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const grid = document.getElementById('history-results-grid');
    const history = await dbService.getContinueWatching();

    if (history.length === 0) {
      grid.innerHTML = '<p style="color: var(--text-secondary);">No tienes historial de reproducción aún.</p>';
      return;
    }

    grid.innerHTML = '';
    
    // Para el historial, necesitamos cargar los detalles básicos de cada anime (título, cover)
    // si no están guardados en el historial.
    for (const item of history) {
      try {
        const animeRes = await apiService.getAnimeInfo(item.animeId);
        const anime = animeRes.data;

        const wrapper = document.createElement('div');
        wrapper.className = 'history-item';
        
        const card = document.createElement('anime-card');
        card.data = {
            ...anime,
            currentEpisode: item.episodeId
        };
        
        wrapper.appendChild(card);
        grid.appendChild(wrapper);
      } catch (e) {
        console.error("Error loading history item info", e);
      }
    }
  }
}
