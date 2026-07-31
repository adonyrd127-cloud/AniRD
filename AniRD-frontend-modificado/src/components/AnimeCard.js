export class AnimeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._renderSkeleton();
  }

  set data(anime) {
    this._anime = anime;
    this.render();
  }

  _renderSkeleton() {
    const isThumbnail = this.getAttribute('mode') === 'thumbnail';
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: ${isThumbnail ? '320px' : '185px'}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 16px; }
        .sk-img { width: 100%; aspect-ratio: ${isThumbnail ? '16/9' : '3/4.2'}; margin-bottom: 12px; }
      </style>
      <div class="sk sk-img"></div>
    `;
  }

  render() {
    if(!this._anime) return;
    const isThumbnail = this.getAttribute('mode') === 'thumbnail';
    const imgUrl = this._anime.images?.webp?.large_image_url || this._anime.images?.jpg?.large_image_url || this._anime.images?.jpg?.image_url || this._anime.image || this._anime.thumbnail || '';
    const title = this._anime.title_english || this._anime.title || 'Anime';
    const id = this._anime.mal_id || this._anime.id;
    const score = this._anime.score || this._anime.rating || '?.?';
    const type = this._anime.type || 'TV';
    const eps = this._anime.episodes ? `${this._anime.episodes} eps` : '';
    const progress = this._anime.progress || 0;
    const duration = this._anime.duration_watched || 0;
    const progressPct = duration > 0 ? Math.min((progress / duration) * 100, 100) : 0;
    
    const isAiring = this._anime.status === "Currently Airing";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: ${isThumbnail ? '280px' : '185px'};
          flex-shrink: 0;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          :host { width: ${isThumbnail ? '240px' : '145px'}; }
        }
        .card-inner {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background: #18181b;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          text-decoration: none;
          display: block;
          transform: translateY(0);
        }
        :host(:hover) .card-inner {
          transform: scale(1.05) translateY(-8px);
        }
        .img-container {
          aspect-ratio: ${isThumbnail ? '16/9' : '3/4.2'};
          width: 100%;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        :host(:hover) img {
          transform: scale(1.1);
        }
        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%);
          opacity: 0.8;
          pointer-events: none;
        }
        .hover-border {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          border: 2px solid transparent;
          transition: border-color 0.3s ease;
          pointer-events: none;
          z-index: 10;
        }
        :host(:hover) .hover-border {
          border-color: rgba(239, 68, 68, 0.5); /* border-red-500/50 */
        }
        
        .badge-score {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 2px 8px;
          z-index: 5;
        }
        .badge-score svg { width: 12px; height: 12px; fill: #fbbf24; color: #fbbf24; }
        .badge-score span { font-size: 11px; font-weight: 700; color: white; font-family: 'Inter', sans-serif; }

        .badge-airing {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 9999px;
          background: rgba(220, 38, 38, 0.9);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 2px 8px;
          z-index: 5;
          font-size: 10px;
          font-weight: 600;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }

        .info-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          padding-top: 32px;
          z-index: 5;
        }
        .title {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .meta-type {
          font-size: 10px;
          font-weight: 500;
          color: #d4d4d8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .meta-dot {
          color: #52525b;
        }
        .meta-eps {
          font-size: 10px;
          color: #a1a1aa;
        }
        
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 10;
        }
        .progress-fill {
          height: 100%;
          background: #dc2626;
          border-radius: 0 2px 2px 0;
        }
      </style>
      <a href="/anime/${id}" data-link class="card-inner">
        <div class="img-container">
          <img src="${imgUrl}" alt="${title}" loading="lazy" referrerpolicy="no-referrer">
        </div>
        <div class="gradient-overlay"></div>
        <div class="hover-border"></div>
        
        ${score !== '?.?' ? `
        <div class="badge-score">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>${score}</span>
        </div>` : ''}

        ${isAiring ? `
        <div class="badge-airing">
          <div class="dot"></div>
          EN EMISIÓN
        </div>` : ''}

        <div class="info-bottom">
          <h3 class="title">${title}</h3>
          <div class="meta">
            ${type ? `<span class="meta-type">${type}</span>` : ''}
            ${type && eps ? `<span class="meta-dot">·</span>` : ''}
            ${eps ? `<span class="meta-eps">${eps}</span>` : ''}
          </div>
        </div>

        ${progressPct > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>` : ''}
      </a>
    `;
  }
}
customElements.define('anime-card', AnimeCard);
