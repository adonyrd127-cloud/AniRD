import{a as $,d as L,b}from"./page-homepage-HfrhAw2J.js";import"./vendor-DIPEJTOH.js";class A{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var d,p,h,x,w,r;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const n=await $.getAnimeInfo(this.animeId);n&&n.data&&(this.anime=n.data);const f=new URLSearchParams(window.location.search).get("title"),m=[];if(this.anime&&(m.push(this.anime.title),this.anime.title_english&&m.push(this.anime.title_english),this.anime.title_japanese&&m.push(this.anime.title_japanese),this.anime.title_synonyms&&m.push(...this.anime.title_synonyms)),f&&!m.includes(f)&&m.push(f),m.length>0){let v=null;for(const u of m){const y=await $.searchLocal(u);if(y&&y.success&&y.data&&y.data.results&&y.data.results.length>0){v=y;break}}if(v){const u=v.data.results.find(I=>m.some(E=>I.title.toLowerCase().includes(E.toLowerCase())))||v.data.results[0];this.anime||(this.anime={title:u.title,images:{jpg:{large_image_url:u.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const y=await $.getAnimeInfo(u.url);if(y.success){this.localInfo=y.data;const I=this.localInfo.episodes.find(E=>E.number===this.episodeNum);if(I&&I.url){const E=await $.getEpisode(I.url);if(E.success&&E.data){this.episodeData=E.data;const C=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=C}}}}}this.isFav=await L.isFavorite(this.animeId);const g=await b.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(g.map(v=>Number(v.episodeId)))}catch(n){console.error("Error crítico al renderizar WatchPage Premium:",n)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,l=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,a=((p=(d=this.anime.images)==null?void 0:d.jpg)==null?void 0:p.large_image_url)||"",o=((x=(h=this.anime.images)==null?void 0:h.jpg)==null?void 0:x.large_image_url)||a;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const n=this.anime.broadcast,c={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(c[n.day]!==void 0){const[f,m]=n.time.split(":").map(Number),g=new Date(new Date().toLocaleString("en-US",{timeZone:n.timezone||"Asia/Tokyo"}));let v=new Date(g);v.setHours(f,m,0,0);let u=c[n.day]-g.getDay();(u<0||u===0&&v<g)&&(u+=7),v.setDate(v.getDate()+u),v-g>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(v,g))}}return e.innerHTML=`
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
              <button class="control-btn-v5 ${t?"active":""}" id="btn-watched-status">
                👁️ <span id="watched-status-text">${t?"Visto":"Marcar Visto"}</span>
              </button>
            </div>
            <div class="player-controls-right">
              <button class="control-btn-v5 ${this.isFav?"active":""}" id="btn-favorite">
                ⭐ <span id="fav-text">${this.isFav?"Quitar Favorito":"Favorito"}</span>
              </button>
              <a href="${s}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${l}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((w=this.anime.studios)==null?void 0:w.map(n=>n.name).join(", "))||"Desconocido"}</div>
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
    `,e}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const e=this.watchedEpisodes.has(this.episodeNum),t=document.getElementById("btn-watched-status"),s=document.getElementById("watched-status-text");e?(t&&t.classList.add("active"),s&&(s.textContent="Visto")):(t&&t.classList.remove("active"),s&&(s.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var a,o;if(!document.getElementById("watch-layout")){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const i=this.anime?{animeTitle:this.anime.title,animeCover:((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await L.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),t&&t.classList.add("active"),s&&(s.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),s=document.getElementById("main-column"),l=document.getElementById("dim-overlay"),a=document.getElementById("btn-theater"),o=document.getElementById("btn-lights"),i=document.getElementById("btn-favorite"),d=document.getElementById("lights-text"),p=document.getElementById("theater-text"),h=document.getElementById("fav-text"),x=r=>{r?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),p&&(p.textContent="Modo Normal")):(e.classList.remove("theater-active"),s.insertBefore(t,s.firstChild),p&&(p.textContent="Modo Cine"))};this.isTheater&&x(!0),a&&a.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),a.classList.toggle("active",this.isTheater),x(this.isTheater)});const w=r=>{const n=r!==void 0?r:!l.classList.contains("active");l.classList.toggle("active",n),t.classList.toggle("dimmed-active",n),o.classList.toggle("active",n),d&&(d.textContent=n?"Encender Luces":"Apagar Luces")};o&&o.addEventListener("click",()=>w()),l&&l.addEventListener("click",()=>w(!1)),i&&i.addEventListener("click",async()=>{if(!this.anime)return;const r=await L.toggleFavorite(this.anime);this.isFav=r,i.classList.toggle("active",r),h&&(h.textContent=r?"Quitar Favorito":"Favorito")})}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.querySelector(".video-wrapper-v5 iframe");e.forEach(l=>{l.addEventListener("click",a=>{e.forEach(i=>i.classList.remove("active")),l.classList.add("active");const o=l.getAttribute("data-url");if(t&&o){t.src=o;const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(l=>{l.addEventListener("click",a=>{const o=l.getAttribute("data-lang");this.anime&&`${encodeURIComponent(this.anime.title)}`,window.location.href=`/watch/${this.animeId}/${this.episodeNum}/${o}?title=${encodeURIComponent(this.anime.title)}`})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const s=e.classList.toggle("expanded");t.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let s=e-t;const l=setInterval(()=>{const a=document.getElementById("countdown-timer");if(!a){clearInterval(l);return}if(s-=1e3,s<=0){a.textContent="¡Disponible ya en Emisión!",clearInterval(l);return}const o=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),d=Math.floor(s%36e5/6e4),p=Math.floor(s%6e4/1e3);let h="";o>0&&(h+=`${o}d `),(i>0||o>0)&&(h+=`${i}h `),h+=`${d}m ${p}s`,a.textContent=h},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var a,o;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[s,l]=await Promise.all([$.getAnimeRecommendations(this.animeId).catch(()=>null),$.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);e.innerHTML=i.map(d=>{var p,h;return`
          <a href="/anime/${d.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(h=(p=d.entry.images)==null?void 0:p.jpg)==null?void 0:h.image_url}" class="related-img-v5" alt="${d.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${d.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,d=((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||"",p=this.anime.title,h=()=>{let r=[...i];if(this.sortDesc&&r.reverse(),this.searchQuery.trim()!==""&&(r=r.filter(c=>String(c.number).includes(this.searchQuery)||c.title&&c.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),r.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=r.map(c=>{let f=`Episodio ${c.number}`,m=d;const g=l[c.number-1];if(g&&(g.title&&(f=g.title.replace(/^Episode \d+\s*-?\s*/i,"")),g.thumbnail&&(m=g.thumbnail)),c.number===this.episodeNum){const C=document.getElementById("active-episode-title");C&&(C.textContent=`${this.anime.title} — ${f}`)}const v=c.number===this.episodeNum,u=this.watchedEpisodes.has(c.number),y=`/watch/${this.animeId}/${c.number}/${this.lang}?title=${encodeURIComponent(p)}`,I=u?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",E=u?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${y}" data-link class="ep-item-horizontal-v5 ${v?"active":""} ${u?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${m}" alt="Episodio ${c.number}" loading="lazy">
                ${I}
                ${E}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${c.number}</span>
                <span class="ep-title-v5">${f}</span>
              </div>
            </a>
          `}).join("");const n=document.getElementById("btn-watched-all");if(n&&this.localInfo&&this.localInfo.episodes){const f=this.localInfo.episodes.map(m=>m.number).every(m=>this.watchedEpisodes.has(m));n.classList.toggle("active",f),n.title=f?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=h,h();const x=document.getElementById("ep-search-input");x&&x.addEventListener("input",r=>{this.searchQuery=r.target.value,h()});const w=document.getElementById("btn-sort-ep");w&&w.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,w.classList.toggle("active",this.sortDesc),h()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var a,o;const l=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),l){const i=await b.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await b.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await L.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await L.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const a=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),a.every(i=>this.watchedEpisodes.has(i)))await b.transaction("rw",b.history,async()=>{for(const i of a){const d=await b.history.where({animeId:String(this.animeId),episodeId:i}).first();d&&await b.history.delete(d.id)}}),a.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const i=Date.now();await b.transaction("rw",b.history,async()=>{for(const d of a)await b.history.where({animeId:String(this.animeId),episodeId:d}).first()||await b.history.add({animeId:String(this.animeId),episodeId:d,progress:120,duration:120,timestamp:i,updatedAt:i})}),a.forEach(d=>this.watchedEpisodes.add(d)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await L.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}export{A as default};
