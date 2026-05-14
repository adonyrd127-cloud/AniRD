import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class SearchPage {
  constructor(params) {
    this.query = params.q;
  }

  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .search-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin-bottom: 2rem;
          color: white;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 25px;
        }
      </style>
      <div class="page-container">
        <h2 class="search-title">Resultados para: "${this.query || ''}"</h2>
        <div class="anime-grid" id="search-results-grid"></div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    if (!this.query) return;
    const grid = document.getElementById('search-results-grid');
    
    // Skeleton loaders
    for(let i=0; i<8; i++) {
        const card = document.createElement('anime-card');
        grid.appendChild(card);
    }

    try {
        const res = await apiService.getAnimeSearch(this.query);
        grid.innerHTML = '';
        
        const results = res.data?.results || res.data || [];
        
        if (results.length === 0) {
            grid.innerHTML = '<p style="color: var(--text-secondary);">No se encontraron resultados.</p>';
            return;
        }

        results.forEach(anime => {
            const card = document.createElement('anime-card');
            card.data = anime;
            grid.appendChild(card);
        });
    } catch(e) {
        console.error("Search failed", e);
        grid.innerHTML = '<p style="color: red;">Error al buscar animes.</p>';
    }
  }
}
