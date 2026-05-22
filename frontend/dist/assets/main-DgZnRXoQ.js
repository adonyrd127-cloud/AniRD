const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-BoYs1ihs.js","assets/page-watchpage-CgQp7min.js","assets/page-historypage-CqZNK3jg.js","assets/page-favoritespage-BsIX1kVp.js","assets/page-searchpage-bBXt4b5Y.js","assets/page-categorypage-BQusQMjN.js","assets/page-calendarpage-Dcd-pGqP.js","assets/page-authpage-BIx7dg_8.js","assets/page-profilepage-BokF0LBc.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./page-favoritespage-BsIX1kVp.js";import{c as _}from"./vendor-DIPEJTOH.js";import{a as I,b as c,d as m,c as v}from"./page-homepage-HfrhAw2J.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}})();const w=_(t=>({theme:"dark",isDataSaver:!1,setTheme:e=>t({theme:e}),toggleDataSaver:()=>t(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>t({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>t({isSearchOpen:e})})),u={"/":()=>d(()=>import("./page-homepage-HfrhAw2J.js").then(t=>t.H),__vite__mapDeps([0,1])),"/anime":()=>d(()=>import("./page-animedetailpage-BoYs1ihs.js"),__vite__mapDeps([2,0,1])),"/watch":()=>d(()=>import("./page-watchpage-CgQp7min.js"),__vite__mapDeps([3,0,1])),"/history":()=>d(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/favorites":()=>d(()=>import("./page-favoritespage-BsIX1kVp.js").then(t=>t.F),__vite__mapDeps([5,0,1])),"/search":()=>d(()=>import("./page-searchpage-bBXt4b5Y.js"),__vite__mapDeps([6,0,1])),"/category":()=>d(()=>import("./page-categorypage-BQusQMjN.js"),__vite__mapDeps([7,0,1])),"/calendar":()=>d(()=>import("./page-calendarpage-Dcd-pGqP.js"),__vite__mapDeps([8,0,1])),"/my-anird":()=>d(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/auth":()=>d(()=>import("./page-authpage-BIx7dg_8.js"),__vite__mapDeps([9,0,1])),"/profile":()=>d(()=>import("./page-profilepage-BokF0LBc.js"),__vite__mapDeps([10,5,0,1]))};class R{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const i=e.target.closest("a[data-link]");i&&(e.preventDefault(),this.navigate(i.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),i=e.pathname;let r="/",a={};const s={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(i.startsWith("/anime/"))r="/anime",a.id=i.split("/")[2],document.title="Cargando... — AniRD";else if(i.startsWith("/watch/")){r="/watch";const n=i.split("/");a.id=n[2],a.ep=n[3],a.lang=n[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else i.startsWith("/category/")?(r="/category",a.name=i.split("/")[2],document.title=`${s[a.name]||"Explorar"} — AniRD`):i==="/search"?(r="/search",a.q=e.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):i==="/profile"?(r="/profile",document.title="Mi Perfil — AniRD"):i==="/auth"?(r="/auth",document.title="Iniciar Sesión — AniRD"):i==="/calendar"?(r="/calendar",document.title="Calendario — AniRD"):i==="/history"||i==="/my-anird"?(r=u[i]?i:"/",document.title="Mi Historial — AniRD"):i==="/favorites"?(r="/favorites",document.title="Favoritos — AniRD"):(u[i]&&(r=i),document.title="AniRD — Tu plataforma de anime");w.getState().setCurrentRoute(i);const o=u[r]||u["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const l=(await o()).default,f=new l(a);this.root.innerHTML="",this.root.appendChild(await f.render()),f.afterRender&&f.afterRender()}catch(n){console.error("Error loading route",n),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let h=null;const S=t=>(!h&&t&&(h=new R(t)),h);class D{constructor(e){this.router=e,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
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
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results")}bindEvents(){document.addEventListener("keydown",e=>{(e.metaKey||e.ctrlKey)&&e.key==="k"&&(e.preventDefault(),this.open()),e.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",e=>{e.target===this.container&&this.close()}),this.input.addEventListener("input",e=>{const i=e.target.value.trim();if(clearTimeout(this.timeout),i.length<3){this.resultsContainer.innerHTML=`
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
      `,this.timeout=setTimeout(async()=>{try{const a=((await I.getAnimeSearch(i)).data||[]).slice(0,8);a.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${a.map(s=>{var o,n;return`
                    <a href="/anime/${s.mal_id||s.id}" data-link class="result-item search-result-item">
                      <img src="${((n=(o=s.images)==null?void 0:o.jpg)==null?void 0:n.image_url)||s.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${s.title}</div>
                        <div class="result-item-meta">${s.type||"TV"} • ${s.year||s.status||""}</div>
                      </div>
                    </a>
                  `}).join("")}
                </div>
              </div>
              <div class="result-group">
                 <a href="/search?q=${encodeURIComponent(i)}" data-link class="result-item" style="justify-content: center; color: var(--accent);">
                    Ver todos los resultados para "${i}"
                 </a>
              </div>
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(s=>{s.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${i}"
                </div>
              </div>
            `}catch(r){console.error("Search error:",r),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",e=>{if(e.key==="Enter"){const i=this.input.value.trim();i&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(i)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const p={async checkNewEpisodes(){const t=await c.following.toArray();let e=!1;for(const i of t)if(i.status==="Currently Airing"&&i.broadcast&&i.broadcast.day&&i.broadcast.day!=="Unknown"){const r=this.getLastBroadcast(i.broadcast);r&&(!i.lastNotified||r>i.lastNotified)&&(await c.notifications.where("animeId").equals(i.animeId).and(s=>s.timestamp===r).first()||(await c.notifications.add({animeId:i.animeId,isRead:0,timestamp:r}),e=!0),await c.following.update(i.animeId,{lastNotified:r}))}return e},getLastBroadcast(t){const e={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(e[t.day]===void 0)return null;const[i,r]=t.time.split(":").map(Number),a=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone||"Asia/Tokyo"}));let s=new Date(a);s.setHours(i,r,0,0);let o=e[t.day]-a.getDay();(o<0||o===0&&s<=a)&&(o+=7),s.setDate(s.getDate()+o);const n=new Date(s);if(n.setDate(n.getDate()-7),n>a)return null;const l=n.getTime()-a.getTime();return Date.now()+l},async getUnreadCount(){return await c.notifications.where("isRead").equals(0).count()},async getNotifications(){const t=await c.notifications.orderBy("timestamp").reverse().toArray(),e=[];for(const i of t){const r=await c.following.get(i.animeId);r&&e.push({...i,title:r.title,cover:r.cover})}return e},async markAllAsRead(){await c.notifications.where("isRead").equals(0).modify({isRead:1})}},g=document.getElementById("app"),C=S(g),y=new D(C),k=document.createElement("header");k.innerHTML=`
  <nav class="nav-v4" id="main-navbar">
    <a href="/" data-link class="nav-logo">AniRD ☁️</a>
    
    <ul class="nav-links">
      <li><a href="/" data-link>Inicio</a></li>
      <li><a href="/category/popular" data-link>Populares</a></li>
      <li><a href="/category/movies" data-link>Películas</a></li>
      <li><a href="/category/dub" data-link>Latino</a></li>
      <li class="nav-dropdown">
        <a>
          Categorías <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-left: 2px;"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="nav-dropdown-content">
          <div class="dropdown-grid">
            <div class="dropdown-column">
              <span class="dropdown-title">GÉNEROS</span>
              <a href="/category/action" data-link>Acción</a>
              <a href="/category/adventure" data-link>Aventura</a>
              <a href="/category/comedy" data-link>Comedia</a>
              <a href="/category/drama" data-link>Drama</a>
              <a href="/category/fantasy" data-link>Fantasía</a>
            </div>
            <div class="dropdown-column" style="padding-top:28px">
              <a href="/category/music" data-link>Musical</a>
              <a href="/category/romance" data-link>Romance</a>
              <a href="/category/sci-fi" data-link>Ciencia Ficción</a>
              <a href="/category/seinen" data-link>Seinen</a>
              <a href="/category/shoujo" data-link>Shoujo</a>
            </div>
            <div class="dropdown-column" style="padding-top:28px">
              <a href="/category/shounen" data-link>Shounen</a>
              <a href="/category/slice-of-life" data-link>Recuentos de la Vida</a>
              <a href="/category/sports" data-link>Deportes</a>
              <a href="/category/supernatural" data-link>Sobrenatural</a>
              <a href="/category/thriller" data-link>Thriller</a>
            </div>
          </div>
        </div>
      </li>
      <li><a href="/calendar" data-link>Calendario</a></li>
    </ul>

    <div class="nav-right" style="display: flex; align-items: center;">
      <div class="search-pill" id="open-search-btn">
        <span>🔍 Buscar...</span>
        <kbd style="opacity:0.5; font-size:9px; margin-left:5px">Ctrl K</kbd>
      </div>
      
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

      <a id="profile-link" href="/auth" data-link class="btn-profile">
        Entrar
      </a>
    </div>
  </nav>

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
`;document.body.insertBefore(k,g);const b=document.createElement("aside");b.className="desktop-sidebar";b.innerHTML=`
  <div class="sidebar-logo">
    <a href="/" data-link class="sidebar-logo-link">AniRD ☁️</a>
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
      <a id="sidebar-profile-link" href="/auth" data-link class="sidebar-link" data-route="/profile">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Mi Perfil</span>
      </a>
    </li>
  </ul>

  <hr class="sidebar-divider">

  <div class="sidebar-section-title">SIGUIENDO</div>
  <div class="sidebar-following-list" id="sidebar-following-list">
    <div style="color: rgba(255,255,255,0.3); font-size: 11px; padding: 10px 20px; text-align: center;">Cargando lista...</div>
  </div>
`;document.body.insertBefore(b,g);const x=()=>{const t=document.getElementById("profile-link"),e=document.getElementById("mobile-profile-link"),i=document.getElementById("sidebar-profile-link"),r=v.isLoggedIn(),a=r?"/profile":"/auth",s=r?"Mi Perfil":"Entrar";if(t&&(t.setAttribute("href",a),t.textContent=s),e){e.setAttribute("href",a);const o=e.querySelector(".nav-label");o&&(o.textContent=r?"Perfil":"Entrar")}if(i){i.setAttribute("href",a);const o=i.querySelector("span");o&&(o.textContent=r?"Mi Perfil":"Entrar")}},E=t=>{const e=document.getElementById("bottomNav");if(!e)return;const i=e.querySelectorAll(".nav-item");i.forEach(a=>{a.classList.remove("active");const s=a.querySelector("svg");s&&s.setAttribute("stroke-width","1.8")});let r=-1;if(t==="/"||t.startsWith("/anime/")||t.startsWith("/category/")||t.startsWith("/watch/")||t==="/calendar"?r=0:t==="/favorites"?r=2:(t==="/profile"||t==="/auth")&&(r=3),r!==-1&&i[r]){i[r].classList.add("active");const a=i[r].querySelector("svg");a&&a.setAttribute("stroke-width","2.2")}},L=t=>{const e=document.querySelector(".desktop-sidebar");if(!e)return;e.querySelectorAll(".sidebar-link").forEach(s=>s.classList.remove("active"));let r="/";t==="/"||t.startsWith("/anime/")||t.startsWith("/watch/")||t.startsWith("/category/")||t==="/calendar"?r="/":t==="/favorites"?r="/favorites":t==="/history"||t==="/my-anird"?r="/history":(t==="/profile"||t==="/auth")&&(r="/profile");const a=e.querySelector(`.sidebar-link[data-route="${r}"]`);a&&a.classList.add("active")},A=async()=>{const t=document.getElementById("sidebar-following-list");if(t)try{const e=await m.getFollowing();if(e.length===0){t.innerHTML=`
        <div class="sidebar-following-empty">
          Aún no sigues ningún anime. Haz clic en "Seguir" en la ficha del anime para agregarlo aquí.
        </div>
      `;return}const i=await c.history.orderBy("updatedAt").reverse().toArray(),r=new Map;i.forEach(a=>{r.has(a.animeId)||r.set(a.animeId,a.episodeId)}),t.innerHTML=e.slice(0,5).map(a=>{const s=Number(a.animeId),o=r.get(s),n=o?`Ep. ${o}`:"Ver ahora";return`
        <a href="/anime/${s}" data-link class="sidebar-following-item">
          <img class="sidebar-following-cover" src="${a.cover}" alt="${a.title}" loading="lazy">
          <div class="sidebar-following-info">
            <div class="sidebar-following-title">${a.title}</div>
            <div class="sidebar-following-ep">${n}</div>
          </div>
        </a>
      `}).join("")}catch(e){console.error("Error al renderizar siguiendo en la barra lateral:",e)}};w.subscribe(t=>{E(t.currentRoute),L(t.currentRoute),A()});window.updateNavbarAuth=x;x();E(window.location.pathname);L(window.location.pathname);A();document.getElementById("open-search-btn").addEventListener("click",()=>y.open());document.getElementById("mobile-search-btn").addEventListener("click",t=>{t.preventDefault(),y.open()});document.getElementById("sidebar-search-btn").addEventListener("click",t=>{t.preventDefault(),y.open()});const T=async()=>{const t=document.getElementById("nav-notifications"),e=document.getElementById("notif-badge"),i=document.getElementById("notif-dropdown"),r=document.getElementById("notif-list"),a=document.getElementById("mark-read-btn");if(!t)return;const s=async()=>{await p.getUnreadCount()>0?(e.style.display="block",t.style.color="#ff0000"):(e.style.display="none",t.style.color="inherit")},o=async()=>{const n=await p.getNotifications();if(n.length===0){r.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}r.innerHTML=n.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};t.addEventListener("click",async n=>{if(n.target===a)return;const l=i.style.display==="block";i.style.display=l?"none":"block",l||await o()}),a.addEventListener("click",async n=>{n.stopPropagation(),await p.markAllAsRead(),await s(),await o()}),document.addEventListener("click",n=>{t.contains(n.target)||(i.style.display="none")}),v.isLoggedIn()&&await p.checkNewEpisodes(),await s()},B=async()=>{if(await m.getSetting("theme","dark")==="light"&&document.body.classList.add("light-theme"),v.isLoggedIn())try{const e=await v.fetchFromServer();e&&await m.syncFromServer(e)}catch{console.error("Sync fail")}await T()};B();
