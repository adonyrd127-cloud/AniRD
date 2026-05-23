import{g as T,u as A}from"./page-watchpage-BEyhp2v9.js";import{a as M,b as d,d as f,c as u}from"./page-homepage-HfrhAw2J.js";import{s as c}from"./page-profilepage-BBwXxqnO.js";import"./vendor-DIPEJTOH.js";(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();class N{constructor(a){this.router=a,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
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
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results")}bindEvents(){document.addEventListener("keydown",a=>{(a.metaKey||a.ctrlKey)&&a.key==="k"&&(a.preventDefault(),this.open()),a.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",a=>{a.target===this.container&&this.close()}),this.input.addEventListener("input",a=>{const t=a.target.value.trim();if(clearTimeout(this.timeout),t.length<3){this.resultsContainer.innerHTML=`
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
      `,this.timeout=setTimeout(async()=>{try{const i=((await M.getAnimeSearch(t)).data||[]).slice(0,8);i.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${i.map(r=>{var o,n;return`
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
            `}catch(s){console.error("Search error:",s),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",a=>{if(a.key==="Enter"){const t=this.input.value.trim();t&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(t)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const p={async checkNewEpisodes(){const e=await d.following.toArray();let a=!1;for(const t of e)if(t.status==="Currently Airing"&&t.broadcast&&t.broadcast.day&&t.broadcast.day!=="Unknown"){const s=this.getLastBroadcast(t.broadcast);s&&(!t.lastNotified||s>t.lastNotified)&&(await d.notifications.where("animeId").equals(t.animeId).and(r=>r.timestamp===s).first()||(await d.notifications.add({animeId:t.animeId,isRead:0,timestamp:s}),a=!0),await d.following.update(t.animeId,{lastNotified:s}))}return a},getLastBroadcast(e){const a={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(a[e.day]===void 0)return null;const[t,s]=e.time.split(":").map(Number),i=new Date(new Date().toLocaleString("en-US",{timeZone:e.timezone||"Asia/Tokyo"}));let r=new Date(i);r.setHours(t,s,0,0);let o=a[e.day]-i.getDay();(o<0||o===0&&r<=i)&&(o+=7),r.setDate(r.getDate()+o);const n=new Date(r);if(n.setDate(n.getDate()-7),n>i)return null;const l=n.getTime()-i.getTime();return Date.now()+l},async getUnreadCount(){return await d.notifications.where("isRead").equals(0).count()},async getNotifications(){const e=await d.notifications.orderBy("timestamp").reverse().toArray(),a=[];for(const t of e){const s=await d.following.get(t.animeId);s&&a.push({...t,title:s.title,cover:s.cover})}return a},async markAllAsRead(){await d.notifications.where("isRead").equals(0).modify({isRead:1})}},h=document.getElementById("app"),z=T(h),D=new N(z),E=document.createElement("header");E.innerHTML=`
  <nav class="nav-v4" id="main-navbar">
    <!-- Contenedor izquierdo: Botón de colapsar, Logo y divisor para escritorio -->
    <div class="nav-left-container" style="display: flex; align-items: center; gap: 15px;">
      <button id="sidebar-collapse-btn" class="sidebar-collapse-btn" title="Colapsar Barra Lateral">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <a href="/" data-link class="nav-logo">AniRD <span class="logo-cloud">☁️</span></a>
      <div class="nav-divider-desktop"></div>
    </div>
    
    <!-- Contenedor de Categorías en Header (visible solo al colapsar barra lateral en PC) -->
    <div class="header-categories-v4" id="header-categories">
      <a href="/category/popular" data-link class="header-cat-link">🔥 Populares</a>
      <a href="/category/movies" data-link class="header-cat-link">🎬 Películas</a>
      <a href="/category/dub" data-link class="header-cat-link">🎙️ Latino</a>
      
      <!-- Dropdown de Géneros en Cabecera -->
      <div class="header-cat-dropdown">
        <button class="header-cat-btn" id="header-genres-trigger">
          Géneros <span style="font-size: 10px; margin-left: 4px;">▼</span>
        </button>
        <div class="header-cat-dropdown-content" id="header-genres-dropdown">
          <a href="/category/action" data-link class="header-genre-sublink">Acción</a>
          <a href="/category/adventure" data-link class="header-genre-sublink">Aventura</a>
          <a href="/category/comedy" data-link class="header-genre-sublink">Comedia</a>
          <a href="/category/drama" data-link class="header-genre-sublink">Drama</a>
          <a href="/category/fantasy" data-link class="header-genre-sublink">Fantasía</a>
          <a href="/category/music" data-link class="header-genre-sublink">Musical</a>
          <a href="/category/romance" data-link class="header-genre-sublink">Romance</a>
          <a href="/category/sci-fi" data-link class="header-genre-sublink">Ciencia Ficción</a>
          <a href="/category/seinen" data-link class="header-genre-sublink">Seinen</a>
          <a href="/category/shoujo" data-link class="header-genre-sublink">Shoujo</a>
          <a href="/category/shounen" data-link class="header-genre-sublink">Shounen</a>
          <a href="/category/slice-of-life" data-link class="header-genre-sublink">Recuentos de la Vida</a>
          <a href="/category/sports" data-link class="header-genre-sublink">Deportes</a>
          <a href="/category/supernatural" data-link class="header-genre-sublink">Sobrenatural</a>
          <a href="/category/thriller" data-link class="header-genre-sublink">Thriller</a>
        </div>
      </div>
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
`;document.body.insertBefore(E,h);const m=document.createElement("aside");m.className="desktop-sidebar";m.innerHTML=`
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
`;document.body.insertBefore(m,h);const B=()=>{const e=document.getElementById("profile-link"),a=document.getElementById("mobile-profile-link"),t=document.getElementById("sidebar-profile-link"),s=document.getElementById("profile-avatar-container"),i=document.getElementById("profile-username-text"),r=u.isLoggedIn(),o=u.getUser(),n=r?"/profile":"/auth";if(e&&(e.setAttribute("href",n),r?(s&&s.classList.add("active-border"),i&&(i.textContent=(o==null?void 0:o.username)||"Perfil")):(s&&s.classList.remove("active-border"),i&&(i.textContent="Entrar"))),a){a.setAttribute("href",n);const l=a.querySelector(".nav-label");l&&(l.textContent=r?"Perfil":"Entrar")}if(t){t.setAttribute("href",n);const l=t.querySelector("span");l&&(l.textContent=r?"Mi Perfil":"Entrar")}},C=e=>{const a=document.getElementById("bottomNav");if(!a)return;const t=a.querySelectorAll(".nav-item");t.forEach(i=>{i.classList.remove("active");const r=i.querySelector("svg");r&&r.setAttribute("stroke-width","1.8")});let s=-1;if(e==="/"||e.startsWith("/anime/")||e.startsWith("/category/")||e.startsWith("/watch/")||e==="/calendar"?s=0:e==="/favorites"?s=2:(e==="/profile"||e==="/auth")&&(s=3),s!==-1&&t[s]){t[s].classList.add("active");const i=t[s].querySelector("svg");i&&i.setAttribute("stroke-width","2.2")}},S=e=>{const a=document.querySelector(".desktop-sidebar");if(!a)return;a.querySelectorAll(".sidebar-link").forEach(r=>r.classList.remove("active"));let s="/";e==="/"||e.startsWith("/anime/")||e.startsWith("/watch/")||e.startsWith("/category/")||e==="/calendar"?s="/":e==="/favorites"?s="/favorites":e==="/history"||e==="/my-anird"?s="/history":(e==="/profile"||e==="/auth")&&(s="/profile");const i=a.querySelector(`.sidebar-link[data-route="${s}"]`);i&&i.classList.add("active")},I=async()=>{const e=document.getElementById("sidebar-following-list");if(e)try{const a=await f.getFollowing();if(a.length===0){e.innerHTML=`
        <div class="sidebar-following-empty">
          Aún no sigues ningún anime. Haz clic en "Seguir" en la ficha del anime para agregarlo aquí.
        </div>
      `;return}const t=await d.history.orderBy("updatedAt").reverse().toArray(),s=new Map;t.forEach(i=>{s.has(i.animeId)||s.set(i.animeId,i.episodeId)}),e.innerHTML=a.slice(0,5).map(i=>{const r=Number(i.animeId),o=s.get(r),n=o?`Ep. ${o}`:"Ver ahora";return`
        <a href="/anime/${r}" data-link class="sidebar-following-item">
          <img class="sidebar-following-cover" src="${i.cover}" alt="${i.title}" loading="lazy">
          <div class="sidebar-following-info">
            <div class="sidebar-following-title">${i.title}</div>
            <div class="sidebar-following-ep">${n}</div>
          </div>
        </a>
      `}).join("")}catch(a){console.error("Error al renderizar siguiendo en la barra lateral:",a)}};A.subscribe(e=>{C(e.currentRoute),S(e.currentRoute),I(),c.isActive&&setTimeout(()=>{c.updateFocusables(),c.focusFirstAvailable()},400)});window.updateNavbarAuth=B;B();C(window.location.pathname);S(window.location.pathname);I();const v=e=>{e&&e.preventDefault(),D.open()},y=document.getElementById("desktop-search-trigger");y&&y.addEventListener("click",v);const b=document.getElementById("open-search-btn");b&&b.addEventListener("click",v);const k=document.getElementById("mobile-search-btn");k&&k.addEventListener("click",v);const x=document.getElementById("sidebar-search-btn");x&&x.addEventListener("click",v);const g=document.getElementById("sidebar-categories-trigger"),w=document.getElementById("sidebar-categories-dropdown");g&&w&&g.addEventListener("click",e=>{e.preventDefault(),g.classList.toggle("expanded"),w.classList.toggle("expanded")});const L=document.getElementById("sidebar-collapse-btn");L&&(localStorage.getItem("sidebarCollapsed")==="true"&&document.body.classList.add("sidebar-collapsed"),L.addEventListener("click",a=>{a.preventDefault();const t=document.body.classList.toggle("sidebar-collapsed");localStorage.setItem("sidebarCollapsed",t?"true":"false")}));const j=async()=>{const e=document.getElementById("nav-notifications"),a=document.getElementById("notif-badge"),t=document.getElementById("notif-dropdown"),s=document.getElementById("notif-list"),i=document.getElementById("mark-read-btn");if(!e)return;const r=async()=>{await p.getUnreadCount()>0?(a.style.display="block",e.style.color="#ff0000"):(a.style.display="none",e.style.color="inherit")},o=async()=>{const n=await p.getNotifications();if(n.length===0){s.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}s.innerHTML=n.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};e.addEventListener("click",async n=>{if(n.target===i)return;const l=t.style.display==="block";t.style.display=l?"none":"block",l||await o()}),i.addEventListener("click",async n=>{n.stopPropagation(),await p.markAllAsRead(),await r(),await o()}),document.addEventListener("click",n=>{e.contains(n.target)||(t.style.display="none")}),u.isLoggedIn()&&await p.checkNewEpisodes(),await r()},q=()=>{const e=document.getElementById("tv-mode-toggle"),a=document.getElementById("tv-mode-text"),t=document.getElementById("header-tv-toggle"),s=n=>{a&&(a.textContent=n?"📺 Modo TV: ON":"📺 Modo TV: OFF"),e&&(n?e.classList.add("active"):e.classList.remove("active")),t&&(n?(t.classList.add("active"),t.style.background="rgba(255, 0, 85, 0.2)",t.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",t.style.border="1px solid rgba(255, 0, 85, 0.4)"):(t.classList.remove("active"),t.style.background="rgba(255,255,255,0.05)",t.style.boxShadow="none",t.style.border="none"))},i=()=>{c.isActive?(c.destroy(),s(!1)):(c.init(),s(!0))};e&&e.addEventListener("click",n=>{n.preventDefault(),i()}),t&&t.addEventListener("click",n=>{n.preventDefault(),i()});const r=localStorage.getItem("tvMode")==="true",o=/SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon/i.test(navigator.userAgent);r||localStorage.getItem("tvMode")===null&&o?(c.init(),s(!0)):s(!1)},P=async()=>{if(await f.getSetting("theme","dark")==="light"&&document.body.classList.add("light-theme"),u.isLoggedIn())try{const a=await u.fetchFromServer();a&&await f.syncFromServer(a)}catch{console.error("Sync fail")}await j(),setTimeout(q,200)};P();
