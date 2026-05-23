const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-BCn5ETVD.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-DNTSjB4k.js","assets/page-historypage-DsIYsC47.js","assets/page-favoritespage-BQ4u-G8h.js","assets/page-searchpage-C6OUA8uT.js","assets/page-categorypage-CgkAU70x.js","assets/page-calendarpage-CV-i961P.js","assets/page-authpage-DHNJMimV.js","assets/page-profilepage-CAwAglsf.js"])))=>i.map(i=>d[i]);
import{a as S,d as T,b as I}from"./page-homepage-BCn5ETVD.js";import{c as R}from"./vendor-DIPEJTOH.js";const P="modulepreload",k=function(g){return"/"+g},$={},x=function(e,t,s){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(t.map(r=>{if(r=k(r),r in $)return;$[r]=!0;const l=r.endsWith(".css"),m=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${r}"]${m}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":P,l||(p.as="script"),p.crossOrigin="",p.href=r,i&&p.setAttribute("nonce",i),document.head.appendChild(p),l)return new Promise((E,f)=>{p.addEventListener("load",E),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${r}`)))})}))}function o(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return n.then(a=>{for(const i of a||[])i.status==="rejected"&&o(i.reason);return e().catch(o)})},M=R(g=>({theme:"dark",isDataSaver:!1,setTheme:e=>g({theme:e}),toggleDataSaver:()=>g(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>g({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>g({isSearchOpen:e})})),D={"/":()=>x(()=>import("./page-homepage-BCn5ETVD.js").then(g=>g.H),__vite__mapDeps([0,1])),"/anime":()=>x(()=>import("./page-animedetailpage-DNTSjB4k.js"),__vite__mapDeps([2,0,1])),"/watch":()=>x(()=>Promise.resolve().then(()=>V),void 0),"/history":()=>x(()=>import("./page-historypage-DsIYsC47.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>x(()=>import("./page-favoritespage-BQ4u-G8h.js"),__vite__mapDeps([4,0,1])),"/search":()=>x(()=>import("./page-searchpage-C6OUA8uT.js"),__vite__mapDeps([5,0,1])),"/category":()=>x(()=>import("./page-categorypage-CgkAU70x.js"),__vite__mapDeps([6,0,1])),"/calendar":()=>x(()=>import("./page-calendarpage-CV-i961P.js"),__vite__mapDeps([7,0,1])),"/my-anird":()=>x(()=>import("./page-historypage-DsIYsC47.js"),__vite__mapDeps([3,0,1])),"/auth":()=>x(()=>import("./page-authpage-DHNJMimV.js"),__vite__mapDeps([8,0,1])),"/profile":()=>x(()=>import("./page-profilepage-CAwAglsf.js").then(g=>g.P),__vite__mapDeps([9,0,1]))};class N{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let s="/",n={};const o={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))s="/anime",n.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){s="/watch";const l=t.split("/");n.id=l[2],n.ep=l[3],n.lang=l[4]||"sub",document.title=`Ep. ${n.ep} — AniRD`}else t.startsWith("/category/")?(s="/category",n.name=t.split("/")[2],document.title=`${o[n.name]||"Explorar"} — AniRD`):t==="/search"?(s="/search",n.q=e.searchParams.get("q"),document.title=`Buscar "${n.q||""}" — AniRD`):t==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(s=D[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):(D[t]&&(s=t),document.title="AniRD — Tu plataforma de anime");const a=[];for(let l=0;l<document.body.classList.length;l++){const m=document.body.classList[l];m&&m.startsWith("route-")&&a.push(m)}a.forEach(l=>document.body.classList.remove(l));const i=`route-${s.replace("/","")||"home"}`;document.body.classList.add(i),M.getState().setCurrentRoute(t);const r=D[s]||D["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const m=(await r()).default,p=new m(n);this.root.innerHTML="",this.root.appendChild(await p.render()),p.afterRender&&p.afterRender(),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(l){console.error("Error loading route",l),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let C=null;const B=g=>(!C&&g&&(C=new N(g)),C);class W{constructor(e){this.params=e,this.animeId=parseInt(e.id),this.episodeNum=parseInt(e.ep)||1,this.lang=e.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var r,l,m,p,E,f;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const h=await S.getAnimeInfo(this.animeId);h&&h.data&&(this.anime=h.data);const u=new URLSearchParams(window.location.search).get("title"),d=[];if(this.anime&&(d.push(this.anime.title),this.anime.title_english&&d.push(this.anime.title_english),this.anime.title_japanese&&d.push(this.anime.title_japanese),this.anime.title_synonyms&&d.push(...this.anime.title_synonyms)),u&&!d.includes(u)&&d.push(u),d.length>0){let v=null;for(const b of d){const w=await S.searchLocal(b);if(w&&w.success&&w.data&&w.data.results&&w.data.results.length>0){v=w;break}}if(v){const b=v.data.results.find(_=>d.some(L=>_.title.toLowerCase().includes(L.toLowerCase())))||v.data.results[0];this.anime||(this.anime={title:b.title,images:{jpg:{large_image_url:b.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const w=await S.getAnimeInfo(b.url);if(w.success){this.localInfo=w.data;const _=this.localInfo.episodes.find(L=>L.number===this.episodeNum);if(_&&_.url){const L=await S.getEpisode(_.url);if(L.success&&L.data){this.episodeData=L.data;const A=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=A}}}}}this.isFav=await T.isFavorite(this.animeId);const y=await I.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(y.map(v=>Number(v.episodeId)))}catch(h){console.error("Error crítico al renderizar WatchPage Premium:",h)}const e=document.createElement("div");if(e.className="page-enter",!this.anime)return e.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,e;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const t=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,n=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,o=((l=(r=this.anime.images)==null?void 0:r.jpg)==null?void 0:l.large_image_url)||"",a=((p=(m=this.anime.images)==null?void 0:m.jpg)==null?void 0:p.large_image_url)||o;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const h=this.anime.broadcast,c={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(c[h.day]!==void 0){const[u,d]=h.time.split(":").map(Number),y=new Date(new Date().toLocaleString("en-US",{timeZone:h.timezone||"Asia/Tokyo"}));let v=new Date(y);v.setHours(u,d,0,0);let b=c[h.day]-y.getDay();(b<0||b===0&&v<y)&&(b+=7),v.setDate(v.getDate()+b),v-y>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(v,y))}}return e.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${a}')"></div>
      
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
                <div class="field-item-v5"><strong>Géneros:</strong> ${((f=this.anime.genres)==null?void 0:f.map(h=>h.name).slice(0,3).join(", "))||"N/A"}</div>
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
    `,e}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const e=this.watchedEpisodes.has(this.episodeNum),t=document.getElementById("btn-watched-status"),s=document.getElementById("watched-status-text");e?(t&&t.classList.add("active"),s&&(s.textContent="Visto")):(t&&t.classList.remove("active"),s&&(s.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var o,a;if(!document.getElementById("watch-layout")){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const i=this.anime?{animeTitle:this.anime.title,animeCover:((a=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:a.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await T.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),t&&t.classList.add("active"),s&&(s.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}}_getAutoplayUrl(e){if(!e)return"";if(!(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"))return e;try{const s=e.startsWith("//"),n=s?"https:"+e:e,o=new URL(n);o.searchParams.set("autoplay","1"),o.searchParams.set("auto","1");let a=o.toString();return s&&(a=a.replace(/^https:/,"")),a}catch{const n=e.includes("?")?"&":"?";return`${e}${n}autoplay=1&auto=1`}}_initPlayerControls(){const e=document.getElementById("watch-layout"),t=document.getElementById("player-section"),s=document.getElementById("main-column"),n=document.getElementById("dim-overlay"),o=document.getElementById("btn-theater"),a=document.getElementById("btn-lights"),i=document.getElementById("btn-favorite"),r=document.getElementById("lights-text"),l=document.getElementById("theater-text"),m=document.getElementById("fav-text"),p=c=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){e.classList.remove("theater-active"),t.parentElement!==e&&e.insertBefore(t,e.firstChild);return}c?(e.classList.add("theater-active"),e.insertBefore(t,e.firstChild),l&&(l.textContent="Modo Normal")):(e.classList.remove("theater-active"),s.insertBefore(t,s.firstChild),l&&(l.textContent="Modo Cine"))};p(this.isTheater),o&&o.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),o.classList.toggle("active",this.isTheater),p(this.isTheater)});const E=c=>{const u=c!==void 0?c:!n.classList.contains("active");n.classList.toggle("active",u),t.classList.toggle("dimmed-active",u),a.classList.toggle("active",u),r&&(r.textContent=u?"Encender Luces":"Apagar Luces")};a&&a.addEventListener("click",()=>E()),n&&n.addEventListener("click",()=>E(!1)),i&&i.addEventListener("click",async()=>{if(!this.anime)return;const c=await T.toggleFavorite(this.anime);this.isFav=c,i.classList.toggle("active",c),m&&(m.textContent=c?"Quitar Favorito":"Favorito")});const f=document.getElementById("btn-back-watch");f&&f.addEventListener("click",c=>{c.preventDefault(),window.history.back()});const h=document.getElementById("btn-fullscreen-watch");h&&h.addEventListener("click",c=>{if(c.preventDefault(),document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){const d=document.getElementById("video-container");if(d){d.classList.toggle("tv-fullscreen-active");const y=d.classList.contains("tv-fullscreen-active"),v=h.querySelector("span");v&&(v.textContent=y?"Salir Pantalla":"Pantalla Completa")}}else{const d=document.querySelector(".video-wrapper-v5 iframe");d&&(d.requestFullscreen?d.requestFullscreen():d.webkitRequestFullscreen?d.webkitRequestFullscreen():d.mozRequestFullScreen?d.mozRequestFullScreen():d.msRequestFullscreen&&d.msRequestFullscreen())}})}_initServerPills(){const e=document.querySelectorAll(".server-pill-v5"),t=document.querySelector(".video-wrapper-v5 iframe");e.forEach(n=>{n.addEventListener("click",o=>{e.forEach(i=>i.classList.remove("active")),n.classList.add("active");const a=n.getAttribute("data-url");if(t&&a){t.src=this._getAutoplayUrl(a);const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(n=>{n.addEventListener("click",o=>{const a=n.getAttribute("data-lang"),i=`/watch/${this.animeId}/${this.episodeNum}/${a}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,r=B();r?r.navigate(i):window.location.href=i})})}_initSynopsisExpand(){const e=document.getElementById("synopsis-box"),t=document.getElementById("btn-more-synopsis");t&&e&&t.addEventListener("click",()=>{const s=e.classList.toggle("expanded");t.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(e,t){let s=e-t;const n=setInterval(()=>{const o=document.getElementById("countdown-timer");if(!o){clearInterval(n);return}if(s-=1e3,s<=0){o.textContent="¡Disponible ya en Emisión!",clearInterval(n);return}const a=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),r=Math.floor(s%36e5/6e4),l=Math.floor(s%6e4/1e3);let m="";a>0&&(m+=`${a}d `),(i>0||a>0)&&(m+=`${i}h `),m+=`${r}m ${l}s`,o.textContent=m},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var o,a;const e=document.getElementById("related-grid"),t=document.getElementById("sidebar-ep-list"),[s,n]=await Promise.all([S.getAnimeRecommendations(this.animeId).catch(()=>null),S.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(e)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);e.innerHTML=i.map(r=>{var l,m;return`
          <a href="/anime/${r.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(m=(l=r.entry.images)==null?void 0:l.jpg)==null?void 0:m.image_url}" class="related-img-v5" alt="${r.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${r.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else e.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,r=((a=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:a.large_image_url)||"",l=this.anime.title,m=()=>{let f=[...i];if(this.sortDesc&&f.reverse(),this.searchQuery.trim()!==""&&(f=f.filter(c=>String(c.number).includes(this.searchQuery)||c.title&&c.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),f.length===0){t.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}t.innerHTML=f.map(c=>{let u=`Episodio ${c.number}`,d=r;const y=n[c.number-1];if(y&&(y.title&&(u=y.title.replace(/^Episode \d+\s*-?\s*/i,"")),y.thumbnail&&(d=y.thumbnail)),c.number===this.episodeNum){const A=document.getElementById("active-episode-title");A&&(A.textContent=`${this.anime.title} — ${u}`)}const v=c.number===this.episodeNum,b=this.watchedEpisodes.has(c.number),w=`/watch/${this.animeId}/${c.number}/${this.lang}?title=${encodeURIComponent(l)}`,_=b?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",L=b?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${w}" data-link class="ep-item-horizontal-v5 ${v?"active":""} ${b?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${d}" alt="Episodio ${c.number}" loading="lazy">
                ${_}
                ${L}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${c.number}</span>
                <span class="ep-title-v5">${u}</span>
              </div>
            </a>
          `}).join("");const h=document.getElementById("btn-watched-all");if(h&&this.localInfo&&this.localInfo.episodes){const u=this.localInfo.episodes.map(d=>d.number).every(d=>this.watchedEpisodes.has(d));h.classList.toggle("active",u),h.title=u?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=m,m();const p=document.getElementById("ep-search-input");p&&p.addEventListener("input",f=>{this.searchQuery=f.target.value,m()});const E=document.getElementById("btn-sort-ep");E&&E.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,E.classList.toggle("active",this.sortDesc),m()})}else t&&(t.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const e=document.getElementById("btn-watched-status"),t=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");e&&e.addEventListener("click",async()=>{var o,a;const n=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),n){const i=await I.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await I.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),e.classList.remove("active"),t&&(t.textContent="Marcar Visto"),await T.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((a=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:a.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await T.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e.classList.add("active"),t&&(t.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const o=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),o.every(i=>this.watchedEpisodes.has(i)))await I.transaction("rw",I.history,async()=>{for(const i of o){const r=await I.history.where({animeId:String(this.animeId),episodeId:i}).first();r&&await I.history.delete(r.id)}}),o.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"));else{const i=Date.now();await I.transaction("rw",I.history,async()=>{for(const r of o)await I.history.where({animeId:String(this.animeId),episodeId:r}).first()||await I.history.add({animeId:String(this.animeId),episodeId:r,progress:120,duration:120,timestamp:i,updatedAt:i})}),o.forEach(r=>this.watchedEpisodes.add(r)),this.watchedEpisodes.has(this.episodeNum)?(e&&e.classList.add("active"),t&&(t.textContent="Visto")):(e&&e.classList.remove("active"),t&&(t.textContent="Marcar Visto"))}await T.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const V=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));export{x as _,B as g,M as u};
