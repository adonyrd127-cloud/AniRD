import { dbService } from '../services/db.js';
import '../components/AnimeCard.js';

export default class FavoritesPage {
  async render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
      </style>
      <div class="page-container">
        <h1 class="title">❤️ Mis Favoritos</h1>
        <div class="anime-grid" id="favorites-grid">
           <div style="color: var(--text-secondary);">Cargando favoritos...</div>
        </div>
      </div>
    `;
    return container;
  }

  async afterRender() {
    const grid = document.getElementById('favorites-grid');
    const favorites = await dbService.getFavorites();

    if (favorites.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--surface); border-radius: 12px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">⭐</div>
          <h2 style="color: white; margin-bottom: 10px;">Aún no tienes favoritos</h2>
          <p style="color: var(--text-secondary);">Explora el catálogo y guarda los animes que más te gusten.</p>
          <a href="/" data-link class="btn-play" style="margin-top:20px; display:inline-block; background:var(--accent); color:black; padding:12px 25px; border-radius:8px; font-weight:700; text-decoration:none;">Explorar Inicio</a>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    favorites.forEach(fav => {
      const card = document.createElement('anime-card');
      // Adaptar datos guardados al formato que espera AnimeCard
      card.data = {
        mal_id: fav.animeId,
        title: fav.title,
        images: { jpg: { large_image_url: fav.cover } },
        type: fav.type,
        score: fav.score,
        episodes: fav.episodes
      };
      grid.appendChild(card);
    });
  }
}
