import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class CategoryPage {
  constructor(params) {
    this.category = params.name;
    this.titles = {
      popular: 'Animes Populares',
      movies: 'Películas de Anime',
      latest: 'Últimos Lanzamientos',
      dub: 'Animes en Latino'
    };
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
        .category-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 2rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .category-title::before {
          content: '';
          width: 6px;
          height: 30px;
          background: var(--accent);
          border-radius: 3px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 25px;
        }
      </style>
      <div class="page-container">
        <h2 class="category-title">${this.titles[this.category] || 'Categoría'}</h2>
        <div class="anime-grid" id="category-grid"></div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const grid = document.getElementById('category-grid');
    
    // Skeletons
    for(let i=0; i<12; i++) {
        const card = document.createElement('anime-card');
        grid.appendChild(card);
    }

    try {
        let res;
        switch(this.category) {
            case 'popular': res = await apiService.getTrending(); break;
            case 'movies': res = await apiService.getMovies(); break;
            case 'latest': res = await apiService.getLatest(); break;
            case 'dub': res = await apiService.getDubbed(); break;
            default: res = await apiService.getTrending();
        }

        grid.innerHTML = '';
        const items = res.data?.results || res.data || [];

        if(items.length === 0) {
            grid.innerHTML = '<p>No hay animes en esta categoría.</p>';
            return;
        }

        items.forEach(anime => {
            const card = document.createElement('anime-card');
            card.data = anime;
            card.addEventListener('anime-click', (e) => {
                const id = e.detail.mal_id || e.detail.id;
                window.history.pushState(null, null, `/anime/${id}`);
                window.dispatchEvent(new Event('popstate'));
            });
            grid.appendChild(card);
        });
    } catch(e) {
        console.error("Failed to load category", e);
        grid.innerHTML = '<p style="color:red">Error al cargar la categoría.</p>';
    }
  }
}
