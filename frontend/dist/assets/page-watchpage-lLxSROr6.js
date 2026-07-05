const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-hw3Gvt4E.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-C2e-AQQF.js","assets/page-historypage-BGTpDy_z.js","assets/page-favoritespage-w8_9A5o7.js","assets/page-searchpage-D4zlvFjL.js","assets/page-categorypage-BWtARgh9.js","assets/page-calendarpage-Dg2OcR1B.js","assets/page-authpage-Co6mBlNv.js","assets/page-profilepage-DL9dMaiE.js","assets/page-mylistspage-Cm9v899u.js"])))=>i.map(i=>d[i]);
import{a as C,d as S,b as I}from"./page-homepage-hw3Gvt4E.js";import{c as k}from"./vendor-DIPEJTOH.js";import{T as D}from"./page-animedetailpage-C2e-AQQF.js";const P="modulepreload",M=function(g){return"/"+g},$={},E=function(e,t,s){let a=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),i=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));a=Promise.allSettled(t.map(o=>{if(o=M(o),o in $)return;$[o]=!0;const m=o.endsWith(".css"),c=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${c}`))return;const u=document.createElement("link");if(u.rel=m?"stylesheet":P,m||(u.as="script"),u.crossOrigin="",u.href=o,i&&u.setAttribute("nonce",i),document.head.appendChild(u),m)return new Promise((x,b)=>{u.addEventListener("load",x),u.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${o}`)))})}))}function l(n){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n}return a.then(n=>{for(const i of n||[])i.status==="rejected"&&l(i.reason);return e().catch(l)})},B=k(g=>({theme:"dark",isDataSaver:!1,setTheme:e=>g({theme:e}),toggleDataSaver:()=>g(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>g({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>g({isSearchOpen:e})})),_={"/":()=>E(()=>import("./page-homepage-hw3Gvt4E.js").then(g=>g.H),__vite__mapDeps([0,1])),"/anime":()=>E(()=>import("./page-animedetailpage-C2e-AQQF.js").then(g=>g.A),__vite__mapDeps([2,0,1])),"/watch":()=>E(()=>Promise.resolve().then(()=>F),void 0),"/history":()=>E(()=>import("./page-historypage-BGTpDy_z.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>E(()=>import("./page-favoritespage-w8_9A5o7.js"),__vite__mapDeps([4,0,1,2])),"/search":()=>E(()=>import("./page-searchpage-D4zlvFjL.js"),__vite__mapDeps([5,0,1])),"/category":()=>E(()=>import("./page-categorypage-BWtARgh9.js"),__vite__mapDeps([6,0,1])),"/calendar":()=>E(()=>import("./page-calendarpage-Dg2OcR1B.js"),__vite__mapDeps([7,0,1])),"/my-anird":()=>E(()=>import("./page-historypage-BGTpDy_z.js"),__vite__mapDeps([3,0,1])),"/auth":()=>E(()=>import("./page-authpage-Co6mBlNv.js"),__vite__mapDeps([8,0,1])),"/profile":()=>E(()=>import("./page-profilepage-DL9dMaiE.js").then(g=>g.P),__vite__mapDeps([9,0,1])),"/lists":()=>E(()=>import("./page-mylistspage-Cm9v899u.js"),__vite__mapDeps([10,0,1,2]))};class O{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let s="/",a={};const l={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))s="/anime",a.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){s="/watch";const c=t.split("/");a.id=c[2],a.ep=c[3],a.lang=c[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else t.startsWith("/category/")?(s="/category",a.name=t.split("/")[2],document.title=`${l[a.name]||"Explorar"} — AniRD`):t==="/search"?(s="/search",a.q=e.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):t==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(s=_[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):t==="/lists"?(s="/lists",document.title="Mis Listas — AniRD"):(_[t]&&(s=t),document.title="AniRD — Tu plataforma de anime");const n=[];for(let c=0;c<document.body.classList.length;c++){const u=document.body.classList[c];u&&u.startsWith("route-")&&n.push(u)}n.forEach(c=>document.body.classList.remove(c));const i=`route-${s.replace("/","")||"home"}`;document.body.classList.add(i),B.getState().setCurrentRoute(t);const o=_[s]||_["/"];this.root.innerHTML=`
      <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        <div class="loader-small" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-family: 'Outfit'; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted);">CARGANDO PÁGINA...</div>
      </div>
    `;let m;try{m=await o()}catch(c){console.warn("⚠️ Error al cargar componente de ruta, reintentando en 500ms...",c),await new Promise(u=>setTimeout(u,500));try{m=await o()}catch(u){console.error("❌ Fallo crítico al cargar ruta después de reintentar:",u),this.root.innerHTML=`
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
        `;return}}try{const c=m.default,u=new c(a);this.root.innerHTML="",this.root.appendChild(await u.render()),u.afterRender&&u.afterRender(),s==="/"&&(typeof window.requestIdleCallback=="function"?window.requestIdleCallback(()=>{_["/anime"]().catch(()=>{}),_["/watch"]().catch(()=>{})}):setTimeout(()=>{_["/anime"]().catch(()=>{}),_["/watch"]().catch(()=>{})},1500)),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(c){console.error("Error al inicializar o renderizar la página:",c),this.root.innerHTML=`<div style="padding: 100px; text-align: center; color: red; font-family:'Outfit';"><h3>Error al renderizar el contenido</h3></div>`}}}let R=null;const N=g=>(!R&&g&&(R=new O(g)),R);class W{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var o,m,c,u,x,b;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const p=await C.getAnimeInfo(this.animeId);p&&p.data&&(this.anime=p.data);const h=new URLSearchParams(window.location.search).get("title"),v=[];if(this.anime&&(v.push(this.anime.title),this.anime.title_english&&v.push(this.anime.title_english),this.anime.title_japanese&&v.push(this.anime.title_japanese),this.anime.title_synonyms&&v.push(...this.anime.title_synonyms)),h&&!v.includes(h)&&v.push(h),v.length>0){let f=null;for(const r of v){const y=await C.searchLocal(r);if(y&&y.success&&y.data&&y.data.results&&y.data.results.length>0){f=y;break}}if(f){const r=f.data.results.find(A=>v.some(L=>A.title.toLowerCase().includes(L.toLowerCase())))||f.data.results[0];this.anime||(this.anime={title:r.title,images:{jpg:{large_image_url:r.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const y=await C.getAnimeInfo(r.url);if(y.success){this.localInfo=y.data;const A=this.localInfo.episodes.find(L=>L.number===this.episodeNum);if(A&&A.url){const L=await C.getEpisode(A.url);if(L.success&&L.data){this.episodeData=L.data;const T=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=T}}}}}this.isFav=await S.isFavorite(this.animeId);const w=await I.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(w.map(f=>Number(f.episodeId)))}catch(p){console.error("Error crítico al renderizar WatchPage Premium:",p)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,a=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,l=((m=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:m.large_image_url)||"",n=((u=(c=this.anime.images)==null?void 0:c.jpg)==null?void 0:u.large_image_url)||l;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const p=this.anime.broadcast,d={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(d[p.day]!==void 0){const[h,v]=p.time.split(":").map(Number),w=new Date(new Date().toLocaleString("en-US",{timeZone:p.timezone||"Asia/Tokyo"}));let f=new Date(w);f.setHours(h,v,0,0);let r=d[p.day]-w.getDay();(r<0||r===0&&f<w)&&(r+=7),f.setDate(f.getDate()+r),f-w>0&&(i=`
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
              <!-- Speed Control -->
              <div class="speed-control-wrapper" id="speed-control-wrapper">
                <button class="control-btn-v5" id="btn-speed" title="Velocidad de reproducción">
                  ⏱️ <span id="speed-text">1x</span>
                </button>
                <div class="speed-dropdown" id="speed-dropdown">
                  ${["0.25","0.5","0.75","1","1.25","1.5","1.75","2"].map(p=>`
                    <button class="speed-option ${p==="1"?"active":""}" data-speed="${p}">${p}x</button>
                  `).join("")}
                </div>
              </div>
              <!-- Skip Intro/Outro -->
              <button class="control-btn-v5" id="btn-skip-intro" title="Saltar Intro (OP)">
                ⏩ <span>OP</span>
              </button>
              <button class="control-btn-v5" id="btn-skip-outro" title="Saltar Outro (ED)">
                ⏭️ <span>ED</span>
              </button>
              <button class="control-btn-v5" id="btn-fullscreen-watch">
                📺 <span>Pantalla Completa</span>
              </button>
              <button class="control-btn-v5 ${this.isFav?"active":""}" id="btn-favorite">
                ⭐ <span id="fav-text">${this.isFav?"Quitar Favorito":"Favorito"}</span>
              </button>
              <a href="${s}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
                <span class="badge-al">AL</span>
              </a>
              <a href="${a}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((p,d)=>`
                      <button class="server-pill-v5 ${d===0?"active":""}" data-url="${p.url}">
                        🚀 ${p.server}
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
              <img src="${l}" alt="${this.anime.title}">
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((x=this.anime.studios)==null?void 0:x.map(p=>p.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((b=this.anime.genres)==null?void 0:b.map(p=>p.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,e}async afterRender(){if(this._initPlayerControls(),this._initPlayerEnhancements(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),s=document.getElementById("btn-watched-status"),a=document.getElementById("watched-status-text");t?(s&&s.classList.add("active"),a&&(a.textContent="Visto")):(s&&s.classList.remove("active"),a&&(a.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var n,i;if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const o=this.anime?{animeTitle:this.anime.title,animeCover:((i=(n=this.anime.images)==null?void 0:n.jpg)==null?void 0:i.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await S.addToHistory(String(this.animeId),this.episodeNum,120,120,o),this.watchedEpisodes.add(this.episodeNum),s&&s.classList.add("active"),a&&(a.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}const e=document.getElementById("btn-close-mobile-fs");e&&e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const s=document.getElementById("video-container");if(s){s.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const a=document.getElementById("btn-fullscreen-watch"),l=a?a.querySelector("span"):null;l&&(l.textContent="Pantalla Completa")}}),this._globalKeyHandler=t=>{if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),window.removeEventListener("keydown",this._globalKeyHandler,{capture:!0});return}if(t.key==="Escape"||t.key==="Backspace"){const a=document.getElementById("video-container");if(a&&a.classList.contains("mobile-fullscreen-active")){a.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const l=document.getElementById("btn-fullscreen-watch"),n=l?l.querySelector("span"):null;n&&(n.textContent="Pantalla Completa"),t.preventDefault(),t.stopPropagation()}}},window.addEventListener("keydown",this._globalKeyHandler,{capture:!0})}_initPlayerEnhancements(){const e=document.querySelector(".video-wrapper-v5 iframe"),t=document.getElementById("btn-speed"),s=document.getElementById("speed-dropdown"),a=document.getElementById("speed-text");t&&s&&(t.addEventListener("click",i=>{i.stopPropagation();const o=s.classList.contains("open");s.classList.toggle("open",!o)}),s.querySelectorAll(".speed-option").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const m=parseFloat(i.dataset.speed);if(s.querySelectorAll(".speed-option").forEach(c=>c.classList.remove("active")),i.classList.add("active"),a&&(a.textContent=`${m}x`),s.classList.remove("open"),e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"setPlaybackRate",args:[m]}),"*")}catch{}await S.setSetting("playback_speed",m),D.info(`Velocidad: ${m}x`,m===1?"Velocidad normal":`Reproduciendo a ${m}x`)})}),S.getSetting("playback_speed",1).then(i=>{i&&i!==1&&(a&&(a.textContent=`${i}x`),s.querySelectorAll(".speed-option").forEach(o=>{o.classList.toggle("active",parseFloat(o.dataset.speed)===i)}))}),document.addEventListener("click",i=>{i.target.closest("#speed-control-wrapper")||s.classList.remove("open")}));const l=document.getElementById("btn-skip-intro");l&&l.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[85]}),"*"),D.info("Saltando OP","Avanzando al minuto 1:25")}catch{}});const n=document.getElementById("btn-skip-outro");n&&n.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[1290]}),"*"),D.info("Saltando ED","Avanzando al minuto 21:30")}catch{}})}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const s=e.startsWith("//"),a=s?"https:"+e:e,l=new URL(a);l.searchParams.set("autoplay","1"),l.searchParams.set("auto","1");let n=l.toString();return s&&(n=n.replace(/^https:/,"")),n}catch{const a=e.includes("?")?"&":"?";return`${e}${a}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),s=document.getElementById("main-column"),a=document.getElementById("dim-overlay"),l=document.getElementById("btn-theater"),n=document.getElementById("btn-lights"),i=document.getElementById("btn-favorite"),o=document.getElementById("lights-text"),m=document.getElementById("theater-text"),c=document.getElementById("fav-text"),u=d=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),t.parentElement!==e&&e.insertBefore(t,e.firstChild);return}d?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),m&&(m.textContent="Modo Normal")):(e.classList.remove("theater-active"),s.insertBefore(t,s.firstChild),m&&(m.textContent="Modo Cine"))};u(this.isTheater),l&&l.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),l.classList.toggle("active",this.isTheater),u(this.isTheater)});const x=d=>{const h=d!==void 0?d:!a.classList.contains("active");a.classList.toggle("active",h),t.classList.toggle("dimmed-active",h),n.classList.toggle("active",h),o&&(o.textContent=h?"Encender Luces":"Apagar Luces")};n&&n.addEventListener("click",()=>x()),a&&a.addEventListener("click",()=>x(!1)),i&&i.addEventListener("click",async()=>{if(!this.anime)return;const d=await S.toggleFavorite(this.anime);this.isFav=d,i.classList.toggle("active",d),c&&(c.textContent=d?"Quitar Favorito":"Favorito")});const b=document.getElementById("btn-back-watch");b&&b.addEventListener("click",d=>{d.preventDefault(),window.history.back()});const p=document.getElementById("btn-fullscreen-watch");p&&p.addEventListener("click",d=>{d.preventDefault();const h=document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true",v=window.innerWidth<=900||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),w=window.Android!==void 0,f=document.getElementById("video-container");if(f)if(w){const r=document.querySelector(".video-wrapper-v5 iframe, iframe");r&&(r.requestFullscreen?r.requestFullscreen():r.webkitRequestFullscreen?r.webkitRequestFullscreen():r.mozRequestFullScreen?r.mozRequestFullScreen():r.msRequestFullscreen&&r.msRequestFullscreen())}else if(h){document.body.classList.toggle("tv-fullscreen-active");const r=document.body.classList.contains("tv-fullscreen-active");f.classList.toggle("tv-fullscreen-active",r);const y=p.querySelector("span");y&&(y.textContent=r?"Salir Pantalla":"Pantalla Completa")}else if(v){document.body.classList.toggle("mobile-fullscreen-active");const r=document.body.classList.contains("mobile-fullscreen-active");f.classList.toggle("mobile-fullscreen-active",r);const y=p.querySelector("span");y&&(y.textContent=r?"Salir Pantalla":"Pantalla Completa")}else{const r=document.querySelector(".video-wrapper-v5 iframe");r&&(r.requestFullscreen?r.requestFullscreen():r.webkitRequestFullscreen?r.webkitRequestFullscreen():r.mozRequestFullScreen?r.mozRequestFullScreen():r.msRequestFullscreen&&r.msRequestFullscreen())}})}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.querySelector(".video-wrapper-v5 iframe");e.forEach(a=>{a.addEventListener("click",l=>{e.forEach(i=>i.classList.remove("active")),a.classList.add("active");const n=a.getAttribute("data-url");if(t&&n){t.src=this._getAutoplayUrl(n);const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(a=>{a.addEventListener("click",l=>{const n=a.getAttribute("data-lang"),i=`/watch/${this.animeId}/${this.episodeNum}/${n}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,o=N();o?o.navigate(i):window.location.href=i})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const s=e.classList.toggle("expanded");t.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let s=e-t;const a=setInterval(()=>{const l=document.getElementById("countdown-timer");if(!l){clearInterval(a);return}if(s-=1e3,s<=0){l.textContent="¡Disponible ya en Emisión!",clearInterval(a);return}const n=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),o=Math.floor(s%36e5/6e4),m=Math.floor(s%6e4/1e3);let c="";n>0&&(c+=`${n}d `),(i>0||n>0)&&(c+=`${i}h `),c+=`${o}m ${m}s`,l.textContent=c},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var l,n;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[s,a]=await Promise.all([C.getAnimeRecommendations(this.animeId).catch(()=>null),C.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);e.innerHTML=i.map(o=>{var m,c;return`
          <a href="/anime/${o.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(c=(m=o.entry.images)==null?void 0:m.jpg)==null?void 0:c.image_url}" class="related-img-v5" alt="${o.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${o.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,o=((n=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:n.large_image_url)||"",m=this.anime.title,c=()=>{let b=[...i];if(this.sortDesc&&b.reverse(),this.searchQuery.trim()!==""&&(b=b.filter(d=>String(d.number).includes(this.searchQuery)||d.title&&d.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),b.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=b.map(d=>{let h=`Episodio ${d.number}`,v=o;const w=a[d.number-1];if(w&&(w.title&&(h=w.title.replace(/^Episode \d+\s*-?\s*/i,"")),w.thumbnail&&(v=w.thumbnail)),d.number===this.episodeNum){const T=document.getElementById("active-episode-title");T&&(T.textContent=`${this.anime.title} — ${h}`)}const f=d.number===this.episodeNum,r=this.watchedEpisodes.has(d.number),y=`/watch/${this.animeId}/${d.number}/${this.lang}?title=${encodeURIComponent(m)}`,A=r?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",L=r?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${y}" data-link class="ep-item-horizontal-v5 ${f?"active":""} ${r?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${v}" alt="Episodio ${d.number}" loading="lazy">
                ${A}
                ${L}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${d.number}</span>
                <span class="ep-title-v5">${h}</span>
              </div>
            </a>
          `}).join("");const p=document.getElementById("btn-watched-all");if(p&&this.localInfo&&this.localInfo.episodes){const h=this.localInfo.episodes.map(v=>v.number).every(v=>this.watchedEpisodes.has(v));p.classList.toggle("active",h),p.title=h?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=c,c();const u=document.getElementById("ep-search-input");u&&u.addEventListener("input",b=>{this.searchQuery=b.target.value,c()});const x=document.getElementById("btn-sort-ep");x&&x.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,x.classList.toggle("active",this.sortDesc),c()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var l,n;const a=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),a){const i=await I.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await I.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await S.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((n=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:n.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await S.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const l=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),l.every(i=>this.watchedEpisodes.has(i)))await I.transaction("rw",I.history,async()=>{for(const i of l){const o=await I.history.where({animeId:String(this.animeId),episodeId:i}).first();o&&await I.history.delete(o.id)}}),l.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const i=Date.now();await I.transaction("rw",I.history,async()=>{for(const o of l)await I.history.where({animeId:String(this.animeId),episodeId:o}).first()||await I.history.add({animeId:String(this.animeId),episodeId:o,progress:120,duration:120,timestamp:i,updatedAt:i})}),l.forEach(o=>this.watchedEpisodes.add(o)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await S.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const F=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));export{E as _,N as g,B as u};
