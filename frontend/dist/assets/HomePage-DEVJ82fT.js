import{t as e}from"./api-Ba0UQCNI.js";var t=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:`open`})}set data(e){this._anime=e,this.render()}connectedCallback(){this._anime||(this.shadowRoot.innerHTML=`<div class="skeleton-card"></div>`,this.renderStyles())}renderStyles(){return`
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
    `}render(){if(!this._anime)return;let{title:e,images:t,score:n,year:r,episodes:i,type:a}=this._anime,o=t?.jpg?.large_image_url||t?.jpg?.image_url||``,s=i?`${i} EPS`:`? EPS`,c=n?`★ ${n}`:``;this.shadowRoot.innerHTML=`
      ${this.renderStyles()}
      <article class="anime-card" aria-label="${e}" role="button" tabindex="0">
        <div class="card-media">
          <img src="${o}" alt="${e}" class="card-image lazyload" loading="lazy" />
          <div class="card-gradient"></div>
          <div class="card-badges">
            ${c?`<span class="badge score">${c}</span>`:``}
            ${r?`<span class="badge year">${r}</span>`:``}
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${e}</h3>
          <p class="card-meta">${a||`TV`} • ${s}</p>
        </div>
      </article>
    `;let l=this.shadowRoot.querySelector(`.anime-card`);l.addEventListener(`click`,()=>{this.dispatchEvent(new CustomEvent(`anime-click`,{detail:this._anime,bubbles:!0,composed:!0}))}),l.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&(e.preventDefault(),l.click())})}};customElements.define(`anime-card`,t);var n=class{async render(){let e=document.createElement(`div`);return e.innerHTML=`
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
    `,e}async afterRender(){let t=document.getElementById(`trending-grid`);for(let e=0;e<6;e++){let e=document.createElement(`anime-card`);t.appendChild(e)}try{let n=await e.getTrending();t.innerHTML=``,n&&n.data&&n.data.slice(0,12).forEach(e=>{let n=document.createElement(`anime-card`);n.data=e,n.addEventListener(`anime-click`,e=>{let t=e.detail.mal_id;window.history.pushState(null,null,`/anime/${t}`),window.dispatchEvent(new Event(`popstate`))}),t.appendChild(n)})}catch(e){console.error(`Failed to load trending`,e),t.innerHTML=`<p>Error al cargar los animes.</p>`}}};export{n as default};