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
          color: var(--text-primary);
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

    const { title, images, score, year, episodes, type, mal_id, id, currentEpisode, status } = this._anime;
    const isThumbnail = this.getAttribute('mode') === 'thumbnail';
    
    const imgUrl = images?.jpg?.large_image_url || images?.jpg?.image_url || this._anime.image || '';
    const thumbUrl = this._anime.thumbnail || imgUrl;
    const finalId = mal_id || id;

    let epText = episodes ? `${episodes} EPS` : '? EPS';
    if (currentEpisode && episodes) {
        epText = `${currentEpisode} / ${episodes} EPS`;
    } else if (currentEpisode) {
        epText = `EP ${currentEpisode}`;
    }

    const progress = (currentEpisode && episodes) ? (currentEpisode / episodes) * 100 : 0;

    this.shadowRoot.innerHTML = `
      ${this.renderStyles()}
      <style>
        .anime-card {
            background: transparent;
            box-shadow: none;
            transition: none;
        }
        .card-media {
            border-radius: var(--radius-sm);
            aspect-ratio: ${isThumbnail ? '16/9' : '2/3'};
            margin-bottom: 8px;
            overflow: hidden;
            position: relative;
        }
        .card-image {
            transition: transform 0.3s ease;
        }
        .anime-card:hover .card-image {
            transform: scale(1.05);
        }
        .card-badges {
            top: unset;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 8px;
            background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
            justify-content: flex-start;
        }
        .badge {
            background: transparent;
            font-size: 0.65rem;
            padding: 2px 0;
            text-transform: uppercase;
            font-weight: 800;
        }
        .card-content {
            padding: 0;
        }
        .card-title {
            font-size: 0.9rem;
            -webkit-line-clamp: 1;
            margin-bottom: 2px;
            font-weight: 700;
            transition: color 0.2s;
        }
        .anime-card:hover .card-title {
            color: var(--accent);
        }
        .card-meta {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-weight: 500;
        }
        .progress-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(255,255,255,0.2);
        }
        .progress-fill {
            height: 100%;
            background: var(--accent);
            box-shadow: 0 0 10px var(--accent-glow);
        }
        .play-btn {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s;
        }
        .anime-card:hover .play-btn {
            opacity: 1;
        }
        .play-icon {
            width: 48px;
            height: 48px;
            background: var(--accent);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: black;
            font-size: 1.5rem;
        }
      </style>
      <a href="/anime/${finalId}" data-link style="text-decoration:none; color:inherit; display:block; height:100%;">
        <article class="anime-card" aria-label="${title}">
          <div class="card-media">
            <img src="${isThumbnail ? thumbUrl : imgUrl}" alt="${title}" class="card-image" loading="lazy" referrerpolicy="no-referrer" />
            
            ${isThumbnail ? `
                <div class="play-btn"><div class="play-icon">▶</div></div>
                ${progress > 0 ? `
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                ` : ''}
            ` : `
                <div class="card-gradient"></div>
                <div class="card-badges">
                    <span class="badge score">★ ${score || 'N/A'}</span>
                </div>
            `}
          </div>
          <div class="card-content">
            <p class="card-meta" style="text-transform: uppercase; font-size: 0.6rem; letter-spacing: 1px; margin-bottom: 2px;">
                ${type || 'TV'} ${status === 'Currently Airing' ? '• RELEASING' : ''}
            </p>
            <h3 class="card-title">${title}</h3>
            <p class="card-meta">
                ${isThumbnail ? `S1 E${currentEpisode || 1}` : `${epText} • ${year || ''}`}
            </p>
          </div>
        </article>
      </a>
    `;
  }
}

customElements.define('anime-card', AnimeCard);
