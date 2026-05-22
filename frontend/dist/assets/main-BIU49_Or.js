const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js","assets/page-animedetailpage-BoYs1ihs.js","assets/page-watchpage-ZhMZ1531.js","assets/page-historypage-CqZNK3jg.js","assets/page-favoritespage-BsIX1kVp.js","assets/page-searchpage-bBXt4b5Y.js","assets/page-categorypage-BQusQMjN.js","assets/page-calendarpage-Dcd-pGqP.js","assets/page-authpage-BIx7dg_8.js","assets/page-profilepage-BokF0LBc.js"])))=>i.map(i=>d[i]);
import{_ as d}from"./page-favoritespage-BsIX1kVp.js";import{c as E}from"./vendor-DIPEJTOH.js";import{a as L,b as c,c as v,d as f}from"./page-homepage-HfrhAw2J.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function e(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=e(a);fetch(a.href,n)}})();const g=E(i=>({theme:"dark",isDataSaver:!1,setTheme:t=>i({theme:t}),toggleDataSaver:()=>i(t=>({isDataSaver:!t.isDataSaver})),currentRoute:"/",setCurrentRoute:t=>i({currentRoute:t}),isSearchOpen:!1,setSearchOpen:t=>i({isSearchOpen:t})})),u={"/":()=>d(()=>import("./page-homepage-HfrhAw2J.js").then(i=>i.H),__vite__mapDeps([0,1])),"/anime":()=>d(()=>import("./page-animedetailpage-BoYs1ihs.js"),__vite__mapDeps([2,0,1])),"/watch":()=>d(()=>import("./page-watchpage-ZhMZ1531.js"),__vite__mapDeps([3,0,1])),"/history":()=>d(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/favorites":()=>d(()=>import("./page-favoritespage-BsIX1kVp.js").then(i=>i.F),__vite__mapDeps([5,0,1])),"/search":()=>d(()=>import("./page-searchpage-bBXt4b5Y.js"),__vite__mapDeps([6,0,1])),"/category":()=>d(()=>import("./page-categorypage-BQusQMjN.js"),__vite__mapDeps([7,0,1])),"/calendar":()=>d(()=>import("./page-calendarpage-Dcd-pGqP.js"),__vite__mapDeps([8,0,1])),"/my-anird":()=>d(()=>import("./page-historypage-CqZNK3jg.js"),__vite__mapDeps([4,0,1])),"/auth":()=>d(()=>import("./page-authpage-BIx7dg_8.js"),__vite__mapDeps([9,0,1])),"/profile":()=>d(()=>import("./page-profilepage-BokF0LBc.js"),__vite__mapDeps([10,5,0,1]))};class _{constructor(t){this.root=t,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",t=>{const e=t.target.closest("a[data-link]");e&&(t.preventDefault(),this.navigate(e.getAttribute("href")))}),this.handleRoute()}navigate(t){window.history.pushState(null,null,t),this.handleRoute()}async handleRoute(){const t=new URL(window.location.href),e=t.pathname;let r="/",a={};const n={popular:"Animes Populares",movies:"Películas",latest:"Últimos Lanzamientos",dub:"Anime Latino",action:"Acción",comedy:"Comedia",romance:"Romance",supernatural:"Sobrenatural",adventure:"Aventura",drama:"Drama",fantasy:"Fantasía",music:"Musical","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",thriller:"Thriller"};if(e.startsWith("/anime/"))r="/anime",a.id=e.split("/")[2],document.title="Cargando... — AniRD";else if(e.startsWith("/watch/")){r="/watch";const s=e.split("/");a.id=s[2],a.ep=s[3],a.lang=s[4]||"sub",document.title=`Ep. ${a.ep} — AniRD`}else e.startsWith("/category/")?(r="/category",a.name=e.split("/")[2],document.title=`${n[a.name]||"Explorar"} — AniRD`):e==="/search"?(r="/search",a.q=t.searchParams.get("q"),document.title=`Buscar "${a.q||""}" — AniRD`):e==="/profile"?(r="/profile",document.title="Mi Perfil — AniRD"):e==="/auth"?(r="/auth",document.title="Iniciar Sesión — AniRD"):e==="/calendar"?(r="/calendar",document.title="Calendario — AniRD"):e==="/history"||e==="/my-anird"?(r=u[e]?e:"/",document.title="Mi Historial — AniRD"):e==="/favorites"?(r="/favorites",document.title="Favoritos — AniRD"):(u[e]&&(r=e),document.title="AniRD — Tu plataforma de anime");g.getState().setCurrentRoute(e);const o=u[r]||u["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const l=(await o()).default,m=new l(a);this.root.innerHTML="",this.root.appendChild(await m.render()),m.afterRender&&m.afterRender()}catch(s){console.error("Error loading route",s),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let h=null;const A=i=>(!h&&i&&(h=new _(i)),h);class R{constructor(t){this.router=t,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
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
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results")}bindEvents(){document.addEventListener("keydown",t=>{(t.metaKey||t.ctrlKey)&&t.key==="k"&&(t.preventDefault(),this.open()),t.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",t=>{t.target===this.container&&this.close()}),this.input.addEventListener("input",t=>{const e=t.target.value.trim();if(clearTimeout(this.timeout),e.length<3){this.resultsContainer.innerHTML=`
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
      `,this.timeout=setTimeout(async()=>{try{const a=((await L.getAnimeSearch(e)).data||[]).slice(0,8);a.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${a.map(n=>{var o,s;return`
                    <a href="/anime/${n.mal_id||n.id}" data-link class="result-item search-result-item">
                      <img src="${((s=(o=n.images)==null?void 0:o.jpg)==null?void 0:s.image_url)||n.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${n.title}</div>
                        <div class="result-item-meta">${n.type||"TV"} • ${n.year||n.status||""}</div>
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
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(n=>{n.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${e}"
                </div>
              </div>
            `}catch(r){console.error("Search error:",r),this.resultsContainer.innerHTML=`
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `}},400)}),this.input.addEventListener("keydown",t=>{if(t.key==="Enter"){const e=this.input.value.trim();e&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(e)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const p={async checkNewEpisodes(){const i=await c.following.toArray();let t=!1;for(const e of i)if(e.status==="Currently Airing"&&e.broadcast&&e.broadcast.day&&e.broadcast.day!=="Unknown"){const r=this.getLastBroadcast(e.broadcast);r&&(!e.lastNotified||r>e.lastNotified)&&(await c.notifications.where("animeId").equals(e.animeId).and(n=>n.timestamp===r).first()||(await c.notifications.add({animeId:e.animeId,isRead:0,timestamp:r}),t=!0),await c.following.update(e.animeId,{lastNotified:r}))}return t},getLastBroadcast(i){const t={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(t[i.day]===void 0)return null;const[e,r]=i.time.split(":").map(Number),a=new Date(new Date().toLocaleString("en-US",{timeZone:i.timezone||"Asia/Tokyo"}));let n=new Date(a);n.setHours(e,r,0,0);let o=t[i.day]-a.getDay();(o<0||o===0&&n<=a)&&(o+=7),n.setDate(n.getDate()+o);const s=new Date(n);if(s.setDate(s.getDate()-7),s>a)return null;const l=s.getTime()-a.getTime();return Date.now()+l},async getUnreadCount(){return await c.notifications.where("isRead").equals(0).count()},async getNotifications(){const i=await c.notifications.orderBy("timestamp").reverse().toArray(),t=[];for(const e of i){const r=await c.following.get(e.animeId);r&&t.push({...e,title:r.title,cover:r.cover})}return t},async markAllAsRead(){await c.notifications.where("isRead").equals(0).modify({isRead:1})}},y=document.getElementById("app"),D=A(y),x=new R(D),b=document.createElement("header");b.innerHTML=`
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
`;document.body.insertBefore(b,y);const w=()=>{const i=document.getElementById("profile-link"),t=document.getElementById("mobile-profile-link"),e=v.isLoggedIn(),r=e?"/profile":"/auth",a=e?"Mi Perfil":"Entrar";if(i&&(i.setAttribute("href",r),i.textContent=a),t){t.setAttribute("href",r);const n=t.querySelector(".nav-label");n&&(n.textContent=e?"Perfil":"Entrar")}},k=i=>{const t=document.getElementById("bottomNav");if(!t)return;const e=t.querySelectorAll(".nav-item");e.forEach(a=>{a.classList.remove("active");const n=a.querySelector("svg");n&&n.setAttribute("stroke-width","1.8")});let r=-1;if(i==="/"||i.startsWith("/anime/")||i.startsWith("/category/")||i.startsWith("/watch/")||i==="/calendar"?r=0:i==="/favorites"?r=2:(i==="/profile"||i==="/auth")&&(r=3),r!==-1&&e[r]){e[r].classList.add("active");const a=e[r].querySelector("svg");a&&a.setAttribute("stroke-width","2.2")}};g.subscribe(i=>{k(i.currentRoute)});window.updateNavbarAuth=w;w();k(window.location.pathname);document.getElementById("open-search-btn").addEventListener("click",()=>x.open());document.getElementById("mobile-search-btn").addEventListener("click",i=>{i.preventDefault(),x.open()});const S=async()=>{const i=document.getElementById("nav-notifications"),t=document.getElementById("notif-badge"),e=document.getElementById("notif-dropdown"),r=document.getElementById("notif-list"),a=document.getElementById("mark-read-btn");if(!i)return;const n=async()=>{await p.getUnreadCount()>0?(t.style.display="block",i.style.color="#ff0000"):(t.style.display="none",i.style.color="inherit")},o=async()=>{const s=await p.getNotifications();if(s.length===0){r.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}r.innerHTML=s.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};i.addEventListener("click",async s=>{if(s.target===a)return;const l=e.style.display==="block";e.style.display=l?"none":"block",l||await o()}),a.addEventListener("click",async s=>{s.stopPropagation(),await p.markAllAsRead(),await n(),await o()}),document.addEventListener("click",s=>{i.contains(s.target)||(e.style.display="none")}),v.isLoggedIn()&&await p.checkNewEpisodes(),await n()},I=async()=>{if(await f.getSetting("theme","dark")==="light"&&document.body.classList.add("light-theme"),v.isLoggedIn())try{const t=await v.fetchFromServer();t&&await f.syncFromServer(t)}catch{console.error("Sync fail")}await S()};I();
