const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-ZidRAItD.js","assets/db-DDVpz0tJ.js","assets/vendor-Cmt3X8aB.js","assets/AnimeCard-CoH8iiLz.js","assets/AnimeDetailPage-Bxb-tgcn.js","assets/WatchPage-DnHDux2k.js","assets/HistoryPage-YBEtOUT3.js","assets/FavoritesPage-DbLaZyUk.js","assets/SearchPage-DalzAnCz.js","assets/CategoryPage-BQ9JWu3L.js","assets/CalendarPage-DpTxjgtV.js"])))=>i.map(i=>d[i]);
import{c as k}from"./vendor-Cmt3X8aB.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(r){if(r.ep)return;r.ep=!0;const a=t(r);fetch(r.href,a)}})();const E="modulepreload",L=function(n){return"/"+n},v={},d=function(e,t,s){let r=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),o=(i==null?void 0:i.nonce)||(i==null?void 0:i.getAttribute("nonce"));r=Promise.allSettled(t.map(l=>{if(l=L(l),l in v)return;v[l]=!0;const u=l.endsWith(".css"),b=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${b}`))return;const c=document.createElement("link");if(c.rel=u?"stylesheet":E,u||(c.as="script"),c.crossOrigin="",c.href=l,o&&c.setAttribute("nonce",o),document.head.appendChild(c),u)return new Promise((w,x)=>{c.addEventListener("load",w),c.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(i){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=i,window.dispatchEvent(o),!o.defaultPrevented)throw i}return r.then(i=>{for(const o of i||[])o.status==="rejected"&&a(o.reason);return e().catch(a)})},_=k(n=>({theme:"dark",isDataSaver:!1,setTheme:e=>n({theme:e}),toggleDataSaver:()=>n(e=>({isDataSaver:!e.isDataSaver})),currentRoute:"/",setCurrentRoute:e=>n({currentRoute:e}),isSearchOpen:!1,setSearchOpen:e=>n({isSearchOpen:e})})),p={"/":()=>d(()=>import("./HomePage-ZidRAItD.js"),__vite__mapDeps([0,1,2,3])),"/anime":()=>d(()=>import("./AnimeDetailPage-Bxb-tgcn.js"),__vite__mapDeps([4,1,2])),"/watch":()=>d(()=>import("./WatchPage-DnHDux2k.js"),__vite__mapDeps([5,1,2])),"/history":()=>d(()=>import("./HistoryPage-YBEtOUT3.js"),__vite__mapDeps([6,1,2,3])),"/favorites":()=>d(()=>import("./FavoritesPage-DbLaZyUk.js"),__vite__mapDeps([7,1,2,3])),"/search":()=>d(()=>import("./SearchPage-DalzAnCz.js"),__vite__mapDeps([8,3,2])),"/category":()=>d(()=>import("./CategoryPage-BQ9JWu3L.js"),__vite__mapDeps([9,3,2])),"/calendar":()=>d(()=>import("./CalendarPage-DpTxjgtV.js"),__vite__mapDeps([10,2]))};class q{constructor(e){this.root=e,this.init()}init(){window.addEventListener("popstate",()=>this.handleRoute()),document.body.addEventListener("click",e=>{const t=e.target.closest("a[data-link]");t&&(e.preventDefault(),this.navigate(t.getAttribute("href")))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){const e=new URL(window.location.href),t=e.pathname;let s="/",r={};if(t.startsWith("/anime/"))s="/anime",r.id=t.split("/")[2];else if(t.startsWith("/watch/")){s="/watch";const i=t.split("/");r.animeId=i[2],r.episodeId=i[3]}else t.startsWith("/category/")?(s="/category",r.name=t.split("/")[2]):t==="/search"?(s="/search",r.q=e.searchParams.get("q")):p[t]&&(s=t);_.getState().setCurrentRoute(t);const a=p[s]||p["/"];this.root.innerHTML='<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>';try{const o=(await a()).default,l=new o(r);this.root.innerHTML="",this.root.appendChild(await l.render()),l.afterRender&&l.afterRender()}catch(i){console.error("Error loading route",i),this.root.innerHTML='<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>'}}}let h=null;const S=n=>(!h&&n&&(h=new q(n)),h);class P{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.lastRequest=0,this.minDelay=500}async request(e,t={}){const s=Date.now(),r=Math.max(0,this.lastRequest+this.minDelay-s);r>0&&await new Promise(o=>setTimeout(o,r)),this.lastRequest=Date.now();const a=new URL(`${this.baseUrl}${e}`);Object.keys(t).forEach(o=>a.searchParams.append(o,t[o]));let i=await fetch(a.toString());if(i.status===429&&(await new Promise(o=>setTimeout(o,2e3)),i=await fetch(a.toString())),!i.ok)throw new Error(`Jikan error: ${i.status}`);return i.json()}}class R{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(e,t={}){const s=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:t})});if(!s.ok)throw new Error(`AniList error: ${s.status}`);return(await s.json()).data}}class A{constructor(){this.baseUrl="http://localhost:3000/api/v1",this.apiKey="dev-anime1v-key"}async request(e,t={}){const s=new URL(`${this.baseUrl}${e}`);Object.keys(t).forEach(a=>s.searchParams.append(a,t[a]));const r=await fetch(s.toString(),{headers:{"X-API-Key":this.apiKey}});if(!r.ok)throw new Error(`Local API error: ${r.status}`);return r.json()}}class T{constructor(){this.providers={jikan:new P,anilist:new R,local:new A},this.cache=new Map}async getAnimeSearch(e){return await this.providers.jikan.request("/anime",{q:e,limit:20})}async searchLocal(e){try{return await this.providers.local.request("/anime/search",{q:e})}catch(t){return console.error("Local search failed",t),{data:[]}}}async getAnimeInfo(e){try{if(typeof e=="string"&&e.includes("http"))return await this.providers.local.request("/anime/info",{url:e});if(this.cache.has(e))return this.cache.get(e);const t=await this.providers.jikan.request(`/anime/${e}/full`);return this.cache.set(e,t),t}catch(t){throw console.error("Error fetching anime info",t),t}}async getEpisode(e){return await this.providers.local.request("/anime/episode",{url:e})}async getTrending(){return await this.providers.jikan.request("/seasons/now",{limit:20})}async getMovies(){return await this.providers.jikan.request("/anime",{type:"movie",order_by:"popularity",sort:"desc",limit:20})}async getLatest(){return await this.providers.jikan.request("/seasons/upcoming",{limit:20})}async getDubbed(){try{return await this.providers.jikan.request("/anime",{q:"Latino",limit:24,order_by:"popularity",sort:"desc"})}catch{return await this.providers.local.request("/anime/search",{q:"Latino"})}}async getSchedule(){return await this.providers.jikan.request("/seasons/now")}async getAnimeRelations(e){return await this.providers.jikan.request(`/anime/${e}/relations`)}async getAnilistBanner(e){var s;const t=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          bannerImage
        }
      }
    `;try{return(s=(await this.providers.anilist.request(t,{id:e})).Media)==null?void 0:s.bannerImage}catch{return null}}}const j=new T;class C{constructor(e){this.router=e,this.timeout=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
      <style>
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0,0,0,0.8);
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
      `,this.timeout=setTimeout(async()=>{try{const r=((await j.getAnimeSearch(t)).data||[]).slice(0,8);r.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${r.map(a=>{var i,o;return`
                    <a href="/anime/${a.mal_id||a.id}" data-link class="result-item search-result-item">
                      <img src="${((o=(i=a.images)==null?void 0:i.jpg)==null?void 0:o.image_url)||a.image||""}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${a.title}</div>
                        <div class="result-item-meta">${a.type||"TV"} • ${a.year||a.status||""}</div>
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
            `,this.resultsContainer.querySelectorAll(".search-result-item, a[data-link]").forEach(a=>{a.addEventListener("click",()=>{this.close()})})):this.resultsContainer.innerHTML=`
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
          `}},400)}),this.input.addEventListener("keydown",e=>{if(e.key==="Enter"){const t=this.input.value.trim();t&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(t)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active"),this.input.value=""}}const f=document.getElementById("app"),I=S(f),g=new C(I),y=document.createElement("header");y.innerHTML=`
  <style>
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 68px;
      display: flex;
      align-items: center;
      padding: 0 4%;
      background: transparent;
      transition: background var(--transition-smooth);
    }

    .navbar.scrolled {
      background: var(--bg-primary);
      box-shadow: 0 2px 20px rgba(0,0,0,0.5);
    }

    .navbar::after {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--gradient-navbar);
      opacity: 0;
      transition: opacity var(--transition-smooth);
      pointer-events: none;
    }

    .navbar.scrolled::after {
      opacity: 1;
    }

    .nav-content {
      position: relative;
      z-index: 1;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }

    .nav-left {
      display: flex;
      align-items: center;
    }

    .nav-logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--accent);
      letter-spacing: -0.02em;
      margin-right: 32px;
      text-decoration: none;
    }

    .nav-links {
      display: flex;
      gap: 20px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .nav-links a {
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-decoration: none;
      transition: color var(--transition-fast);
      font-weight: 500;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: var(--text-primary);
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-search-btn {
      background: transparent;
      border: none;
      color: var(--text-primary);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      padding: 8px;
      border-radius: var(--radius-sm);
      transition: background var(--transition-fast);
    }

    .nav-search-btn:hover {
      background: rgba(255,255,255,0.1);
    }

    .nav-search-btn kbd {
       padding: 2px 6px;
       background: rgba(255,255,255,0.1);
       border: 1px solid var(--glass-border);
       border-radius: var(--radius-sm);
       font-size: 0.7rem;
       color: var(--text-muted);
    }

    /* Mobile Nav */
    .mobile-nav {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(18, 18, 26, 0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid var(--glass-border);
      justify-content: space-around;
      align-items: center;
      z-index: 1000;
      padding-bottom: env(safe-area-inset-bottom);
    }

    .mobile-nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      color: var(--text-muted);
      font-size: 0.65rem;
      text-decoration: none;
      transition: color var(--transition-fast);
      padding: 8px;
    }

    .mobile-nav-item.active {
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .mobile-nav { display: flex; }
      .navbar { padding: 0 16px; }
      .nav-search-btn kbd { display: none; }
    }
  </style>
  <nav class="navbar" id="main-navbar">
    <div class="nav-content">
      <div class="nav-left">
        <a href="/" data-link class="nav-logo">AniRD</a>
        <ul class="nav-links">
          <li><a href="/" data-link>Inicio</a></li>
          <li><a href="/category/popular" data-link>Populares</a></li>
          <li><a href="/category/movies" data-link>Películas</a></li>
          <li><a href="/category/dub" data-link>Latino</a></li>
          <li><a href="/calendar" data-link>Calendario</a></li>
        </ul>
      </div>
      <div class="nav-right">
        <button class="nav-search-btn" id="open-search-btn">
          <span>🔍 Buscar</span>
          <kbd>Cmd+K</kbd>
        </button>
        <a href="/my-anird" data-link style="width: 32px; height: 32px; border-radius: 4px; background: var(--accent); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; font-weight: bold; font-size: 0.9rem;">
          Tú
        </a>
      </div>
    </div>
  </nav>

  <nav class="mobile-nav">
     <a href="/" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">🏠</span>
       <span>Inicio</span>
     </a>
     <a href="#" class="mobile-nav-item" id="mobile-search-btn">
       <span style="font-size: 1.2rem;">🔍</span>
       <span>Buscar</span>
     </a>
     <a href="/calendar" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">📅</span>
       <span>Emisiones</span>
     </a>
     <a href="/my-anird" data-link class="mobile-nav-item">
       <span style="font-size: 1.2rem;">👤</span>
       <span>Mi AniRD</span>
     </a>
  </nav>
`;document.body.insertBefore(y,f);const m=document.getElementById("main-navbar");window.addEventListener("scroll",()=>{window.scrollY>20?m.classList.add("scrolled"):m.classList.remove("scrolled")});document.getElementById("open-search-btn").addEventListener("click",()=>{g.open()});document.getElementById("mobile-search-btn").addEventListener("click",n=>{n.preventDefault(),g.open()});"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js").then(n=>{console.log("SW registered: ",n)}).catch(n=>{console.log("SW registration failed: ",n)})});export{j as a};
