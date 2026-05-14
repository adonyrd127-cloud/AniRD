export class AnimeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(anime) {
    this._anime = anime;
    this.render();
  }

  connectedCallback() {
    if (!this._anime) {
       // Placeholder si no hay datos iniciales
       this.shadowRoot.innerHTML = `<div class="skeleton-card"></div>`;
       this.renderStyles();
    }
  }

  renderStyles() {
    return `
      <style>
        :host {
          display: block;
        }
        .anime-card {
          position: relative;
          border-radius: var(--radius-md, 12px);
          overflow: hidden;
          background: var(--bg-secondary, #12121a);
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .anime-card:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: var(--shadow-card, 0 4px 20px rgba(0,0,0,0.4));
        }

        .card-media {
          position: relative;
          aspect-ratio: 2/3;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.3s;
        }

        .anime-card:hover .card-image {
          filter: brightness(1.1);
        }

        .card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.4) 50%, transparent 100%);
          pointer-events: none;
        }

        .card-badges {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          color: white;
        }

        .card-content {
          padding: 12px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-family: var(--font-display, 'Outfit', sans-serif);
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 4px 0;
          color: white;
        }

        .card-meta {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 0.8rem;
          color: var(--text-secondary, #a0a0b0);
          margin: 0;
        }
      </style>
    `;
  }

  render() {
    if(!this._anime) return;

    const { title, images, score, year, episodes, type, mal_id, id, currentEpisode } = this._anime;
    const imgUrl = images?.jpg?.large_image_url || images?.jpg?.image_url || this._anime.image || '';
    const finalId = mal_id || id;

    let epText = episodes ? `${episodes} EPS` : '? EPS';
    if (currentEpisode && episodes) {
        epText = `${currentEpisode} / ${episodes} EPS`;
    } else if (currentEpisode) {
        epText = `EP ${currentEpisode}`;
    }

    const scoreText = score ? `★ ${score}` : '';

    this.shadowRoot.innerHTML = `
      ${this.renderStyles()}
      <a href="/anime/${finalId}" data-link style="text-decoration:none; color:inherit; display:block; height:100%;">
        <article class="anime-card" aria-label="${title}" role="button" tabindex="0">
          <div class="card-media" style="background: #1a1a2e;">
            <img 
              src="${imgUrl}" 
              alt="${title}" 
              class="card-image" 
              loading="lazy" 
              referrerpolicy="no-referrer"
              onerror="if(!this.src.includes('placehold.co')) this.src='https://placehold.co/400x600/12121a/white?text=No+Image'"
            />
            <div class="card-gradient"></div>
            <div class="card-badges">
              ${scoreText ? `<span class="badge score">${scoreText}</span>` : ''}
              ${year ? `<span class="badge year">${year}</span>` : ''}
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${title}</h3>
            <p class="card-meta">${type || 'TV'} • ${epText}</p>
          </div>
        </article>
      </a>
    `;
  }
}

customElements.define('anime-card', AnimeCard);
