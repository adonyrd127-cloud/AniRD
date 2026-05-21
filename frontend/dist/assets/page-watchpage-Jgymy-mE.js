import{a as x,d as $,b as f}from"./page-homepage-Ditd0iT1.js";import"./vendor-DIPEJTOH.js";class T{constructor(t){this.params=t,this.animeId=parseInt(t.id),this.episodeNum=parseInt(t.ep)||1,this.lang=t.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var d,m,h,w,b,l;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const a=await x.getAnimeInfo(this.animeId);a&&a.data&&(this.anime=a.data);const y=new URLSearchParams(window.location.search).get("title"),u=this.anime?this.anime.title:y;if(u){const v=await x.searchLocal(u);if(v.success&&v.data.results.length>0){const g=v.data.results.find(E=>E.title.toLowerCase().includes(u.toLowerCase()))||v.data.results[0];this.anime||(this.anime={title:g.title,images:{jpg:{large_image_url:g.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const L=await x.getAnimeInfo(g.url);if(L.success){this.localInfo=L.data;const E=this.localInfo.episodes.find(I=>I.number===this.episodeNum);if(E&&E.url){const I=await x.getEpisode(E.url);if(I.success&&I.data){this.episodeData=I.data;const C=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=C}}}}}this.isFav=await $.isFavorite(this.animeId);const p=await f.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(p.map(v=>Number(v.episodeId)))}catch(a){console.error("Error crítico al renderizar WatchPage Premium:",a)}const t=document.createElement("div");if(t.className="page-enter",!this.anime)return t.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,t;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const e=this.watchedEpisodes.has(this.episodeNum),i=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,o=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,n=((m=(d=this.anime.images)==null?void 0:d.jpg)==null?void 0:m.large_image_url)||"",c=((w=(h=this.anime.images)==null?void 0:h.jpg)==null?void 0:w.large_image_url)||n;let s="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const a=this.anime.broadcast,r={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(r[a.day]!==void 0){const[y,u]=a.time.split(":").map(Number),p=new Date(new Date().toLocaleString("en-US",{timeZone:a.timezone||"Asia/Tokyo"}));let v=new Date(p);v.setHours(y,u,0,0);let g=r[a.day]-p.getDay();(g<0||g===0&&v<p)&&(g+=7),v.setDate(v.getDate()+g),v-p>0&&(s=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(v,p))}}return t.innerHTML=`
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
              <a href="${i}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${o}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
                <span class="badge-mal">MAL</span>
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN CENTRAL: METADATOS Y RECOMENDADOS -->
        <div class="watch-main-column-v5" id="main-column">
          
          <!-- Banner de cuenta regresiva si está en emisión -->
          ${s}

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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((a,r)=>`
                      <button class="server-pill-v5 ${r===0?"active":""}" data-url="${a.url}">
                        🚀 ${a.server}
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
              <img src="${n}" alt="${this.anime.title}">
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((b=this.anime.studios)==null?void 0:b.map(a=>a.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((l=this.anime.genres)==null?void 0:l.map(a=>a.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,t}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),e=document.getElementById("btn-watched-status"),i=document.getElementById("watched-status-text");t?(e&&e.classList.add("active"),i&&(i.textContent="Visto")):(e&&e.classList.remove("active"),i&&(i.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{if(!document.getElementById("watch-layout")){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}document.hidden||(this.watchTimeCounter++,this.watchTimeCounter>=120&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente."),await $.addToHistory(String(this.animeId),this.episodeNum,120,120),this.watchedEpisodes.add(this.episodeNum),e&&e.classList.add("active"),i&&(i.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()))},1e3))}}_initPlayerControls(){const t=document.getElementById("watch-layout"),e=document.getElementById("player-section"),i=document.getElementById("main-column"),o=document.getElementById("dim-overlay"),n=document.getElementById("btn-theater"),c=document.getElementById("btn-lights"),s=document.getElementById("btn-favorite"),d=document.getElementById("lights-text"),m=document.getElementById("theater-text"),h=document.getElementById("fav-text"),w=l=>{l?(t.classList.add("theater-active"),t.insertBefore(e,t.firstChild),m&&(m.textContent="Modo Normal")):(t.classList.remove("theater-active"),i.insertBefore(e,i.firstChild),m&&(m.textContent="Modo Cine"))};this.isTheater&&w(!0),n&&n.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),n.classList.toggle("active",this.isTheater),w(this.isTheater)});const b=l=>{const a=l!==void 0?l:!o.classList.contains("active");o.classList.toggle("active",a),e.classList.toggle("dimmed-active",a),c.classList.toggle("active",a),d&&(d.textContent=a?"Encender Luces":"Apagar Luces")};c&&c.addEventListener("click",()=>b()),o&&o.addEventListener("click",()=>b(!1)),s&&s.addEventListener("click",async()=>{if(!this.anime)return;const l=await $.toggleFavorite(this.anime);this.isFav=l,s.classList.toggle("active",l),h&&(h.textContent=l?"Quitar Favorito":"Favorito")})}_initServerPills(){const t=document.querySelectorAll(".server-pill-v5"),e=document.querySelector(".video-wrapper-v5 iframe");t.forEach(o=>{o.addEventListener("click",n=>{t.forEach(s=>s.classList.remove("active")),o.classList.add("active");const c=o.getAttribute("data-url");if(e&&c){e.src=c;const s=document.getElementById("video-container");s.style.opacity="0.5",setTimeout(()=>s.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(o=>{o.addEventListener("click",n=>{const c=o.getAttribute("data-lang");this.anime&&`${encodeURIComponent(this.anime.title)}`,window.location.href=`/watch/${this.animeId}/${this.episodeNum}/${c}?title=${encodeURIComponent(this.anime.title)}`})})}_initSynopsisExpand(){const t=document.getElementById("synopsis-box"),e=document.getElementById("btn-more-synopsis");e&&t&&e.addEventListener("click",()=>{const i=t.classList.toggle("expanded");e.textContent=i?"... ver menos":"... ver más"})}_startCountdownTimer(t,e){let i=t-e;const o=setInterval(()=>{const n=document.getElementById("countdown-timer");if(!n){clearInterval(o);return}if(i-=1e3,i<=0){n.textContent="¡Disponible ya en Emisión!",clearInterval(o);return}const c=Math.floor(i/864e5),s=Math.floor(i%864e5/36e5),d=Math.floor(i%36e5/6e4),m=Math.floor(i%6e4/1e3);let h="";c>0&&(h+=`${c}d `),(s>0||c>0)&&(h+=`${s}h `),h+=`${d}m ${m}s`,n.textContent=h},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var n,c;const t=document.getElementById("related-grid"),e=document.getElementById("sidebar-ep-list"),[i,o]=await Promise.all([x.getAnimeRecommendations(this.animeId).catch(()=>null),x.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(t)if(i&&i.data&&i.data.length>0){const s=i.data.slice(0,6);t.innerHTML=s.map(d=>{var m,h;return`
          <a href="/anime/${d.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(h=(m=d.entry.images)==null?void 0:m.jpg)==null?void 0:h.image_url}" class="related-img-v5" alt="${d.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${d.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else t.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const s=this.localInfo.episodes,d=((c=(n=this.anime.images)==null?void 0:n.jpg)==null?void 0:c.large_image_url)||"",m=this.anime.title,h=()=>{let l=[...s];if(this.sortDesc&&l.reverse(),this.searchQuery.trim()!==""&&(l=l.filter(r=>String(r.number).includes(this.searchQuery)||r.title&&r.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),l.length===0){e.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}e.innerHTML=l.map(r=>{let y=`Episodio ${r.number}`,u=d;const p=o[r.number-1];if(p&&(p.title&&(y=p.title.replace(/^Episode \d+\s*-?\s*/i,"")),p.thumbnail&&(u=p.thumbnail)),r.number===this.episodeNum){const C=document.getElementById("active-episode-title");C&&(C.textContent=`${this.anime.title} — ${y}`)}const v=r.number===this.episodeNum,g=this.watchedEpisodes.has(r.number),L=`/watch/${this.animeId}/${r.number}/${this.lang}?title=${encodeURIComponent(m)}`,E=g?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",I=g?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${L}" data-link class="ep-item-horizontal-v5 ${v?"active":""} ${g?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${u}" alt="Episodio ${r.number}" loading="lazy">
                ${E}
                ${I}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${r.number}</span>
                <span class="ep-title-v5">${y}</span>
              </div>
            </a>
          `}).join("");const a=document.getElementById("btn-watched-all");if(a&&this.localInfo&&this.localInfo.episodes){const y=this.localInfo.episodes.map(u=>u.number).every(u=>this.watchedEpisodes.has(u));a.classList.toggle("active",y),a.title=y?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=h,h();const w=document.getElementById("ep-search-input");w&&w.addEventListener("input",l=>{this.searchQuery=l.target.value,h()});const b=document.getElementById("btn-sort-ep");b&&b.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,b.classList.toggle("active",this.sortDesc),h()})}}_initWatchedToggleControls(){const t=document.getElementById("btn-watched-status"),e=document.getElementById("watched-status-text"),i=document.getElementById("btn-watched-all");t&&t.addEventListener("click",async()=>{const o=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),o){const n=await f.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();n&&await f.history.delete(n.id),this.watchedEpisodes.delete(this.episodeNum),t.classList.remove("active"),e&&(e.textContent="Marcar Visto"),await $.triggerSync()}else await $.addToHistory(String(this.animeId),this.episodeNum,120,120),this.watchedEpisodes.add(this.episodeNum),t.classList.add("active"),e&&(e.textContent="Visto");this.renderEpisodes&&this.renderEpisodes()}),i&&i.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const n=this.localInfo.episodes.map(s=>s.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),n.every(s=>this.watchedEpisodes.has(s)))await f.transaction("rw",f.history,async()=>{for(const s of n){const d=await f.history.where({animeId:String(this.animeId),episodeId:s}).first();d&&await f.history.delete(d.id)}}),n.forEach(s=>this.watchedEpisodes.delete(s)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"));else{const s=Date.now();await f.transaction("rw",f.history,async()=>{for(const d of n)await f.history.where({animeId:String(this.animeId),episodeId:d}).first()||await f.history.add({animeId:String(this.animeId),episodeId:d,progress:120,duration:120,timestamp:s,updatedAt:s})}),n.forEach(d=>this.watchedEpisodes.add(d)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"))}await $.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}export{T as default};
