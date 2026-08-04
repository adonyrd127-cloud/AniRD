const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-gz9FGPn7.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-AOBgfgm5.js","assets/page-historypage-mmpttW7P.js","assets/page-favoritespage-PBYHsdAW.js","assets/dependencies-Ce00LDPN.js","assets/dependencies-BoANmIBg.css","assets/page-searchpage-DE8eqX78.js","assets/page-categorypage-ByazW9RF.js","assets/page-calendarpage-B76Z6vT6.js","assets/page-authpage-BaaUivOz.js","assets/page-profilepage-CwIvPYYe.js","assets/page-mylistspage-BYo16TAp.js"])))=>i.map(i=>d[i]);
import{a as R,d as T,b as A}from"./page-homepage-gz9FGPn7.js";import{c as W}from"./vendor-DIPEJTOH.js";import{T as $}from"./page-animedetailpage-AOBgfgm5.js";import{H as k,P}from"./dependencies-Ce00LDPN.js";const N="modulepreload",z=function(g){return"/"+g},B={},S=function(e,i,t){let n=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),s=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(i.map(l=>{if(l=z(l),l in B)return;B[l]=!0;const c=l.endsWith(".css"),r=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${r}`))return;const p=document.createElement("link");if(p.rel=c?"stylesheet":N,c||(p.as="script"),p.crossOrigin="",p.href=l,s&&p.setAttribute("nonce",s),document.head.appendChild(p),c)return new Promise((L,E)=>{p.addEventListener("load",L),p.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(o){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o}return n.then(o=>{for(const s of o||[])s.status==="rejected"&&a(s.reason);return e().catch(a)})},F=W(g=>({theme:"dark",isDataSaver:!1,setTheme:e=>g({theme:e}),toggleDataSaver:()=>g(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>g({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>g({isSearchOpen:e})})),D={"/":()=>S(()=>import("./page-homepage-gz9FGPn7.js").then(g=>g.H),__vite__mapDeps([0,1])),"/anime":()=>S(()=>import("./page-animedetailpage-AOBgfgm5.js").then(g=>g.A),__vite__mapDeps([2,0,1])),"/watch":()=>S(()=>Promise.resolve().then(()=>H),void 0),"/history":()=>S(()=>import("./page-historypage-mmpttW7P.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>S(()=>import("./page-favoritespage-PBYHsdAW.js"),__vite__mapDeps([4,0,1,2,5,6])),"/search":()=>S(()=>import("./page-searchpage-DE8eqX78.js"),__vite__mapDeps([7,0,1])),"/category":()=>S(()=>import("./page-categorypage-ByazW9RF.js"),__vite__mapDeps([8,0,1])),"/calendar":()=>S(()=>import("./page-calendarpage-B76Z6vT6.js"),__vite__mapDeps([9,0,1])),"/my-anird":()=>S(()=>import("./page-historypage-mmpttW7P.js"),__vite__mapDeps([3,0,1])),"/auth":()=>S(()=>import("./page-authpage-BaaUivOz.js"),__vite__mapDeps([10,0,1])),"/profile":()=>S(()=>import("./page-profilepage-CwIvPYYe.js").then(g=>g.P),__vite__mapDeps([11,0,1])),"/lists":()=>S(()=>import("./page-mylistspage-BYo16TAp.js"),__vite__mapDeps([12,0,1,2]))};class V{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const i=e.target.closest("a[data-link]");i&&(e.preventDefault(),this.navigate(i.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),i=e.pathname;let t="/",n={};const a={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(i.startsWith("/anime/"))t="/anime",n.id=i.split("/")[2],document.title="Cargando... — AniRD";else if(i.startsWith("/watch/")){t="/watch";const r=i.split("/");n.id=r[2],n.ep=r[3],n.lang=r[4]||"sub",document.title=`Ep. ${n.ep} — AniRD`}else i.startsWith("/category/")?(t="/category",n.name=i.split("/")[2],document.title=`${a[n.name]||"Explorar"} — AniRD`):i==="/search"?(t="/search",n.q=e.searchParams.get("q"),document.title=`Buscar "${n.q||""}" — AniRD`):i==="/profile"?(t="/profile",document.title="Mi Perfil — AniRD"):i==="/auth"?(t="/auth",document.title="Iniciar Sesión — AniRD"):i==="/calendar"?(t="/calendar",document.title="Calendario — AniRD"):i==="/history"||i==="/my-anird"?(t=D[i]?i:"/",document.title="Mi Historial — AniRD"):i==="/favorites"?(t="/favorites",document.title="Favoritos — AniRD"):i==="/lists"?(t="/lists",document.title="Mis Listas — AniRD"):(D[i]&&(t=i),document.title="AniRD — Tu plataforma de anime");const o=[];for(let r=0;r<document.body.classList.length;r++){const p=document.body.classList[r];p&&p.startsWith("route-")&&o.push(p)}o.forEach(r=>document.body.classList.remove(r));const s=`route-${t.replace("/","")||"home"}`;document.body.classList.add(s),F.getState().setCurrentRoute(i);const l=D[t]||D["/"];this.root.innerHTML=`
      <div style="padding: 100px 20px; text-align: center; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 15px;">
        <div class="loader-small" style="width: 32px; height: 32px; border-width: 3px;"></div>
        <div style="font-family: 'Outfit'; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: var(--text-muted);">CARGANDO PÁGINA...</div>
      </div>
    `;let c;try{c=await l()}catch(r){console.warn("⚠️ Error al cargar componente de ruta, reintentando en 500ms...",r),await new Promise(p=>setTimeout(p,500));try{c=await l()}catch(p){console.error("❌ Fallo crítico al cargar ruta después de reintentar:",p),this.root.innerHTML=`
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
        `;return}}try{const r=c.default,p=new r(n);this.root.innerHTML="",this.root.appendChild(await p.render()),p.afterRender&&p.afterRender(),t==="/"&&(typeof window.requestIdleCallback=="function"?window.requestIdleCallback(()=>{D["/anime"]().catch(()=>{}),D["/watch"]().catch(()=>{})}):setTimeout(()=>{D["/anime"]().catch(()=>{}),D["/watch"]().catch(()=>{})},1500)),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(r){console.error("Error al inicializar o renderizar la página:",r),this.root.innerHTML=`<div style="padding: 100px; text-align: center; color: red; font-family:'Outfit';"><h3>Error al renderizar el contenido</h3></div>`}}}let M=null;const U=g=>(!M&&g&&(M=new V(g)),M);class q{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.isAmbient=localStorage.getItem("watch-ambient-mode")!=="false",this.sortDesc=!1,this.searchQuery="",this.plyrInstance=null,this.hlsInstance=null}async render(){var l,c,r,p,L,E;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const u=await R.getAnimeInfo(this.animeId);u&&u.data&&(this.anime=u.data);const b=new URLSearchParams(window.location.search).get("title"),m=[];if(this.anime&&(m.push(this.anime.title),this.anime.title_english&&m.push(this.anime.title_english),this.anime.title_japanese&&m.push(this.anime.title_japanese),this.anime.title_synonyms&&m.push(...this.anime.title_synonyms)),b&&!m.includes(b)&&m.push(b),m.length>0){let y=null;for(const x of m){const f=await R.searchLocal(x);if(f&&f.success&&f.data&&f.data.results&&f.data.results.length>0){y=f;break}}if(y&&y.data&&Array.isArray(y.data.results)){const x=[...y.data.results].sort((f,d)=>{const I=m.some(w=>f.title.toLowerCase().includes(w.toLowerCase()));return(m.some(w=>d.title.toLowerCase().includes(w.toLowerCase()))?1:0)-(I?1:0)});for(const f of x){this.anime||(this.anime={title:f.title,images:{jpg:{large_image_url:f.image||f.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const d=await R.getAnimeInfo(f.url);if(d&&d.success&&d.data&&Array.isArray(d.data.episodes)&&d.data.episodes.length>0){this.localInfo=d.data;const I=this.localInfo.episodes.find(_=>_.number===this.episodeNum);if(I&&I.url){const _=await R.getEpisode(I.url);if(_&&_.success&&_.data){this.episodeData=_.data;const w=this.episodeData.servers||{};let C=w[this.lang]||[];if(!C||C.length===0)if(this.lang==="dub"&&w.sub&&w.sub.length>0){this.lang="sub",C=w.sub,$.show("El episodio no tiene doblaje disponible. Reproduciendo subtitulado.","info");const O=window.location.href.replace("/dub","/sub");window.history.replaceState({},"",O)}else w.sub&&w.sub.length>0?C=w.sub:w.dub&&w.dub.length>0?C=w.dub:Array.isArray(w)&&(C=w);if(this.episodeData.activeServers=C||[],this.episodeData.activeServers.length>0){console.log(`[WatchPage] Servidores encontrados con éxito (${this.episodeData.activeServers.length}) desde ${f.url}`);break}}}}}}}this.isFav=await T.isFavorite(this.animeId);const v=await A.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(v.map(y=>Number(y.episodeId)))}catch(u){console.error("Error crítico al renderizar WatchPage Premium:",u)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const i=this.watchedEpisodes.has(this.episodeNum),t=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,n=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,a=((c=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:c.large_image_url)||"",o=((p=(r=this.anime.images)==null?void 0:r.jpg)==null?void 0:p.large_image_url)||a;let s="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const u=this.anime.broadcast,h={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(h[u.day]!==void 0){const[b,m]=u.time.split(":").map(Number),v=new Date(new Date().toLocaleString("en-US",{timeZone:u.timezone||"Asia/Tokyo"}));let y=new Date(v);y.setHours(b,m,0,0);let x=h[u.day]-v.getDay();(x<0||x===0&&y<v)&&(x+=7),y.setDate(y.getDate()+x),y-v>0&&(s=`
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
            ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?`<iframe src="${this._getAutoplayUrl(this._normalizeEmbedUrl(this.episodeData.activeServers[0].url))}" allowfullscreen allow="autoplay; encrypted-media; picture-in-picture; fullscreen" sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"></iframe>`:`<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
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
              <button class="control-btn-v5 ${i?"active":""}" id="btn-watched-status">
                👁️ <span id="watched-status-text">${i?"Visto":"Marcar Visto"}</span>
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
              <a href="${t}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
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
    `,e}async afterRender(){const e=document.getElementById("video-container");if(e&&this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0&&this._renderActiveServerPlayer(e,this.episodeData.activeServers[0]),this._initPlayerControls(),this._initPlayerEnhancements(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),n=document.getElementById("btn-watched-status"),a=document.getElementById("watched-status-text");t?(n&&n.classList.add("active"),a&&(a.textContent="Visto")):(n&&n.classList.remove("active"),a&&(a.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var s,l;if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const c=this.anime?{animeTitle:this.anime.title,animeCover:((l=(s=this.anime.images)==null?void 0:s.jpg)==null?void 0:l.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await T.addToHistory(String(this.animeId),this.episodeNum,120,120,c),this.watchedEpisodes.add(this.episodeNum),n&&n.classList.add("active"),a&&(a.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}const i=document.getElementById("btn-close-mobile-fs");i&&i.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const n=document.getElementById("video-container");if(n){n.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const a=document.getElementById("btn-fullscreen-watch"),o=a?a.querySelector("span"):null;o&&(o.textContent="Pantalla Completa")}}),this._globalKeyHandler=t=>{if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),window.removeEventListener("keydown",this._globalKeyHandler,{capture:!0});return}if(t.key==="Escape"||t.key==="Backspace"){const a=document.getElementById("video-container");if(a&&a.classList.contains("mobile-fullscreen-active")){a.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const o=document.getElementById("btn-fullscreen-watch"),s=o?o.querySelector("span"):null;s&&(s.textContent="Pantalla Completa"),t.preventDefault(),t.stopPropagation()}}},window.addEventListener("keydown",this._globalKeyHandler,{capture:!0})}_initPlayerEnhancements(){const e=document.querySelector(".video-wrapper-v5 iframe"),i=document.getElementById("btn-speed"),t=document.getElementById("speed-dropdown"),n=document.getElementById("speed-text");i&&t&&(i.addEventListener("click",s=>{s.stopPropagation();const l=t.classList.contains("open");t.classList.toggle("open",!l)}),t.querySelectorAll(".speed-option").forEach(s=>{s.addEventListener("click",async l=>{l.stopPropagation();const c=parseFloat(s.dataset.speed);if(t.querySelectorAll(".speed-option").forEach(r=>r.classList.remove("active")),s.classList.add("active"),n&&(n.textContent=`${c}x`),t.classList.remove("open"),e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"setPlaybackRate",args:[c]}),"*")}catch{}await T.setSetting("playback_speed",c),$.info(`Velocidad: ${c}x`,c===1?"Velocidad normal":`Reproduciendo a ${c}x`)})}),T.getSetting("playback_speed",1).then(s=>{s&&s!==1&&(n&&(n.textContent=`${s}x`),t.querySelectorAll(".speed-option").forEach(l=>{l.classList.toggle("active",parseFloat(l.dataset.speed)===s)}))}),document.addEventListener("click",s=>{s.target.closest("#speed-control-wrapper")||t.classList.remove("open")}));const a=document.getElementById("btn-skip-intro");a&&a.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[85]}),"*"),$.info("Saltando OP","Avanzando al minuto 1:25")}catch{}});const o=document.getElementById("btn-skip-outro");o&&o.addEventListener("click",()=>{if(e&&e.contentWindow)try{e.contentWindow.postMessage(JSON.stringify({event:"command",func:"seekTo",args:[1290]}),"*"),$.info("Saltando ED","Avanzando al minuto 21:30")}catch{}})}_normalizeEmbedUrl(e){if(!e||typeof e!="string")return"";let i=e.trim();i.startsWith("//")?i="https:"+i:!i.startsWith("http://")&&!i.startsWith("https://")&&(i="https://"+i);try{const t=new URL(i),n=t.hostname.toLowerCase();if((n.includes("upnshare")||n.includes("uns.bio"))&&t.pathname.startsWith("/d/"))return t.pathname=t.pathname.replace("/d/","/e/"),t.toString();if(n.includes("mp4upload")&&!t.pathname.includes("embed")&&!t.pathname.endsWith(".html")){const a=t.pathname.split("/").filter(Boolean).pop();if(a)return t.pathname=`/embed-${a}.html`,t.toString()}return(n.includes("dood")||n.includes("ds2play")||n.includes("dstream"))&&t.pathname.startsWith("/d/")?(t.pathname=t.pathname.replace("/d/","/e/"),t.toString()):((n.includes("wish")||n.includes("awish")||n.includes("playnix")||n.includes("davioad"))&&(t.pathname.startsWith("/d/")||t.pathname.startsWith("/f/"))&&(t.pathname=t.pathname.replace(/^\/[df]\//,"/e/")),t.toString())}catch{return i}}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const t=e.startsWith("//"),n=t?"https:"+e:e,a=new URL(n);a.searchParams.set("autoplay","1"),a.searchParams.set("auto","1");let o=a.toString();return t&&(o=o.replace(/^https:/,"")),o}catch{const n=e.includes("?")?"&":"?";return`${e}${n}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),i=document.getElementById("player-section"),t=document.getElementById("main-column"),n=document.getElementById("dim-overlay"),a=document.getElementById("ambient-glow"),o=document.getElementById("btn-theater"),s=document.getElementById("btn-lights"),l=document.getElementById("btn-ambient"),c=document.getElementById("btn-favorite"),r=document.getElementById("lights-text"),p=document.getElementById("theater-text"),L=document.getElementById("fav-text"),E=m=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),i.parentElement!==e&&e.insertBefore(i,e.firstChild);return}m?(e.classList.add("theater-active"),e.insertBefore(i,e.firstChild),p&&(p.textContent="Modo Normal")):(e.classList.remove("theater-active"),t.insertBefore(i,t.firstChild),p&&(p.textContent="Modo Cine"))};E(this.isTheater),o&&o.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),o.classList.toggle("active",this.isTheater),E(this.isTheater)});const u=m=>{const v=m!==void 0?m:!n.classList.contains("active");n.classList.toggle("active",v),i.classList.toggle("dimmed-active",v),s.classList.toggle("active",v),r&&(r.textContent=v?"Encender Luces":"Apagar Luces")};s&&s.addEventListener("click",()=>u()),n&&n.addEventListener("click",()=>u(!1)),l&&a&&l.addEventListener("click",()=>{this.isAmbient=!this.isAmbient,localStorage.setItem("watch-ambient-mode",this.isAmbient),l.classList.toggle("active",this.isAmbient),this.isAmbient?(a.style.display="block",a.offsetHeight,a.style.opacity="0.6",$.info("Modo Ambiente","Resplandor dinámico activado")):(a.style.opacity="0",setTimeout(()=>{this.isAmbient||(a.style.display="none")},800),$.info("Modo Ambiente","Resplandor dinámico desactivado"))}),c&&c.addEventListener("click",async()=>{if(!this.anime)return;const m=await T.toggleFavorite(this.anime);this.isFav=m,c.classList.toggle("active",m),L&&(L.textContent=m?"Quitar Favorito":"Favorito")});const h=document.getElementById("btn-back-watch");h&&h.addEventListener("click",m=>{m.preventDefault(),window.history.back()});const b=document.getElementById("btn-fullscreen-watch");b&&b.addEventListener("click",m=>{m.preventDefault();const v=document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true",y=window.innerWidth<=900||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),x=window.Android!==void 0,f=document.getElementById("video-container");if(f)if(x){const d=document.querySelector(".video-wrapper-v5 iframe, iframe");d&&(d.requestFullscreen?d.requestFullscreen():d.webkitRequestFullscreen?d.webkitRequestFullscreen():d.mozRequestFullScreen?d.mozRequestFullScreen():d.msRequestFullscreen&&d.msRequestFullscreen())}else if(v){document.body.classList.toggle("tv-fullscreen-active");const d=document.body.classList.contains("tv-fullscreen-active");f.classList.toggle("tv-fullscreen-active",d);const I=b.querySelector("span");I&&(I.textContent=d?"Salir Pantalla":"Pantalla Completa")}else if(y){document.body.classList.toggle("mobile-fullscreen-active");const d=document.body.classList.contains("mobile-fullscreen-active");f.classList.toggle("mobile-fullscreen-active",d);const I=b.querySelector("span");I&&(I.textContent=d?"Salir Pantalla":"Pantalla Completa")}else{const d=document.querySelector(".video-wrapper-v5 iframe");d&&(d.requestFullscreen?d.requestFullscreen():d.webkitRequestFullscreen?d.webkitRequestFullscreen():d.mozRequestFullScreen?d.mozRequestFullScreen():d.msRequestFullscreen&&d.msRequestFullscreen())}})}async _renderActiveServerPlayer(e,i){if(!e||!i||!i.url)return;const t=i.url,n=this._normalizeEmbedUrl(t);if(this.plyrInstance){try{this.plyrInstance.destroy()}catch{}this.plyrInstance=null}if(this.hlsInstance){try{this.hlsInstance.destroy()}catch{}this.hlsInstance=null}if(i.isDirect||t.includes(".m3u8")){e.innerHTML=`
        <video id="anird-player" playsinline controls style="--plyr-color-main: #ff3366; width:100%; height:100%;"></video>
        <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
      `;const a=document.getElementById("anird-player");k.isSupported()?(this.hlsInstance=new k,this.hlsInstance.loadSource(t),this.hlsInstance.attachMedia(a),this.hlsInstance.on(k.Events.MANIFEST_PARSED,()=>{this.plyrInstance=new P(a,{autoplay:!0})})):a.canPlayType("application/vnd.apple.mpegurl")&&(a.src=t,this.plyrInstance=new P(a,{autoplay:!0}));return}this._renderIframeFallback(e,n,i.server);try{const a=await Promise.race([R.resolveServer(t),new Promise(o=>setTimeout(()=>o(null),3e3))]);if(a&&a.success&&a.streamUrl&&a.streamUrl.includes(".m3u8")){const o=a.streamUrl;e.innerHTML=`
          <video id="anird-player" playsinline controls style="--plyr-color-main: #ff3366; width:100%; height:100%;"></video>
          <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
        `;const s=document.getElementById("anird-player");k.isSupported()?(this.hlsInstance=new k,this.hlsInstance.loadSource(o),this.hlsInstance.attachMedia(s),this.hlsInstance.on(k.Events.MANIFEST_PARSED,()=>{this.plyrInstance=new P(s,{autoplay:!0})})):s.canPlayType("application/vnd.apple.mpegurl")&&(s.src=o,this.plyrInstance=new P(s,{autoplay:!0}))}}catch{}}_renderIframeFallback(e,i,t){const n=this._normalizeEmbedUrl(i);if(!n||!n.startsWith("http://")&&!n.startsWith("https://")){e.innerHTML=`
        <div class="video-error-state">
          <span style="font-size: 36px;">⚠️</span>
          <h3 style="font-family:'Outfit'; font-size:16px; margin:10px 0 5px;">URL inválida</h3>
          <p style="color:var(--text-muted); font-size:12px;">La URL del servidor no es válida. Intenta con otro servidor.</p>
        </div>
      `;return}const a=this._getAutoplayUrl(n),o="video-iframe-"+Date.now();e.innerHTML=`
      <iframe 
        id="${o}"
        src="${a}" 
        allowfullscreen 
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen" 
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      ></iframe>
      <button class="mobile-close-fullscreen-btn" id="btn-close-mobile-fs">✕</button>
    `;const s=document.getElementById(o);if(s){let l=!1;s.addEventListener("load",()=>{l=!0}),setTimeout(()=>{var c;if(!l&&s.parentElement)try{const r=s.contentDocument||((c=s.contentWindow)==null?void 0:c.document);r&&r.body&&r.body.innerHTML===""&&this._showIframeError(e,n,t)}catch{}},1e4)}}_showIframeError(e,i,t){e&&(e.innerHTML=`
      <div class="video-error-state" style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap:15px; padding:20px; text-align:center;">
        <span style="font-size: 40px;">🚫</span>
        <h3 style="font-family:'Outfit'; font-size:18px; margin:0;">Error al cargar ${t||"el servidor"}</h3>
        <p style="color:var(--text-muted); font-size:13px; max-width:420px; margin:0;">El servidor de video restringió la carga dentro de la página (política X-Frame-Options) o no está disponible.</p>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:10px;">
          <button onclick="window.open('${i}', '_blank')" style="background:var(--accent, #ff3366); color:white; border:none; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Outfit';">
            🔗 Abrir en nueva pestaña
          </button>
          <button onclick="location.reload()" style="background:#222; color:white; border:1px solid #444; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; font-family:'Outfit';">
            🔄 Reintentar
          </button>
        </div>
      </div>
    `)}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),i=document.getElementById("video-container");e.forEach((n,a)=>{n.addEventListener("click",o=>{var r;e.forEach(p=>p.classList.remove("active")),n.classList.add("active");const s=((r=this.episodeData)==null?void 0:r.activeServers)||[],l=n.getAttribute("data-url"),c=s[a]||{url:l};i&&c.url&&(this._renderActiveServerPlayer(i,c),i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500))})}),document.querySelectorAll(".lang-pill-v5").forEach(n=>{n.addEventListener("click",a=>{const o=n.getAttribute("data-lang"),s=`/watch/${this.animeId}/${this.episodeNum}/${o}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,l=U();l?l.navigate(s):window.location.href=s})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),i=document.getElementById("btn-more-synopsis");i&&e&&i.addEventListener("click",()=>{const t=e.classList.toggle("expanded");i.textContent=t?"... ver menos":"... ver más"})}_startCountdownTimer(e,i){let t=e-i;const n=setInterval(()=>{const a=document.getElementById("countdown-timer");if(!a){clearInterval(n);return}if(t-=1e3,t<=0){a.textContent="¡Disponible ya en Emisión!",clearInterval(n);return}const o=Math.floor(t/864e5),s=Math.floor(t%864e5/36e5),l=Math.floor(t%36e5/6e4),c=Math.floor(t%6e4/1e3);let r="";o>0&&(r+=`${o}d `),(s>0||o>0)&&(r+=`${s}h `),r+=`${l}m ${c}s`,a.textContent=r},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var a,o;const e=document.getElementById("related-grid"),i=document.getElementById("sidebar-ep-list"),[t,n]=await Promise.all([R.getAnimeRecommendations(this.animeId).catch(()=>null),R.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(t&&t.data&&t.data.length>0){const s=t.data.slice(0,6);e.innerHTML=s.map(l=>{var c,r;return`
          <a href="/anime/${l.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(r=(c=l.entry.images)==null?void 0:c.jpg)==null?void 0:r.image_url}" class="related-img-v5" alt="${l.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${l.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const s=this.localInfo.episodes,l=((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||"",c=this.anime.title,r=()=>{let E=[...s];if(this.sortDesc&&E.reverse(),this.searchQuery.trim()!==""&&(E=E.filter(h=>String(h.number).includes(this.searchQuery)||h.title&&h.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),E.length===0){i.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}i.innerHTML=E.map(h=>{let b=`Episodio ${h.number}`,m=l;const v=n[h.number-1];if(v&&(v.title&&(b=v.title.replace(/^Episode \d+\s*-?\s*/i,"")),v.thumbnail&&(m=v.thumbnail)),h.number===this.episodeNum){const _=document.getElementById("active-episode-title");_&&(_.textContent=`${this.anime.title} — ${b}`)}const y=h.number===this.episodeNum,x=this.watchedEpisodes.has(h.number),f=`/watch/${this.animeId}/${h.number}/${this.lang}?title=${encodeURIComponent(c)}`,d=x?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",I=x?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${f}" data-link class="ep-item-horizontal-v5 ${y?"active":""} ${x?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${m}" alt="Episodio ${h.number}" loading="lazy">
                ${d}
                ${I}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${h.number}</span>
                <span class="ep-title-v5">${b}</span>
              </div>
            </a>
          `}).join("");const u=document.getElementById("btn-watched-all");if(u&&this.localInfo&&this.localInfo.episodes){const b=this.localInfo.episodes.map(m=>m.number).every(m=>this.watchedEpisodes.has(m));u.classList.toggle("active",b),u.title=b?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=r,r();const p=document.getElementById("ep-search-input");p&&p.addEventListener("input",E=>{this.searchQuery=E.target.value,r()});const L=document.getElementById("btn-sort-ep");L&&L.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,L.classList.toggle("active",this.sortDesc),r()})}else i&&(i.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),i=document.getElementById("watched-status-text"),t=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var a,o;const n=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),n){const s=await A.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();s&&await A.history.delete(s.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),i&&(i.textContent="Marcar Visto"),await T.triggerSync()}else{const s=this.anime?{animeTitle:this.anime.title,animeCover:((o=(a=this.anime.images)==null?void 0:a.jpg)==null?void 0:o.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await T.addToHistory(String(this.animeId),this.episodeNum,120,120,s),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),i&&(i.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),t&&t.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const a=this.localInfo.episodes.map(s=>s.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),a.every(s=>this.watchedEpisodes.has(s)))await A.transaction("rw",A.history,async()=>{for(const s of a){const l=await A.history.where({animeId:String(this.animeId),episodeId:s}).first();l&&await A.history.delete(l.id)}}),a.forEach(s=>this.watchedEpisodes.delete(s)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),i&&(i.textContent="Visto")):(e&&e.classList.remove("active"),i&&(i.textContent="Marcar Visto"));else{const s=Date.now();await A.transaction("rw",A.history,async()=>{for(const l of a)await A.history.where({animeId:String(this.animeId),episodeId:l}).first()||await A.history.add({animeId:String(this.animeId),episodeId:l,progress:120,duration:120,timestamp:s,updatedAt:s})}),a.forEach(l=>this.watchedEpisodes.add(l)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),i&&(i.textContent="Visto")):(e&&e.classList.remove("active"),i&&(i.textContent="Marcar Visto"))}await T.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const H=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"}));export{S as _,U as g,F as u};
