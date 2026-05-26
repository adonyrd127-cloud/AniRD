import{g as I,u as T}from"./page-watchpage-vY_L_15W.js";import{a as D,b as d,c as u,d as g}from"./page-homepage-ENQx0n2_.js";import{s as c}from"./page-profilepage-D3-lKUq0.js";import"./vendor-DIPEJTOH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const n of s.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&r(n)}).observe(document,{childList:!0,subtree:!0});function a(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=a(i);fetch(i.href,s)}})();class M{constructor(t){this.router=t,this.timeout=null,this.abortController=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
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
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results")}bindEvents(){document.addEventListener("keydown",t=>{(t.metaKey||t.ctrlKey)&&t.key==="k"&&(t.preventDefault(),this.open()),t.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",t=>{t.target===this.container&&this.close()}),this.input.addEventListener("input",t=>{const a=t.target.value.trim();this.abortController&&this.abortController.abort(),this.abortController=new AbortController;const r=this.abortController.signal;if(a.length<3){this.resultsContainer.innerHTML=`
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
      `,this.timeout=setTimeout(async()=>{try{const i=await D.getAnimeSearch(a,{signal:r});if(r.aborted)return;const s=(i.data||[]).slice(0,8);s.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${s.map(n=>{var o,l;return`
                    <a href="/anime/${n.mal_id||n.id}" data-link class="result-item search-result-item">
                      <img src="${((l=(o=n.images)==null?void 0:o.jpg)==null?void 0:l.image_url)||n.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${n.title}</div>
                        <div class="result-item-meta">${n.type||"TV"} • ${n.year||n.status||""}</div>
                      </div>
                    </a>
                  `}).join("")}
                </div>
              </div>
              <div class="result-group">
                 <a href="/search?q=${encodeURIComponent(a)}" data-link class="result-item" style="justify-content: center; color: var(--accent);">
                    Ver todos los resultados para "${a}"
                 </a>
              </div>
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(n=>{n.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${a}"
                </div>
              </div>
            `}catch(i){if(i.name==="AbortError")return;console.error("Search error:",i),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",t=>{if(t.key==="Enter"){const a=this.input.value.trim();a&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(a)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const p={async checkNewEpisodes(){const e=await d.following.toArray();let t=!1;for(const a of e)if(a.status==="Currently Airing"&&a.broadcast&&a.broadcast.day&&a.broadcast.day!=="Unknown"){const r=this.getLastBroadcast(a.broadcast);r&&(!a.lastNotified||r>a.lastNotified)&&(await d.notifications.where("animeId").equals(a.animeId).and(s=>s.timestamp===r).first()||(await d.notifications.add({animeId:a.animeId,isRead:0,timestamp:r}),t=!0),await d.following.update(a.animeId,{lastNotified:r}))}return t},getLastBroadcast(e){const t={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(t[e.day]===void 0)return null;const[a,r]=e.time.split(":").map(Number),i=new Date(new Date().toLocaleString("en-US",{timeZone:e.timezone||"Asia/Tokyo"}));let s=new Date(i);s.setHours(a,r,0,0);let n=t[e.day]-i.getDay();(n<0||n===0&&s<=i)&&(n+=7),s.setDate(s.getDate()+n);const o=new Date(s);if(o.setDate(o.getDate()-7),o>i)return null;const l=o.getTime()-i.getTime();return Date.now()+l},async getUnreadCount(){return await d.notifications.where("isRead").equals(0).count()},async getNotifications(){const e=await d.notifications.orderBy("timestamp").reverse().toArray(),t=[];for(const a of e){const r=await d.following.get(a.animeId);r&&t.push({...a,title:r.title,cover:r.cover})}return t},async markAllAsRead(){await d.notifications.where("isRead").equals(0).modify({isRead:1})}},h=document.getElementById("app"),N=I(h),q=new M(N),S=document.createElement("header");S.innerHTML=`
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
`;document.body.insertBefore(S,h);const m=document.createElement("aside");m.className="desktop-sidebar";m.innerHTML=`
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
`;document.body.insertBefore(m,h);const E=()=>{const e=document.getElementById("profile-link"),t=document.getElementById("mobile-profile-link"),a=document.getElementById("sidebar-profile-link"),r=document.getElementById("profile-avatar-container"),i=document.getElementById("profile-username-text"),s=u.isLoggedIn(),n=u.getUser(),o=s?"/profile":"/auth";if(e&&(e.setAttribute("href",o),s?(r&&r.classList.add("active-border"),i&&(i.textContent=(n==null?void 0:n.username)||"Perfil")):(r&&r.classList.remove("active-border"),i&&(i.textContent="Entrar"))),t){t.setAttribute("href",o);const l=t.querySelector(".nav-label");l&&(l.textContent=s?"Perfil":"Entrar")}if(a){a.setAttribute("href",o);const l=a.querySelector("span");l&&(l.textContent=s?"Mi Perfil":"Entrar")}},B=e=>{const t=document.getElementById("bottomNav");if(!t)return;const a=t.querySelectorAll(".nav-item");a.forEach(i=>{i.classList.remove("active");const s=i.querySelector("svg");s&&s.setAttribute("stroke-width","1.8")});let r=-1;if(e==="/"||e.startsWith("/anime/")||e.startsWith("/category/")||e.startsWith("/watch/")||e==="/calendar"?r=0:e==="/favorites"?r=2:(e==="/profile"||e==="/auth")&&(r=3),r!==-1&&a[r]){a[r].classList.add("active");const i=a[r].querySelector("svg");i&&i.setAttribute("stroke-width","2.2")}},C=e=>{const t=document.querySelector(".desktop-sidebar");if(!t)return;t.querySelectorAll(".sidebar-link").forEach(s=>s.classList.remove("active"));let r="/";e==="/"||e.startsWith("/anime/")||e.startsWith("/watch/")||e.startsWith("/category/")||e==="/calendar"?r="/":e==="/favorites"?r="/favorites":e==="/history"||e==="/my-anird"?r="/history":(e==="/profile"||e==="/auth")&&(r="/profile");const i=t.querySelector(`.sidebar-link[data-route="${r}"]`);i&&i.classList.add("active")},A=async()=>{const e=document.getElementById("sidebar-following-list");if(e)try{const t=await g.getFollowing();if(t.length===0){e.innerHTML=`
        <div class="sidebar-following-empty">
          Aún no sigues ningún anime. Haz clic en "Seguir" en la ficha del anime para agregarlo aquí.
        </div>
      `;return}const a=await d.history.orderBy("updatedAt").reverse().toArray(),r=new Map;a.forEach(i=>{r.has(i.animeId)||r.set(i.animeId,i.episodeId)}),e.innerHTML=t.slice(0,5).map(i=>{const s=Number(i.animeId),n=r.get(s),o=n?`Ep. ${n}`:"Ver ahora";return`
        <a href="/anime/${s}" data-link class="sidebar-following-item">
          <img class="sidebar-following-cover" src="${i.cover}" alt="${i.title}" loading="lazy">
          <div class="sidebar-following-info">
            <div class="sidebar-following-title">${i.title}</div>
            <div class="sidebar-following-ep">${o}</div>
          </div>
        </a>
      `}).join("")}catch(t){console.error("Error al renderizar siguiendo en la barra lateral:",t)}};T.subscribe(e=>{B(e.currentRoute),C(e.currentRoute),A(),c.isActive&&setTimeout(()=>{c.updateFocusables(),c.focusFirstAvailable()},400)});window.updateNavbarAuth=E;E();B(window.location.pathname);C(window.location.pathname);A();const v=e=>{e&&e.preventDefault(),q.open()},y=document.getElementById("desktop-search-trigger");y&&y.addEventListener("click",v);const b=document.getElementById("open-search-btn");b&&b.addEventListener("click",v);const k=document.getElementById("mobile-search-btn");k&&k.addEventListener("click",v);const w=document.getElementById("sidebar-search-btn");w&&w.addEventListener("click",v);const f=document.getElementById("sidebar-categories-trigger"),x=document.getElementById("sidebar-categories-dropdown");f&&x&&f.addEventListener("click",e=>{e.preventDefault(),f.classList.toggle("expanded"),x.classList.toggle("expanded")});const L=document.getElementById("sidebar-collapse-btn");L&&(localStorage.getItem("sidebarCollapsed")==="true"&&document.body.classList.add("sidebar-collapsed"),L.addEventListener("click",t=>{t.preventDefault();const a=document.body.classList.toggle("sidebar-collapsed");localStorage.setItem("sidebarCollapsed",a?"true":"false")}));const P=async()=>{const e=document.getElementById("nav-notifications"),t=document.getElementById("notif-badge"),a=document.getElementById("notif-dropdown"),r=document.getElementById("notif-list"),i=document.getElementById("mark-read-btn");if(!e)return;const s=async()=>{await p.getUnreadCount()>0?(t.style.display="block",e.style.color="#ff0000"):(t.style.display="none",e.style.color="inherit")},n=async()=>{const o=await p.getNotifications();if(o.length===0){r.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}r.innerHTML=o.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};e.addEventListener("click",async o=>{if(o.target===i)return;const l=a.style.display==="block";a.style.display=l?"none":"block",l||await n()}),i.addEventListener("click",async o=>{o.stopPropagation(),await p.markAllAsRead(),await s(),await n()}),document.addEventListener("click",o=>{e.contains(o.target)||(a.style.display="none")}),u.isLoggedIn()&&await p.checkNewEpisodes(),await s()},R=()=>{const e=document.getElementById("tv-mode-toggle"),t=document.getElementById("tv-mode-text"),a=document.getElementById("header-tv-toggle"),r=o=>{t&&(t.textContent=o?"📺 Modo TV: ON":"📺 Modo TV: OFF"),e&&(o?e.classList.add("active"):e.classList.remove("active")),a&&(o?(a.classList.add("active"),a.style.background="rgba(255, 0, 85, 0.2)",a.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",a.style.border="1px solid rgba(255, 0, 85, 0.4)"):(a.classList.remove("active"),a.style.background="rgba(255,255,255,0.05)",a.style.boxShadow="none",a.style.border="none"))},i=()=>{c.isActive?(c.destroy(),r(!1)):(c.init(),r(!0))};e&&e.addEventListener("click",o=>{o.preventDefault(),i()}),a&&a.addEventListener("click",o=>{o.preventDefault(),i()});const s=localStorage.getItem("tvMode")==="true",n=(/AniRD-AndroidTV|SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon|Chromecast|DroidTV|TV\s+Box|Smart_TV|MiBox|Shield/i.test(navigator.userAgent)||navigator.userAgent.toLowerCase().includes("tv"))&&!navigator.userAgent.includes("AniRD-AndroidMobile");s||localStorage.getItem("tvMode")===null&&n?(c.init(),r(!0)):r(!1)},z=async()=>{let e=await g.getSetting("theme",null);if(e||(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),e==="light"?document.body.classList.add("light-theme"):document.body.classList.remove("light-theme"),u.isLoggedIn())try{const t=await u.fetchFromServer();t&&await g.syncFromServer(t)}catch{console.error("Sync fail")}await P(),setTimeout(R,200)};z();"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").catch(console.warn);window.AniRDBridge={isPlaying:()=>{const e=document.body.classList.contains("player-active")||document.querySelector(".watch-container")!==null,t=document.querySelector("video")!==null,a=document.querySelector("#video-container iframe, iframe")!==null;return e&&(t||a)},enterPip:()=>{document.body.classList.add("pip-mode")},exitPip:()=>{document.body.classList.remove("pip-mode")},play:()=>{const e=document.querySelector("video");if(e)e.play().catch(t=>console.error("Play error:",t));else{const t=document.querySelector("iframe");t&&t.contentWindow&&t.contentWindow.postMessage(JSON.stringify({event:"command",func:"playVideo"}),"*")}},pause:()=>{const e=document.querySelector("video");if(e)e.pause();else{const t=document.querySelector("iframe");t&&t.contentWindow&&t.contentWindow.postMessage(JSON.stringify({event:"command",func:"pauseVideo"}),"*")}},togglePlayPause:()=>{const e=document.querySelector("video");e&&(e.paused?e.play().catch(t=>console.error("Play error:",t)):e.pause())},nextEpisode:()=>{const e=document.querySelector('.next-episode-btn, #next-ep-btn, button[title*="Siguiente"], a[title*="Siguiente"]');e&&e.click()},prevEpisode:()=>{const e=document.querySelector('.prev-episode-btn, #prev-ep-btn, button[title*="Anterior"], a[title*="Anterior"]');e&&e.click()},seekForward:e=>{const t=document.querySelector("video");t&&(t.currentTime=Math.min(t.duration||0,t.currentTime+e))},seekBack:e=>{const t=document.querySelector("video");t&&(t.currentTime=Math.max(0,t.currentTime-e))},handleBack:()=>{const e=document.querySelector('.modal.active, .dropdown.open, #notif-dropdown[style*="block"]');return e?(e.id==="notif-dropdown"?e.style.display="none":e.classList.remove("active","open"),!0):!1},loginWithToken:e=>{e&&u.loginWithToken(e).then(()=>{window.updateNavbarAuth&&window.updateNavbarAuth()}).catch(t=>console.error("Auto login token error:",t))},notifyPlayback:(e,t)=>{window.Android&&window.Android.onPlaybackChanged&&window.Android.onPlaybackChanged(e,t)}};setInterval(()=>{const e=document.querySelector("video");if(e&&!e.dataset.hasAniRDListener){e.dataset.hasAniRDListener="true";const t=()=>{const a=document.querySelector(".watch-anime-title, .anime-title, h1, h2"),r=a?a.textContent.trim():"AniRD Video";window.AniRDBridge&&window.AniRDBridge.notifyPlayback&&window.AniRDBridge.notifyPlayback(r,!e.paused)};e.addEventListener("play",t),e.addEventListener("pause",t),e.addEventListener("ended",()=>{window.AniRDBridge&&window.AniRDBridge.notifyPlayback&&window.AniRDBridge.notifyPlayback("AniRD",!1)})}},1e3);
