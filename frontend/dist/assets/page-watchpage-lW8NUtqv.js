import{a as E,d as $}from"./page-homepage-BLqD5dcZ.js";import"./vendor-Cmt3X8aB.js";class A{constructor(t){this.params=t,this.animeId=parseInt(t.id),this.episodeNum=parseInt(t.ep)||1,this.lang=t.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var o,m,v,d,g,h;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const e=await E.getAnimeInfo(this.animeId);e&&e.data&&(this.anime=e.data);const b=new URLSearchParams(window.location.search).get("title"),f=this.anime?this.anime.title:b;if(f){const r=await E.searchLocal(f);if(r.success&&r.data.results.length>0){const p=r.data.results.find(u=>u.title.toLowerCase().includes(f.toLowerCase()))||r.data.results[0];this.anime||(this.anime={title:p.title,images:{jpg:{large_image_url:p.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const y=await E.getAnimeInfo(p.url);if(y.success){this.localInfo=y.data;const u=this.localInfo.episodes.find(x=>x.number===this.episodeNum);if(u&&u.url){const x=await E.getEpisode(u.url);if(x.success&&x.data){this.episodeData=x.data;const I=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=I}}}}}this.isFav=await $.isFavorite(this.animeId)}catch(e){console.error("Error crítico al renderizar WatchPage Premium:",e)}const t=document.createElement("div");if(t.className="page-enter",!this.anime)return t.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,t;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const l=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,s=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,a=((m=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:m.large_image_url)||"",c=((d=(v=this.anime.images)==null?void 0:v.jpg)==null?void 0:d.large_image_url)||a;let n="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const e=this.anime.broadcast,i={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(i[e.day]!==void 0){const[b,f]=e.time.split(":").map(Number),r=new Date(new Date().toLocaleString("en-US",{timeZone:e.timezone||"Asia/Tokyo"}));let p=new Date(r);p.setHours(b,f,0,0);let y=i[e.day]-r.getDay();(y<0||y===0&&p<r)&&(y+=7),p.setDate(p.getDate()+y),p-r>0&&(n=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(p,r))}}return t.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${c}')"></div>
      
      <!-- Capa de Luces Apagadas -->
      <div class="dim-overlay" id="dim-overlay"></div>

      <div class="watch-layout-v5 ${this.isTheater?"theater-active":""}" id="watch-layout">
        
        <!-- SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROLES -->
        <div class="player-section-v5" id="player-section">
          
          <!-- Reproductor de Video -->
          <div class="video-wrapper-v5" id="video-container">
            ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?`<iframe src="${this.episodeData.activeServers[0].url}" allowfullscreen allow="autoplay; encrypted-media"></iframe>
                 <div class="player-watermark-v5">AniRD ☁️</div>`:`<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
                  <span style="font-size: 40px;">⚠️</span>
                  <h3 style="font-family:'Outfit'; font-size:18px;">Video no disponible</h3>
                  <p style="color:var(--text-muted); font-size:13px; max-width: 400px; margin: 0;">El episodio ${this.episodeNum} en idioma ${this.lang==="sub"?"Subtitulado":"Latino"} no tiene enlaces disponibles actualmente.</p>
                 </div>`}
          </div>

          <!-- Barra de Controles Premium -->
          <div class="player-controls-v5">
            <div class="player-controls-left">
              <button class="control-btn-v5" id="btn-lights">
                💡 <span id="lights-text">Apagar Luces</span>
              </button>
              <button class="control-btn-v5 ${this.isTheater?"active":""}" id="btn-theater">
                🎬 <span id="theater-text">${this.isTheater?"Modo Normal":"Modo Cine"}</span>
              </button>
            </div>
            <div class="player-controls-right">
              <button class="control-btn-v5 ${this.isFav?"active":""}" id="btn-favorite">
                ⭐ <span id="fav-text">${this.isFav?"Quitar Favorito":"Favorito"}</span>
              </button>
              <a href="${l}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${s}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
                <span class="badge-mal">MAL</span>
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN CENTRAL: METADATOS Y RECOMENDADOS -->
        <div class="watch-main-column-v5" id="main-column">
          
          <!-- Banner de cuenta regresiva si está en emisión -->
          ${n}

          <!-- Título del Episodio Actual -->
          <div style="margin-bottom: 30px;">
            <span style="color: var(--accent); font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">Estás Viendo:</span>
            <h1 class="details-title-v5" style="margin-top: 5px; font-size: 2rem;" id="active-episode-title">
              ${this.anime.title} — Episodio ${this.episodeNum}
            </h1>
            <p style="color: var(--text-muted); font-size: 13px; font-weight: 600; margin-top: 5px;">
              Formato: ${this.lang==="sub"?"Subtitulado al Español":"Doblaje Latino"}
            </p>
          </div>

          <!-- Selectores Premium estilo Animex (Píldoras) -->
          <div class="selection-container-v5">
            <div class="server-selection-v5">
              <span class="selection-label-v5">Servidores Disponibles</span>
              <div class="server-pills-v5" id="server-pills">
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((e,i)=>`
                      <button class="server-pill-v5 ${i===0?"active":""}" data-url="${e.url}">
                        🚀 ${e.server}
                      </button>
                    `).join(""):'<span style="color:var(--text-muted); font-size:12px; font-weight:600;">Ninguno disponible</span>'}
              </div>
            </div>
            
            <div class="lang-selection-v5">
              <span class="selection-label-v5">Cambiar Idioma</span>
              <div class="lang-pills-v5">
                <button class="lang-pill-v5 ${this.lang==="sub"?"active":""}" data-lang="sub">Subtitulado</button>
                <button class="lang-pill-v5 ${this.lang==="dub"?"active":""}" data-lang="dub">Doblaje Latino</button>
              </div>
            </div>
          </div>

          <!-- Ficha Ampliada del Anime (Metadata) -->
          <div class="anime-details-card-v5">
            <div class="details-poster-v5">
              <img src="${a}" alt="${this.anime.title}">
            </div>
            <div class="details-info-v5">
              <span style="color: var(--accent); font-size: 9px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 5px;">Ficha del Anime</span>
              <h2 class="details-title-v5" style="font-size: 1.5rem; margin-bottom: 15px;">${this.anime.title}</h2>
              
              <div class="details-meta-row-v5">
                <span class="meta-tag-v5 score">★ ${this.anime.score||"N/A"}</span>
                <span class="meta-tag-v5">${this.anime.type||"TV"}</span>
                <span class="meta-tag-v5">${this.anime.year||this.anime.season||"N/A"}</span>
                <span class="meta-tag-v5">${this.anime.status==="Currently Airing"?"En Emisión":"Finalizado"}</span>
              </div>

              <div class="details-grid-fields-v5">
                <div class="field-item-v5"><strong>Estudio:</strong> ${((g=this.anime.studios)==null?void 0:g.map(e=>e.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((h=this.anime.genres)==null?void 0:h.map(e=>e.name).slice(0,3).join(", "))||"N/A"}</div>
              </div>

              <div class="synopsis-container-v5" id="synopsis-box">
                <div class="synopsis-text-v5" id="synopsis-text">
                  ${this.anime.synopsis||"No hay sinopsis disponible para este anime."}
                </div>
                <div class="synopsis-fade-v5"></div>
                <button class="btn-more-v5" id="btn-more-synopsis">... ver más</button>
              </div>
            </div>
          </div>

          <!-- Carrusel de Animes Recomendados (Related) -->
          <div class="related-section-v5">
            <h3 class="section-title">ANIMES RECOMENDADOS</h3>
            <div class="related-grid-v5" id="related-grid">
              <!-- Skeletons de carga -->
              ${Array.from({length:3},()=>`
                <div class="related-card-v5" style="opacity:0.5; pointer-events:none;">
                  <div class="skeleton" style="width:55px; height:75px; border-radius:10px;"></div>
                  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:8px;">
                    <div class="skeleton" style="height:12px; width:80%;"></div>
                    <div class="skeleton" style="height:8px; width:40%;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

        </div>

        <!-- SECCIÓN DERECHA: SIDEBAR DE EPISODIOS -->
        <div class="watch-side-column-v5" id="side-column">
          <aside class="ep-sidebar-v5">
            <div class="sidebar-header-v5">
              <div class="sidebar-title-row">
                <h3 class="sidebar-title-v5">Episodios</h3>
                <button id="btn-sort-ep" class="sidebar-icon-btn" title="Invertir orden">
                  ⇅
                </button>
              </div>
              <div class="ep-search-container-v5">
                <input type="text" id="ep-search-input" placeholder="Buscar episodio..." class="ep-search-input-v5">
              </div>
            </div>
            
            <div class="ep-list-v5" id="sidebar-ep-list">
              <p style="color:var(--text-muted); text-align:center; padding:20px; font-size:12px;">Cargando episodios...</p>
            </div>
          </aside>
        </div>

      </div>
    `,t}async afterRender(){this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._loadEnrichedEpisodesAndRecommendations(),this.anime&&await $.addToHistory(String(this.animeId),this.episodeNum,0,0)}_initPlayerControls(){const t=document.getElementById("watch-layout"),l=document.getElementById("player-section"),s=document.getElementById("main-column"),a=document.getElementById("dim-overlay"),c=document.getElementById("btn-theater"),n=document.getElementById("btn-lights"),o=document.getElementById("btn-favorite"),m=document.getElementById("lights-text"),v=document.getElementById("theater-text"),d=document.getElementById("fav-text"),g=e=>{e?(t.classList.add("theater-active"),t.insertBefore(l,t.firstChild),v&&(v.textContent="Modo Normal")):(t.classList.remove("theater-active"),s.insertBefore(l,s.firstChild),v&&(v.textContent="Modo Cine"))};this.isTheater&&g(!0),c&&c.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),c.classList.toggle("active",this.isTheater),g(this.isTheater)});const h=e=>{const i=e!==void 0?e:!a.classList.contains("active");a.classList.toggle("active",i),l.classList.toggle("dimmed-active",i),n.classList.toggle("active",i),m&&(m.textContent=i?"Encender Luces":"Apagar Luces")};n&&n.addEventListener("click",()=>h()),a&&a.addEventListener("click",()=>h(!1)),o&&o.addEventListener("click",async()=>{if(!this.anime)return;const e=await $.toggleFavorite(this.anime);this.isFav=e,o.classList.toggle("active",e),d&&(d.textContent=e?"Quitar Favorito":"Favorito")})}_initServerPills(){const t=document.querySelectorAll(".server-pill-v5"),l=document.querySelector(".video-wrapper-v5 iframe");t.forEach(a=>{a.addEventListener("click",c=>{t.forEach(o=>o.classList.remove("active")),a.classList.add("active");const n=a.getAttribute("data-url");if(l&&n){l.src=n;const o=document.getElementById("video-container");o.style.opacity="0.5",setTimeout(()=>o.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(a=>{a.addEventListener("click",c=>{const n=a.getAttribute("data-lang");this.anime&&`${encodeURIComponent(this.anime.title)}`,window.location.href=`/watch/${this.animeId}/${this.episodeNum}/${n}?title=${encodeURIComponent(this.anime.title)}`})})}_initSynopsisExpand(){const t=document.getElementById("synopsis-box"),l=document.getElementById("btn-more-synopsis");l&&t&&l.addEventListener("click",()=>{const s=t.classList.toggle("expanded");l.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(t,l){let s=t-l;const a=setInterval(()=>{const c=document.getElementById("countdown-timer");if(!c){clearInterval(a);return}if(s-=1e3,s<=0){c.textContent="¡Disponible ya en Emisión!",clearInterval(a);return}const n=Math.floor(s/864e5),o=Math.floor(s%864e5/36e5),m=Math.floor(s%36e5/6e4),v=Math.floor(s%6e4/1e3);let d="";n>0&&(d+=`${n}d `),(o>0||n>0)&&(d+=`${o}h `),d+=`${m}m ${v}s`,c.textContent=d},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var c,n;const t=document.getElementById("related-grid"),l=document.getElementById("sidebar-ep-list"),[s,a]=await Promise.all([E.getAnimeRecommendations(this.animeId).catch(()=>null),E.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(t)if(s&&s.data&&s.data.length>0){const o=s.data.slice(0,6);t.innerHTML=o.map(m=>{var v,d;return`
          <a href="/anime/${m.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(d=(v=m.entry.images)==null?void 0:v.jpg)==null?void 0:d.image_url}" class="related-img-v5" alt="${m.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${m.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else t.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const o=this.localInfo.episodes,m=((n=(c=this.anime.images)==null?void 0:c.jpg)==null?void 0:n.large_image_url)||"",v=this.anime.title,d=()=>{let e=[...o];if(this.sortDesc&&e.reverse(),this.searchQuery.trim()!==""&&(e=e.filter(i=>String(i.number).includes(this.searchQuery)||i.title&&i.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),e.length===0){l.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}l.innerHTML=e.map(i=>{let b=`Episodio ${i.number}`,f=m;const r=a[i.number-1];if(r&&(r.title&&(b=r.title.replace(/^Episode \d+\s*-?\s*/i,"")),r.thumbnail&&(f=r.thumbnail)),i.number===this.episodeNum){const u=document.getElementById("active-episode-title");u&&(u.textContent=`${this.anime.title} — ${b}`)}const p=i.number===this.episodeNum;return`
            <a href="${`/watch/${this.animeId}/${i.number}/${this.lang}?title=${encodeURIComponent(v)}`}" data-link class="ep-item-horizontal-v5 ${p?"active":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${f}" alt="Episodio ${i.number}" loading="lazy">
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${i.number}</span>
                <span class="ep-title-v5">${b}</span>
              </div>
            </a>
          `}).join("")};d();const g=document.getElementById("ep-search-input");g&&g.addEventListener("input",e=>{this.searchQuery=e.target.value,d()});const h=document.getElementById("btn-sort-ep");h&&h.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,h.classList.toggle("active",this.sortDesc),d()})}}}export{A as default};
