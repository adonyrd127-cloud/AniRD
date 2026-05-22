import{a as x,d as $,b as f}from"./page-homepage-C8RU0l7O.js";import"./vendor-DIPEJTOH.js";class A{constructor(t){this.params=t,this.animeId=parseInt(t.id),this.episodeNum=parseInt(t.ep)||1,this.lang=t.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var l,m,h,w,b,r;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const n=await x.getAnimeInfo(this.animeId);n&&n.data&&(this.anime=n.data);const y=new URLSearchParams(window.location.search).get("title"),u=this.anime?this.anime.title:y;if(u){const v=await x.searchLocal(u);if(v.success&&v.data.results.length>0){const g=v.data.results.find(E=>E.title.toLowerCase().includes(u.toLowerCase()))||v.data.results[0];this.anime||(this.anime={title:g.title,images:{jpg:{large_image_url:g.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const L=await x.getAnimeInfo(g.url);if(L.success){this.localInfo=L.data;const E=this.localInfo.episodes.find(I=>I.number===this.episodeNum);if(E&&E.url){const I=await x.getEpisode(E.url);if(I.success&&I.data){this.episodeData=I.data;const C=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=C}}}}}this.isFav=await $.isFavorite(this.animeId);const p=await f.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(p.map(v=>Number(v.episodeId)))}catch(n){console.error("Error crítico al renderizar WatchPage Premium:",n)}const t=document.createElement("div");if(t.className="page-enter",!this.anime)return t.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,t;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const e=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,d=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,a=((m=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:m.large_image_url)||"",o=((w=(h=this.anime.images)==null?void 0:h.jpg)==null?void 0:w.large_image_url)||a;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const n=this.anime.broadcast,c={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(c[n.day]!==void 0){const[y,u]=n.time.split(":").map(Number),p=new Date(new Date().toLocaleString("en-US",{timeZone:n.timezone||"Asia/Tokyo"}));let v=new Date(p);v.setHours(y,u,0,0);let g=c[n.day]-p.getDay();(g<0||g===0&&v<p)&&(g+=7),v.setDate(v.getDate()+g),v-p>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(v,p))}}return t.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${o}')"></div>
      
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
              <a href="${s}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((n,c)=>`
                      <button class="server-pill-v5 ${c===0?"active":""}" data-url="${n.url}">
                        🚀 ${n.server}
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((b=this.anime.studios)==null?void 0:b.map(n=>n.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((r=this.anime.genres)==null?void 0:r.map(n=>n.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,t}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),e=document.getElementById("btn-watched-status"),s=document.getElementById("watched-status-text");t?(e&&e.classList.add("active"),s&&(s.textContent="Visto")):(e&&e.classList.remove("active"),s&&(s.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var a,o;if(!document.getElementById("watch-layout")){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const i=this.anime?{animeTitle:this.anime.title,animeCover:((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await $.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e&&e.classList.add("active"),s&&(s.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}}_initPlayerControls(){const t=document.getElementById("watch-layout"),e=document.getElementById("player-section"),s=document.getElementById("main-column"),d=document.getElementById("dim-overlay"),a=document.getElementById("btn-theater"),o=document.getElementById("btn-lights"),i=document.getElementById("btn-favorite"),l=document.getElementById("lights-text"),m=document.getElementById("theater-text"),h=document.getElementById("fav-text"),w=r=>{r?(t.classList.add("theater-active"),t.insertBefore(e,t.firstChild),m&&(m.textContent="Modo Normal")):(t.classList.remove("theater-active"),s.insertBefore(e,s.firstChild),m&&(m.textContent="Modo Cine"))};this.isTheater&&w(!0),a&&a.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),a.classList.toggle("active",this.isTheater),w(this.isTheater)});const b=r=>{const n=r!==void 0?r:!d.classList.contains("active");d.classList.toggle("active",n),e.classList.toggle("dimmed-active",n),o.classList.toggle("active",n),l&&(l.textContent=n?"Encender Luces":"Apagar Luces")};o&&o.addEventListener("click",()=>b()),d&&d.addEventListener("click",()=>b(!1)),i&&i.addEventListener("click",async()=>{if(!this.anime)return;const r=await $.toggleFavorite(this.anime);this.isFav=r,i.classList.toggle("active",r),h&&(h.textContent=r?"Quitar Favorito":"Favorito")})}_initServerPills(){const t=document.querySelectorAll(".server-pill-v5"),e=document.querySelector(".video-wrapper-v5 iframe");t.forEach(d=>{d.addEventListener("click",a=>{t.forEach(i=>i.classList.remove("active")),d.classList.add("active");const o=d.getAttribute("data-url");if(e&&o){e.src=o;const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(d=>{d.addEventListener("click",a=>{const o=d.getAttribute("data-lang");this.anime&&`${encodeURIComponent(this.anime.title)}`,window.location.href=`/watch/${this.animeId}/${this.episodeNum}/${o}?title=${encodeURIComponent(this.anime.title)}`})})}_initSynopsisExpand(){const t=document.getElementById("synopsis-box"),e=document.getElementById("btn-more-synopsis");e&&t&&e.addEventListener("click",()=>{const s=t.classList.toggle("expanded");e.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(t,e){let s=t-e;const d=setInterval(()=>{const a=document.getElementById("countdown-timer");if(!a){clearInterval(d);return}if(s-=1e3,s<=0){a.textContent="¡Disponible ya en Emisión!",clearInterval(d);return}const o=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),l=Math.floor(s%36e5/6e4),m=Math.floor(s%6e4/1e3);let h="";o>0&&(h+=`${o}d `),(i>0||o>0)&&(h+=`${i}h `),h+=`${l}m ${m}s`,a.textContent=h},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var a,o;const t=document.getElementById("related-grid"),e=document.getElementById("sidebar-ep-list"),[s,d]=await Promise.all([x.getAnimeRecommendations(this.animeId).catch(()=>null),x.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(t)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);t.innerHTML=i.map(l=>{var m,h;return`
          <a href="/anime/${l.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(h=(m=l.entry.images)==null?void 0:m.jpg)==null?void 0:h.image_url}" class="related-img-v5" alt="${l.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${l.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else t.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,l=((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||"",m=this.anime.title,h=()=>{let r=[...i];if(this.sortDesc&&r.reverse(),this.searchQuery.trim()!==""&&(r=r.filter(c=>String(c.number).includes(this.searchQuery)||c.title&&c.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),r.length===0){e.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}e.innerHTML=r.map(c=>{let y=`Episodio ${c.number}`,u=l;const p=d[c.number-1];if(p&&(p.title&&(y=p.title.replace(/^Episode \d+\s*-?\s*/i,"")),p.thumbnail&&(u=p.thumbnail)),c.number===this.episodeNum){const C=document.getElementById("active-episode-title");C&&(C.textContent=`${this.anime.title} — ${y}`)}const v=c.number===this.episodeNum,g=this.watchedEpisodes.has(c.number),L=`/watch/${this.animeId}/${c.number}/${this.lang}?title=${encodeURIComponent(m)}`,E=g?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",I=g?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${L}" data-link class="ep-item-horizontal-v5 ${v?"active":""} ${g?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${u}" alt="Episodio ${c.number}" loading="lazy">
                ${E}
                ${I}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${c.number}</span>
                <span class="ep-title-v5">${y}</span>
              </div>
            </a>
          `}).join("");const n=document.getElementById("btn-watched-all");if(n&&this.localInfo&&this.localInfo.episodes){const y=this.localInfo.episodes.map(u=>u.number).every(u=>this.watchedEpisodes.has(u));n.classList.toggle("active",y),n.title=y?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=h,h();const w=document.getElementById("ep-search-input");w&&w.addEventListener("input",r=>{this.searchQuery=r.target.value,h()});const b=document.getElementById("btn-sort-ep");b&&b.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,b.classList.toggle("active",this.sortDesc),h()})}}_initWatchedToggleControls(){const t=document.getElementById("btn-watched-status"),e=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");t&&t.addEventListener("click",async()=>{var a,o;const d=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),d){const i=await f.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await f.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),t.classList.remove("active"),e&&(e.textContent="Marcar Visto"),await $.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await $.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),t.classList.add("active"),e&&(e.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const a=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),a.every(i=>this.watchedEpisodes.has(i)))await f.transaction("rw",f.history,async()=>{for(const i of a){const l=await f.history.where({animeId:String(this.animeId),episodeId:i}).first();l&&await f.history.delete(l.id)}}),a.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"));else{const i=Date.now();await f.transaction("rw",f.history,async()=>{for(const l of a)await f.history.where({animeId:String(this.animeId),episodeId:l}).first()||await f.history.add({animeId:String(this.animeId),episodeId:l,progress:120,duration:120,timestamp:i,updatedAt:i})}),a.forEach(l=>this.watchedEpisodes.add(l)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"))}await $.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}export{A as default};
