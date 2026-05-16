export class AnimeCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set data(anime) {
    this._anime = anime;
    this.render();
  }

  render() {
    if(!this._anime) return;
    const isThumbnail = this.getAttribute('mode') === 'thumbnail';
    const imgUrl = this._anime.images?.jpg?.large_image_url || this._anime.images?.jpg?.image_url || this._anime.image || this._anime.thumbnail || '';
    const title = this._anime.title || 'Anime';
    const id = this._anime.mal_id || this._anime.id;
    const score = this._anime.score || this._anime.rating || '?.?';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: ${isThumbnail ? '320px' : '185px'};
          flex-shrink: 0;
        }
        .card-v4 {
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-decoration: none;
          color: white;
          display: flex;
          flex-direction: column;
        }
        .card-v4:hover {
          transform: translateY(-8px);
        }
        .img-box {
          width: 100%;
          aspect-ratio: ${isThumbnail ? '16/9' : '2/3'};
          border-radius: 22px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 12px;
          position: relative;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          transition: border-color 0.3s ease;
        }
        .card-v4:hover .img-box {
          border-color: rgba(255, 0, 0, 0.5);
          box-shadow: 0 20px 40px rgba(255, 0, 0, 0.15);
        }
        img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .card-v4:hover img { transform: scale(1.08); }

        .rating-v4 {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 900;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .info-v4 { padding: 0 4px; }
        .title-v4 {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 4px 0;
          color: #f4f4f5;
        }
        .meta-v4 {
          font-size: 9px;
          color: #71717a;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
      </style>
      <a href="/anime/${id}" data-link class="card-v4">
        <div class="img-box">
          <img src="${imgUrl}" alt="${title}" loading="lazy" referrerpolicy="no-referrer">
          <div class="rating-v4"><span style="color:#ff0000">★</span> ${score}</div>
        </div>
        <div class="info-v4">
          <div class="meta-v4">${this._anime.type || 'TV'} • ${this._anime.status || 'EN EMISIÓN'}</div>
          <h3 class="title-v4">${title}</h3>
          ${this._anime.currentEpisode ? `<div style="font-size: 10px; color: #ff0000; font-weight: 800; margin-top: 2px;">Visto Ep. ${this._anime.currentEpisode}</div>` : ''}
        </div>
      </a>
    `;
  }
}
customElements.define('anime-card', AnimeCard);
