import{t as e}from"./api-Ba0UQCNI.js";var t=class{constructor(e){this.id=e.id}async render(){return this.container=document.createElement(`div`),this.container.innerHTML=`<div style="padding: 50px; text-align: center; color: white;">Cargando detalles...</div>`,this.container}async afterRender(){try{let t=(await e.getAnimeInfo(this.id)).data;this.container.innerHTML=`
        <style>
          .detail-hero {
            position: relative;
            height: 400px;
            display: flex;
            align-items: flex-end;
            padding: 4%;
          }
          .hero-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            filter: blur(10px) brightness(0.3);
            z-index: -1;
          }
          .detail-content {
            display: flex;
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
            width: 100%;
          }
          .poster {
            width: 200px;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-card);
          }
          .info h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
          }
          .meta {
            display: flex;
            gap: 15px;
            color: var(--text-secondary);
            margin-bottom: 20px;
          }
          .synopsis {
            line-height: 1.6;
            color: var(--text-secondary);
            max-width: 800px;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .btn-play {
             background: var(--accent);
             color: white;
             padding: 10px 24px;
             border-radius: var(--radius-sm);
             font-weight: 600;
             margin-top: 20px;
             display: inline-block;
          }
        </style>
        <div class="detail-hero">
          <div class="hero-bg" style="background-image: url('${t.images?.jpg?.large_image_url}')"></div>
          <div class="detail-content">
            <img src="${t.images?.jpg?.large_image_url}" class="poster" alt="${t.title}" />
            <div class="info">
              <h1>${t.title}</h1>
              <div class="meta">
                <span>⭐ ${t.score||`N/A`}</span>
                <span>${t.type}</span>
                <span>${t.year||`-`}</span>
                <span>${t.episodes||`?`} EPS</span>
              </div>
              <p class="synopsis">${t.synopsis}</p>
              <a href="/watch/${this.id}/1" data-link class="btn-play">▶ Ver Episodio 1</a>
            </div>
          </div>
        </div>
      `}catch{this.container.innerHTML=`<div style="padding: 50px; text-align: center; color: red;">Error al cargar el anime</div>`}}};export{t as default};