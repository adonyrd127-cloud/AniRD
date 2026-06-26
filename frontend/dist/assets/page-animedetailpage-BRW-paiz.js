import{d as m,a as g,b as y}from"./page-homepage-CrySyT2k.js";import"./vendor-DIPEJTOH.js";class I{constructor(o){this.params=o,this.animeId=o.id,this.anime=null,this.characters=[],this.recommendations=[],this.relations=[],this.isFavorite=!1,this.isFollowing=!1}async render(){var b,v,f;const o=await m.getSetting("audio_pref","sub"),[c,n,t,r,s,i]=await Promise.all([g.getAnimeInfo(this.animeId),g.providers.jikan.request(`/anime/${this.animeId}/characters`).catch(()=>({data:[]})),g.providers.jikan.request(`/anime/${this.animeId}/recommendations`).catch(()=>({data:[]})),m.isFavorite(this.animeId),m.isFollowing(this.animeId),g.getAnimeRelations(this.animeId).catch(()=>({data:[]}))]);this.anime=c.data,this.characters=(n==null?void 0:n.data)||[],this.recommendations=(t==null?void 0:t.data)||[],this.isFavorite=r,this.isFollowing=s,this.relations=(i==null?void 0:i.data)||[];const l=await g.getAnilistBanner(this.animeId)||((v=(b=this.anime.images)==null?void 0:b.jpg)==null?void 0:v.large_image_url)||"";document.title=`${this.anime.title_english||this.anime.title} — AniRD`;const d=document.createElement("div");return d.className="page-enter",d.innerHTML=`
      <style>
        .page-bg {
          position: fixed; inset: 0; z-index: 0;
          background: url('${l}') center/cover no-repeat;
          filter: brightness(0.3) blur(20px);
          transform: scale(1.1);
        }
        .sheet-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .sheet-panel {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 100%; max-width: 600px;
          background: rgba(9, 9, 11, 0.95); /* zinc-950 with slight transparency */
          backdrop-filter: blur(20px);
          box-shadow: 10px 0 40px rgba(0,0,0,0.5);
          z-index: 101;
          overflow-y: auto;
          scrollbar-width: none;
          transform: translateX(-100%);
          animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          display: flex; flex-direction: column;
        }
        .sheet-panel::-webkit-scrollbar { display: none; }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        .sheet-banner {
          position: relative; height: 260px; flex-shrink: 0;
        }
        .sheet-banner img { width: 100%; height: 100%; object-fit: cover; }
        .sheet-banner-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, #09090b, rgba(9,9,11,0.4), transparent);
        }
        .sheet-close {
          position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s; z-index: 10;
        }
        .sheet-close:hover { background: rgba(0,0,0,0.7); }

        .sheet-title-container {
          position: absolute; bottom: 16px; left: 20px; right: 20px;
        }
        .sheet-title {
          font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 900; color: white;
          line-height: 1.1; margin: 0 0 8px 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .sheet-meta-badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .sheet-score { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: #fbbf24; }
        .sheet-type { font-size: 14px; color: #d4d4d8; }

        .sheet-actions {
          display: flex; gap: 12px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .btn-play-sheet {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #dc2626; color: white; padding: 12px; border-radius: 9999px; font-weight: 600;
          text-decoration: none; transition: transform 0.2s, background 0.2s; font-size: 14px;
        }
        .btn-play-sheet:hover { transform: scale(1.02); background: #b91c1c; }
        .btn-icon-sheet {
          width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; color: #a1a1aa; cursor: pointer; transition: all 0.2s;
        }
        .btn-icon-sheet:hover { color: white; border-color: rgba(255,255,255,0.2); }
        .btn-icon-sheet.active { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }

        .sheet-tabs {
          display: flex; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sheet-tab {
          padding: 12px 16px; font-size: 14px; font-weight: 500; color: #71717a; cursor: pointer; position: relative; transition: color 0.2s;
        }
        .sheet-tab.active { color: white; }
        .sheet-tab.active::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #ef4444; border-radius: 2px 2px 0 0;
        }
        .mobile-only-tab { display: none; }
        @media (max-width: 1023px) {
          .mobile-only-tab { display: block; }
        }

        .sheet-content { padding: 20px; flex: 1; }
        .tab-panel { display: none; animation: fadeIn 0.3s; }
        .tab-panel.active { display: block; }

        /* Info Grid */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; }
        .info-card-label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #71717a; margin-bottom: 4px; }
        .info-card-value { font-size: 14px; font-weight: 500; color: white; }

        .section-heading { font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; }
        .badge-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .badge-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #d4d4d8; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
        .badge-pill.status { background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2); }

        .synopsis-text { font-size: 14px; color: #a1a1aa; line-height: 1.6; }

        /* Characters Grid */
        .chars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .char-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px; }
        .char-img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .char-info { min-width: 0; }
        .char-name { font-size: 13px; font-weight: 500; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .char-role { font-size: 11px; color: #71717a; }

        /* Recommendations Grid */
        .recs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }

        /* Episodes */
        .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 16px; }
        .ep-card { position: relative; border-radius: 12px; overflow: hidden; text-decoration: none; display: block; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.2s; }
        .ep-card:hover { transform: translateY(-4px); border-color: rgba(220,38,38,0.3); }
        .ep-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .ep-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; align-items: flex-end; padding: 8px; }
        .ep-card-title { color: white; font-size: 11px; font-weight: 600; }
        .ep-watched-badge { position: absolute; top: 8px; right: 8px; background: #a855f7; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; }

        /* Relations Panel (Desktop Only) */
        .relations-panel {
          position: fixed; top: 90px; left: 630px; right: 30px; bottom: 30px;
          z-index: 101;
          overflow-y: auto;
          scrollbar-width: none;
          display: flex; flex-direction: column; gap: 20px;
          animation: fadeIn 0.4s ease-out;
        }
        .relations-panel::-webkit-scrollbar { display: none; }
        
        .relations-panel-title {
          font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: white;
          margin: 0; padding-bottom: 10px; border-bottom: 2px solid rgba(255,255,255,0.08);
          letter-spacing: -0.02em;
        }
        
        .relations-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        
        .relation-item-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .relation-item-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(220, 38, 38, 0.3);
          transform: translateY(-2px);
        }
        
        .relation-badge {
          display: inline-block;
          align-self: flex-start;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .relation-badge.prequel {
          background: rgba(59, 130, 246, 0.1);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .relation-badge.sequel {
          background: rgba(16, 185, 129, 0.1);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .relation-badge.other {
          background: rgba(255, 255, 255, 0.06);
          color: #d4d4d8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .relation-item-title {
          font-size: 14px; font-weight: 600; color: white;
          line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        
        .relation-item-meta {
          font-size: 11px; color: #71717a; font-weight: 500;
        }
        
        .no-relations-message {
          color: #71717a; font-size: 14px; text-align: center; padding: 40px 0; width: 100%; grid-column: 1 / -1;
        }

        @media (max-width: 1023px) {
          .relations-panel { display: none !important; }
        }
      </style>

      <div class="page-bg"></div>
      <div class="sheet-overlay" id="sheet-overlay"></div>
      <div class="sheet-panel">
        <div class="sheet-banner">
          <img src="${l}" alt="">
          <div class="sheet-banner-overlay"></div>
          <button class="sheet-close" id="sheet-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div class="sheet-title-container">
            <h1 class="sheet-title">${this.anime.title_english||this.anime.title}</h1>
            <div class="sheet-meta-badges">
              ${this.anime.score?`<div class="sheet-score"><svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${this.anime.score}</div>`:""}
              ${this.anime.type?`<div class="sheet-type">${this.anime.type}</div>`:""}
              ${this.anime.episodes?`<div class="sheet-type">${this.anime.episodes} eps</div>`:""}
            </div>
          </div>
        </div>

        <div class="sheet-actions">
          <a href="/watch/${this.animeId}/1/${o}?title=${encodeURIComponent(this.anime.title)}" data-link class="btn-play-sheet">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Reproducir
          </a>
          <button class="btn-icon-sheet ${this.isFavorite?"active":""}" id="fav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button class="btn-icon-sheet ${this.isFollowing?"active":""}" id="follow-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
        </div>

        <div class="sheet-tabs">
          <div class="sheet-tab active" data-tab="info">Información</div>
          <div class="sheet-tab" data-tab="episodes">Episodios</div>
          <div class="sheet-tab" data-tab="characters">Personajes</div>
          <div class="sheet-tab" data-tab="recommendations">Recomendados</div>
          <div class="sheet-tab mobile-only-tab" data-tab="relations">Relaciones</div>
        </div>

        <div class="sheet-content">
          <!-- INFO TAB -->
          <div class="tab-panel active" id="tab-info">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Año</div>
                <div class="info-card-value">${this.anime.year||"N/A"}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Tipo</div>
                <div class="info-card-value">${this.anime.type||"N/A"}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Duración</div>
                <div class="info-card-value">${this.anime.duration||"N/A"}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> Puntuación</div>
                <div class="info-card-value">${this.anime.score||"N/A"}</div>
              </div>
            </div>

            <h4 class="section-heading">Estado</h4>
            <div class="badge-list">
              <div class="badge-pill ${this.anime.status==="Currently Airing"?"status":""}">${this.anime.status==="Currently Airing"?"En Emisión":this.anime.status}</div>
              ${this.anime.rating?`<div class="badge-pill">${this.anime.rating}</div>`:""}
              ${this.anime.source?`<div class="badge-pill">${this.anime.source}</div>`:""}
            </div>

            ${((f=this.anime.studios)==null?void 0:f.length)>0?`
              <h4 class="section-heading">Estudio</h4>
              <div class="badge-list">
                ${this.anime.studios.map(e=>`<div class="badge-pill">${e.name}</div>`).join("")}
              </div>
            `:""}

            <h4 class="section-heading">Géneros</h4>
            <div class="badge-list">
              ${this.anime.genres.map(e=>`<div class="badge-pill" style="background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2);">${e.name}</div>`).join("")}
            </div>

            <h4 class="section-heading" style="margin-top: 8px;">Sinopsis</h4>
            <p class="synopsis-text">${this.anime.synopsis||"Sin sinopsis disponible."}</p>
          </div>

          <!-- EPISODES TAB -->
          <div class="tab-panel" id="tab-episodes">
             <div id="episodes-container" style="text-align:center; color:#71717a; padding: 20px;">Cargando episodios...</div>
          </div>

          <!-- CHARACTERS TAB -->
          <div class="tab-panel" id="tab-characters">
            ${this.characters.length>0?`
              <div class="chars-grid">
                ${this.characters.slice(0,20).map(e=>{var a,h;return`
                  <div class="char-card">
                    <img class="char-img" src="${(h=(a=e.character.images)==null?void 0:a.jpg)==null?void 0:h.image_url}" alt="${e.character.name}">
                    <div class="char-info">
                      <div class="char-name">${e.character.name}</div>
                      <div class="char-role">${e.role}</div>
                    </div>
                  </div>
                `}).join("")}
              </div>
            `:'<div style="color:#71717a;text-align:center;padding:20px;">No hay personajes disponibles.</div>'}
          </div>

          <!-- RECS TAB -->
          <div class="tab-panel" id="tab-recommendations">
            ${this.recommendations.length>0?`
              <div class="recs-grid">
                ${this.recommendations.slice(0,10).map(e=>`
                  <anime-card data='${JSON.stringify({mal_id:e.entry.mal_id,title:e.entry.title,images:e.entry.images,score:"?.?"}).replace(/'/g,"&#39;")}'></anime-card>
                `).join("")}
              </div>
            `:'<div style="color:#71717a;text-align:center;padding:20px;">No hay recomendaciones.</div>'}
          </div>

          <!-- RELATIONS TAB (MOBILE ONLY) -->
          <div class="tab-panel" id="tab-relations">
            <div class="relations-list" style="display: grid;">
              ${this.renderRelationsHtml()}
            </div>
          </div>
        </div>
      </div>

      <!-- Relations Panel (Desktop Only) -->
      <div class="relations-panel">
        <h2 class="relations-panel-title">Precuelas y Secuelas</h2>
        <div class="relations-list">
          ${this.renderRelationsHtml()}
        </div>
      </div>
    `,d}async afterRender(){const o=document.getElementById("fav-btn"),c=document.getElementById("follow-btn");o&&o.addEventListener("click",async()=>{this.isFavorite?(await m.removeFavorite(this.animeId),this.isFavorite=!1,o.classList.remove("active")):(await m.addFavorite({...this.anime,addedAt:Date.now()}),this.isFavorite=!0,o.classList.add("active"))}),c&&c.addEventListener("click",async()=>{this.isFollowing?(await m.removeFollowing(this.animeId),this.isFollowing=!1,c.classList.remove("active")):(await m.addFollowing({...this.anime,addedAt:Date.now()}),this.isFollowing=!0,c.classList.add("active"))});const n=document.querySelectorAll(".sheet-tab"),t=document.querySelectorAll(".tab-panel");n.forEach(s=>{s.addEventListener("click",()=>{n.forEach(i=>i.classList.remove("active")),t.forEach(i=>i.classList.remove("active")),s.classList.add("active"),document.getElementById("tab-"+s.dataset.tab).classList.add("active")})});const r=()=>{const s=document.querySelector(".sheet-panel"),i=document.querySelector(".sheet-overlay"),l=document.querySelector(".relations-panel");if(s&&i){s.style.animation="slideOut 0.3s forwards",i.style.animation="fadeOut 0.3s forwards",l&&(l.style.animation="fadeOut 0.3s forwards");const d=document.createElement("style");d.innerHTML=`
           @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(-100%); } }
           @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
         `,document.head.appendChild(d),setTimeout(()=>{window.history.back()},300)}else window.history.back()};document.getElementById("sheet-close").addEventListener("click",r),document.getElementById("sheet-overlay").addEventListener("click",r),this.loadEpisodes()}async loadEpisodes(){var i,l,d,b,v,f;const o=document.getElementById("episodes-container"),c=await m.getSetting("audio_pref","sub");let n=new Set;try{const e=await y.history.where({animeId:String(this.animeId)}).toArray();n=new Set(e.map(a=>Number(a.episodeId)))}catch{}let t=null;try{const e=[this.anime.title,this.anime.title_english,this.anime.title_japanese,...this.anime.title_synonyms||[]].filter(Boolean);let a=null;for(const h of e){const p=await g.searchLocal(h);if(p!=null&&p.success&&((l=(i=p.data)==null?void 0:i.results)==null?void 0:l.length)>0){a=p;break}}if(a){const h=a.data.results.find(x=>e.some(u=>x.title.toLowerCase().includes(u.toLowerCase())))||a.data.results[0],p=await g.getAnimeInfo(h.url);(d=p==null?void 0:p.data)!=null&&d.episodes&&(t=p.data.episodes.length)}}catch{}if(!t){if(this.anime.status==="Currently Airing")try{const e=await g.providers.jikan.request(`/anime/${this.animeId}/episodes`);if(((b=e==null?void 0:e.data)==null?void 0:b.length)>0){const a=e.pagination.last_visible_page;if(a>1){const h=await g.providers.jikan.request(`/anime/${this.animeId}/episodes?page=${a}`);t=h.data[h.data.length-1].mal_id}else t=e.data[e.data.length-1].mal_id}}catch{}t||(t=this.anime.episodes||12)}const r=((f=(v=this.anime.images)==null?void 0:v.jpg)==null?void 0:f.large_image_url)||"",s=`?title=${encodeURIComponent(this.anime.title)}`;o.innerHTML=`
      <div class="episodes-grid">
        ${Array.from({length:t},(e,a)=>a+1).map(e=>{const a=n.has(e);return`
            <a href="/watch/${this.animeId}/${e}/${c}${s}" data-link class="ep-card">
              <img src="${r}" loading="lazy" style="${a?"opacity: 0.5; filter: grayscale(1);":""}">
              <div class="ep-card-overlay">
                <span class="ep-card-title">Ep. ${e}</span>
              </div>
              ${a?'<div class="ep-watched-badge">Visto</div>':""}
            </a>
          `}).join("")}
    `}renderRelationsHtml(){if(!this.relations||this.relations.length===0)return'<div class="no-relations-message">No se encontraron precuelas, secuelas u otras conexiones.</div>';let o="";const c=[...this.relations].sort((n,t)=>{const r=n.relation.toLowerCase(),s=t.relation.toLowerCase();return r==="prequel"||r==="sequel"?-1:s==="prequel"||s==="sequel"?1:0});for(const n of c){const t=n.relation,r=t.toLowerCase()==="prequel"?"prequel":t.toLowerCase()==="sequel"?"sequel":"other",s=t==="Prequel"?"Precuela":t==="Sequel"?"Secuela":t==="Alternative version"?"Versión Alternativa":t==="Side story"?"Historia Paralela":t==="Spin-off"?"Spin-off":t==="Parent story"?"Historia Principal":t==="Summary"?"Resumen":t;for(const i of n.entry){const l=i.type==="anime",d=l?`/anime/${i.mal_id}`:i.url;o+=`
          <a href="${d}" ${l?"data-link":'target="_blank" rel="noopener noreferrer"'} class="relation-item-card">
            <span class="relation-badge ${r}">${s}</span>
            <div class="relation-item-title">${i.name}</div>
            <div class="relation-item-meta">${i.type.toUpperCase()}</div>
          </a>
        `}}return o}}export{I as default};
