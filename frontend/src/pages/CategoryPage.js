import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class CategoryPage {
  constructor(params) {
    this.category = params.name;
    this.page = 1;
    this.loading = false;
    this.hasMore = true;
    this.titles = {
      popular: 'Animes Populares',
      movies: 'Películas de Anime',
      latest: 'Últimos Lanzamientos',
      dub: 'Animes en Latino',
      action: 'Acción',
      comedy: 'Comedia',
      romance: 'Romance',
      supernatural: 'Sobrenatural'
    };
    this.genres = {
      action: 1,
      comedy: 4,
      romance: 22,
      supernatural: 37
    };
  }

  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .page-container {
          padding: 100px 4% 60px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .category-header {
            margin-bottom: 40px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .category-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: white;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        .loader {
            padding: 40px;
            text-align: center;
            color: var(--accent);
            font-weight: bold;
        }
        @media (max-width: 768px) {
            .page-container { padding-top: 80px; }
            .category-title { font-size: 1.8rem; }
            .anime-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        }
      </style>
      <div class="page-container">
        <div class="category-header">
            <h2 class="category-title">${this.titles[this.category] || 'Explorar'}</h2>
        </div>
        <div class="anime-grid" id="category-grid"></div>
        <div id="grid-loader" class="loader" style="display:none;">Cargando más...</div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    this.grid = document.getElementById('category-grid');
    this.loader = document.getElementById('grid-loader');
    
    // Initial Load
    await this.loadMore();

    // Scroll Listener
    this.scrollHandler = () => {
        if (this.loading || !this.hasMore) return;
        
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            this.loadMore();
        }
    };
    window.addEventListener('scroll', this.scrollHandler);
  }

  // Cleanup on destroy (though our simple router doesn't explicitly call it yet)
  // We'll add a check in the router later if needed.

  async loadMore() {
    if (this.loading) return;
    this.loading = true;
    this.loader.style.display = 'block';

    try {
        let res;
        const genreId = this.genres[this.category];
        
        if (genreId) {
            res = await apiService.getByGenre(genreId, this.page);
        } else {
            switch(this.category) {
                case 'popular': res = await apiService.getTrending(this.page); break;
                case 'movies': res = await apiService.getMovies(this.page); break;
                case 'latest': res = await apiService.getLatest(this.page); break;
                case 'dub': res = await apiService.getDubbed(this.page); break;
                default: res = await apiService.getTrending(this.page);
            }
        }

        const items = res.data?.results || res.data || [];
        
        if (items.length === 0) {
            this.hasMore = false;
        } else {
            items.forEach(anime => {
                const card = document.createElement('anime-card');
                card.data = anime;
                this.grid.appendChild(card);
            });
            this.page++;
        }
    } catch(e) {
        console.error("Failed to load more items", e);
    } finally {
        this.loading = false;
        this.loader.style.display = 'none';
    }
  }
}
