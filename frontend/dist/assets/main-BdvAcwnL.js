const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-BoYs1ihs.js","assets/page-watchpage-DXQJ_1kV.js","assets/page-historypage-CqZNK3jg.js","assets/page-favoritespage-BsIX1kVp.js","assets/page-searchpage-bBXt4b5Y.js","assets/page-categorypage-BQusQMjN.js","assets/page-calendarpage-Dcd-pGqP.js","assets/page-authpage-BIx7dg_8.js","assets/page-profilepage-CNyO1mLn.js"])))=>i.map(i=>d[i]);
import{_ as c}from"./page-favoritespage-BsIX1kVp.js";import{c as P}from"./vendor-DIPEJTOH.js";import{a as N,b as u,d as x,c as f}from"./page-homepage-HfrhAw2J.js";import{s as p}from"./page-profilepage-CNyO1mLn.js";(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(a){if(a.ep)return;a.ep=!0;const r=e(a);fetch(a.href,r)}})();const B=P(t=>({theme:"dark",isDataSaver:!1,setTheme:i=>t({theme:i}),toggleDataSaver:()=>t(i=>({isDataSaver:!i.isDataSaver})),currentRoute:"/",setCurrentRoute:i=>t({currentRoute:i}),isSearchOpen:!1,setSearchOpen:i=>t({isSearchOpen:i})})),h={"/":()=>c(()=>import("./page-homepage-HfrhAw2J.js").then(t=>t.H),__vite__mapDeps([0,1])),"/anime":()=>c(()=>import("./page-animedetailpage-BoYs1ihs.js"),__vite__mapDeps([2,0,1])),"/watch":()=>c(()=>import("./page-watchpage-DXQJ_1kV.js"),__vite__mapDeps([3,0,1])),"/history":()=>c(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/favorites":()=>c(()=>import("./page-favoritespage-BsIX1kVp.js").then(t=>t.F),__vite__mapDeps([5,0,1])),"/search":()=>c(()=>import("./page-searchpage-bBXt4b5Y.js"),__vite__mapDeps([6,0,1])),"/category":()=>c(()=>import("./page-categorypage-BQusQMjN.js"),__vite__mapDeps([7,0,1])),"/calendar":()=>c(()=>import("./page-calendarpage-Dcd-pGqP.js"),__vite__mapDeps([8,0,1])),"/my-anird":()=>c(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/auth":()=>c(()=>import("./page-authpage-BIx7dg_8.js"),__vite__mapDeps([9,0,1])),"/profile":()=>c(()=>import("./page-profilepage-CNyO1mLn.js").then(t=>t.P),__vite__mapDeps([10,5,0,1]))};class V{constructor(i){this.root=i,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",i=>{const e=i.target.closest("a[data-link]");e&&(i.preventDefault(),this.navigate(e.getAttribute("href")))}),this.handleRoute()}navigate(i){window.history.pushState(null,null,i),this.handleRoute()}async handleRoute(){const i=new URL(window.location.href),e=i.pathname;let s="/",a={};const r={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(e.startsWith("/anime/"))s="/anime",a.id=e.split("/")[2],document.title="Cargando... — AniRD";else if(e.startsWith("/watch/")){s="/watch";const d=e.split("/");a.id=d[2],a.ep=d[3],a.lang=d[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else e.startsWith("/category/")?(s="/category",a.name=e.split("/")[2],document.title=`${r[a.name]||"Explorar"} — AniRD`):e==="/search"?(s="/search",a.q=i.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):e==="/profile"?(s="/profile",document.title="Mi Perfil — AniRD"):e==="/auth"?(s="/auth",document.title="Iniciar Sesión — AniRD"):e==="/calendar"?(s="/calendar",document.title="Calendario — AniRD"):e==="/history"||e==="/my-anird"?(s=h[e]?e:"/",document.title="Mi Historial — AniRD"):e==="/favorites"?(s="/favorites",document.title="Favoritos — AniRD"):(h[e]&&(s=e),document.title="AniRD — Tu plataforma de anime");const n=[];for(let d=0;d<document.body.classList.length;d++){const v=document.body.classList[d];v&&v.startsWith("route-")&&n.push(v)}n.forEach(d=>document.body.classList.remove(d));const o=`route-${s.replace("/","")||"home"}`;document.body.classList.add(o),B.getState().setCurrentRoute(e);const l=h[s]||h["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const v=(await l()).default,y=new v(a);this.root.innerHTML="",this.root.appendChild(await y.render()),y.afterRender&&y.afterRender()}catch(d){console.error("Error loading route",d),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let b=null;const z=t=>(!b&&t&&(b=new V(t)),b);class O{constructor(i){this.router=i,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
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
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results")}bindEvents(){document.addEventListener("keydown",i=>{(i.metaKey||i.ctrlKey)&&i.key==="k"&&(i.preventDefault(),this.open()),i.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",i=>{i.target===this.container&&this.close()}),this.input.addEventListener("input",i=>{const e=i.target.value.trim();if(clearTimeout(this.timeout),e.length<3){this.resultsContainer.innerHTML=`
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
      `,this.timeout=setTimeout(async()=>{try{const a=((await N.getAnimeSearch(e)).data||[]).slice(0,8);a.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${a.map(r=>{var n,o;return`
                    <a href="/anime/${r.mal_id||r.id}" data-link class="result-item search-result-item">
                      <img src="${((o=(n=r.images)==null?void 0:n.jpg)==null?void 0:o.image_url)||r.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${r.title}</div>
                        <div class="result-item-meta">${r.type||"TV"} • ${r.year||r.status||""}</div>
                      </div>
                    </a>
                  `}).join("")}
                </div>
              </div>
              <div class="result-group">
                 <a href="/search?q=${encodeURIComponent(e)}" data-link class="result-item" style="justify-content: center; color: var(--accent);">
                    Ver todos los resultados para "${e}"
                 </a>
              </div>
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(r=>{r.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${e}"
                </div>
              </div>
            `}catch(s){console.error("Search error:",s),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",i=>{if(i.key==="Enter"){const e=this.input.value.trim();e&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(e)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const m={async checkNewEpisodes(){const t=await u.following.toArray();let i=!1;for(const e of t)if(e.status==="Currently Airing"&&e.broadcast&&e.broadcast.day&&e.broadcast.day!=="Unknown"){const s=this.getLastBroadcast(e.broadcast);s&&(!e.lastNotified||s>e.lastNotified)&&(await u.notifications.where("animeId").equals(e.animeId).and(r=>r.timestamp===s).first()||(await u.notifications.add({animeId:e.animeId,isRead:0,timestamp:s}),i=!0),await u.following.update(e.animeId,{lastNotified:s}))}return i},getLastBroadcast(t){const i={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(i[t.day]===void 0)return null;const[e,s]=t.time.split(":").map(Number),a=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone||"Asia/Tokyo"}));let r=new Date(a);r.setHours(e,s,0,0);let n=i[t.day]-a.getDay();(n<0||n===0&&r<=a)&&(n+=7),r.setDate(r.getDate()+n);const o=new Date(r);if(o.setDate(o.getDate()-7),o>a)return null;const l=o.getTime()-a.getTime();return Date.now()+l},async getUnreadCount(){return await u.notifications.where("isRead").equals(0).count()},async getNotifications(){const t=await u.notifications.orderBy("timestamp").reverse().toArray(),i=[];for(const e of t){const s=await u.following.get(e.animeId);s&&i.push({...e,title:s.title,cover:s.cover})}return i},async markAllAsRead(){await u.notifications.where("isRead").equals(0).modify({isRead:1})}},w=document.getElementById("app"),j=z(w),q=new O(j),_=document.createElement("header");_.innerHTML=`
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
`;document.body.insertBefore(_,w);const E=document.createElement("aside");E.className="desktop-sidebar";E.innerHTML=`
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
  </ul>

  <hr class="sidebar-divider">

  <div class="sidebar-section-title">SIGUIENDO</div>
  <div class="sidebar-following-list" id="sidebar-following-list">
    <div style="color: rgba(255,255,255,0.3); font-size: 11px; padding: 10px 20px; text-align: center;">Cargando lista...</div>
  </div>
`;document.body.insertBefore(E,w);const C=()=>{const t=document.getElementById("profile-link"),i=document.getElementById("mobile-profile-link"),e=document.getElementById("sidebar-profile-link"),s=document.getElementById("profile-avatar-container"),a=document.getElementById("profile-username-text"),r=f.isLoggedIn(),n=f.getUser(),o=r?"/profile":"/auth";if(t&&(t.setAttribute("href",o),r?(s&&s.classList.add("active-border"),a&&(a.textContent=(n==null?void 0:n.username)||"Perfil")):(s&&s.classList.remove("active-border"),a&&(a.textContent="Entrar"))),i){i.setAttribute("href",o);const l=i.querySelector(".nav-label");l&&(l.textContent=r?"Perfil":"Entrar")}if(e){e.setAttribute("href",o);const l=e.querySelector("span");l&&(l.textContent=r?"Mi Perfil":"Entrar")}},R=t=>{const i=document.getElementById("bottomNav");if(!i)return;const e=i.querySelectorAll(".nav-item");e.forEach(a=>{a.classList.remove("active");const r=a.querySelector("svg");r&&r.setAttribute("stroke-width","1.8")});let s=-1;if(t==="/"||t.startsWith("/anime/")||t.startsWith("/category/")||t.startsWith("/watch/")||t==="/calendar"?s=0:t==="/favorites"?s=2:(t==="/profile"||t==="/auth")&&(s=3),s!==-1&&e[s]){e[s].classList.add("active");const a=e[s].querySelector("svg");a&&a.setAttribute("stroke-width","2.2")}},D=t=>{const i=document.querySelector(".desktop-sidebar");if(!i)return;i.querySelectorAll(".sidebar-link").forEach(r=>r.classList.remove("active"));let s="/";t==="/"||t.startsWith("/anime/")||t.startsWith("/watch/")||t.startsWith("/category/")||t==="/calendar"?s="/":t==="/favorites"?s="/favorites":t==="/history"||t==="/my-anird"?s="/history":(t==="/profile"||t==="/auth")&&(s="/profile");const a=i.querySelector(`.sidebar-link[data-route="${s}"]`);a&&a.classList.add("active")},M=async()=>{const t=document.getElementById("sidebar-following-list");if(t)try{const i=await x.getFollowing();if(i.length===0){t.innerHTML=`
        <div class="sidebar-following-empty">
          Aún no sigues ningún anime. Haz clic en "Seguir" en la ficha del anime para agregarlo aquí.
        </div>
      `;return}const e=await u.history.orderBy("updatedAt").reverse().toArray(),s=new Map;e.forEach(a=>{s.has(a.animeId)||s.set(a.animeId,a.episodeId)}),t.innerHTML=i.slice(0,5).map(a=>{const r=Number(a.animeId),n=s.get(r),o=n?`Ep. ${n}`:"Ver ahora";return`
        <a href="/anime/${r}" data-link class="sidebar-following-item">
          <img class="sidebar-following-cover" src="${a.cover}" alt="${a.title}" loading="lazy">
          <div class="sidebar-following-info">
            <div class="sidebar-following-title">${a.title}</div>
            <div class="sidebar-following-ep">${o}</div>
          </div>
        </a>
      `}).join("")}catch(i){console.error("Error al renderizar siguiendo en la barra lateral:",i)}};B.subscribe(t=>{R(t.currentRoute),D(t.currentRoute),M(),p.isActive&&setTimeout(()=>{p.updateFocusables(),p.focusFirstAvailable()},400)});window.updateNavbarAuth=C;C();R(window.location.pathname);D(window.location.pathname);M();const g=t=>{t&&t.preventDefault(),q.open()},L=document.getElementById("desktop-search-trigger");L&&L.addEventListener("click",g);const A=document.getElementById("open-search-btn");A&&A.addEventListener("click",g);const S=document.getElementById("mobile-search-btn");S&&S.addEventListener("click",g);const T=document.getElementById("sidebar-search-btn");T&&T.addEventListener("click",g);const k=document.getElementById("sidebar-categories-trigger"),I=document.getElementById("sidebar-categories-dropdown");k&&I&&k.addEventListener("click",t=>{t.preventDefault(),k.classList.toggle("expanded"),I.classList.toggle("expanded")});const H=async()=>{const t=document.getElementById("nav-notifications"),i=document.getElementById("notif-badge"),e=document.getElementById("notif-dropdown"),s=document.getElementById("notif-list"),a=document.getElementById("mark-read-btn");if(!t)return;const r=async()=>{await m.getUnreadCount()>0?(i.style.display="block",t.style.color="#ff0000"):(i.style.display="none",t.style.color="inherit")},n=async()=>{const o=await m.getNotifications();if(o.length===0){s.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}s.innerHTML=o.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};t.addEventListener("click",async o=>{if(o.target===a)return;const l=e.style.display==="block";e.style.display=l?"none":"block",l||await n()}),a.addEventListener("click",async o=>{o.stopPropagation(),await m.markAllAsRead(),await r(),await n()}),document.addEventListener("click",o=>{t.contains(o.target)||(e.style.display="none")}),f.isLoggedIn()&&await m.checkNewEpisodes(),await r()},$=()=>{const t=document.getElementById("tv-mode-toggle"),i=document.getElementById("tv-mode-text"),e=document.getElementById("header-tv-toggle"),s=o=>{i&&(i.textContent=o?"📺 Modo TV: ON":"📺 Modo TV: OFF"),t&&(o?t.classList.add("active"):t.classList.remove("active")),e&&(o?(e.classList.add("active"),e.style.background="rgba(255, 0, 85, 0.2)",e.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",e.style.border="1px solid rgba(255, 0, 85, 0.4)"):(e.classList.remove("active"),e.style.background="rgba(255,255,255,0.05)",e.style.boxShadow="none",e.style.border="none"))},a=()=>{p.isActive?(p.destroy(),s(!1)):(p.init(),s(!0))};t&&t.addEventListener("click",o=>{o.preventDefault(),a()}),e&&e.addEventListener("click",o=>{o.preventDefault(),a()});const r=localStorage.getItem("tvMode")==="true",n=/SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon/i.test(navigator.userAgent);r||localStorage.getItem("tvMode")===null&&n?(p.init(),s(!0)):s(!1)},F=async()=>{if(await x.getSetting("theme","dark")==="light"&&document.body.classList.add("light-theme"),f.isLoggedIn())try{const i=await f.fetchFromServer();i&&await x.syncFromServer(i)}catch{console.error("Sync fail")}await H(),setTimeout($,200)};F();
