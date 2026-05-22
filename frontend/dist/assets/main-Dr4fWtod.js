const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-BoYs1ihs.js","assets/page-watchpage-CgQp7min.js","assets/page-historypage-CqZNK3jg.js","assets/page-favoritespage-BsIX1kVp.js","assets/page-searchpage-bBXt4b5Y.js","assets/page-categorypage-BQusQMjN.js","assets/page-calendarpage-Dcd-pGqP.js","assets/page-authpage-BIx7dg_8.js","assets/page-profilepage-BokF0LBc.js"])))=>i.map(i=>d[i]);
import{_ as c}from"./page-favoritespage-BsIX1kVp.js";import{c as F}from"./vendor-DIPEJTOH.js";import{a as j,b as d,d as A,c as y}from"./page-homepage-HfrhAw2J.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const _=F(s=>({theme:"dark",isDataSaver:!1,setTheme:e=>s({theme:e}),toggleDataSaver:()=>s(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>s({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>s({isSearchOpen:e})})),b={"/":()=>c(()=>import("./page-homepage-HfrhAw2J.js").then(s=>s.H),__vite__mapDeps([0,1])),"/anime":()=>c(()=>import("./page-animedetailpage-BoYs1ihs.js"),__vite__mapDeps([2,0,1])),"/watch":()=>c(()=>import("./page-watchpage-CgQp7min.js"),__vite__mapDeps([3,0,1])),"/history":()=>c(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/favorites":()=>c(()=>import("./page-favoritespage-BsIX1kVp.js").then(s=>s.F),__vite__mapDeps([5,0,1])),"/search":()=>c(()=>import("./page-searchpage-bBXt4b5Y.js"),__vite__mapDeps([6,0,1])),"/category":()=>c(()=>import("./page-categorypage-BQusQMjN.js"),__vite__mapDeps([7,0,1])),"/calendar":()=>c(()=>import("./page-calendarpage-Dcd-pGqP.js"),__vite__mapDeps([8,0,1])),"/my-anird":()=>c(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/auth":()=>c(()=>import("./page-authpage-BIx7dg_8.js"),__vite__mapDeps([9,0,1])),"/profile":()=>c(()=>import("./page-profilepage-BokF0LBc.js"),__vite__mapDeps([10,5,0,1]))};class q{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let i="/",a={};const r={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))i="/anime",a.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){i="/watch";const n=t.split("/");a.id=n[2],a.ep=n[3],a.lang=n[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else t.startsWith("/category/")?(i="/category",a.name=t.split("/")[2],document.title=`${r[a.name]||"Explorar"} — AniRD`):t==="/search"?(i="/search",a.q=e.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):t==="/profile"?(i="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(i="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(i="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(i=b[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(i="/favorites",document.title="Favoritos — AniRD"):(b[t]&&(i=t),document.title="AniRD — Tu plataforma de anime");_.getState().setCurrentRoute(t);const o=b[i]||b["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const l=(await o()).default,v=new l(a);this.root.innerHTML="",this.root.appendChild(await v.render()),v.afterRender&&v.afterRender()}catch(n){console.error("Error loading route",n),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let x=null;const H=s=>(!x&&s&&(x=new q(s)),x);class ${constructor(e){this.router=e,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
      <style>
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--bg-overlay);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          opacity: 0;
          visibility: hidden;
          transition: all var(--transition-smooth);
        }

        .search-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .search-modal {
          width: 100%;
          max-width: 640px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-elevated);
          transform: scale(0.95);
          transition: transform var(--transition-smooth);
        }

        .search-overlay.active .search-modal {
          transform: scale(1);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--glass-border);
        }

        .search-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.1rem;
          outline: none;
        }

        .search-input-wrapper input::placeholder {
          color: var(--text-muted);
        }

        kbd {
          padding: 4px 8px;
          background: var(--surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .result-group {
          padding: 12px 0;
        }

        .result-group h4 {
          padding: 0 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          cursor: pointer;
          transition: background var(--transition-fast);
          text-decoration: none;
          color: inherit;
        }

        .result-item:hover,
        .result-item.selected {
          background: var(--surface-hover);
        }

        .result-item img {
          width: 40px;
          height: 60px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .result-item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-item-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 400px;
        }

        .result-item-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
      </style>
      <div class="search-modal">
        <div class="search-input-wrapper">
          <span style="color: var(--text-muted)">🔍</span>
          <input type="text" id="palette-input" placeholder="Buscar animes, géneros, episodios..." autocomplete="off">
          <kbd class="shortcut">ESC</kbd>
        </div>
        <div class="search-results" id="palette-results" style="max-height: 400px; overflow-y: auto;">
          <!-- Resultados aquí -->
          <div class="result-group" id="initial-suggestions">
             <h4>Sugerencias</h4>
             <a href="/category/popular" data-link class="result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <span style="font-size: 1.2rem;">🔥</span>
               <div class="result-item-info">
                 <div class="result-item-title">Animes Populares</div>
               </div>
             </a>
             <a href="/category/movies" data-link class="result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <span style="font-size: 1.2rem;">🎬</span>
               <div class="result-item-info">
                 <div class="result-item-title">Películas</div>
               </div>
             </a>
             <a href="/calendar" data-link class="result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <span style="font-size: 1.2rem;">📅</span>
               <div class="result-item-info">
                 <div class="result-item-title">Calendario de Emisiones</div>
               </div>
             </a>
          </div>
        </div>
      </div>
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results")}bindEvents(){document.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="k"&&(e.preventDefault(),this.open()),e.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",e=>{e.target===this.container&&this.close()}),this.input.addEventListener("input",e=>{const t=e.target.value.trim();if(clearTimeout(this.timeout),t.length<3){this.resultsContainer.innerHTML=`
          <div class="result-group">
            <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
              Escribe al menos 3 caracteres...
            </div>
          </div>
        `;return}this.resultsContainer.innerHTML=`
        <div class="result-group">
          <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
            Buscando...
          </div>
        </div>
      `,this.timeout=setTimeout(async()=>{try{const a=((await j.getAnimeSearch(t)).data||[]).slice(0,8);a.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${a.map(r=>{var o,n;return`
                    <a href="/anime/${r.mal_id||r.id}" data-link class="result-item search-result-item">
                      <img src="${((n=(o=r.images)==null?void 0:o.jpg)==null?void 0:n.image_url)||r.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${r.title}</div>
                        <div class="result-item-meta">${r.type||"TV"} • ${r.year||r.status||""}</div>
                      </div>
                    </a>
                  `}).join("")}
                </div>
              </div>
              <div class="result-group">
                 <a href="/search?q=${encodeURIComponent(t)}" data-link class="result-item" style="justify-content: center; color: var(--accent);">
                    Ver todos los resultados para "${t}"
                 </a>
              </div>
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(r=>{r.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${t}"
                </div>
              </div>
            `}catch(i){console.error("Search error:",i),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",e=>{if(e.key==="Enter"){const t=this.input.value.trim();t&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(t)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}class U{constructor(){this.isActive=!1,this.focusedElement=null,this.focusableElements=[],this.handleKeyDownBound=this.handleKeyDown.bind(this),this.mutationObserver=null}init(){this.isActive||(this.isActive=!0,document.body.classList.add("tv-mode"),localStorage.setItem("tvMode","true"),window.addEventListener("keydown",this.handleKeyDownBound,{capture:!0}),this.setupMutationObserver(),setTimeout(()=>{this.updateFocusables(),this.focusFirstAvailable()},300),console.log("📺 AniRD Spatial Navigation (Smart TV Mode) initialized."))}destroy(){if(!this.isActive)return;this.isActive=!1,document.body.classList.remove("tv-mode"),localStorage.setItem("tvMode","false"),window.removeEventListener("keydown",this.handleKeyDownBound,{capture:!0}),this.mutationObserver&&(this.mutationObserver.disconnect(),this.mutationObserver=null),this.focusedElement&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null),document.querySelectorAll(".focused").forEach(t=>t.classList.remove("focused")),console.log("📺 AniRD Spatial Navigation (Smart TV Mode) destroyed.")}setupMutationObserver(){this.mutationObserver&&this.mutationObserver.disconnect(),this.mutationObserver=new MutationObserver(()=>{this.updateTimeout&&clearTimeout(this.updateTimeout),this.updateTimeout=setTimeout(()=>{this.isActive&&this.updateFocusables()},200)}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0})}updateFocusables(){if(!this.isActive)return;const e=["a[href]","button",'input:not([type="hidden"])',"select","textarea",'[tabindex]:not([tabindex="-1"])',"anime-card",".anime-card",".episode-btn",".sidebar-link",".search-bar-desktop",".header-profile-btn","#header-tv-toggle",".server-btn",".player-control-btn",".category-item",".sidebar-categories-trigger",".control-btn-v5",".server-pill-v5",".lang-pill-v5",".btn-more-v5",".ep-search-input-v5",".sidebar-icon-btn",".ep-item-horizontal-v5",".related-card-v5",'[role="button"]'].join(", "),t=Array.from(document.querySelectorAll(e));this.focusableElements=t.filter(i=>{if(i.disabled||i.getAttribute("aria-disabled")==="true")return!1;if(i.id==="tv-mode-toggle"||i.id==="header-tv-toggle")return!0;const a=i.getBoundingClientRect();if(a.width===0||a.height===0)return!1;const r=window.getComputedStyle(i);if(r.display==="none"||r.visibility==="hidden"||r.opacity==="0")return!1;let o=i.parentElement;for(;o;){if(window.getComputedStyle(o).display==="none")return!1;o=o.parentElement}return!0}),this.focusedElement&&!this.focusableElements.includes(this.focusedElement)&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null,this.focusFirstAvailable())}focusFirstAvailable(){if(this.focusableElements.length>0){let e=this.focusableElements.find(t=>t.classList.contains("sidebar-link")||t.tagName==="ANIME-CARD"||t.classList.contains("ep-item-horizontal-v5"));e||(e=this.focusableElements[0]),this.focusElement(e)}}focusElement(e){e&&(this.focusedElement&&(this.focusedElement.classList.remove("focused"),typeof this.focusedElement.blur=="function"&&this.focusedElement.blur()),this.focusedElement=e,this.focusedElement.classList.add("focused"),typeof this.focusedElement.focus=="function"&&this.focusedElement.focus(),this.focusedElement.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"}))}handleKeyDown(e){var a;if(!this.isActive)return;const t=document.activeElement?document.activeElement.tagName:"",i=t==="INPUT"||t==="TEXTAREA";if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){if(i&&["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault(),e.stopPropagation();const r=e.key.replace("Arrow","").toLowerCase();this.moveFocus(r);return}if(e.key==="Enter"){if(i)return;if(this.focusedElement)if(e.preventDefault(),e.stopPropagation(),console.log("📺 TV D-pad Select: Enter key triggered on element:",this.focusedElement),this.focusedElement.tagName==="ANIME-CARD"){const r=(a=this.focusedElement.shadowRoot)==null?void 0:a.querySelector("a");r?r.click():this.focusedElement.click()}else this.focusedElement.click();return}if(e.key==="Backspace"||e.key==="Escape"){if(i&&e.key==="Backspace")return;const r=document.getElementById("searchOverlay");if(r&&r.classList.contains("active"))return;e.preventDefault(),e.stopPropagation(),console.log("📺 TV D-pad Back: navigating history back"),window.history.back()}}moveFocus(e){if(this.updateFocusables(),this.focusableElements.length===0)return;if(!this.focusedElement||!this.focusableElements.includes(this.focusedElement)){this.focusFirstAvailable();return}const t=this.focusedElement.getBoundingClientRect(),i=t.left+t.width/2,a=t.top+t.height/2;let r=null,o=1/0;for(const n of this.focusableElements){if(n===this.focusedElement)continue;const l=n.getBoundingClientRect(),v=l.left+l.width/2,z=l.top+l.height/2,p=v-i,f=z-a;let h=0,m=0,g=!1;switch(e){case"right":p>5&&(h=p,m=Math.abs(f),g=!0);break;case"left":p<-5&&(h=-p,m=Math.abs(f),g=!0);break;case"down":f>5&&(h=f,m=Math.abs(p),g=!0);break;case"up":f<-5&&(h=-f,m=Math.abs(p),g=!0);break}if(g){const T=h+m*3;T<o&&(o=T,r=n)}}r?this.focusElement(r):console.log(`📺 No focusable candidate found in direction: ${e}`)}}const u=new U,k={async checkNewEpisodes(){const s=await d.following.toArray();let e=!1;for(const t of s)if(t.status==="Currently Airing"&&t.broadcast&&t.broadcast.day&&t.broadcast.day!=="Unknown"){const i=this.getLastBroadcast(t.broadcast);i&&(!t.lastNotified||i>t.lastNotified)&&(await d.notifications.where("animeId").equals(t.animeId).and(r=>r.timestamp===i).first()||(await d.notifications.add({animeId:t.animeId,isRead:0,timestamp:i}),e=!0),await d.following.update(t.animeId,{lastNotified:i}))}return e},getLastBroadcast(s){const e={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(e[s.day]===void 0)return null;const[t,i]=s.time.split(":").map(Number),a=new Date(new Date().toLocaleString("en-US",{timeZone:s.timezone||"Asia/Tokyo"}));let r=new Date(a);r.setHours(t,i,0,0);let o=e[s.day]-a.getDay();(o<0||o===0&&r<=a)&&(o+=7),r.setDate(r.getDate()+o);const n=new Date(r);if(n.setDate(n.getDate()-7),n>a)return null;const l=n.getTime()-a.getTime();return Date.now()+l},async getUnreadCount(){return await d.notifications.where("isRead").equals(0).count()},async getNotifications(){const s=await d.notifications.orderBy("timestamp").reverse().toArray(),e=[];for(const t of s){const i=await d.following.get(t.animeId);i&&e.push({...t,title:i.title,cover:i.cover})}return e},async markAllAsRead(){await d.notifications.where("isRead").equals(0).modify({isRead:1})}},L=document.getElementById("app"),W=H(L),K=new $(W),M=document.createElement("header");M.innerHTML=`
  <nav class="nav-v4" id="main-navbar">
    <!-- Contenedor izquierdo: Logo y divisor para escritorio -->
    <div class="nav-left-container">
      <a href="/" data-link class="nav-logo">AniRD <span class="logo-cloud">☁️</span></a>
      <div class="nav-divider-desktop"></div>
    </div>
    
    <!-- Contenedor del centro: Barra de búsqueda simulada para escritorio -->
    <div class="nav-center-container">
      <div class="search-bar-desktop" id="desktop-search-trigger">
        <svg class="search-icon-desktop" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Buscar anime...</span>
      </div>
    </div>

    <!-- Contenedor derecho: Notificaciones y perfil dinámico -->
    <div class="nav-right" style="display: flex; align-items: center;">
      <!-- Botón de Modo TV Global Premium (para fácil activación en TVs/móviles) -->
      <button id="header-tv-toggle" class="header-tv-toggle" title="Activar Modo TV" style="margin-right: 20px; background: rgba(255,255,255,0.05); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 18px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 15px rgba(0,0,0,0.15);">
        📺
      </button>

      <!-- Campana de Notificaciones original intacta -->
      <div class="nav-notifications" id="nav-notifications" style="position: relative; margin-right: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); transition: all 0.3s ease;">
        <span style="font-size: 18px; filter: grayscale(1) contrast(2);">🔔</span>
        <span id="notif-badge" style="display:none; position: absolute; top: 8px; right: 8px; background: #ff0000; width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px #ff0000;"></span>
        
        <div id="notif-dropdown" style="display:none; position: absolute; top: 50px; right: 0; width: 320px; background: rgba(15,15,15,0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 15px; z-index: 100; cursor: default; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
           <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
             <h4 style="margin: 0; color: white; font-family: 'Outfit';">Notificaciones</h4>
             <span id="mark-read-btn" style="font-size: 11px; color: var(--accent); cursor: pointer; font-weight: 800;">Marcar Leídas</span>
           </div>
           <div id="notif-list" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
             <div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>
           </div>
        </div>
      </div>

      <!-- Barra de búsqueda clásica pill para móvil/compatibilidad -->
      <div class="search-pill" id="open-search-btn" style="display: none;">
        <span>🔍 Buscar...</span>
      </div>

      <!-- Botón de Perfil Premium (Escritorio y adaptado) -->
      <a id="profile-link" href="/auth" data-link class="header-profile-btn">
        <div class="header-profile-avatar-container" id="profile-avatar-container">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="header-profile-username" id="profile-username-text">Entrar</span>
      </a>
    </div>
  </nav>

  <!-- Navegación móvil bottom-nav intacta -->
  <nav class="mobile-nav bottom-nav" id="bottomNav">
     <a href="/" data-link class="nav-item">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
           <polyline points="9 22 9 12 15 12 15 22"/>
         </svg>
       </div>
       <div class="nav-label">Inicio</div>
     </a>
     <a href="#" class="nav-item" id="mobile-search-btn">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <circle cx="11" cy="11" r="8"/>
           <line x1="21" y1="21" x2="16.65" y2="16.65"/>
         </svg>
       </div>
       <div class="nav-label">Buscar</div>
     </a>
     <a href="/favorites" data-link class="nav-item">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
         </svg>
       </div>
       <div class="nav-label">Fav</div>
     </a>
     <a id="mobile-profile-link" href="/auth" data-link class="nav-item">
       <div class="nav-icon">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
           <circle cx="12" cy="7" r="4"/>
         </svg>
       </div>
       <div class="nav-label">Entrar</div>
     </a>
  </nav>
`;document.body.insertBefore(M,L);const S=document.createElement("aside");S.className="desktop-sidebar";S.innerHTML=`
  <div class="sidebar-logo">
    <a href="/" data-link class="sidebar-logo-link">AniRD <span class="logo-cloud">☁️</span></a>
  </div>
  
  <ul class="sidebar-menu">
    <li>
      <a href="/" data-link class="sidebar-link" data-route="/">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <span>Inicio</span>
      </a>
    </li>
    <li>
      <a href="#" class="sidebar-link" id="sidebar-search-btn">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span>Explorar</span>
      </a>
    </li>
    <li>
      <a href="/favorites" data-link class="sidebar-link" data-route="/favorites">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Favoritos</span>
      </a>
    </li>
    <li>
      <a href="/history" data-link class="sidebar-link" data-route="/history">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Historial</span>
      </a>
    </li>
    <li>
      <a href="/calendar" data-link class="sidebar-link" data-route="/calendar">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>Calendario</span>
      </a>
    </li>
    <li>
      <a id="sidebar-profile-link" href="/auth" data-link class="sidebar-link" data-route="/profile">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Mi Perfil</span>
      </a>
    </li>
    <li class="sidebar-dropdown">
      <button class="sidebar-link sidebar-dropdown-trigger" id="sidebar-categories-trigger">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="9"></rect>
          <rect x="14" y="3" width="7" height="5"></rect>
          <rect x="14" y="12" width="7" height="9"></rect>
          <rect x="3" y="16" width="7" height="5"></rect>
        </svg>
        <span>Categorías</span>
        <svg class="dropdown-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="sidebar-dropdown-content" id="sidebar-categories-dropdown">
        <div class="sidebar-dropdown-inner">
          <a href="/category/popular" data-link class="sidebar-sublink">🔥 Populares</a>
          <a href="/category/movies" data-link class="sidebar-sublink">🎬 Películas</a>
          <a href="/category/dub" data-link class="sidebar-sublink">🎙️ Latino</a>
          <div class="sidebar-sublink-divider">GÉNEROS</div>
          <a href="/category/action" data-link class="sidebar-sublink">Acción</a>
          <a href="/category/adventure" data-link class="sidebar-sublink">Aventura</a>
          <a href="/category/comedy" data-link class="sidebar-sublink">Comedia</a>
          <a href="/category/drama" data-link class="sidebar-sublink">Drama</a>
          <a href="/category/fantasy" data-link class="sidebar-sublink">Fantasía</a>
          <a href="/category/music" data-link class="sidebar-sublink">Musical</a>
          <a href="/category/romance" data-link class="sidebar-sublink">Romance</a>
          <a href="/category/sci-fi" data-link class="sidebar-sublink">Ciencia Ficción</a>
          <a href="/category/seinen" data-link class="sidebar-sublink">Seinen</a>
          <a href="/category/shoujo" data-link class="sidebar-sublink">Shoujo</a>
          <a href="/category/shounen" data-link class="sidebar-sublink">Shounen</a>
          <a href="/category/slice-of-life" data-link class="sidebar-sublink">Recuentos de la Vida</a>
          <a href="/category/sports" data-link class="sidebar-sublink">Deportes</a>
          <a href="/category/supernatural" data-link class="sidebar-sublink">Sobrenatural</a>
          <a href="/category/thriller" data-link class="sidebar-sublink">Thriller</a>
        </div>
      </div>
    </li>
    <li>
      <button class="sidebar-link" id="tv-mode-toggle" style="background: none; border: none; width: 100%; text-align: left; cursor: pointer;">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="13" rx="2" ry="2"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
        </svg>
        <span id="tv-mode-text">Modo TV: APAGADO</span>
      </button>
    </li>
  </ul>

  <hr class="sidebar-divider">

  <div class="sidebar-section-title">SIGUIENDO</div>
  <div class="sidebar-following-list" id="sidebar-following-list">
    <div style="color: rgba(255,255,255,0.3); font-size: 11px; padding: 10px 20px; text-align: center;">Cargando lista...</div>
  </div>
`;document.body.insertBefore(S,L);const N=()=>{const s=document.getElementById("profile-link"),e=document.getElementById("mobile-profile-link"),t=document.getElementById("sidebar-profile-link"),i=document.getElementById("profile-avatar-container"),a=document.getElementById("profile-username-text"),r=y.isLoggedIn(),o=y.getUser(),n=r?"/profile":"/auth";if(s&&(s.setAttribute("href",n),r?(i&&i.classList.add("active-border"),a&&(a.textContent=(o==null?void 0:o.username)||"Perfil")):(i&&i.classList.remove("active-border"),a&&(a.textContent="Entrar"))),e){e.setAttribute("href",n);const l=e.querySelector(".nav-label");l&&(l.textContent=r?"Perfil":"Entrar")}if(t){t.setAttribute("href",n);const l=t.querySelector("span");l&&(l.textContent=r?"Mi Perfil":"Entrar")}},O=s=>{const e=document.getElementById("bottomNav");if(!e)return;const t=e.querySelectorAll(".nav-item");t.forEach(a=>{a.classList.remove("active");const r=a.querySelector("svg");r&&r.setAttribute("stroke-width","1.8")});let i=-1;if(s==="/"||s.startsWith("/anime/")||s.startsWith("/category/")||s.startsWith("/watch/")||s==="/calendar"?i=0:s==="/favorites"?i=2:(s==="/profile"||s==="/auth")&&(i=3),i!==-1&&t[i]){t[i].classList.add("active");const a=t[i].querySelector("svg");a&&a.setAttribute("stroke-width","2.2")}},P=s=>{const e=document.querySelector(".desktop-sidebar");if(!e)return;e.querySelectorAll(".sidebar-link").forEach(r=>r.classList.remove("active"));let i="/";s==="/"||s.startsWith("/anime/")||s.startsWith("/watch/")||s.startsWith("/category/")||s==="/calendar"?i="/":s==="/favorites"?i="/favorites":s==="/history"||s==="/my-anird"?i="/history":(s==="/profile"||s==="/auth")&&(i="/profile");const a=e.querySelector(`.sidebar-link[data-route="${i}"]`);a&&a.classList.add("active")},V=async()=>{const s=document.getElementById("sidebar-following-list");if(s)try{const e=await A.getFollowing();if(e.length===0){s.innerHTML=`
        <div class="sidebar-following-empty">
          Aún no sigues ningún anime. Haz clic en "Seguir" en la ficha del anime para agregarlo aquí.
        </div>
      `;return}const t=await d.history.orderBy("updatedAt").reverse().toArray(),i=new Map;t.forEach(a=>{i.has(a.animeId)||i.set(a.animeId,a.episodeId)}),s.innerHTML=e.slice(0,5).map(a=>{const r=Number(a.animeId),o=i.get(r),n=o?`Ep. ${o}`:"Ver ahora";return`
        <a href="/anime/${r}" data-link class="sidebar-following-item">
          <img class="sidebar-following-cover" src="${a.cover}" alt="${a.title}" loading="lazy">
          <div class="sidebar-following-info">
            <div class="sidebar-following-title">${a.title}</div>
            <div class="sidebar-following-ep">${n}</div>
          </div>
        </a>
      `}).join("")}catch(e){console.error("Error al renderizar siguiendo en la barra lateral:",e)}};_.subscribe(s=>{O(s.currentRoute),P(s.currentRoute),V(),u.isActive&&setTimeout(()=>{u.updateFocusables(),u.focusFirstAvailable()},400)});window.updateNavbarAuth=N;N();O(window.location.pathname);P(window.location.pathname);V();const w=s=>{s&&s.preventDefault(),K.open()},B=document.getElementById("desktop-search-trigger");B&&B.addEventListener("click",w);const D=document.getElementById("open-search-btn");D&&D.addEventListener("click",w);const I=document.getElementById("mobile-search-btn");I&&I.addEventListener("click",w);const R=document.getElementById("sidebar-search-btn");R&&R.addEventListener("click",w);const E=document.getElementById("sidebar-categories-trigger"),C=document.getElementById("sidebar-categories-dropdown");E&&C&&E.addEventListener("click",s=>{s.preventDefault(),E.classList.toggle("expanded"),C.classList.toggle("expanded")});const G=async()=>{const s=document.getElementById("nav-notifications"),e=document.getElementById("notif-badge"),t=document.getElementById("notif-dropdown"),i=document.getElementById("notif-list"),a=document.getElementById("mark-read-btn");if(!s)return;const r=async()=>{await k.getUnreadCount()>0?(e.style.display="block",s.style.color="#ff0000"):(e.style.display="none",s.style.color="inherit")},o=async()=>{const n=await k.getNotifications();if(n.length===0){i.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}i.innerHTML=n.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};s.addEventListener("click",async n=>{if(n.target===a)return;const l=t.style.display==="block";t.style.display=l?"none":"block",l||await o()}),a.addEventListener("click",async n=>{n.stopPropagation(),await k.markAllAsRead(),await r(),await o()}),document.addEventListener("click",n=>{s.contains(n.target)||(t.style.display="none")}),y.isLoggedIn()&&await k.checkNewEpisodes(),await r()},X=()=>{const s=document.getElementById("tv-mode-toggle"),e=document.getElementById("tv-mode-text"),t=document.getElementById("header-tv-toggle"),i=n=>{e&&(e.textContent=n?"📺 Modo TV: ON":"📺 Modo TV: OFF"),s&&(n?s.classList.add("active"):s.classList.remove("active")),t&&(n?(t.classList.add("active"),t.style.background="rgba(255, 0, 85, 0.2)",t.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",t.style.border="1px solid rgba(255, 0, 85, 0.4)"):(t.classList.remove("active"),t.style.background="rgba(255,255,255,0.05)",t.style.boxShadow="none",t.style.border="none"))},a=()=>{u.isActive?(u.destroy(),i(!1)):(u.init(),i(!0))};s&&s.addEventListener("click",n=>{n.preventDefault(),a()}),t&&t.addEventListener("click",n=>{n.preventDefault(),a()});const r=localStorage.getItem("tvMode")==="true",o=/SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon/i.test(navigator.userAgent);r||localStorage.getItem("tvMode")===null&&o?(u.init(),i(!0)):i(!1)},Z=async()=>{if(await A.getSetting("theme","dark")==="light"&&document.body.classList.add("light-theme"),y.isLoggedIn())try{const e=await y.fetchFromServer();e&&await A.syncFromServer(e)}catch{console.error("Sync fail")}await G(),setTimeout(X,200)};Z();
