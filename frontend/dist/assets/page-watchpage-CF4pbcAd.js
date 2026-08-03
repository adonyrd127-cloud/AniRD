const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-gz9FGPn7.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-AOBgfgm5.js","assets/page-historypage-mmpttW7P.js","assets/page-favoritespage-CPDvGV-m.js","assets/dependencies-Ce00LDPN.js","assets/dependencies-BoANmIBg.css","assets/page-searchpage-DE8eqX78.js","assets/page-categorypage-ByazW9RF.js","assets/page-calendarpage-B76Z6vT6.js","assets/page-authpage-BaaUivOz.js","assets/page-profilepage-BIS2M2Yy.js","assets/page-mylistspage-BYo16TAp.js"])))=>i.map(i=>d[i]);
import{a as T,d as _,b as L}from"./page-homepage-gz9FGPn7.js";import{c as B}from"./vendor-DIPEJTOH.js";import{T as C}from"./page-animedetailpage-AOBgfgm5.js";import{H as R,P as $}from"./dependencies-Ce00LDPN.js";const O="modulepreload",N=function(f){return"/"+f},P={},I=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),i=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(t.map(l=>{if(l=N(l),l in P)return;P[l]=!0;const c=l.endsWith(".css"),r=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${r}`))return;const d=document.createElement("link");if(d.rel=c?"stylesheet":O,c||(d.as="script"),d.crossOrigin="",d.href=l,i&&d.setAttribute("nonce",i),document.head.appendChild(d),c)return new Promise((S,E)=>{d.addEventListener("load",S),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(o){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=o,window.dispatchEvent(i),!i.defaultPrevented)throw o}return n.then(o=>{for(const i of o||[])i.status==="rejected"&&a(i.reason);return e().catch(a)})},F=B(f=>({theme:"dark",isDataSaver:!1,setTheme:e=>f({theme:e}),toggleDataSaver:()=>f(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>f({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>f({isSearchOpen:e})})),D={"/":()=>I(()=>import("./page-homepage-gz9FGPn7.js").then(f=>f.H),__vite__mapDeps([0,1])),"/anime":()=>I(()=>import("./page-animedetailpage-AOBgfgm5.js").then(f=>f.A),__vite__mapDeps([2,0,1])),"/watch":()=>I(()=>Promise.resolve().then(()=>q),void 0),"/history":()=>I(()=>import("./page-historypage-mmpttW7P.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>I(()=>import("./page-favoritespage-CPDvGV-m.js"),__vite__mapDeps([4,0,1,2,5,6])),"/search":()=>I(()=>import("./page-searchpage-DE8eqX78.js"),__vite__mapDeps([7,0,1])),"/category":()=>I(()=>import("./page-categorypage-ByazW9RF.js"),__vite__mapDeps([8,0,1])),"/calendar":()=>I(()=>import("./page-calendarpage-B76Z6vT6.js"),__vite__mapDeps([9,0,1])),"/my-anird":()=>I(()=>import("./page-historypage-mmpttW7P.js"),__vite__mapDeps([3,0,1])),"/auth":()=>I(()=>import("./page-authpage-BaaUivOz.js"),__vite__mapDeps([10,0,1])),"/profile":()=>I(()=>import("./page-profilepage-BIS2M2Yy.js").then(f=>f.P),__vite__mapDeps([11,0,1])),"/lists":()=>I(()=>import("./page-mylistspage-BYo16TAp.js"),__vite__mapDeps([12,0,1,2]))};class W{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let s="/",n={};const a={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))s="/anime",n.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){s="/watch";const r=t.split("/");n.id=r[2],n.ep=r[3],n.lang=r[4]||"sub",document.title=`Ep. ${n.ep} — AniRD`}else t.startsWith("/category/")?(s="/category",n.name=t.split("/")[2],document.title=`${a[n.name]||"Explorar"} — AniRD`):t==="/search"?(s="/search",n.q=e.searchParams.get("q"),document.title=`Buscar "${n.q||""}" — AniRD`):t==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(s=D[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):t==="/lists"?(s="/lists",document.title="Mis Listas — AniRD"):(D[t]&&(s=t),document.title="AniRD — Tu plataforma de anime");const o=[];for(let r=0;r<document.body.classList.length;r++){const d=document.body.classList[r];d&&d.startsWith("route-")&&o.push(d)}o.forEach(r=>document.body.classList.remove(r));const i=`route-${s.replace("/","")||"home"}`;document.body.classList.add(i),F.getState().setCurrentRoute(t);const l=D[s]||D["/"];this.root.innerHTML=`
      <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        <div class="loader-small" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-family: 'Outfit'; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted);">CARGANDO PÁGINA...</div>
      </div>
    `;let c;try{c=await l()}catch(r){console.warn("⚠️ Error al cargar componente de ruta, reintentando en 500ms...",r),await new Promise(d=>setTimeout(d,500));try{c=await l()}catch(d){console.error("❌ Fallo crítico al cargar ruta después de reintentar:",d),this.root.innerHTML=`
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
        `;return}}try{const r=c.default,d=new r(n);this.root.innerHTML="",this.root.appendChild(await d.render()),d.afterRender&&d.afterRender(),s==="/"&&(typeof window.requestIdleCallback=="function"?window.requestIdleCallback(()=>{D["/anime"]().catch(()=>{}),D["/watch"]().catch(()=>{})}):setTimeout(()=>{D["/anime"]().catch(()=>{}),D["/watch"]().catch(()=>{})},1500)),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(r){console.error("Error al inicializar o renderizar la página:",r),this.root.innerHTML=`<div style="padding: 100px; text-align: center; color: red; font-family:'Outfit';"><h3>Error al renderizar el contenido</h3></div>`}}}let k=null;const V=f=>(!k&&f&&(k=new W(f)),k);class z{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.isAmbient=localStorage.getItem("watch-ambient-mode")!=="false",this.sortDesc=!1,this.searchQuery="",this.plyrInstance=null,this.hlsInstance=null}async render(){var l,c,r,d,S,E;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const u=await T.getAnimeInfo(this.animeId);u&&u.data&&(this.anime=u.data);const g=new URLSearchParams(window.location.search).get("title"),p=[];if(this.anime&&(p.push(this.anime.title),this.anime.title_english&&p.push(this.anime.title_english),this.anime.title_japanese&&p.push(this.anime.title_japanese),this.anime.title_synonyms&&p.push(...this.anime.title_synonyms)),g&&!p.includes(g)&&p.push(g),p.length>0){let y=null;for(const b of p){const w=await T.searchLocal(b);if(w&&w.success&&w.data&&w.data.results&&w.data.results.length>0){y=w;break}}if(y){const b=y.data.results.find(m=>p.some(x=>m.title.toLowerCase().includes(x.toLowerCase())))||y.data.results[0];this.anime||(this.anime={title:b.title,images:{jpg:{large_image_url:b.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const w=await T.getAnimeInfo(b.url);if(w.success){this.localInfo=w.data;const m=this.localInfo.episodes.find(x=>x.number===this.episodeNum);if(m&&m.url){const x=await T.getEpisode(m.url);if(x.success&&x.data){this.episodeData=x.data;let A=this.episodeData.servers[this.lang];if(!A||A.length===0)if(this.lang==="dub"&&this.episodeData.servers.sub&&this.episodeData.servers.sub.length>0){this.lang="sub",A=this.episodeData.servers.sub,C.show("El episodio no tiene doblaje disponible. Reproduciendo subtitulado.","info");const M=window.location.href.replace("/dub","/sub");window.history.replaceState({},"",M)}else A=this.episodeData.servers.sub||[];this.episodeData.activeServers=A}}}}}this.isFav=await _.isFavorite(this.animeId);const v=await L.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(v.map(y=>Number(y.episodeId)))}catch(u){console.error("Error crítico al renderizar WatchPage Premium:",u)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,n=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,a=((c=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:c.large_image_url)||"",o=((d=(r=this.anime.images)==null?void 0:r.jpg)==null?void 0:d.large_image_url)||a;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const u=this.anime.broadcast,h={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(h[u.day]!==void 0){const[g,p]=u.time.split(":").map(Number),v=new Date(new Date().toLocaleString("en-US",{timeZone:u.timezone||"Asia/Tokyo"}));let y=new Date(v);y.setHours(g,p,0,0);let b=h[u.day]-v.getDay();(b<0||b===0&&y<v)&&(b+=7),y.setDate(y.getDate()+b),y-v>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(y,v))}}return e.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${o}'); transition: opacity 0.8s ease; ${this.isAmbient?"opacity: 0.6; display: block;":"opacity: 0; display: none;"}"></div>
      
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
              <a href="${n}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en MyAnimeList">
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((S=this.anime.studios)==null?void 0:S.map(u=>u.name).join(", "))||"Desconocido"}</div>
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
    `,e}async afterRender(){const e=document.getElementById("video-container");if(e&&this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0&&this._renderActiveServerPlayer(e,this.episodeData.activeServers[0]),this._initPlayerControls(),this._initPlayerEnhancements(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const s=this.watchedEpisodes.has(this.episodeNum),n=document.getElementById("btn-watched-status"),a=document.getElementById("watched-status-text");s?(n&&n.classList.add("active"),a&&(a.textContent="Visto")):(n&&n.classList.remove("active"),a&&(a.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var i,l;if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const c=this.anime?{animeTitle:this.anime.title,animeCover:((l=(i=this.anime.images)==null?void 0:i.jpg)==null?void 0:l.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await _.addToHistory(String(this.animeId),this.episodeNum,120,120,c),this.watchedEpisodes.add(this.episodeNum),n&&n.classList.add("active"),a&&(a.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}const t=document.getElementById("btn-close-mobile-fs");t&&t.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation();const n=document.getElementById("video-container");if(n){n.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const a=document.getElementById("btn-fullscreen-watch"),o=a?a.querySelector("span"):null;o&&(o.textContent="Pantalla Completa")}}),this._globalKeyHandler=s=>{if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),window.removeEventListener("keydown",this._globalKeyHandler,{capture:!0});return}if(s.key==="Escape"||s.key==="Backspace"){const a=document.getElementById("video-container");if(a&&a.classList.contains("mobile-fullscreen-active")){a.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const o=document.getElementById("btn-fullscreen-watch"),i=o?o.querySelector("span"):null;i&&(i.textContent="Pantalla Completa"),s.preventDefault(),s.stopPropagation()}}},window.addEventListener("keydown",this._globalKeyHandler,{capture:!0})}_initPlayerEnhancements(){const e=document.querySelector(".video-wrapper-v5 iframe"),t=document.getElementById("btn-speed"),s=document.getElementById("speed-dropdown"),n=document.getElementById("speed-text");t&&s&&(t.addEventListener("click",i=>{i.stopPropagation();const l=s.classList.contains("open");s.classList.toggle("open",!l)}),s.querySelectorAll(".speed-option").forEach(i=>{i.addEventListener("click",async l=>{l.stopPropagation();const c=parseFloat(i.dataset.speed);if(s.querySelectorAll(".speed-option").forEach(r=>r.classList.remove("active")),i.classList.add("active"),n&&(n.textContent=`${c}x`),s.classList.remove("open"),e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"setPlaybackRate",args:[c]}),"*")}catch{}await _.setSetting("playback_speed",c),C.info(`Velocidad: ${c}x`,c===1?"Velocidad normal":`Reproduciendo a ${c}x`)})}),_.getSetting("playback_speed",1).then(i=>{i&&i!==1&&(n&&(n.textContent=`${i}x`),s.querySelectorAll(".speed-option").forEach(l=>{l.classList.toggle("active",parseFloat(l.dataset.speed)===i)}))}),document.addEventListener("click",i=>{i.target.closest("#speed-control-wrapper")||s.classList.remove("open")}));const a=document.getElementById("btn-skip-intro");a&&a.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[85]}),"*"),C.info("Saltando OP","Avanzando al minuto 1:25")}catch{}});const o=document.getElementById("btn-skip-outro");o&&o.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[1290]}),"*"),C.info("Saltando ED","Avanzando al minuto 21:30")}catch{}})}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const s=e.startsWith("//"),n=s?"https:"+e:e,a=new URL(n);a.searchParams.set("autoplay","1"),a.searchParams.set("auto","1");let o=a.toString();return s&&(o=o.replace(/^https:/,"")),o}catch{const n=e.includes("?")?"&":"?";return`${e}${n}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),s=document.getElementById("main-column"),n=document.getElementById("dim-overlay"),a=document.getElementById("ambient-glow"),o=document.getElementById("btn-theater"),i=document.getElementById("btn-lights"),l=document.getElementById("btn-ambient"),c=document.getElementById("btn-favorite"),r=document.getElementById("lights-text"),d=document.getElementById("theater-text"),S=document.getElementById("fav-text"),E=p=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),t.parentElement!==e&&e.insertBefore(t,e.firstChild);return}p?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),d&&(d.textContent="Modo Normal")):(e.classList.remove("theater-active"),s.insertBefore(t,s.firstChild),d&&(d.textContent="Modo Cine"))};E(this.isTheater),o&&o.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),o.classList.toggle("active",this.isTheater),E(this.isTheater)});const u=p=>{const v=p!==void 0?p:!n.classList.contains("active");n.classList.toggle("active",v),t.classList.toggle("dimmed-active",v),i.classList.toggle("active",v),r&&(r.textContent=v?"Encender Luces":"Apagar Luces")};i&&i.addEventListener("click",()=>u()),n&&n.addEventListener("click",()=>u(!1)),l&&a&&l.addEventListener("click",()=>{this.isAmbient=!this.isAmbient,localStorage.setItem("watch-ambient-mode",this.isAmbient),l.classList.toggle("active",this.isAmbient),this.isAmbient?(a.style.display="block",a.offsetHeight,a.style.opacity="0.6",C.info("Modo Ambiente","Resplandor dinámico activado")):(a.style.opacity="0",setTimeout(()=>{this.isAmbient||(a.style.display="none")},800),C.info("Modo Ambiente","Resplandor dinámico desactivado"))}),c&&c.addEventListener("click",async()=>{if(!this.anime)return;const p=await _.toggleFavorite(this.anime);this.isFav=p,c.classList.toggle("active",p),S&&(S.textContent=p?"Quitar Favorito":"Favorito")});const h=document.getElementById("btn-back-watch");h&&h.addEventListener("click",p=>{p.preventDefault(),window.history.back()});const g=document.getElementById("btn-fullscreen-watch");g&&g.addEventListener("click",p=>{p.preventDefault();const v=document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true",y=window.innerWidth<=900||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),b=window.Android!==void 0,w=document.getElementById("video-container");if(w)if(b){const m=document.querySelector(".video-wrapper-v5 iframe, iframe");m&&(m.requestFullscreen?m.requestFullscreen():m.webkitRequestFullscreen?m.webkitRequestFullscreen():m.mozRequestFullScreen?m.mozRequestFullScreen():m.msRequestFullscreen&&m.msRequestFullscreen())}else if(v){document.body.classList.toggle("tv-fullscreen-active");const m=document.body.classList.contains("tv-fullscreen-active");w.classList.toggle("tv-fullscreen-active",m);const x=g.querySelector("span");x&&(x.textContent=m?"Salir Pantalla":"Pantalla Completa")}else if(y){document.body.classList.toggle("mobile-fullscreen-active");const m=document.body.classList.contains("mobile-fullscreen-active");w.classList.toggle("mobile-fullscreen-active",m);const x=g.querySelector("span");x&&(x.textContent=m?"Salir Pantalla":"Pantalla Completa")}else{const m=document.querySelector(".video-wrapper-v5 iframe");m&&(m.requestFullscreen?m.requestFullscreen():m.webkitRequestFullscreen?m.webkitRequestFullscreen():m.mozRequestFullScreen?m.mozRequestFullScreen():m.msRequestFullscreen&&m.msRequestFullscreen())}})}async _renderActiveServerPlayer(e,t){if(!e||!t||!t.url)return;const s=t.url;if(this.plyrInstance){try{this.plyrInstance.destroy()}catch{}this.plyrInstance=null}if(this.hlsInstance){try{this.hlsInstance.destroy()}catch{}this.hlsInstance=null}e.innerHTML=`
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#000;">
         <div class="spinner" style="border: 4px solid rgba(255,255,255,0.1); border-left-color: #ff3366; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
         <p style="color:#aaa; font-size:12px; margin-top:15px; font-family:'Outfit'">Resolviendo enlace de video...</p>
         <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
      </div>
      <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
    `;try{const n=await T.resolveServer(s);if(n&&n.success&&n.streamUrl){e.innerHTML=`
          <video id="anird-player" playsinline controls style="--plyr-color-main: #ff3366;"></video>
          <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
        `;const a=document.getElementById("anird-player"),o=n.streamUrl;n.mediaType==="hls"||o.includes(".m3u8")?R.isSupported()?(this.hlsInstance=new R,this.hlsInstance.loadSource(o),this.hlsInstance.attachMedia(a),this.hlsInstance.on(R.Events.MANIFEST_PARSED,()=>{this.plyrInstance=new $(a,{autoplay:!0})})):a.canPlayType("application/vnd.apple.mpegurl")&&(a.src=o,this.plyrInstance=new $(a,{autoplay:!0})):(a.src=o,this.plyrInstance=new $(a,{autoplay:!0}))}else this._renderIframeFallback(e,s)}catch(n){console.warn("Failed to resolve native stream:",n),this._renderIframeFallback(e,s)}}_renderIframeFallback(e,t){e.innerHTML=`
      <iframe src="${this._getAutoplayUrl(t)}" allowfullscreen allow="autoplay; encrypted-media"></iframe>
      <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
    `}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.getElementById("video-container");e.forEach((n,a)=>{n.addEventListener("click",o=>{var r;e.forEach(d=>d.classList.remove("active")),n.classList.add("active");const i=((r=this.episodeData)==null?void 0:r.activeServers)||[],l=n.getAttribute("data-url"),c=i[a]||{url:l};t&&c.url&&(this._renderActiveServerPlayer(t,c),t.style.opacity="0.5",setTimeout(()=>t.style.opacity="1",500))})}),document.querySelectorAll(".lang-pill-v5").forEach(n=>{n.addEventListener("click",a=>{const o=n.getAttribute("data-lang"),i=`/watch/${this.animeId}/${this.episodeNum}/${o}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,l=V();l?l.navigate(i):window.location.href=i})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const s=e.classList.toggle("expanded");t.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let s=e-t;const n=setInterval(()=>{const a=document.getElementById("countdown-timer");if(!a){clearInterval(n);return}if(s-=1e3,s<=0){a.textContent="¡Disponible ya en Emisión!",clearInterval(n);return}const o=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),l=Math.floor(s%36e5/6e4),c=Math.floor(s%6e4/1e3);let r="";o>0&&(r+=`${o}d `),(i>0||o>0)&&(r+=`${i}h `),r+=`${l}m ${c}s`,a.textContent=r},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var a,o;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[s,n]=await Promise.all([T.getAnimeRecommendations(this.animeId).catch(()=>null),T.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);e.innerHTML=i.map(l=>{var c,r;return`
          <a href="/anime/${l.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(r=(c=l.entry.images)==null?void 0:c.jpg)==null?void 0:r.image_url}" class="related-img-v5" alt="${l.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${l.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,l=((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||"",c=this.anime.title,r=()=>{let E=[...i];if(this.sortDesc&&E.reverse(),this.searchQuery.trim()!==""&&(E=E.filter(h=>String(h.number).includes(this.searchQuery)||h.title&&h.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),E.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=E.map(h=>{let g=`Episodio ${h.number}`,p=l;const v=n[h.number-1];if(v&&(v.title&&(g=v.title.replace(/^Episode \d+\s*-?\s*/i,"")),v.thumbnail&&(p=v.thumbnail)),h.number===this.episodeNum){const A=document.getElementById("active-episode-title");A&&(A.textContent=`${this.anime.title} — ${g}`)}const y=h.number===this.episodeNum,b=this.watchedEpisodes.has(h.number),w=`/watch/${this.animeId}/${h.number}/${this.lang}?title=${encodeURIComponent(c)}`,m=b?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",x=b?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${w}" data-link class="ep-item-horizontal-v5 ${y?"active":""} ${b?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${p}" alt="Episodio ${h.number}" loading="lazy">
                ${m}
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
          `}).join("");const u=document.getElementById("btn-watched-all");if(u&&this.localInfo&&this.localInfo.episodes){const g=this.localInfo.episodes.map(p=>p.number).every(p=>this.watchedEpisodes.has(p));u.classList.toggle("active",g),u.title=g?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=r,r();const d=document.getElementById("ep-search-input");d&&d.addEventListener("input",E=>{this.searchQuery=E.target.value,r()});const S=document.getElementById("btn-sort-ep");S&&S.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,S.classList.toggle("active",this.sortDesc),r()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var a,o;const n=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),n){const i=await L.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await L.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await _.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await _.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const a=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),a.every(i=>this.watchedEpisodes.has(i)))await L.transaction("rw",L.history,async()=>{for(const i of a){const l=await L.history.where({animeId:String(this.animeId),episodeId:i}).first();l&&await L.history.delete(l.id)}}),a.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const i=Date.now();await L.transaction("rw",L.history,async()=>{for(const l of a)await L.history.where({animeId:String(this.animeId),episodeId:l}).first()||await L.history.add({animeId:String(this.animeId),episodeId:l,progress:120,duration:120,timestamp:i,updatedAt:i})}),a.forEach(l=>this.watchedEpisodes.add(l)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await _.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const q=Object.freeze(Object.defineProperty({__proto__:null,default:z},Symbol.toStringTag,{value:"Module"}));export{I as _,V as g,F as u};
