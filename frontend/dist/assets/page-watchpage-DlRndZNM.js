const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-BCn5ETVD.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-CyKWB72G.js","assets/page-historypage-DsIYsC47.js","assets/page-favoritespage-DVHftMwI.js","assets/page-searchpage-C6OUA8uT.js","assets/page-categorypage-CgkAU70x.js","assets/page-calendarpage-CV-i961P.js","assets/page-authpage-DHNJMimV.js","assets/page-profilepage-CPSS_yHX.js"])))=>i.map(i=>d[i]);
import{a as S,d as D,b as I}from"./page-homepage-BCn5ETVD.js";import{c as R}from"./vendor-DIPEJTOH.js";const k="modulepreload",P=function(v){return"/"+v},$={},x=function(t,e,s){let n=Promise.resolve();if(e&&e.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(e.map(o=>{if(o=P(o),o in $)return;$[o]=!0;const r=o.endsWith(".css"),m=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${o}"]${m}`))return;const p=document.createElement("link");if(p.rel=r?"stylesheet":k,r||(p.as="script"),p.crossOrigin="",p.href=o,i&&p.setAttribute("nonce",i),document.head.appendChild(p),r)return new Promise((E,f)=>{p.addEventListener("load",E),p.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${o}`)))})}))}function l(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return n.then(a=>{for(const i of a||[])i.status==="rejected"&&l(i.reason);return t().catch(l)})},N=R(v=>({theme:"dark",isDataSaver:!1,setTheme:t=>v({theme:t}),toggleDataSaver:()=>v(t=>({isDataSaver:!t.isDataSaver})),currentRoute:"/",setCurrentRoute:t=>v({currentRoute:t}),isSearchOpen:!1,setSearchOpen:t=>v({isSearchOpen:t})})),T={"/":()=>x(()=>import("./page-homepage-BCn5ETVD.js").then(v=>v.H),__vite__mapDeps([0,1])),"/anime":()=>x(()=>import("./page-animedetailpage-CyKWB72G.js"),__vite__mapDeps([2,0,1])),"/watch":()=>x(()=>Promise.resolve().then(()=>O),void 0),"/history":()=>x(()=>import("./page-historypage-DsIYsC47.js"),__vite__mapDeps([3,0,1])),"/favorites":()=>x(()=>import("./page-favoritespage-DVHftMwI.js"),__vite__mapDeps([4,0,1])),"/search":()=>x(()=>import("./page-searchpage-C6OUA8uT.js"),__vite__mapDeps([5,0,1])),"/category":()=>x(()=>import("./page-categorypage-CgkAU70x.js"),__vite__mapDeps([6,0,1])),"/calendar":()=>x(()=>import("./page-calendarpage-CV-i961P.js"),__vite__mapDeps([7,0,1])),"/my-anird":()=>x(()=>import("./page-historypage-DsIYsC47.js"),__vite__mapDeps([3,0,1])),"/auth":()=>x(()=>import("./page-authpage-DHNJMimV.js"),__vite__mapDeps([8,0,1])),"/profile":()=>x(()=>import("./page-profilepage-CPSS_yHX.js").then(v=>v.P),__vite__mapDeps([9,0,1]))};class M{constructor(t){this.root=t,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",t=>{const e=t.target.closest("a[data-link]");e&&(t.preventDefault(),this.navigate(e.getAttribute("href")))}),this.handleRoute()}navigate(t){window.history.pushState(null,null,t),this.handleRoute()}async handleRoute(){const t=new URL(window.location.href),e=t.pathname;let s="/",n={};const l={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(e.startsWith("/anime/"))s="/anime",n.id=e.split("/")[2],document.title="Cargando... — AniRD";else if(e.startsWith("/watch/")){s="/watch";const r=e.split("/");n.id=r[2],n.ep=r[3],n.lang=r[4]||"sub",document.title=`Ep. ${n.ep} — AniRD`}else e.startsWith("/category/")?(s="/category",n.name=e.split("/")[2],document.title=`${l[n.name]||"Explorar"} — AniRD`):e==="/search"?(s="/search",n.q=t.searchParams.get("q"),document.title=`Buscar "${n.q||""}" — AniRD`):e==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):e==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):e==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):e==="/history"||e==="/my-anird"?(s=T[e]?e:"/",document.title="Mi Historial — AniRD"):e==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):(T[e]&&(s=e),document.title="AniRD — Tu plataforma de anime");const a=[];for(let r=0;r<document.body.classList.length;r++){const m=document.body.classList[r];m&&m.startsWith("route-")&&a.push(m)}a.forEach(r=>document.body.classList.remove(r));const i=`route-${s.replace("/","")||"home"}`;document.body.classList.add(i),N.getState().setCurrentRoute(e);const o=T[s]||T["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const m=(await o()).default,p=new m(n);this.root.innerHTML="",this.root.appendChild(await p.render()),p.afterRender&&p.afterRender(),window.scrollTo(0,0),document.documentElement.scrollTop=0,document.body.scrollTop=0}catch(r){console.error("Error loading route",r),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let C=null;const B=v=>(!C&&v&&(C=new M(v)),C);class W{constructor(t){this.params=t,this.animeId=parseInt(t.id),this.episodeNum=parseInt(t.ep)||1,this.lang=t.lang||"sub",this.anime=null,this.localInfo=null,this.episodeData=null,this.relatedAnimes=[],this.anilistEpisodes=[],this.isFav=!1,this.watchedEpisodes=new Set,this.isTheater=localStorage.getItem("watch-theater-mode")==="true",this.sortDesc=!1,this.searchQuery=""}async render(){var o,r,m,p,E,f;try{console.log("Iniciando carga de WatchPage Premium para ID:",this.animeId,"Episodio:",this.episodeNum);const h=await S.getAnimeInfo(this.animeId);h&&h.data&&(this.anime=h.data);const c=new URLSearchParams(window.location.search).get("title"),u=[];if(this.anime&&(u.push(this.anime.title),this.anime.title_english&&u.push(this.anime.title_english),this.anime.title_japanese&&u.push(this.anime.title_japanese),this.anime.title_synonyms&&u.push(...this.anime.title_synonyms)),c&&!u.includes(c)&&u.push(c),u.length>0){let g=null;for(const y of u){const w=await S.searchLocal(y);if(w&&w.success&&w.data&&w.data.results&&w.data.results.length>0){g=w;break}}if(g){const y=g.data.results.find(_=>u.some(L=>_.title.toLowerCase().includes(L.toLowerCase())))||g.data.results[0];this.anime||(this.anime={title:y.title,images:{jpg:{large_image_url:y.thumbnail}},genres:[],synopsis:"Cargado desde el servidor local de AniRD."});const w=await S.getAnimeInfo(y.url);if(w.success){this.localInfo=w.data;const _=this.localInfo.episodes.find(L=>L.number===this.episodeNum);if(_&&_.url){const L=await S.getEpisode(_.url);if(L.success&&L.data){this.episodeData=L.data;const A=this.episodeData.servers[this.lang]||this.episodeData.servers.sub||[];this.episodeData.activeServers=A}}}}}this.isFav=await D.isFavorite(this.animeId);const b=await I.history.where({animeId:String(this.animeId)}).toArray();this.watchedEpisodes=new Set(b.map(g=>Number(g.episodeId)))}catch(h){console.error("Error crítico al renderizar WatchPage Premium:",h)}const t=document.createElement("div");if(t.className="page-enter",!this.anime)return t.innerHTML=`
        <div style="padding:150px 20px; text-align:center">
          <h2 style="font-family:'Outfit'; font-size:2rem; margin-bottom:20px">Contenido no disponible</h2>
          <p style="color:var(--text-muted); margin-bottom:30px">No pudimos conectar con los servidores de video de AniRD para esta serie.</p>
          <a href="/" data-link class="btn-v4-primary" style="display:inline-flex">Volver al Inicio</a>
        </div>
      `,t;document.title=`${this.anime.title} — Episodio ${this.episodeNum} (${this.lang.toUpperCase()}) — AniRD`;const e=this.watchedEpisodes.has(this.episodeNum),s=`https://anilist.co/search/anime?search=${encodeURIComponent(this.anime.title)}`,n=`https://myanimelist.net/anime/${this.anime.mal_id||""}`,l=((r=(o=this.anime.images)==null?void 0:o.jpg)==null?void 0:r.large_image_url)||"",a=((p=(m=this.anime.images)==null?void 0:m.jpg)==null?void 0:p.large_image_url)||l;let i="";if(this.anime.status==="Currently Airing"&&this.anime.broadcast&&this.anime.broadcast.time){const h=this.anime.broadcast,d={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(d[h.day]!==void 0){const[c,u]=h.time.split(":").map(Number),b=new Date(new Date().toLocaleString("en-US",{timeZone:h.timezone||"Asia/Tokyo"}));let g=new Date(b);g.setHours(c,u,0,0);let y=d[h.day]-b.getDay();(y<0||y===0&&g<b)&&(y+=7),g.setDate(g.getDate()+y),g-b>0&&(i=`
            <div class="countdown-banner-v5" id="live-countdown">
              <span>⏱️</span>
              <span>El próximo episodio se emitirá en aproximadamente <strong id="countdown-timer">calculando...</strong></span>
            </div>
          `,this._startCountdownTimer(g,b))}}return t.innerHTML=`
      <!-- Resplandor dinámico de fondo (Modo Ambiente) -->
      <div class="ambient-glow" id="ambient-glow" style="background-image: url('${a}')"></div>
      
      <!-- Capa de Luces Apagadas -->
      <div class="dim-overlay" id="dim-overlay"></div>

      <div class="watch-layout-v5 ${this.isTheater?"theater-active":""}" id="watch-layout">
        
        <!-- SECCIÓN IZQUIERDA: REPRODUCTOR Y CONTROLES -->
        <div class="player-section-v5" id="player-section">
          
          <!-- Reproductor de Video -->
          <div class="video-wrapper-v5" id="video-container" tabindex="0">
            ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?`<iframe src="${this.episodeData.activeServers[0].url}" allowfullscreen allow="autoplay; encrypted-media"></iframe>`:`<div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#111; gap: 15px; padding: 20px; text-align: center;">
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
              <button class="control-btn-v5 ${e?"active":""}" id="btn-watched-status">
                👁️ <span id="watched-status-text">${e?"Visto":"Marcar Visto"}</span>
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
                ${this.episodeData&&this.episodeData.activeServers&&this.episodeData.activeServers.length>0?this.episodeData.activeServers.map((h,d)=>`
                      <button class="server-pill-v5 ${d===0?"active":""}" data-url="${h.url}">
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
    `,t}async afterRender(){if(this._initPlayerControls(),this._initServerPills(),this._initSynopsisExpand(),this._initWatchedToggleControls(),this._loadEnrichedEpisodesAndRecommendations(),window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),this.anime){const t=this.watchedEpisodes.has(this.episodeNum),e=document.getElementById("btn-watched-status"),s=document.getElementById("watched-status-text");t?(e&&e.classList.add("active"),s&&(s.textContent="Visto")):(e&&e.classList.remove("active"),s&&(s.textContent="Marcar Visto"),this.watchTimeCounter=0,window.activeWatchInterval=setInterval(async()=>{var l,a;if(!document.getElementById("watch-layout")){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null;return}if(!document.hidden&&(this.watchTimeCounter++,this.watchTimeCounter>=120)){clearInterval(window.activeWatchInterval),window.activeWatchInterval=null,console.log("[WatchTimer] 2 minutos cumplidos. Marcando como visto automáticamente.");const i=this.anime?{animeTitle:this.anime.title,animeCover:((a=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:a.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await D.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),e&&e.classList.add("active"),s&&(s.textContent="Visto"),this.renderEpisodes&&this.renderEpisodes()}},1e3))}}_initPlayerControls(){const t=document.getElementById("watch-layout"),e=document.getElementById("player-section"),s=document.getElementById("main-column"),n=document.getElementById("dim-overlay"),l=document.getElementById("btn-theater"),a=document.getElementById("btn-lights"),i=document.getElementById("btn-favorite"),o=document.getElementById("lights-text"),r=document.getElementById("theater-text"),m=document.getElementById("fav-text"),p=d=>{if(document.body.classList.contains("tv-mode")||localStorage.getItem("tvMode")==="true"){t.classList.remove("theater-active"),e.parentElement!==t&&t.insertBefore(e,t.firstChild);return}d?(t.classList.add("theater-active"),t.insertBefore(e,t.firstChild),r&&(r.textContent="Modo Normal")):(t.classList.remove("theater-active"),s.insertBefore(e,s.firstChild),r&&(r.textContent="Modo Cine"))};p(this.isTheater),l&&l.addEventListener("click",()=>{this.isTheater=!this.isTheater,localStorage.setItem("watch-theater-mode",this.isTheater),l.classList.toggle("active",this.isTheater),p(this.isTheater)});const E=d=>{const c=d!==void 0?d:!n.classList.contains("active");n.classList.toggle("active",c),e.classList.toggle("dimmed-active",c),a.classList.toggle("active",c),o&&(o.textContent=c?"Encender Luces":"Apagar Luces")};a&&a.addEventListener("click",()=>E()),n&&n.addEventListener("click",()=>E(!1)),i&&i.addEventListener("click",async()=>{if(!this.anime)return;const d=await D.toggleFavorite(this.anime);this.isFav=d,i.classList.toggle("active",d),m&&(m.textContent=d?"Quitar Favorito":"Favorito")});const f=document.getElementById("btn-back-watch");f&&f.addEventListener("click",d=>{d.preventDefault(),window.history.back()});const h=document.getElementById("btn-fullscreen-watch");h&&h.addEventListener("click",d=>{d.preventDefault();const c=document.querySelector(".video-wrapper-v5 iframe");c&&(c.requestFullscreen?c.requestFullscreen():c.webkitRequestFullscreen?c.webkitRequestFullscreen():c.mozRequestFullScreen?c.mozRequestFullScreen():c.msRequestFullscreen&&c.msRequestFullscreen())})}_initServerPills(){const t=document.querySelectorAll(".server-pill-v5"),e=document.querySelector(".video-wrapper-v5 iframe");t.forEach(n=>{n.addEventListener("click",l=>{t.forEach(i=>i.classList.remove("active")),n.classList.add("active");const a=n.getAttribute("data-url");if(e&&a){e.src=a;const i=document.getElementById("video-container");i.style.opacity="0.5",setTimeout(()=>i.style.opacity="1",500)}})}),document.querySelectorAll(".lang-pill-v5").forEach(n=>{n.addEventListener("click",l=>{const a=n.getAttribute("data-lang"),i=`/watch/${this.animeId}/${this.episodeNum}/${a}?title=${this.anime?encodeURIComponent(this.anime.title):""}`,o=B();o?o.navigate(i):window.location.href=i})})}_initSynopsisExpand(){const t=document.getElementById("synopsis-box"),e=document.getElementById("btn-more-synopsis");e&&t&&e.addEventListener("click",()=>{const s=t.classList.toggle("expanded");e.textContent=s?"... ver menos":"... ver más"})}_startCountdownTimer(t,e){let s=t-e;const n=setInterval(()=>{const l=document.getElementById("countdown-timer");if(!l){clearInterval(n);return}if(s-=1e3,s<=0){l.textContent="¡Disponible ya en Emisión!",clearInterval(n);return}const a=Math.floor(s/864e5),i=Math.floor(s%864e5/36e5),o=Math.floor(s%36e5/6e4),r=Math.floor(s%6e4/1e3);let m="";a>0&&(m+=`${a}d `),(i>0||a>0)&&(m+=`${i}h `),m+=`${o}m ${r}s`,l.textContent=m},1e3)}async _loadEnrichedEpisodesAndRecommendations(){var l,a;const t=document.getElementById("related-grid"),e=document.getElementById("sidebar-ep-list"),[s,n]=await Promise.all([S.getAnimeRecommendations(this.animeId).catch(()=>null),S.getAnilistEpisodes(this.animeId).catch(()=>[])]);if(t)if(s&&s.data&&s.data.length>0){const i=s.data.slice(0,6);t.innerHTML=i.map(o=>{var r,m;return`
          <a href="/anime/${o.entry.mal_id}" data-link class="related-card-v5">
            <img src="${(m=(r=o.entry.images)==null?void 0:r.jpg)==null?void 0:m.image_url}" class="related-img-v5" alt="${o.entry.title}">
            <div class="related-info-v5">
              <h4 class="related-title-v5">${o.entry.title}</h4>
              <span class="related-meta-v5">Recomendado</span>
            </div>
          </a>
        `}).join("")}else t.innerHTML='<p style="color:var(--text-muted); font-size:12px; font-weight:600;">No hay recomendaciones similares disponibles.</p>';if(this.localInfo&&this.localInfo.episodes){const i=this.localInfo.episodes,o=((a=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:a.large_image_url)||"",r=this.anime.title,m=()=>{let f=[...i];if(this.sortDesc&&f.reverse(),this.searchQuery.trim()!==""&&(f=f.filter(d=>String(d.number).includes(this.searchQuery)||d.title&&d.title.toLowerCase().includes(this.searchQuery.toLowerCase()))),f.length===0){e.innerHTML='<p style="color:var(--text-muted); text-align:center; padding:20px; font-size:11px;">No se encontraron episodios.</p>';return}e.innerHTML=f.map(d=>{let c=`Episodio ${d.number}`,u=o;const b=n[d.number-1];if(b&&(b.title&&(c=b.title.replace(/^Episode \d+\s*-?\s*/i,"")),b.thumbnail&&(u=b.thumbnail)),d.number===this.episodeNum){const A=document.getElementById("active-episode-title");A&&(A.textContent=`${this.anime.title} — ${c}`)}const g=d.number===this.episodeNum,y=this.watchedEpisodes.has(d.number),w=`/watch/${this.animeId}/${d.number}/${this.lang}?title=${encodeURIComponent(r)}`,_=y?'<div class="ep-watched-badge-v5">✓ Visto</div>':"",L=y?'<div class="ep-progress-bar-v5"><div class="ep-progress-fill-v5"></div></div>':"";return`
            <a href="${w}" data-link class="ep-item-horizontal-v5 ${g?"active":""} ${y?"watched":""}">
              <div class="ep-thumb-wrapper-v5">
                <img src="${u}" alt="Episodio ${d.number}" loading="lazy">
                ${_}
                ${L}
                <div class="ep-play-overlay-v5">
                  <div class="ep-play-icon-v5">▶</div>
                </div>
              </div>
              <div class="ep-info-v5">
                <span class="ep-number-v5">Episodio ${d.number}</span>
                <span class="ep-title-v5">${c}</span>
              </div>
            </a>
          `}).join("");const h=document.getElementById("btn-watched-all");if(h&&this.localInfo&&this.localInfo.episodes){const c=this.localInfo.episodes.map(u=>u.number).every(u=>this.watchedEpisodes.has(u));h.classList.toggle("active",c),h.title=c?"Desmarcar toda la temporada":"Marcar toda la temporada como vista"}};this.renderEpisodes=m,m();const p=document.getElementById("ep-search-input");p&&p.addEventListener("input",f=>{this.searchQuery=f.target.value,m()});const E=document.getElementById("btn-sort-ep");E&&E.addEventListener("click",()=>{this.sortDesc=!this.sortDesc,E.classList.toggle("active",this.sortDesc),m()})}else e&&(e.innerHTML=`
          <div style="text-align:center; padding:30px 15px; color:var(--text-muted); font-size:12px; line-height:1.6;">
            <span style="font-size:28px; display:block; margin-bottom:12px;">🔌</span>
            <strong style="color:white; display:block; margin-bottom:8px; font-size:13px; font-family:'Outfit';">Servidor Local desconectado</strong>
            El backend en la Orange Pi no pudo extraer los videos o la lista de reproducción local para este anime.<br>
            <span style="display:block; margin-top:12px; font-size:10px; color:var(--accent); font-weight:800; text-transform:uppercase; letter-spacing:0.5px;">Código de error: Scraper/Network Timeout</span>
          </div>
        `)}_initWatchedToggleControls(){const t=document.getElementById("btn-watched-status"),e=document.getElementById("watched-status-text"),s=document.getElementById("btn-watched-all");t&&t.addEventListener("click",async()=>{var l,a;const n=this.watchedEpisodes.has(this.episodeNum);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),n){const i=await I.history.where({animeId:String(this.animeId),episodeId:this.episodeNum}).first();i&&await I.history.delete(i.id),this.watchedEpisodes.delete(this.episodeNum),t.classList.remove("active"),e&&(e.textContent="Marcar Visto"),await D.triggerSync()}else{const i=this.anime?{animeTitle:this.anime.title,animeCover:((a=(l=this.anime.images)==null?void 0:l.jpg)==null?void 0:a.large_image_url)||this.anime.cover||"",animeType:this.anime.type||"",animeScore:this.anime.score||""}:{};await D.addToHistory(String(this.animeId),this.episodeNum,120,120,i),this.watchedEpisodes.add(this.episodeNum),t.classList.add("active"),e&&(e.textContent="Visto")}this.renderEpisodes&&this.renderEpisodes()}),s&&s.addEventListener("click",async()=>{if(!this.localInfo||!this.localInfo.episodes)return;const l=this.localInfo.episodes.map(i=>i.number);if(window.activeWatchInterval&&(clearInterval(window.activeWatchInterval),window.activeWatchInterval=null),l.every(i=>this.watchedEpisodes.has(i)))await I.transaction("rw",I.history,async()=>{for(const i of l){const o=await I.history.where({animeId:String(this.animeId),episodeId:i}).first();o&&await I.history.delete(o.id)}}),l.forEach(i=>this.watchedEpisodes.delete(i)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"));else{const i=Date.now();await I.transaction("rw",I.history,async()=>{for(const o of l)await I.history.where({animeId:String(this.animeId),episodeId:o}).first()||await I.history.add({animeId:String(this.animeId),episodeId:o,progress:120,duration:120,timestamp:i,updatedAt:i})}),l.forEach(o=>this.watchedEpisodes.add(o)),this.watchedEpisodes.has(this.episodeNum)?(t&&t.classList.add("active"),e&&(e.textContent="Visto")):(t&&t.classList.remove("active"),e&&(e.textContent="Marcar Visto"))}await D.triggerSync(),this.renderEpisodes&&this.renderEpisodes()})}}const O=Object.freeze(Object.defineProperty({__proto__:null,default:W},Symbol.toStringTag,{value:"Module"}));export{x as _,B as g,N as u};
