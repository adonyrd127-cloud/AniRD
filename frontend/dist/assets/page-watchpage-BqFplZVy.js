const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-BCn5ETVD.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-DNTSjB4k.js","assets/page-historypage-DsIYsC47.js","assets/page-favoritespage-BzAGC13l.js","assets/page-searchpage-C6OUA8uT.js","assets/page-categorypage-CgkAU70x.js","assets/page-calendarpage-CV-i961P.js","assets/page-authpage-DHNJMimV.js","assets/page-profilepage-C0bJhPHg.js"])))=>i.map(i=>d[i]);
import{a as _,d as C,b as I}from"./page-homepage-BCn5ETVD.js";import{c as R}from"./vendor-DIPEJTOH.js";const P="modulepreload",k=function(y){return"/"+y},$={},x=function(e,t,a){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const n=document.querySelector("meta[property=csp-nonce]"),s=(n==null?void 0:n.nonce)||(n==null?void 0:n.getAttribute("nonce"));i=Promise.allSettled(t.map(l=>{if(l=k(l),l in $)return;$[l]=!0;const r=l.endsWith(".css"),m=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${m}`))return;const u=document.createElement("link");if(u.rel=r?"stylesheet":P,r||(u.as="script"),u.crossOrigin="",u.href=l,s&&u.setAttribute("nonce",s),document.head.appendChild(u),r)return new Promise((E,b)=>{u.addEventListener("load",E),u.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${l}`)))})}))}function o(n){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=n,window.dispatchEvent(s),!s.defaultPrevented)throw n}return i.then(n=>{for(const s of n||[])s.status==="rejected"&&o(s.reason);return e().catch(o)})},M=R(y=>({theme:"dark",isDataSaver:!1,setTheme:e=>y({theme:e}),toggleDataSaver:()=>y(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>y({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>y({isSearchOpen:e})})),T={"/":()=>x(()=>import("./page-homepage-BCn5ETVD.js").then(y=>y.H),__vite__mapDeps([0,1])),"/anime":()=>x(()=>import("./page-animedetailpage-DNTSjB4k.js"),__vite__mapDeps([2,0,1])),"/watch":()=>x(()=>Promise.resolve().then(()=>W),void 0),"/history":()=>x(()=>import("./page-historypage-DsIYsC47.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>x(()=>import("./page-favoritespage-BzAGC13l.js"),__vite__mapDeps([4,0,1])),"/search":()=>x(()=>import("./page-searchpage-C6OUA8uT.js"),__vite__mapDeps([5,0,1])),"/category":()=>x(()=>import("./page-categorypage-CgkAU70x.js"),__vite__mapDeps([6,0,1])),"/calendar":()=>x(()=>import("./page-calendarpage-CV-i961P.js"),__vite__mapDeps([7,0,1])),"/my-anird":()=>x(()=>import("./page-historypage-DsIYsC47.js"),__vite__mapDeps([3,0,1])),"/auth":()=>x(()=>import("./page-authpage-DHNJMimV.js"),__vite__mapDeps([8,0,1])),"/profile":()=>x(()=>import("./page-profilepage-C0bJhPHg.js").then(y=>y.P),__vite__mapDeps([9,0,1]))};class B{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let a="/",i={};const o={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))a="/anime",i.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){a="/watch";const r=t.split("/");i.id=r[2],i.ep=r[3],i.lang=r[4]||"sub",document.title=`Ep. ${i.ep} — AniRD`}else t.startsWith("/category/")?(a="/category",i.name=t.split("/")[2],document.title=`${o[i.name]||"Explorar"} — AniRD`):t==="/search"?(a="/search",i.q=e.searchParams.get("q"),document.title=`Buscar "${i.q||""}" — AniRD`):t==="/profile"?(a="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(a="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(a="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(a=T[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(a="/favorites",document.title="Favoritos — AniRD"):(T[t]&&(a=t),document.title="AniRD — Tu plataforma de anime");const n=[];for(let r=0;r<document.body.classList.length;r++){const m=document.body.classList[r];m&&m.startsWith("route-")&&n.push(m)}n.forEach(r=>document.body.classList.remove(r));const s=`route-${a.replace("/","")||"home"}`;document.body.classList.add(s),M.getState().setCurrentRoute(t);const l=T[a]||T["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const m=(await l()).default,u=new m(i);this.root.innerHTML="",this.root.appendChild(await u.render()),u.afterRender&&u.afterRender(),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(r){console.error("Error loading route",r),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let A=null;const N=y=>(!A&&y&&(A=new B(y)),A);class O{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var l,r,m,u,E,b;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const h=await _.getAnimeInfo(this.animeId);h&&h.data&&(this.anime=h.data);const p=new URLSearchParams(window.location.search).get("title"),v=[];if(this.anime&&(v.push(this.anime.title),this.anime.title_english&&v.push(this.anime.title_english),this.anime.title_japanese&&v.push(this.anime.title_japanese),this.anime.title_synonyms&&v.push(...this.anime.title_synonyms)),p&&!v.includes(p)&&v.push(p),v.length>0){let d=null;for(const f of v){const w=await _.searchLocal(f);if(w&&w.success&&w.data&&w.data.results&&w.data.results.length>0){d=w;break}}if(d){const f=d.data.results.find(S=>v.some(L=>S.title.toLowerCase().includes(L.toLowerCase())))||d.data.results[0];this.anime||(this.anime={title:f.title,images:{jpg:{large_image_url:f.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const w=await _.getAnimeInfo(f.url);if(w.success){this.localInfo=w.data;const S=this.localInfo.episodes.find(L=>L.number===this.episodeNum);if(S&&S.url){const L=await _.getEpisode(S.url);if(L.success&&L.data){this.episodeData=L.data;const D=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=D}}}}}this.isFav=await C.isFavorite(this.animeId);const g=await I.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(g.map(d=>Number(d.episodeId)))}catch(h){console.error("Error crítico al renderizar WatchPage Premium:",h)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),a=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,i=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,o=((r=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:r.large_image_url)||"",n=((u=(m=this.anime.images)==null?void 0:m.jpg)==null?void 0:u.large_image_url)||o;let s="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const h=this.anime.broadcast,c={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(c[h.day]!==void 0){const[p,v]=h.time.split(":").map(Number),g=new Date(new Date().toLocaleString("en-US",{timeZone:h.timezone||"Asia/Tokyo"}));let d=new Date(g);d.setHours(p,v,0,0);let f=c[h.day]-g.getDay();(f<0||f===0&&d<g)&&(f+=7),d.setDate(d.getDate()+f),d-g>0&&(s=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(d,g))}}return e.innerHTML=`
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
              <a href="${a}" target="_blank" class="control-btn-v5 social-link-v5" title="Ver en AniList">
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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((h,c)=>`
                      <button class="server-pill-v5 ${c===0?"active":""}" data-url="${h.url}">
                        🚀 ${h.server}
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
                <div class="field-item-v5"><strong>Estudio:</strong> ${((E=this.anime.studios)==null?void 0:E.map(h=>h.name).join(", "))||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Duración:</strong> ${this.anime.duration||"24 min por ep."}</div>
                <div class="field-item-v5"><strong>Episodios:</strong> ${this.anime.episodes||"Desconocido"}</div>
                <div class="field-item-v5"><strong>Géneros:</strong> ${((b=this.anime.genres)==null?void 0:b.map(h=>h.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,e}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),a=document.getElementById("btn-watched-status"),i=document.getElementById("watched-status-text");t?(a&&a.classList.add("active"),i&&(i.textContent="Visto")):(a&&a.classList.remove("active"),i&&(i.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var n,s;if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const l=this.anime?{animeTitle:this.anime.title,animeCover:((s=(n=this.anime.images)==null?void 0:n.jpg)==null?void 0:s.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await C.addToHistory(String(this.animeId),this.episodeNum,120,120,l),this.watchedEpisodes.add(this.episodeNum),a&&a.classList.add("active"),i&&(i.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}const e=document.getElementById("btn-close-mobile-fs");e&&e.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const a=document.getElementById("video-container");if(a){a.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const i=document.getElementById("btn-fullscreen-watch"),o=i?i.querySelector("span"):null;o&&(o.textContent="Pantalla Completa")}}),this._globalKeyHandler=t=>{if(!document.getElementById("watch-layout")){document.body.classList.remove("tv-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active"),window.removeEventListener("keydown",this._globalKeyHandler,{capture:!0});return}if(t.key==="Escape"||t.key==="Backspace"){const i=document.getElementById("video-container");if(i&&i.classList.contains("mobile-fullscreen-active")){i.classList.remove("mobile-fullscreen-active"),document.body.classList.remove("mobile-fullscreen-active");const o=document.getElementById("btn-fullscreen-watch"),n=o?o.querySelector("span"):null;n&&(n.textContent="Pantalla Completa"),t.preventDefault(),t.stopPropagation()}}},window.addEventListener("keydown",this._globalKeyHandler,{capture:!0})}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const a=e.startsWith("//"),i=a?"https:"+e:e,o=new URL(i);o.searchParams.set("autoplay","1"),o.searchParams.set("auto","1");let n=o.toString();return a&&(n=n.replace(/^https:/,"")),n}catch{const i=e.includes("?")?"&":"?";return`${e}${i}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),a=document.getElementById("main-column"),i=document.getElementById("dim-overlay"),o=document.getElementById("btn-theater"),n=document.getElementById("btn-lights"),s=document.getElementById("btn-favorite"),l=document.getElementById("lights-text"),r=document.getElementById("theater-text"),m=document.getElementById("fav-text"),u=c=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),t.parentElement!==e&&e.insertBefore(t,e.firstChild);return}c?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),r&&(r.textContent="Modo Normal")):(e.classList.remove("theater-active"),a.insertBefore(t,a.firstChild),r&&(r.textContent="Modo Cine"))};u(this.isTheater),o&&o.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),o.classList.toggle("active",this.isTheater),u(this.isTheater)});const E=c=>{const p=c!==void 0?c:!i.classList.contains("active");i.classList.toggle("active",p),t.classList.toggle("dimmed-active",p),n.classList.toggle("active",p),l&&(l.textContent=p?"Encender Luces":"Apagar Luces")};n&&n.addEventListener("click",()=>E()),i&&i.addEventListener("click",()=>E(!1)),s&&s.addEventListener("click",async()=>{if(!this.anime)return;const c=await C.toggleFavorite(this.anime);this.isFav=c,s.classList.toggle("active",c),m&&(m.textContent=c?"Quitar Favorito":"Favorito")});const b=document.getElementById("btn-back-watch");b&&b.addEventListener("click",c=>{c.preventDefault(),window.history.back()});const h=document.getElementById("btn-fullscreen-watch");h&&h.addEventListener("click",c=>{c.preventDefault();const p=document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true",v=window.innerWidth<=900||/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),g=document.getElementById("video-container");if(g)if(p){document.body.classList.toggle("tv-fullscreen-active");const d=document.body.classList.contains("tv-fullscreen-active");g.classList.toggle("tv-fullscreen-active",d);const f=h.querySelector("span");f&&(f.textContent=d?"Salir Pantalla":"Pantalla Completa")}else if(v){document.body.classList.toggle("mobile-fullscreen-active");const d=document.body.classList.contains("mobile-fullscreen-active");g.classList.toggle("mobile-fullscreen-active",d);const f=h.querySelector("span");f&&(f.textContent=d?"Salir Pantalla":"Pantalla Completa")}else{const d=document.querySelector(".video-wrapper-v5 iframe");d&&(d.requestFullscreen?d.requestFullscreen():d.webkitRequestFullscreen?d.webkitRequestFullscreen():d.mozRequestFullScreen?d.mozRequestFullScreen():d.msRequestFullscreen&&d.msRequestFullscreen())}})}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.querySelector(".video-wrapper-v5 iframe");e.forEach(i=>{i.addEventListener("click",o=>{e.forEach(s=>s.classList.remove("active")),i.classList.add("active");const n=i.getAttribute("data-url");if(t&&n){t.src=this._getAutoplayUrl(n);const s=document.getElementById("video-container");s.style.opacity="0.5",setTimeout(()=>s.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(i=>{i.addEventListener("click",o=>{const n=i.getAttribute("data-lang"),s=`/watch/${this.animeId}/${this.episodeNum}/${n}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,l=N();l?l.navigate(s):window.location.href=s})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const a=e.classList.toggle("expanded");t.textContent=a?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let a=e-t;const i=setInterval(()=>{const o=document.getElementById("countdown-timer");if(!o){clearInterval(i);return}if(a-=1e3,a<=0){o.textContent="¡Disponible ya en Emisión!",clearInterval(i);return}const n=Math.floor(a/864e5),s=Math.floor(a%864e5/36e5),l=Math.floor(a%36e5/6e4),r=Math.floor(a%6e4/1e3);let m="";n>0&&(m+=`${n}d `),(s>0||n>0)&&(m+=`${s}h `),m+=`${l}m ${r}s`,o.textContent=m},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var o,n;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[a,i]=await Promise.all([_.getAnimeRecommendations(this.animeId).catch(()=>null),_.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(a&&a.data&&a.data.length>0){const s=a.data.slice(0,6);e.innerHTML=s.map(l=>{var r,m;return`
          <a href="/anime/${l.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(m=(r=l.entry.images)==null?void 0:r.jpg)==null?void 0:m.image_url}" class="related-img-v5" alt="${l.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${l.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const s=this.localInfo.episodes,l=((n=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:n.large_image_url)||"",r=this.anime.title,m=()=>{let b=[...s];if(this.sortDesc&&b.reverse(),this.searchQuery.trim()!==""&&(b=b.filter(c=>String(c.number).includes(this.searchQuery)||c.title&&c.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),b.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=b.map(c=>{let p=`Episodio ${c.number}`,v=l;const g=i[c.number-1];if(g&&(g.title&&(p=g.title.replace(/^Episode \d+\s*-?\s*/i,"")),g.thumbnail&&(v=g.thumbnail)),c.number===this.episodeNum){const D=document.getElementById("active-episode-title");D&&(D.textContent=`${this.anime.title} — ${p}`)}const d=c.number===this.episodeNum,f=this.watchedEpisodes.has(c.number),w=`/watch/${this.animeId}/${c.number}/${this.lang}?title=${encodeURIComponent(r)}`,S=f?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",L=f?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${w}" data-link class="ep-item-horizontal-v5 ${d?"active":""} ${f?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${v}" alt="Episodio ${c.number}" loading="lazy">
                ${S}
                ${L}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${c.number}</span>
                <span class="ep-title-v5">${p}</span>
              </div>
            </a>
          `}).join("");const h=document.getElementById("btn-watched-all");if(h&&this.localInfo&&this.localInfo.episodes){const p=this.localInfo.episodes.map(v=>v.number).every(v=>this.watchedEpisodes.has(v));h.classList.toggle("active",p),h.title=p?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=m,m();const u=document.getElementById("ep-search-input");u&&u.addEventListener("input",b=>{this.searchQuery=b.target.value,m()});const E=document.getElementById("btn-sort-ep");E&&E.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,E.classList.toggle("active",this.sortDesc),m()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),a=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var o,n;const i=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),i){const s=await I.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();s&&await I.history.delete(s.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await C.triggerSync()}else{const s=this.anime?{animeTitle:this.anime.title,animeCover:((n=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:n.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await C.addToHistory(String(this.animeId),this.episodeNum,120,120,s),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),a&&a.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const o=this.localInfo.episodes.map(s=>s.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),o.every(s=>this.watchedEpisodes.has(s)))await I.transaction("rw",I.history,async()=>{for(const s of o){const l=await I.history.where({animeId:String(this.animeId),episodeId:s}).first();l&&await I.history.delete(l.id)}}),o.forEach(s=>this.watchedEpisodes.delete(s)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const s=Date.now();await I.transaction("rw",I.history,async()=>{for(const l of o)await I.history.where({animeId:String(this.animeId),episodeId:l}).first()||await I.history.add({animeId:String(this.animeId),episodeId:l,progress:120,duration:120,timestamp:s,updatedAt:s})}),o.forEach(l=>this.watchedEpisodes.add(l)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await C.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const W=Object.freeze(Object.defineProperty({__proto__:null,default:O},Symbol.toStringTag,{value:"Module"}));export{x as _,N as g,M as u};
