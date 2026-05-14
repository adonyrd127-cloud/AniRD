import{a as g}from"./main-CtB6XwmH.js";import{d as u}from"./db-DDVpz0tJ.js";import"./vendor-Cmt3X8aB.js";class ${constructor(t){this.id=t.id}async render(){return this.container=document.createElement("div"),this.container.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando detalles...</div>',this.container}async afterRender(){var t,i,s,l;try{const e=(await g.getAnimeInfo(this.id)).data,r=await u.isFavorite(this.id);this.container.innerHTML=`
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
             border: none;
             cursor: pointer;
          }
          .btn-fav.active {
             background: #ff4757 !important;
             color: white !important;
          }
        </style>
        <div class="detail-hero">
          <div class="hero-bg" style="background-image: url('${(i=(t=e.images)==null?void 0:t.jpg)==null?void 0:i.large_image_url}')"></div>
          <div class="detail-content">
            <img src="${(l=(s=e.images)==null?void 0:s.jpg)==null?void 0:l.large_image_url}" class="poster" alt="${e.title}" />
            <div class="info">
              <h1>${e.title}</h1>
              <div class="meta">
                <span>⭐ ${e.score||"N/A"}</span>
                <span>${e.type}</span>
                <span>${e.year||"-"}</span>
                <span>${e.episodes||"?"} EPS</span>
              </div>
              <p class="synopsis">${e.synopsis}</p>
              <div style="display:flex; gap:10px; margin-top:20px;">
                <a href="/watch/${this.id}/1" data-link class="btn-play">▶ Ver Episodio 1</a>
                <button id="add-fav" class="btn-play btn-fav ${r?"active":""}" style="background:var(--surface); color:white;">
                  ${r?"❤️ En Favoritos":"⭐ Añadir a Favoritos"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style="max-width:1400px; margin: 40px auto; padding: 0 4%;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <h2 style="font-family:var(--font-display);">Episodios</h2>
            <div id="language-tabs" style="display:flex; gap:10px;">
               <button class="tab-btn active" data-lang="sub">Subtitulado</button>
               <button class="tab-btn" data-lang="latino">Latino</button>
            </div>
          </div>
          <div id="episodes-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:20px;">
             <p style="color:var(--text-secondary);">Cargando lista de episodios...</p>
          </div>

          <div id="relations-section" style="margin-top:60px;">
            <h2 style="margin-bottom:20px; font-family:var(--font-display);">Temporadas y Relacionados</h2>
            <div id="relations-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap:20px;">
               <p style="color:var(--text-secondary);">Buscando otras temporadas...</p>
            </div>
          </div>
        </div>
        <style>
          .tab-btn {
            background: var(--surface);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
          }
          .tab-btn.active {
            background: var(--accent);
            color: black;
          }
        </style>
      `;const a=document.getElementById("add-fav");a.onclick=async()=>{const o=await u.toggleFavorite(e);a.classList.toggle("active",o),a.innerHTML=o?"❤️ En Favoritos":"⭐ Añadir a Favoritos"},this.loadEpisodes(e),this.loadRelations(this.id)}catch(n){console.error(n),this.container.innerHTML=`<div style="padding: 50px; text-align: center; color: white;">
          <h2 style="color:red;">Jikan Error: 404</h2>
          <p>No se pudo cargar la información de este anime. Es posible que el ID sea incorrecto o el servidor esté caído.</p>
        </div>`}}async loadRelations(t){const i=document.getElementById("relations-grid");try{const n=((await g.getAnimeRelations(t)).data||[]).filter(e=>["Prequel","Sequel","Parent Story","Side Story"].includes(e.relation));if(n.length===0){i.innerHTML='<p style="color:var(--text-secondary);">No se encontraron otras temporadas relacionadas.</p>';return}i.innerHTML="";for(const e of n)for(const r of e.entry){if(r.type!=="anime")continue;const a=document.createElement("a");a.href=`/anime/${r.mal_id}`,a.setAttribute("data-link",""),a.style.textDecoration="none",a.innerHTML=`
             <div style="background:var(--surface); border-radius:8px; overflow:hidden;">
               <div style="padding:10px;">
                 <div style="font-size:0.8rem; color:var(--accent); margin-bottom:4px;">${e.relation}</div>
                 <div style="font-size:0.9rem; font-weight:600; color:white; display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${r.name}</div>
               </div>
             </div>
           `,i.appendChild(a)}}catch{i.innerHTML=""}}async loadEpisodes(t,i="sub"){var n,e,r,a;const s=document.getElementById("episodes-grid");document.querySelectorAll(".tab-btn").forEach(o=>{o.classList.toggle("active",o.dataset.lang===i),o.onclick=()=>this.loadEpisodes(t,o.dataset.lang)});try{s.innerHTML='<p style="color:var(--text-secondary);">Buscando episodios...</p>';const o=t.title,c=[i==="latino"?`${o} Latino`:o];i==="latino"?t.title_english&&c.push(`${t.title_english} Latino`):(t.title_english&&c.push(t.title_english),t.title_japanese&&c.push(t.title_japanese));let p=null;for(const d of c)if(p=(e=(n=(await g.searchLocal(d)).data)==null?void 0:n.results)==null?void 0:e[0],p)break;if(!p){s.innerHTML=`<p style="color:var(--text-secondary);">No se encontraron episodios en ${i==="sub"?"Japonés":"Latino"} para este título.</p>`;return}const v=await g.getAnimeInfo(p.url),y=v.data.episodes||[];if(y.length===0){s.innerHTML='<p style="color:var(--text-secondary);">No hay episodios disponibles.</p>';return}const h=((a=(r=t.images)==null?void 0:r.jpg)==null?void 0:a.large_image_url)||v.data.image;s.innerHTML=y.map(d=>`
        <div class="ep-card" style="background:var(--surface); border-radius:10px; overflow:hidden; cursor:pointer; transition:transform 0.2s;">
          <a href="/watch/${this.id}/${d.number}" data-link style="text-decoration:none; color:white;">
            <div style="aspect-ratio:16/9; background:#1a1a2e; display:flex; align-items:center; justify-content:center; position:relative;">
               <img src="${h}" style="width:100%; height:100%; object-fit:cover; opacity:0.6;">
               <span style="position:absolute; background:var(--accent); color:black; padding:4px 10px; border-radius:5px; font-weight:700; bottom:10px; left:10px;">EP ${d.number}</span>
               <div style="position:absolute; font-size:24px; color:white; text-shadow:0 2px 10px rgba(0,0,0,0.5);">▶</div>
            </div>
            <div style="padding:12px;">
              <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${d.title||`Episodio ${d.number}`}</div>
            </div>
          </a>
        </div>
      `).join("")}catch(o){console.error(o),s.innerHTML='<p style="color:red;">Error al cargar episodios.</p>'}}}export{$ as default};
