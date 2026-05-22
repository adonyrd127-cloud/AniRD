const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-C8RU0l7O.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-Y1uIqXzi.js","assets/page-watchpage-DFBNsA2o.js","assets/page-historypage-DCNoGSDz.js","assets/page-favoritespage-Dwpj0Byw.js","assets/page-searchpage-CeNJVPzl.js","assets/page-categorypage-CfglTy4z.js","assets/page-calendarpage-UOM5BGRR.js","assets/page-authpage-BseNeimM.js","assets/page-profilepage-77RqPQOi.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./page-favoritespage-Dwpj0Byw.js";import{c as w}from"./vendor-DIPEJTOH.js";import{a as k,b as c,c as m,d as v}from"./page-homepage-C8RU0l7O.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const E=w(r=>({theme:"dark",isDataSaver:!1,setTheme:e=>r({theme:e}),toggleDataSaver:()=>r(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>r({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>r({isSearchOpen:e})})),u={"/":()=>d(()=>import("./page-homepage-C8RU0l7O.js").then(r=>r.H),__vite__mapDeps([0,1])),"/anime":()=>d(()=>import("./page-animedetailpage-Y1uIqXzi.js"),__vite__mapDeps([2,0,1])),"/watch":()=>d(()=>import("./page-watchpage-DFBNsA2o.js"),__vite__mapDeps([3,0,1])),"/history":()=>d(()=>import("./page-historypage-DCNoGSDz.js"),__vite__mapDeps([4,0,1])),"/favorites":()=>d(()=>import("./page-favoritespage-Dwpj0Byw.js").then(r=>r.F),__vite__mapDeps([5,0,1])),"/search":()=>d(()=>import("./page-searchpage-CeNJVPzl.js"),__vite__mapDeps([6,0,1])),"/category":()=>d(()=>import("./page-categorypage-CfglTy4z.js"),__vite__mapDeps([7,0,1])),"/calendar":()=>d(()=>import("./page-calendarpage-UOM5BGRR.js"),__vite__mapDeps([8,0,1])),"/my-anird":()=>d(()=>import("./page-historypage-DCNoGSDz.js"),__vite__mapDeps([4,0,1])),"/auth":()=>d(()=>import("./page-authpage-BseNeimM.js"),__vite__mapDeps([9,0,1])),"/profile":()=>d(()=>import("./page-profilepage-77RqPQOi.js"),__vite__mapDeps([10,5,0,1]))};class L{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let n="/",a={};const i={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(t.startsWith("/anime/"))n="/anime",a.id=t.split("/")[2],document.title="Cargando... — AniRD";else if(t.startsWith("/watch/")){n="/watch";const s=t.split("/");a.id=s[2],a.ep=s[3],a.lang=s[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else t.startsWith("/category/")?(n="/category",a.name=t.split("/")[2],document.title=`${i[a.name]||"Explorar"} — AniRD`):t==="/search"?(n="/search",a.q=e.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):t==="/profile"?(n="/profile",document.title="Mi Perfil — AniRD"):t==="/auth"?(n="/auth",document.title="Iniciar Sesión — AniRD"):t==="/calendar"?(n="/calendar",document.title="Calendario — AniRD"):t==="/history"||t==="/my-anird"?(n=u[t]?t:"/",document.title="Mi Historial — AniRD"):t==="/favorites"?(n="/favorites",document.title="Favoritos — AniRD"):(u[t]&&(n=t),document.title="AniRD — Tu plataforma de anime");E.getState().setCurrentRoute(t);const o=u[n]||u["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const l=(await o()).default,h=new l(a);this.root.innerHTML="",this.root.appendChild(await h.render()),h.afterRender&&h.afterRender()}catch(s){console.error("Error loading route",s),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let f=null;const _=r=>(!f&&r&&(f=new L(r)),f);class R{constructor(e){this.router=e,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
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
      `,this.timeout=setTimeout(async()=>{try{const a=((await k.getAnimeSearch(t)).data||[]).slice(0,8);a.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${a.map(i=>{var o,s;return`
                    <a href="/anime/${i.mal_id||i.id}" data-link class="result-item search-result-item">
                      <img src="${((s=(o=i.images)==null?void 0:o.jpg)==null?void 0:s.image_url)||i.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${i.title}</div>
                        <div class="result-item-meta">${i.type||"TV"} • ${i.year||i.status||""}</div>
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
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(i=>{i.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${t}"
                </div>
              </div>
            `}catch(n){console.error("Search error:",n),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",e=>{if(e.key==="Enter"){const t=this.input.value.trim();t&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(t)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const p={async checkNewEpisodes(){const r=await c.following.toArray();let e=!1;for(const t of r)if(t.status==="Currently Airing"&&t.broadcast&&t.broadcast.day&&t.broadcast.day!=="Unknown"){const n=this.getLastBroadcast(t.broadcast);n&&(!t.lastNotified||n>t.lastNotified)&&(await c.notifications.where("animeId").equals(t.animeId).and(i=>i.timestamp===n).first()||(await c.notifications.add({animeId:t.animeId,isRead:0,timestamp:n}),e=!0),await c.following.update(t.animeId,{lastNotified:n}))}return e},getLastBroadcast(r){const e={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(e[r.day]===void 0)return null;const[t,n]=r.time.split(":").map(Number),a=new Date(new Date().toLocaleString("en-US",{timeZone:r.timezone||"Asia/Tokyo"}));let i=new Date(a);i.setHours(t,n,0,0);let o=e[r.day]-a.getDay();(o<0||o===0&&i<=a)&&(o+=7),i.setDate(i.getDate()+o);const s=new Date(i);if(s.setDate(s.getDate()-7),s>a)return null;const l=s.getTime()-a.getTime();return Date.now()+l},async getUnreadCount(){return await c.notifications.where("isRead").equals(0).count()},async getNotifications(){const r=await c.notifications.orderBy("timestamp").reverse().toArray(),e=[];for(const t of r){const n=await c.following.get(t.animeId);n&&e.push({...t,title:n.title,cover:n.cover})}return e},async markAllAsRead(){await c.notifications.where("isRead").equals(0).modify({isRead:1})}},g=document.getElementById("app"),A=_(g),y=new R(A),x=document.createElement("header");x.innerHTML=`
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

  <nav class="mobile-nav">
     <a href="/" data-link class="mobile-nav-item">🏠<span>Inicio</span></a>
     <a href="#" class="mobile-nav-item" id="mobile-search-btn">🔍<span>Buscar</span></a>
     <a href="/calendar" data-link class="mobile-nav-item">📅<span>Emisiones</span></a>
     <a id="mobile-profile-link" href="/auth" data-link class="mobile-nav-item">👤<span>Entrar</span></a>
  </nav>
`;document.body.insertBefore(x,g);const b=()=>{const r=document.getElementById("profile-link"),e=document.getElementById("mobile-profile-link"),t=m.isLoggedIn(),n=t?"/profile":"/auth",a=t?"Mi Perfil":"Entrar";if(r&&(r.setAttribute("href",n),r.textContent=a),e){e.setAttribute("href",n);const i=e.querySelector("span:last-child");i&&(i.textContent=a)}};window.updateNavbarAuth=b;b();document.getElementById("open-search-btn").addEventListener("click",()=>y.open());document.getElementById("mobile-search-btn").addEventListener("click",r=>{r.preventDefault(),y.open()});const D=async()=>{const r=document.getElementById("nav-notifications"),e=document.getElementById("notif-badge"),t=document.getElementById("notif-dropdown"),n=document.getElementById("notif-list"),a=document.getElementById("mark-read-btn");if(!r)return;const i=async()=>{await p.getUnreadCount()>0?(e.style.display="block",r.style.color="#ff0000"):(e.style.display="none",r.style.color="inherit")},o=async()=>{const s=await p.getNotifications();if(s.length===0){n.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}n.innerHTML=s.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};r.addEventListener("click",async s=>{if(s.target===a)return;const l=t.style.display==="block";t.style.display=l?"none":"block",l||await o()}),a.addEventListener("click",async s=>{s.stopPropagation(),await p.markAllAsRead(),await i(),await o()}),document.addEventListener("click",s=>{r.contains(s.target)||(t.style.display="none")}),m.isLoggedIn()&&await p.checkNewEpisodes(),await i()},S=async()=>{if(await v.getSetting("theme","dark")==="light"&&document.body.classList.add("light-theme"),m.isLoggedIn())try{const e=await m.fetchFromServer();e&&await v.syncFromServer(e)}catch{console.error("Sync fail")}await D()};S();
