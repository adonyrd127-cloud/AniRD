class f extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}set data(a){this._anime=a,this.render()}connectedCallback(){this._anime||(this.shadowRoot.innerHTML='<div class="skeleton-card"></div>',this.renderStyles())}renderStyles(){return`
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
    `}render(){var d,l;if(!this._anime)return;const{title:a,images:e,score:s,year:o,episodes:r,type:c,mal_id:p,id:h,currentEpisode:i}=this._anime,g=((d=e==null?void 0:e.jpg)==null?void 0:d.large_image_url)||((l=e==null?void 0:e.jpg)==null?void 0:l.image_url)||this._anime.image||"",m=p||h;let t=r?`${r} EPS`:"? EPS";i&&r?t=`${i} / ${r} EPS`:i&&(t=`EP ${i}`);const n=s?`★ ${s}`:"";this.shadowRoot.innerHTML=`
      ${this.renderStyles()}
      <a href="/anime/${m}" data-link style="text-decoration:none; color:inherit; display:block; height:100%;">
        <article class="anime-card" aria-label="${a}" role="button" tabindex="0">
          <div class="card-media" style="background: #1a1a2e;">
            <img
              src="${g}"
              alt="${a}"
              class="card-image"
              loading="lazy"
              referrerpolicy="no-referrer"
              onerror="if(!this.src.includes('placehold.co')) this.src='https://placehold.co/400x600/12121a/white?text=No+Image'"
            />
            <div class="card-gradient"></div>
            <div class="card-badges">
              ${n?`<span class="badge score">${n}</span>`:""}
              ${o?`<span class="badge year">${o}</span>`:""}
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">${a}</h3>
            <p class="card-meta">${c||"TV"} • ${t}</p>
          </div>
        </article>
      </a>
    `}}customElements.define("anime-card",f);
