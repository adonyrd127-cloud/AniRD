import{a as I,d as C,b as f}from"./page-homepage-BLqD5dcZ.js";import"./vendor-Cmt3X8aB.js";class N{constructor(t){this.params=t,this.animeId=parseInt(t.id),this.episodeNum=parseInt(t.ep)||1,this.lang=t.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var o,m,h,E,b,l;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const s=await I.getAnimeInfo(this.animeId);s&&s.data&&(this.anime=s.data);const y=new URLSearchParams(window.location.search).get("title"),u=this.anime?this.anime.title:y;if(u){const p=await I.searchLocal(u);if(p.success&&p.data.results.length>0){const g=p.data.results.find(x=>x.title.toLowerCase().includes(u.toLowerCase()))||p.data.results[0];this.anime||(this.anime={title:g.title,images:{jpg:{large_image_url:g.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const $=await I.getAnimeInfo(g.url);if($.success){this.localInfo=$.data;const x=this.localInfo.episodes.find(w=>w.number===this.episodeNum);if(x&&x.url){const w=await I.getEpisode(x.url);if(w.success&&w.data){this.episodeData=w.data;const L=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=L}}}}}this.isFav=await C.isFavorite(this.animeId);const v=await f.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(v.map(p=>Number(p.episodeId)))}catch(s){console.error("Error crítico al renderizar WatchPage Premium:",s)}const t=document.createElement("div");if(t.className="page-enter",!this.anime)return t.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,t;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const e=this.watchedEpisodes.has(this.episodeNum),n=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,d=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,a=((m=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:m.large_image_url)||"",c=((E=(h=this.anime.images)==null?void 0:h.jpg)==null?void 0:E.large_image_url)||a;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const s=this.anime.broadcast,r={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(r[s.day]!==void 0){const[y,u]=s.time.split(":").map(Number),v=new Date(new Date().toLocaleString("en-US",{timeZone:s.timezone||"Asia/Tokyo"}));let p=new Date(v);p.setHours(y,u,0,0);let g=r[s.day]-v.getDay();(g<0||g===0&&p<v)&&(g+=7),p.setDate(p.getDate()+g),p-v>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(p,v))}}return t.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${c}')"></div>
      
      <!-- Capa de Luces Apagadas -->
      <div class="dim-overlay" id="dim-overlay"></div>

      <div class="watch-layout-v5 ${this.isTheater?"theater-active":""}" id="watch-layout">
        
        <!-- SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROLES -->
        <div class="player-section-v5" id="player-section">
          
          <!-- Reproductor de Video -->
          <div class="video-wrapper-v5" id="video-container">
            ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?`<iframe src="${this.episodeData.activeServers[0].url}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`:`<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
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
              <button class="control-btn-v5 ${e?"active":""}" id="btn-watched-status">
                👁️ <span id="watched-status-text">${e?"Visto":"Marcar Visto"}</span>
              </button>
            </div>
            <div class="player-controls-right">
              <button class="control-btn-v5 ${this.isFav?"active":""}" id="btn-favorite">
                ⭐ <span id="fav-text">${this.isFav?"Quitar Favorito":"Favorito"}</span>
              </button>
              <a href="${n}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${d}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
                <span class="badge-mal">MAL</span>
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN CENTRAL: METADATOS Y RECOMENDADOS -->
        <div class="watch-main-column-v5" id="main-column">
          
          <!-- Banner de cuenta regresiva si está en emisión -->
          ${i}

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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((s,r)=>`
                      <button class="server-pill-v5 ${r===0?"active":""}" data-url="${s.url}">
                        🚀 ${s.server}
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((b=this.anime.studios)==null?void 0:b.map(s=>s.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((l=this.anime.genres)==null?void 0:l.map(s=>s.name).slice(0,3).join(", "))||"N/A"}</div>
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
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button id="btn-watched-all" class="sidebar-icon-btn" title="Marcar temporada como vista">✓✓</button>
                  <button id="btn-sort-ep" class="sidebar-icon-btn" title="Invertir orden">⇅</button>
                </div>
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
    `,t}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),this.anime){await C.addToHistory(String(this.animeId),this.episodeNum,0,0),this.watchedEpisodes.add(this.episodeNum);const t=document.getElementById("btn-watched-status"),e=document.getElementById("watched-status-text");t&&(t.classList.add("active"),e&&(e.textContent="Visto"))}}_initPlayerControls(){const t=document.getElementById("watch-layout"),e=document.getElementById("player-section"),n=document.getElementById("main-column"),d=document.getElementById("dim-overlay"),a=document.getElementById("btn-theater"),c=document.getElementById("btn-lights"),i=document.getElementById("btn-favorite"),o=document.getElementById("lights-text"),m=document.getElementById("theater-text"),h=document.getElementById("fav-text"),E=l=>{l?(t.classList.add("theater-active"),t.insertBefore(e,t.firstChild),m&&(m.textContent="Modo Normal")):(t.classList.remove("theater-active"),n.insertBefore(e,n.firstChild),m&&(m.textContent="Modo Cine"))};this.isTheater&&E(!0),a&&a.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),a.classList.toggle("active",this.isTheater),E(this.isTheater)});const b=l=>{const s=l!==void 0?l:!d.classList.contains("active");d.classList.toggle("active",s),e.classList.toggle("dimmed-active",s),c.classList.toggle("active",s),o&&(o.textContent=s?"Encender Luces":"Apagar Luces")};c&&c.addEventListener("click",()=>b()),d&&d.addEventListener("click",()=>b(!1)),i&&i.addEventListener("click",async()=>{if(!this.anime)return;const l=await C.toggleFavorite(this.anime);this.isFav=l,i.classList.toggle("active",l),h&&(h.textContent=l?"Quitar Favorito":"Favorito")})}_initServerPills(){const t=document.querySelectorAll(".server-pill-v5"),e=document.querySelector(".video-wrapper-v5 iframe");t.forEach(d=>{d.addEventListener("click",a=>{t.forEach(i=>i.classList.remove("active")),d.classList.add("active");const c=d.getAttribute("data-url");if(e&&c){e.src=c;const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(d=>{d.addEventListener("click",a=>{const c=d.getAttribute("data-lang");this.anime&&`${encodeURIComponent(this.anime.title)}`,window.location.href=`/watch/${this.animeId}/${this.episodeNum}/${c}?title=${encodeURIComponent(this.anime.title)}`})})}_initSynopsisExpand(){const t=document.getElementById("synopsis-box"),e=document.getElementById("btn-more-synopsis");e&&t&&e.addEventListener("click",()=>{const n=t.classList.toggle("expanded");e.textContent=n?"... ver menos":"... ver más"})}_startCountdownTimer(t,e){let n=t-e;const d=setInterval(()=>{const a=document.getElementById("countdown-timer");if(!a){clearInterval(d);return}if(n-=1e3,n<=0){a.textContent="¡Disponible ya en Emisión!",clearInterval(d);return}const c=Math.floor(n/864e5),i=Math.floor(n%864e5/36e5),o=Math.floor(n%36e5/6e4),m=Math.floor(n%6e4/1e3);let h="";c>0&&(h+=`${c}d `),(i>0||c>0)&&(h+=`${i}h `),h+=`${o}m ${m}s`,a.textContent=h},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var a,c;const t=document.getElementById("related-grid"),e=document.getElementById("sidebar-ep-list"),[n,d]=await Promise.all([I.getAnimeRecommendations(this.animeId).catch(()=>null),I.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(t)if(n&&n.data&&n.data.length>0){const i=n.data.slice(0,6);t.innerHTML=i.map(o=>{var m,h;return`
          <a href="/anime/${o.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(h=(m=o.entry.images)==null?void 0:m.jpg)==null?void 0:h.image_url}" class="related-img-v5" alt="${o.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${o.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else t.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,o=((c=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:c.large_image_url)||"",m=this.anime.title,h=()=>{let l=[...i];if(this.sortDesc&&l.reverse(),this.searchQuery.trim()!==""&&(l=l.filter(r=>String(r.number).includes(this.searchQuery)||r.title&&r.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),l.length===0){e.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}e.innerHTML=l.map(r=>{let y=`Episodio ${r.number}`,u=o;const v=d[r.number-1];if(v&&(v.title&&(y=v.title.replace(/^Episode \d+\s*-?\s*/i,"")),v.thumbnail&&(u=v.thumbnail)),r.number===this.episodeNum){const L=document.getElementById("active-episode-title");L&&(L.textContent=`${this.anime.title} — ${y}`)}const p=r.number===this.episodeNum,g=this.watchedEpisodes.has(r.number),$=`/watch/${this.animeId}/${r.number}/${this.lang}?title=${encodeURIComponent(m)}`,x=g?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",w=g?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${$}" data-link class="ep-item-horizontal-v5 ${p?"active":""} ${g?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${u}" alt="Episodio ${r.number}" loading="lazy">
                ${x}
                ${w}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${r.number}</span>
                <span class="ep-title-v5">${y}</span>
              </div>
            </a>
          `}).join("");const s=document.getElementById("btn-watched-all");if(s&&this.localInfo&&this.localInfo.episodes){const y=this.localInfo.episodes.map(u=>u.number).every(u=>this.watchedEpisodes.has(u));s.classList.toggle("active",y),s.title=y?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=h,h();const E=document.getElementById("ep-search-input");E&&E.addEventListener("input",l=>{this.searchQuery=l.target.value,h()});const b=document.getElementById("btn-sort-ep");b&&b.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,b.classList.toggle("active",this.sortDesc),h()})}}_initWatchedToggleControls(){const t=document.getElementById("btn-watched-status"),e=document.getElementById("watched-status-text"),n=document.getElementById("btn-watched-all");t&&t.addEventListener("click",async()=>{if(this.watchedEpisodes.has(this.episodeNum)){const a=await f.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();a&&await f.history.delete(a.id),this.watchedEpisodes.delete(this.episodeNum),t.classList.remove("active"),e&&(e.textContent="Marcar Visto")}else await C.addToHistory(String(this.animeId),this.episodeNum,0,0),this.watchedEpisodes.add(this.episodeNum),t.classList.add("active"),e&&(e.textContent="Visto");this.renderEpisodes&&this.renderEpisodes()}),n&&n.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const a=this.localInfo.episodes.map(i=>i.number);if(a.every(i=>this.watchedEpisodes.has(i)))await f.transaction("rw",f.history,async()=>{for(const i of a){const o=await f.history.where({animeId:String(this.animeId),episodeId:i}).first();o&&await f.history.delete(o.id)}}),a.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"));else{const i=Date.now();await f.transaction("rw",f.history,async()=>{for(const o of a)await f.history.where({animeId:String(this.animeId),episodeId:o}).first()||await f.history.add({animeId:String(this.animeId),episodeId:o,progress:0,duration:0,timestamp:i,updatedAt:i})}),a.forEach(o=>this.watchedEpisodes.add(o)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"))}this.renderEpisodes&&this.renderEpisodes()})}}export{N as default};
