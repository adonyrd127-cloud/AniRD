import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class HomePage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .page-container {
          padding: 20px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin: 2rem 0 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: var(--accent);
            border-radius: 2px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
      </style>
      <div class="page-container">
        <h2 class="section-title">Animes Populares</h2>
        <div class="anime-grid" id="trending-grid"></div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const grid = document.getElementById('trending-grid');

    // Skeleton loaders
    for(let i=0; i<6; i++) {
        const card = document.createElement('anime-card');
        grid.appendChild(card);
    }

    try {
        const res = await apiService.getTrending();
        grid.innerHTML = ''; // clear skeletons
        if(res && res.data) {
            res.data.slice(0,12).forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                card.addEventListener('anime-click', (e) => {
                    const id = e.detail.mal_id;
                    window.history.pushState(null, null, `/anime/${id}`);
                    window.dispatchEvent(new Event('popstate'));
                });
                grid.appendChild(card);
            });
        }
    } catch(e) {
        console.error("Failed to load trending", e);
        grid.innerHTML = '<p>Error al cargar los animes.</p>';
    }
  }
}
