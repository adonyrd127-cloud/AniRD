const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-CMAm-BoN.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-D5KPHKxt.js","assets/page-historypage-XqPv3F09.js","assets/page-favoritespage-C8oAH08l.js","assets/page-searchpage-CNO8RP7x.js","assets/page-categorypage-Cy4yzcLk.js","assets/page-calendarpage-DOgkCfyE.js","assets/page-authpage-C-mLlBBw.js","assets/page-profilepage-Dj905olN.js","assets/page-mylistspage-Bms0Oazl.js"])))=>i.map(i=>d[i]);
import{a as D,d as _,b as S}from"./page-homepage-CMAm-BoN.js";import{c as P}from"./vendor-DIPEJTOH.js";import{T}from"./page-animedetailpage-D5KPHKxt.js";const M="modulepreload",B=function(f){return"/"+f},$={},I=function(e,t,s){let a=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),i=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));a=Promise.allSettled(t.map(o=>{if(o=B(o),o in $)return;$[o]=!0;const p=o.endsWith(".css"),r=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${r}`))return;const d=document.createElement("link");if(d.rel=p?"stylesheet":M,p||(d.as="script"),d.crossOrigin="",d.href=o,i&&d.setAttribute("nonce",i),document.head.appendChild(d),p)return new Promise((L,E)=>{d.addEventListener("load",L),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${o}`)))})}))}function l(n){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=n,window.dispatchEvent(i),!i.defaultPrevented)throw n}return a.then(n=>{for(const i of n||[])i.status==="rejected"&&l(i.reason);return e().catch(l)})},O=P(f=>({theme:"dark",isDataSaver:!1,setTheme:e=>f({theme:e}),toggleDataSaver:()=>f(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>f({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>f({isSearchOpen:e})})),C={"/":()=>I(()=>import("./page-homepage-CMAm-BoN.js").then(f=>f.H),__vite__mapDeps([0,1])),"/anime":()=>I(()=>import("./page-animedetailpage-D5KPHKxt.js").then(f=>f.A),__vite__mapDeps([2,0,1])),"/watch":()=>I(()=>Promise.resolve().then(()=>V),void 0),"/history":()=>I(()=>import("./page-historypage-XqPv3F09.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>I(()=>import("./page-favoritespage-C8oAH08l.js"),__vite__mapDeps([4,0,1,2])),"/search":()=>I(()=>import("./page-searchpage-CNO8RP7x.js"),__vite__mapDeps([5,0,1])),"/category":()=>I(()=>import("./page-categorypage-Cy4yzcLk.js"),__vite__mapDeps([6,0,1])),"/calendar":()=>I(()=>import("./page-calendarpage-DOgkCfyE.js"),__vite__mapDeps([7,0,1])),"/my-anird":()=>I(()=>import("./page-historypage-XqPv3F09.js"),__vite__mapDeps([3,0,1])),"/auth":()=>I(()=>import("./page-authpage-C-mLlBBw.js"),__vite__mapDeps([8,0,1])),"/profile":()=>I(()=>import("./page-profilepage-Dj905olN.js").then(f=>f.P),__vite__mapDeps([9,0,1])),"/lists":()=>I(()=>import("./page-mylistspage-Bms0Oazl.js"),__vite__mapDeps([10,0,1,2]))};class N{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let s="/",a={};const l={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))s="/anime",a.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){s="/watch";const r=t.split("/");a.id=r[2],a.ep=r[3],a.lang=r[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else t.startsWith("/category/")?(s="/category",a.name=t.split("/")[2],document.title=`${l[a.name]||"Explorar"} — AniRD`):t==="/search"?(s="/search",a.q=e.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):t==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(s=C[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):t==="/lists"?(s="/lists",document.title="Mis Listas — AniRD"):(C[t]&&(s=t),document.title="AniRD — Tu plataforma de anime");const n=[];for(let r=0;r<document.body.classList.length;r++){const d=document.body.classList[r];d&&d.startsWith("route-")&&n.push(d)}n.forEach(r=>document.body.classList.remove(r));const i=`route-${s.replace("/","")||"home"}`;document.body.classList.add(i),O.getState().setCurrentRoute(t);const o=C[s]||C["/"];this.root.innerHTML=`
      <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        <div class="loader-small" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-family: 'Outfit'; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted);">CARGANDO PÁGINA...</div>
      </div>
    `;let p;try{p=await o()}catch(r){console.warn("⚠️ Error al cargar componente de ruta, reintentando en 500ms...",r),await new Promise(d=>setTimeout(d,500));try{p=await o()}catch(d){console.error("❌ Fallo crítico al cargar ruta después de reintentar:",d),this.root.innerHTML=`
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
        `;return}}try{const r=p.default,d=new r(a);this.root.innerHTML="",this.root.appendChild(await d.render()),d.afterRender&&d.afterRender(),s==="/"&&(typeof window.requestIdleCallback=="function"?window.requestIdleCallback(()=>{C["/anime"]().catch(()=>{}),C["/watch"]().catch(()=>{})}):setTimeout(()=>{C["/anime"]().catch(()=>{}),C["/watch"]().catch(()=>{})},1500)),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(r){console.error("Error al inicializar o renderizar la página:",r),this.root.innerHTML=`<div style="padding: 100px; text-align: center; color: red; font-family:'Outfit';"><h3>Error al renderizar el contenido</h3></div>`}}}let R=null;const W=f=>(!R&&f&&(R=new N(f)),R);class F{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.isAmbient=localStorage.getItem("watch-ambient-mode")!=="false",this.sortDesc=!1,this.searchQuery=""}async render(){var o,p,r,d,L,E;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const u=await D.getAnimeInfo(this.animeId);u&&u.data&&(this.anime=u.data);const g=new URLSearchParams(window.location.search).get("title"),m=[];if(this.anime&&(m.push(this.anime.title),this.anime.title_english&&m.push(this.anime.title_english),this.anime.title_japanese&&m.push(this.anime.title_japanese),this.anime.title_synonyms&&m.push(...this.anime.title_synonyms)),g&&!m.includes(g)&&m.push(g),m.length>0){let y=null;for(const b of m){const w=await D.searchLocal(b);if(w&&w.success&&w.data&&w.data.results&&w.data.results.length>0){y=w;break}}if(y){const b=y.data.results.find(c=>m.some(x=>c.title.toLowerCase().includes(x.toLowerCase())))||y.data.results[0];this.anime||(this.anime={title:b.title,images:{jpg:{large_image_url:b.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const w=await D.getAnimeInfo(b.url);if(w.success){this.localInfo=w.data;const c=this.localInfo.episodes.find(x=>x.number===this.episodeNum);if(c&&c.url){const x=await D.getEpisode(c.url);if(x.success&&x.data){this.episodeData=x.data;let A=this.episodeData.servers[this.lang];if(!A||A.length===0)if(this.lang==="dub"&&this.episodeData.servers.sub&&this.episodeData.servers.sub.length>0){this.lang="sub",A=this.episodeData.servers.sub,T.show("El episodio no tiene doblaje disponible. Reproduciendo subtitulado.","info");const k=window.location.href.replace("/dub","/sub");window.history.replaceState({},"",k)}else A=this.episodeData.servers.sub||[];this.episodeData.activeServers=A}}}}}this.isFav=await _.isFavorite(this.animeId);const v=await S.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(v.map(y=>Number(y.episodeId)))}catch(u){console.error("Error crítico al renderizar WatchPage Premium:",u)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,a=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,l=((p=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:p.large_image_url)||"",n=((d=(r=this.anime.images)==null?void 0:r.jpg)==null?void 0:d.large_image_url)||l;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const u=this.anime.broadcast,h={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(h[u.day]!==void 0){const[g,m]=u.time.split(":").map(Number),v=new Date(new Date().toLocaleString("en-US",{timeZone:u.timezone||"Asia/Tokyo"}));let y=new Date(v);y.setHours(g,m,0,0);let b=h[u.day]-v.getDay();(b<0||b===0&&y<v)&&(b+=7),y.setDate(y.getDate()+b),y-v>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(y,v))}}return e.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${n}'); transition: opacity 0.8s ease; ${this.isAmbient?"opacity: 0.6; display: block;":"opacity: 0; display: none;"}"></div>
      
      <!-- Capa de Luces Apagadas -->
      <div class="dim-overlay" id="dim-overlay"></div>

      <div class="watch-layout-v5 ${this.isTheater?"theater-active":""}" id="watch-layout">
        
        <!-- SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROLES -->
        <div class="player-section-v5" id="player-section">
          
          <!-- Reproductor de Video -->
          <div class="video-wrapper-v5" id="video-container" tabindex="0">
            ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?`<iframe src="${this._getAutoplayUrl(this.episodeData.activeServers[0].url)}" allowfullscreen allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"></iframe>`:`<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
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
              <button class="control-btn-v5 ${this.isAmbient?"active":""}" id="btn-ambient">
                ✨ <span id="ambient-text">Modo Ambiente</span>
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
                  ${["0.25","0.5","0.75","1","1.25","1.5","1.75","2"].map(u=>`
                    <button class="speed-option ${u==="1"?"active":""}" data-speed="${u}">${u}x</button>
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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((u,h)=>`
                      <button class="server-pill-v5 ${h===0?"active":""}" data-url="${u.url}">
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((L=this.anime.studios)==null?void 0:L.map(u=>u.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((E=this.anime.genres)==null?void 0:E.map(u=>u.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,e}async afterRender(){if(this._initPlayerControls(),this._initPlayerEnhancements(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),s=document.getElementById("btn-watched-status"),a=document.getElementById("watched-status-text");t?(s&&s.classList.add("active"),a&&(a.textContent="Visto")):(s&&s.classList.remove("active"),a&&(a.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var n,i;if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const o=this.anime?{animeTitle:this.anime.title,animeCover:((i=(n=this.anime.images)==null?void 0:n.jpg)==null?void 0:i.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await _.addToHistory(String(this.animeId),this.episodeNum,120,120,o),this.watchedEpisodes.add(this.episodeNum),s&&s.classList.add("active"),a&&(a.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}const e=document.getElementById("btn-close-mobile-fs");e&&e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const s=document.getElementById("video-container");if(s){s.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const a=document.getElementById("btn-fullscreen-watch"),l=a?a.querySelector("span"):null;l&&(l.textContent="Pantalla Completa")}}),this._globalKeyHandler=t=>{if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),window.removeEventListener("keydown",this._globalKeyHandler,{capture:!0});return}if(t.key==="Escape"||t.key==="Backspace"){const a=document.getElementById("video-container");if(a&&a.classList.contains("mobile-fullscreen-active")){a.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const l=document.getElementById("btn-fullscreen-watch"),n=l?l.querySelector("span"):null;n&&(n.textContent="Pantalla Completa"),t.preventDefault(),t.stopPropagation()}}},window.addEventListener("keydown",this._globalKeyHandler,{capture:!0})}_initPlayerEnhancements(){const e=document.querySelector(".video-wrapper-v5 iframe"),t=document.getElementById("btn-speed"),s=document.getElementById("speed-dropdown"),a=document.getElementById("speed-text");t&&s&&(t.addEventListener("click",i=>{i.stopPropagation();const o=s.classList.contains("open");s.classList.toggle("open",!o)}),s.querySelectorAll(".speed-option").forEach(i=>{i.addEventListener("click",async o=>{o.stopPropagation();const p=parseFloat(i.dataset.speed);if(s.querySelectorAll(".speed-option").forEach(r=>r.classList.remove("active")),i.classList.add("active"),a&&(a.textContent=`${p}x`),s.classList.remove("open"),e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"setPlaybackRate",args:[p]}),"*")}catch{}await _.setSetting("playback_speed",p),T.info(`Velocidad: ${p}x`,p===1?"Velocidad normal":`Reproduciendo a ${p}x`)})}),_.getSetting("playback_speed",1).then(i=>{i&&i!==1&&(a&&(a.textContent=`${i}x`),s.querySelectorAll(".speed-option").forEach(o=>{o.classList.toggle("active",parseFloat(o.dataset.speed)===i)}))}),document.addEventListener("click",i=>{i.target.closest("#speed-control-wrapper")||s.classList.remove("open")}));const l=document.getElementById("btn-skip-intro");l&&l.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[85]}),"*"),T.info("Saltando OP","Avanzando al minuto 1:25")}catch{}});const n=document.getElementById("btn-skip-outro");n&&n.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[1290]}),"*"),T.info("Saltando ED","Avanzando al minuto 21:30")}catch{}})}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const s=e.startsWith("//"),a=s?"https:"+e:e,l=new URL(a);l.searchParams.set("autoplay","1"),l.searchParams.set("auto","1");let n=l.toString();return s&&(n=n.replace(/^https:/,"")),n}catch{const a=e.includes("?")?"&":"?";return`${e}${a}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),s=document.getElementById("main-column"),a=document.getElementById("dim-overlay"),l=document.getElementById("ambient-glow"),n=document.getElementById("btn-theater"),i=document.getElementById("btn-lights"),o=document.getElementById("btn-ambient"),p=document.getElementById("btn-favorite"),r=document.getElementById("lights-text"),d=document.getElementById("theater-text"),L=document.getElementById("fav-text"),E=m=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),t.parentElement!==e&&e.insertBefore(t,e.firstChild);return}m?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),d&&(d.textContent="Modo Normal")):(e.classList.remove("theater-active"),s.insertBefore(t,s.firstChild),d&&(d.textContent="Modo Cine"))};E(this.isTheater),n&&n.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),n.classList.toggle("active",this.isTheater),E(this.isTheater)});const u=m=>{const v=m!==void 0?m:!a.classList.contains("active");a.classList.toggle("active",v),t.classList.toggle("dimmed-active",v),i.classList.toggle("active",v),r&&(r.textContent=v?"Encender Luces":"Apagar Luces")};i&&i.addEventListener("click",()=>u()),a&&a.addEventListener("click",()=>u(!1)),o&&l&&o.addEventListener("click",()=>{this.isAmbient=!this.isAmbient,localStorage.setItem("watch-ambient-mode",this.isAmbient),o.classList.toggle("active",this.isAmbient),this.isAmbient?(l.style.display="block",l.offsetHeight,l.style.opacity="0.6",T.info("Modo Ambiente","Resplandor dinámico activado")):(l.style.opacity="0",setTimeout(()=>{this.isAmbient||(l.style.display="none")},800),T.info("Modo Ambiente","Resplandor dinámico desactivado"))}),p&&p.addEventListener("click",async()=>{if(!this.anime)return;const m=await _.toggleFavorite(this.anime);this.isFav=m,p.classList.toggle("active",m),L&&(L.textContent=m?"Quitar Favorito":"Favorito")});const h=document.getElementById("btn-back-watch");h&&h.addEventListener("click",m=>{m.preventDefault(),window.history.back()});const g=document.getElementById("btn-fullscreen-watch");g&&g.addEventListener("click",m=>{m.preventDefault();const v=document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true",y=window.innerWidth<=900||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),b=window.Android!==void 0,w=document.getElementById("video-container");if(w)if(b){const c=document.querySelector(".video-wrapper-v5 iframe, iframe");c&&(c.requestFullscreen?c.requestFullscreen():c.webkitRequestFullscreen?c.webkitRequestFullscreen():c.mozRequestFullScreen?c.mozRequestFullScreen():c.msRequestFullscreen&&c.msRequestFullscreen())}else if(v){document.body.classList.toggle("tv-fullscreen-active");const c=document.body.classList.contains("tv-fullscreen-active");w.classList.toggle("tv-fullscreen-active",c);const x=g.querySelector("span");x&&(x.textContent=c?"Salir Pantalla":"Pantalla Completa")}else if(y){document.body.classList.toggle("mobile-fullscreen-active");const c=document.body.classList.contains("mobile-fullscreen-active");w.classList.toggle("mobile-fullscreen-active",c);const x=g.querySelector("span");x&&(x.textContent=c?"Salir Pantalla":"Pantalla Completa")}else{const c=document.querySelector(".video-wrapper-v5 iframe");c&&(c.requestFullscreen?c.requestFullscreen():c.webkitRequestFullscreen?c.webkitRequestFullscreen():c.mozRequestFullScreen?c.mozRequestFullScreen():c.msRequestFullscreen&&c.msRequestFullscreen())}})}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.querySelector(".video-wrapper-v5 iframe");e.forEach(a=>{a.addEventListener("click",l=>{e.forEach(i=>i.classList.remove("active")),a.classList.add("active");const n=a.getAttribute("data-url");if(t&&n){t.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms allow-presentation"),t.src=this._getAutoplayUrl(n);const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(a=>{a.addEventListener("click",l=>{const n=a.getAttribute("data-lang"),i=`/watch/${this.animeId}/${this.episodeNum}/${n}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,o=W();o?o.navigate(i):window.location.href=i})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const s=e.classList.toggle("expanded");t.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let s=e-t;const a=setInterval(()=>{const l=document.getElementById("countdown-timer");if(!l){clearInterval(a);return}if(s-=1e3,s<=0){l.textContent="¡Disponible ya en Emisión!",clearInterval(a);return}const n=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),o=Math.floor(s%36e5/6e4),p=Math.floor(s%6e4/1e3);let r="";n>0&&(r+=`${n}d `),(i>0||n>0)&&(r+=`${i}h `),r+=`${o}m ${p}s`,l.textContent=r},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var l,n;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[s,a]=await Promise.all([D.getAnimeRecommendations(this.animeId).catch(()=>null),D.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);e.innerHTML=i.map(o=>{var p,r;return`
          <a href="/anime/${o.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(r=(p=o.entry.images)==null?void 0:p.jpg)==null?void 0:r.image_url}" class="related-img-v5" alt="${o.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${o.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,o=((n=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:n.large_image_url)||"",p=this.anime.title,r=()=>{let E=[...i];if(this.sortDesc&&E.reverse(),this.searchQuery.trim()!==""&&(E=E.filter(h=>String(h.number).includes(this.searchQuery)||h.title&&h.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),E.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=E.map(h=>{let g=`Episodio ${h.number}`,m=o;const v=a[h.number-1];if(v&&(v.title&&(g=v.title.replace(/^Episode \d+\s*-?\s*/i,"")),v.thumbnail&&(m=v.thumbnail)),h.number===this.episodeNum){const A=document.getElementById("active-episode-title");A&&(A.textContent=`${this.anime.title} — ${g}`)}const y=h.number===this.episodeNum,b=this.watchedEpisodes.has(h.number),w=`/watch/${this.animeId}/${h.number}/${this.lang}?title=${encodeURIComponent(p)}`,c=b?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",x=b?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${w}" data-link class="ep-item-horizontal-v5 ${y?"active":""} ${b?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${m}" alt="Episodio ${h.number}" loading="lazy">
                ${c}
                ${x}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${h.number}</span>
                <span class="ep-title-v5">${g}</span>
              </div>
            </a>
          `}).join("");const u=document.getElementById("btn-watched-all");if(u&&this.localInfo&&this.localInfo.episodes){const g=this.localInfo.episodes.map(m=>m.number).every(m=>this.watchedEpisodes.has(m));u.classList.toggle("active",g),u.title=g?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=r,r();const d=document.getElementById("ep-search-input");d&&d.addEventListener("input",E=>{this.searchQuery=E.target.value,r()});const L=document.getElementById("btn-sort-ep");L&&L.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,L.classList.toggle("active",this.sortDesc),r()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var l,n;const a=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),a){const i=await S.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await S.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await _.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((n=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:n.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await _.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const l=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),l.every(i=>this.watchedEpisodes.has(i)))await S.transaction("rw",S.history,async()=>{for(const i of l){const o=await S.history.where({animeId:String(this.animeId),episodeId:i}).first();o&&await S.history.delete(o.id)}}),l.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const i=Date.now();await S.transaction("rw",S.history,async()=>{for(const o of l)await S.history.where({animeId:String(this.animeId),episodeId:o}).first()||await S.history.add({animeId:String(this.animeId),episodeId:o,progress:120,duration:120,timestamp:i,updatedAt:i})}),l.forEach(o=>this.watchedEpisodes.add(o)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await _.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const V=Object.freeze(Object.defineProperty({__proto__:null,default:F},Symbol.toStringTag,{value:"Module"}));export{I as _,W as g,O as u};
