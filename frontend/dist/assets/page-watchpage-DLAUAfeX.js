const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-CrySyT2k.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-BRW-paiz.js","assets/page-historypage-CAA5d06i.js","assets/page-favoritespage-BLyjXf1M.js","assets/page-searchpage-CAe11NfB.js","assets/page-categorypage-C-G0i5h6.js","assets/page-calendarpage-DPXEcTiB.js","assets/page-authpage-CqlseFVn.js","assets/page-profilepage-tcq7z4mM.js"])))=>i.map(i=>d[i]);
import{a as C,d as A,b as x}from"./page-homepage-CrySyT2k.js";import{c as $}from"./vendor-DIPEJTOH.js";const P="modulepreload",k=function(y){return"/"+y},R={},I=function(e,t,s){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),a=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=Promise.allSettled(t.map(r=>{if(r=k(r),r in R)return;R[r]=!0;const h=r.endsWith(".css"),c=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${c}`))return;const m=document.createElement("link");if(m.rel=h?"stylesheet":P,h||(m.as="script"),m.crossOrigin="",m.href=r,a&&m.setAttribute("nonce",a),document.head.appendChild(m),h)return new Promise((E,b)=>{m.addEventListener("load",E),m.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${r}`)))})}))}function o(n){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=n,window.dispatchEvent(a),!a.defaultPrevented)throw n}return i.then(n=>{for(const a of n||[])a.status==="rejected"&&o(a.reason);return e().catch(o)})},M=$(y=>({theme:"dark",isDataSaver:!1,setTheme:e=>y({theme:e}),toggleDataSaver:()=>y(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>y({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>y({isSearchOpen:e})})),S={"/":()=>I(()=>import("./page-homepage-CrySyT2k.js").then(y=>y.H),__vite__mapDeps([0,1])),"/anime":()=>I(()=>import("./page-animedetailpage-BRW-paiz.js"),__vite__mapDeps([2,0,1])),"/watch":()=>I(()=>Promise.resolve().then(()=>F),void 0),"/history":()=>I(()=>import("./page-historypage-CAA5d06i.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>I(()=>import("./page-favoritespage-BLyjXf1M.js"),__vite__mapDeps([4,0,1])),"/search":()=>I(()=>import("./page-searchpage-CAe11NfB.js"),__vite__mapDeps([5,0,1])),"/category":()=>I(()=>import("./page-categorypage-C-G0i5h6.js"),__vite__mapDeps([6,0,1])),"/calendar":()=>I(()=>import("./page-calendarpage-DPXEcTiB.js"),__vite__mapDeps([7,0,1])),"/my-anird":()=>I(()=>import("./page-historypage-CAA5d06i.js"),__vite__mapDeps([3,0,1])),"/auth":()=>I(()=>import("./page-authpage-CqlseFVn.js"),__vite__mapDeps([8,0,1])),"/profile":()=>I(()=>import("./page-profilepage-tcq7z4mM.js").then(y=>y.P),__vite__mapDeps([9,0,1]))};class B{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let s="/",i={};const o={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))s="/anime",i.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){s="/watch";const c=t.split("/");i.id=c[2],i.ep=c[3],i.lang=c[4]||"sub",document.title=`Ep. ${i.ep} — AniRD`}else t.startsWith("/category/")?(s="/category",i.name=t.split("/")[2],document.title=`${o[i.name]||"Explorar"} — AniRD`):t==="/search"?(s="/search",i.q=e.searchParams.get("q"),document.title=`Buscar "${i.q||""}" — AniRD`):t==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(s=S[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):(S[t]&&(s=t),document.title="AniRD — Tu plataforma de anime");const n=[];for(let c=0;c<document.body.classList.length;c++){const m=document.body.classList[c];m&&m.startsWith("route-")&&n.push(m)}n.forEach(c=>document.body.classList.remove(c));const a=`route-${s.replace("/","")||"home"}`;document.body.classList.add(a),M.getState().setCurrentRoute(t);const r=S[s]||S["/"];this.root.innerHTML=`
      <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        <div class="loader-small" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-family: 'Outfit'; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted);">CARGANDO PÁGINA...</div>
      </div>
    `;let h;try{h=await r()}catch(c){console.warn("⚠️ Error al cargar componente de ruta, reintentando en 500ms...",c),await new Promise(m=>setTimeout(m,500));try{h=await r()}catch(m){console.error("❌ Fallo crítico al cargar ruta después de reintentar:",m),this.root.innerHTML=`
          <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 50vh;">
            <span style="font-size: 44px; display: block; margin-bottom: 20px; filter: drop-shadow(0 0 10px rgba(255,0,85,0.4));">📶</span>
            <h3 style="font-family: 'Outfit'; font-size: 20px; font-weight: 800; margin-bottom: 10px;">Error de Conexión</h3>
            <p style="color: var(--text-muted); font-size: 13px; max-width: 420px; line-height: 1.5; margin: 0 auto 30px;">
              No pudimos descargar los componentes visuales necesarios. Revisa tu conexión a internet e inténtalo de nuevo.
            </p>
            <button onclick="window.location.reload()" class="btn-v4-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 28px; border-radius: 50px;">
               🔄 Reintentar Cargar
            </button>
          </div>
        `;return}}try{const c=h.default,m=new c(i);this.root.innerHTML="",this.root.appendChild(await m.render()),m.afterRender&&m.afterRender(),s==="/"&&(typeof window.requestIdleCallback=="function"?window.requestIdleCallback(()=>{S["/anime"]().catch(()=>{}),S["/watch"]().catch(()=>{})}):setTimeout(()=>{S["/anime"]().catch(()=>{}),S["/watch"]().catch(()=>{})},1500)),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(c){console.error("Error al inicializar o renderizar la página:",c),this.root.innerHTML=`<div style="padding: 100px; text-align: center; color: red; font-family:'Outfit';"><h3>Error al renderizar el contenido</h3></div>`}}}let D=null;const N=y=>(!D&&y&&(D=new B(y)),D);class O{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var r,h,c,m,E,b;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const u=await C.getAnimeInfo(this.animeId);u&&u.data&&(this.anime=u.data);const p=new URLSearchParams(window.location.search).get("title"),v=[];if(this.anime&&(v.push(this.anime.title),this.anime.title_english&&v.push(this.anime.title_english),this.anime.title_japanese&&v.push(this.anime.title_japanese),this.anime.title_synonyms&&v.push(...this.anime.title_synonyms)),p&&!v.includes(p)&&v.push(p),v.length>0){let f=null;for(const l of v){const g=await C.searchLocal(l);if(g&&g.success&&g.data&&g.data.results&&g.data.results.length>0){f=g;break}}if(f){const l=f.data.results.find(_=>v.some(L=>_.title.toLowerCase().includes(L.toLowerCase())))||f.data.results[0];this.anime||(this.anime={title:l.title,images:{jpg:{large_image_url:l.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const g=await C.getAnimeInfo(l.url);if(g.success){this.localInfo=g.data;const _=this.localInfo.episodes.find(L=>L.number===this.episodeNum);if(_&&_.url){const L=await C.getEpisode(_.url);if(L.success&&L.data){this.episodeData=L.data;const T=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=T}}}}}this.isFav=await A.isFavorite(this.animeId);const w=await x.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(w.map(f=>Number(f.episodeId)))}catch(u){console.error("Error crítico al renderizar WatchPage Premium:",u)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,i=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,o=((h=(r=this.anime.images)==null?void 0:r.jpg)==null?void 0:h.large_image_url)||"",n=((m=(c=this.anime.images)==null?void 0:c.jpg)==null?void 0:m.large_image_url)||o;let a="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const u=this.anime.broadcast,d={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(d[u.day]!==void 0){const[p,v]=u.time.split(":").map(Number),w=new Date(new Date().toLocaleString("en-US",{timeZone:u.timezone||"Asia/Tokyo"}));let f=new Date(w);f.setHours(p,v,0,0);let l=d[u.day]-w.getDay();(l<0||l===0&&f<w)&&(l+=7),f.setDate(f.getDate()+l),f-w>0&&(a=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(f,w))}}return e.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${n}')"></div>
      
      <!-- Capa de Luces Apagadas -->
      <div class="dim-overlay" id="dim-overlay"></div>

      <div class="watch-layout-v5 ${this.isTheater?"theater-active":""}" id="watch-layout">
        
        <!-- SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROLES -->
        <div class="player-section-v5" id="player-section">
          
          <!-- Reproductor de Video -->
          <div class="video-wrapper-v5" id="video-container" tabindex="0">
            ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?`<iframe src="${this._getAutoplayUrl(this.episodeData.activeServers[0].url)}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`:`<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
                  <span style="font-size: 40px;">⚠️</span>
                  <h3 style="font-family:'Outfit'; font-size:18px;">Video no disponible</h3>
                  <p style="color:var(--text-muted); font-size:13px; max-width: 400px; margin: 0;">El episodio ${this.episodeNum} en idioma ${this.lang==="sub"?"Subtitulado":"Latino"} no tiene enlaces disponibles actualmente.</p>
                 </div>`}
            <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
          </div>

          <!-- Barra de Controles Premium -->
          <div class="player-controls-v5">
            <div class="player-controls-left">
              <button class="control-btn-v5" id="btn-back-watch">
                ⬅ <span>Volver</span>
              </button>
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
              <button class="control-btn-v5" id="btn-fullscreen-watch">
                📺 <span>Pantalla Completa</span>
              </button>
              <button class="control-btn-v5 ${this.isFav?"active":""}" id="btn-favorite">
                ⭐ <span id="fav-text">${this.isFav?"Quitar Favorito":"Favorito"}</span>
              </button>
              <a href="${s}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${i}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
                <span class="badge-mal">MAL</span>
              </a>
            </div>
          </div>
        </div>

        <!-- SECCIÓN CENTRAL: METADATOS Y RECOMENDADOS -->
        <div class="watch-main-column-v5" id="main-column">
          
          <!-- Banner de cuenta regresiva si está en emisión -->
          ${a}

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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((u,d)=>`
                      <button class="server-pill-v5 ${d===0?"active":""}" data-url="${u.url}">
                        🚀 ${u.server}
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
              <img src="${o}" alt="${this.anime.title}">
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((E=this.anime.studios)==null?void 0:E.map(u=>u.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((b=this.anime.genres)==null?void 0:b.map(u=>u.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,e}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),s=document.getElementById("btn-watched-status"),i=document.getElementById("watched-status-text");t?(s&&s.classList.add("active"),i&&(i.textContent="Visto")):(s&&s.classList.remove("active"),i&&(i.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var n,a;if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const r=this.anime?{animeTitle:this.anime.title,animeCover:((a=(n=this.anime.images)==null?void 0:n.jpg)==null?void 0:a.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await A.addToHistory(String(this.animeId),this.episodeNum,120,120,r),this.watchedEpisodes.add(this.episodeNum),s&&s.classList.add("active"),i&&(i.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}const e=document.getElementById("btn-close-mobile-fs");e&&e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const s=document.getElementById("video-container");if(s){s.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const i=document.getElementById("btn-fullscreen-watch"),o=i?i.querySelector("span"):null;o&&(o.textContent="Pantalla Completa")}}),this._globalKeyHandler=t=>{if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),window.removeEventListener("keydown",this._globalKeyHandler,{capture:!0});return}if(t.key==="Escape"||t.key==="Backspace"){const i=document.getElementById("video-container");if(i&&i.classList.contains("mobile-fullscreen-active")){i.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const o=document.getElementById("btn-fullscreen-watch"),n=o?o.querySelector("span"):null;n&&(n.textContent="Pantalla Completa"),t.preventDefault(),t.stopPropagation()}}},window.addEventListener("keydown",this._globalKeyHandler,{capture:!0})}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const s=e.startsWith("//"),i=s?"https:"+e:e,o=new URL(i);o.searchParams.set("autoplay","1"),o.searchParams.set("auto","1");let n=o.toString();return s&&(n=n.replace(/^https:/,"")),n}catch{const i=e.includes("?")?"&":"?";return`${e}${i}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),s=document.getElementById("main-column"),i=document.getElementById("dim-overlay"),o=document.getElementById("btn-theater"),n=document.getElementById("btn-lights"),a=document.getElementById("btn-favorite"),r=document.getElementById("lights-text"),h=document.getElementById("theater-text"),c=document.getElementById("fav-text"),m=d=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),t.parentElement!==e&&e.insertBefore(t,e.firstChild);return}d?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),h&&(h.textContent="Modo Normal")):(e.classList.remove("theater-active"),s.insertBefore(t,s.firstChild),h&&(h.textContent="Modo Cine"))};m(this.isTheater),o&&o.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),o.classList.toggle("active",this.isTheater),m(this.isTheater)});const E=d=>{const p=d!==void 0?d:!i.classList.contains("active");i.classList.toggle("active",p),t.classList.toggle("dimmed-active",p),n.classList.toggle("active",p),r&&(r.textContent=p?"Encender Luces":"Apagar Luces")};n&&n.addEventListener("click",()=>E()),i&&i.addEventListener("click",()=>E(!1)),a&&a.addEventListener("click",async()=>{if(!this.anime)return;const d=await A.toggleFavorite(this.anime);this.isFav=d,a.classList.toggle("active",d),c&&(c.textContent=d?"Quitar Favorito":"Favorito")});const b=document.getElementById("btn-back-watch");b&&b.addEventListener("click",d=>{d.preventDefault(),window.history.back()});const u=document.getElementById("btn-fullscreen-watch");u&&u.addEventListener("click",d=>{d.preventDefault();const p=document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true",v=window.innerWidth<=900||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),w=window.Android!==void 0,f=document.getElementById("video-container");if(f)if(w){const l=document.querySelector(".video-wrapper-v5 iframe, iframe");l&&(l.requestFullscreen?l.requestFullscreen():l.webkitRequestFullscreen?l.webkitRequestFullscreen():l.mozRequestFullScreen?l.mozRequestFullScreen():l.msRequestFullscreen&&l.msRequestFullscreen())}else if(p){document.body.classList.toggle("tv-fullscreen-active");const l=document.body.classList.contains("tv-fullscreen-active");f.classList.toggle("tv-fullscreen-active",l);const g=u.querySelector("span");g&&(g.textContent=l?"Salir Pantalla":"Pantalla Completa")}else if(v){document.body.classList.toggle("mobile-fullscreen-active");const l=document.body.classList.contains("mobile-fullscreen-active");f.classList.toggle("mobile-fullscreen-active",l);const g=u.querySelector("span");g&&(g.textContent=l?"Salir Pantalla":"Pantalla Completa")}else{const l=document.querySelector(".video-wrapper-v5 iframe");l&&(l.requestFullscreen?l.requestFullscreen():l.webkitRequestFullscreen?l.webkitRequestFullscreen():l.mozRequestFullScreen?l.mozRequestFullScreen():l.msRequestFullscreen&&l.msRequestFullscreen())}})}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.querySelector(".video-wrapper-v5 iframe");e.forEach(i=>{i.addEventListener("click",o=>{e.forEach(a=>a.classList.remove("active")),i.classList.add("active");const n=i.getAttribute("data-url");if(t&&n){t.src=this._getAutoplayUrl(n);const a=document.getElementById("video-container");a.style.opacity="0.5",setTimeout(()=>a.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(i=>{i.addEventListener("click",o=>{const n=i.getAttribute("data-lang"),a=`/watch/${this.animeId}/${this.episodeNum}/${n}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,r=N();r?r.navigate(a):window.location.href=a})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const s=e.classList.toggle("expanded");t.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let s=e-t;const i=setInterval(()=>{const o=document.getElementById("countdown-timer");if(!o){clearInterval(i);return}if(s-=1e3,s<=0){o.textContent="¡Disponible ya en Emisión!",clearInterval(i);return}const n=Math.floor(s/864e5),a=Math.floor(s%864e5/36e5),r=Math.floor(s%36e5/6e4),h=Math.floor(s%6e4/1e3);let c="";n>0&&(c+=`${n}d `),(a>0||n>0)&&(c+=`${a}h `),c+=`${r}m ${h}s`,o.textContent=c},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var o,n;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[s,i]=await Promise.all([C.getAnimeRecommendations(this.animeId).catch(()=>null),C.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(s&&s.data&&s.data.length>0){const a=s.data.slice(0,6);e.innerHTML=a.map(r=>{var h,c;return`
          <a href="/anime/${r.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(c=(h=r.entry.images)==null?void 0:h.jpg)==null?void 0:c.image_url}" class="related-img-v5" alt="${r.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${r.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const a=this.localInfo.episodes,r=((n=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:n.large_image_url)||"",h=this.anime.title,c=()=>{let b=[...a];if(this.sortDesc&&b.reverse(),this.searchQuery.trim()!==""&&(b=b.filter(d=>String(d.number).includes(this.searchQuery)||d.title&&d.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),b.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=b.map(d=>{let p=`Episodio ${d.number}`,v=r;const w=i[d.number-1];if(w&&(w.title&&(p=w.title.replace(/^Episode \d+\s*-?\s*/i,"")),w.thumbnail&&(v=w.thumbnail)),d.number===this.episodeNum){const T=document.getElementById("active-episode-title");T&&(T.textContent=`${this.anime.title} — ${p}`)}const f=d.number===this.episodeNum,l=this.watchedEpisodes.has(d.number),g=`/watch/${this.animeId}/${d.number}/${this.lang}?title=${encodeURIComponent(h)}`,_=l?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",L=l?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${g}" data-link class="ep-item-horizontal-v5 ${f?"active":""} ${l?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${v}" alt="Episodio ${d.number}" loading="lazy">
                ${_}
                ${L}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${d.number}</span>
                <span class="ep-title-v5">${p}</span>
              </div>
            </a>
          `}).join("");const u=document.getElementById("btn-watched-all");if(u&&this.localInfo&&this.localInfo.episodes){const p=this.localInfo.episodes.map(v=>v.number).every(v=>this.watchedEpisodes.has(v));u.classList.toggle("active",p),u.title=p?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=c,c();const m=document.getElementById("ep-search-input");m&&m.addEventListener("input",b=>{this.searchQuery=b.target.value,c()});const E=document.getElementById("btn-sort-ep");E&&E.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,E.classList.toggle("active",this.sortDesc),c()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var o,n;const i=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),i){const a=await x.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();a&&await x.history.delete(a.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await A.triggerSync()}else{const a=this.anime?{animeTitle:this.anime.title,animeCover:((n=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:n.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await A.addToHistory(String(this.animeId),this.episodeNum,120,120,a),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const o=this.localInfo.episodes.map(a=>a.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),o.every(a=>this.watchedEpisodes.has(a)))await x.transaction("rw",x.history,async()=>{for(const a of o){const r=await x.history.where({animeId:String(this.animeId),episodeId:a}).first();r&&await x.history.delete(r.id)}}),o.forEach(a=>this.watchedEpisodes.delete(a)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const a=Date.now();await x.transaction("rw",x.history,async()=>{for(const r of o)await x.history.where({animeId:String(this.animeId),episodeId:r}).first()||await x.history.add({animeId:String(this.animeId),episodeId:r,progress:120,duration:120,timestamp:a,updatedAt:a})}),o.forEach(r=>this.watchedEpisodes.add(r)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await A.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const F=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"}));export{I as _,N as g,M as u};
