import{g as L,u as S}from"./page-watchpage-DLAUAfeX.js";import{a as A,b as d,c as p,d as h}from"./page-homepage-CrySyT2k.js";import{s as c}from"./page-profilepage-tcq7z4mM.js";import"./vendor-DIPEJTOH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();class E{constructor(t){this.router=t,this.timeout=null,this.abortController=null,this.render(),this.bindEvents()}render(){this.container=document.createElement("div"),this.container.className="search-overlay",this.container.id="searchOverlay",this.container.innerHTML=`
      <style>
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10vh;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease-out;
        }

        .search-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .search-modal {
          width: 100%;
          max-width: 672px; /* max-w-2xl */
          margin: 0 16px;
          background: rgba(24, 24, 27, 0.95); /* zinc-900/95 */
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transform: scale(0.95) translateY(-20px);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .search-overlay.active .search-modal {
          transform: scale(1) translateY(0);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-input-wrapper svg {
          width: 20px;
          height: 20px;
          color: #a1a1aa; /* zinc-400 */
        }

        .search-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          outline: none;
        }

        .search-input-wrapper input::placeholder {
          color: #71717a; /* zinc-500 */
        }

        .clear-btn {
          background: none; border: none; padding: 0; margin: 0;
          color: #a1a1aa; cursor: pointer; display: none;
          transition: color 0.2s;
        }
        .clear-btn:hover { color: white; }
        .clear-btn.visible { display: flex; align-items: center; justify-content: center; }

        kbd {
          padding: 2px 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          font-size: 12px;
          color: #71717a;
          font-family: sans-serif;
        }
        @media (max-width: 640px) { kbd { display: none; } }

        .search-results {
          max-height: 60vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .search-results::-webkit-scrollbar { width: 6px; }
        .search-results::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .explore-group { padding: 16px; }
        .explore-title { font-size: 12px; font-weight: 500; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding: 0 8px; }
        .explore-item {
          display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px;
          border-radius: 12px; font-size: 14px; color: #d4d4d8; text-decoration: none;
          background: transparent; border: none; cursor: pointer; transition: all 0.2s;
        }
        .explore-item:hover { background: rgba(255,255,255,0.05); color: white; }
        
        .result-group { padding: 8px; }
        .result-item {
          display: flex; align-items: center; gap: 16px; width: 100%; padding: 12px;
          border-radius: 12px; text-decoration: none; transition: all 0.2s; cursor: pointer;
        }
        .result-item:hover { background: rgba(255,255,255,0.05); }

        .result-item img {
          width: 48px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0;
        }

        .result-item-info { flex: 1; min-width: 0; text-align: left; }
        .result-item-title {
          font-size: 14px; font-weight: 500; color: white; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color 0.2s;
        }
        .result-item:hover .result-item-title { color: #f87171; /* red-400 */ }
        
        .result-item-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #a1a1aa; }
        .score-meta { color: #fbbf24; display: flex; align-items: center; gap: 4px; }

        .result-item-genres { display: flex; gap: 6px; flex-shrink: 0; }
        .genre-badge {
          background: rgba(255,255,255,0.05); color: #a1a1aa;
          padding: 2px 8px; border-radius: 9999px; font-size: 10px;
        }

        .loading-state, .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px 0; color: #71717a;
        }
        .loading-state svg { animation: spin 1s linear infinite; color: #ef4444; width: 24px; height: 24px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      </style>
      <div class="search-modal">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="palette-input" placeholder="Buscar anime..." autocomplete="off">
          <button class="clear-btn" id="palette-clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <kbd>ESC</kbd>
        </div>
        <div class="search-results" id="palette-results">
          <!-- Default Explore State -->
          <div class="explore-group" id="explore-state">
             <div class="explore-title">Explorar</div>
             <a href="/category/popular" data-link class="explore-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
               Populares
             </a>
             <a href="/category/movies" data-link class="explore-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
               Películas
             </a>
             <a href="/calendar" data-link class="explore-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
               Emisión
             </a>
          </div>
        </div>
      </div>
    `,document.body.appendChild(this.container),this.input=this.container.querySelector("#palette-input"),this.resultsContainer=this.container.querySelector("#palette-results"),this.clearBtn=this.container.querySelector("#palette-clear"),this.exploreStateHtml=this.container.querySelector("#explore-state").outerHTML}bindEvents(){document.addEventListener("keydown",t=>{(t.metaKey||t.ctrlKey)&&t.key==="k"&&(t.preventDefault(),this.open()),t.key==="Escape"&&this.container.classList.contains("active")&&this.close()}),this.container.addEventListener("click",t=>{t.target===this.container&&this.close()}),this.clearBtn.addEventListener("click",()=>{this.input.value="",this.input.focus(),this.clearBtn.classList.remove("visible"),this.resultsContainer.innerHTML=this.exploreStateHtml}),this.input.addEventListener("input",t=>{const o=t.target.value.trim();o.length>0?this.clearBtn.classList.add("visible"):this.clearBtn.classList.remove("visible"),this.abortController&&this.abortController.abort(),this.abortController=new AbortController;const a=this.abortController.signal;if(o.length===0){this.resultsContainer.innerHTML=this.exploreStateHtml;return}this.resultsContainer.innerHTML=`
        <div class="loading-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        </div>
      `,this.timeout=setTimeout(async()=>{try{const n=await A.getAnimeSearch(o,{signal:a});if(a.aborted)return;const i=(n.data||[]).slice(0,10);i.length>0?(this.resultsContainer.innerHTML=`
              <div class="result-group">
                ${i.map(r=>{var s,l;return`
                  <a href="/anime/${r.mal_id||r.id}" data-link class="result-item search-result-item">
                    <img src="${((l=(s=r.images)==null?void 0:s.jpg)==null?void 0:l.image_url)||r.image||""}" alt="">
                    <div class="result-item-info">
                      <div class="result-item-title">${r.title_english||r.title}</div>
                      <div class="result-item-meta">
                        ${r.type?`<span>${r.type}</span>`:""}
                        ${r.score?`<span class="score-meta">★ ${r.score}</span>`:""}
                        ${r.year?`<span>${r.year}</span>`:""}
                      </div>
                    </div>
                    <div class="result-item-genres">
                      ${(r.genres||[]).slice(0,2).map(f=>`<span class="genre-badge">${f.name}</span>`).join("")}
                    </div>
                  </a>
                `}).join("")}
              </div>
            `,this.resultsContainer.querySelectorAll(".search-result-item").forEach(r=>{r.addEventListener("click",()=>this.close())})):this.resultsContainer.innerHTML=`
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:32px;height:32px;margin-bottom:12px;opacity:0.3;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p>No se encontraron resultados para "${o}"</p>
              </div>
            `}catch(n){if(n.name==="AbortError")return}},400)}),this.input.addEventListener("keydown",t=>{if(t.key==="Enter"){const o=this.input.value.trim();o&&(this.close(),this.router.navigate(`/search?q=${encodeURIComponent(o)}`))}})}open(){this.container.classList.add("active"),this.input.focus()}close(){this.container.classList.remove("active")}}const u={async checkNewEpisodes(){const e=await d.following.toArray(),t=await d.favorites.toArray(),o=new Map;t.forEach(i=>o.set(i.animeId,i)),e.forEach(i=>o.set(i.animeId,i));const a=Array.from(o.values());let n=!1;for(const i of a)if(i.status==="Currently Airing"&&i.broadcast&&i.broadcast.day&&i.broadcast.day!=="Unknown"){const r=this.getLastBroadcast(i.broadcast);r&&(!i.lastNotified||r>i.lastNotified)&&(await d.notifications.where("animeId").equals(i.animeId).and(B=>B.timestamp===r).first()||(await d.notifications.add({animeId:i.animeId,isRead:0,timestamp:r}),n=!0),await d.favorites.get(i.animeId)&&await d.favorites.update(i.animeId,{lastNotified:r}),await d.following.get(i.animeId)&&await d.following.update(i.animeId,{lastNotified:r}))}return n},getLastBroadcast(e){const t={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(t[e.day]===void 0)return null;const[o,a]=e.time.split(":").map(Number),n=new Date(new Date().toLocaleString("en-US",{timeZone:e.timezone||"Asia/Tokyo"}));let i=new Date(n);i.setHours(o,a,0,0);let r=t[e.day]-n.getDay();(r<0||r===0&&i<=n)&&(r+=7),i.setDate(i.getDate()+r);const s=new Date(i);if(s.setDate(s.getDate()-7),s>n)return null;const l=s.getTime()-n.getTime();return Date.now()+l},async getUnreadCount(){return await d.notifications.where("isRead").equals(0).count()},async getNotifications(){const e=await d.notifications.orderBy("timestamp").reverse().toArray(),t=[];for(const o of e){let a=await d.following.get(o.animeId);a||(a=await d.favorites.get(o.animeId)),a&&t.push({...o,title:a.title,cover:a.cover})}return t},async markAllAsRead(){await d.notifications.where("isRead").equals(0).modify({isRead:1})}},v=document.getElementById("app"),C=L(v),I=new E(C),b=document.createElement("header");b.innerHTML=`
  <nav class="nav-v5 fixed top-0 left-0 right-0 z-50 bg-zinc-950/70 backdrop-blur-xl border-b border-white/[0.06]" style="position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: rgba(9,9,11,0.7); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-bottom: 1px solid rgba(255,255,255,0.06);">
    <div style="max-width: 1920px; margin: 0 auto; padding: 0 5%; height: 70px; display: flex; align-items: center; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 24px;">
        <a href="/" data-link style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #dc2626; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(220,38,38,0.3);">
            <span style="color: white; font-weight: 900; font-size: 14px; font-family: 'Outfit';">A</span>
          </div>
          <span class="nav-logo-text" style="font-size: 20px; font-weight: 900; letter-spacing: -0.05em; color: white; font-family: 'Outfit'; display: block;">
            Ani<span style="color: #ef4444;">RD</span>
          </span>
        </a>
        <div class="nav-links-v5" style="display: flex; align-items: center; gap: 4px;">
          <a href="/" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>Inicio</a>
          <a href="/category/popular" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>Populares</a>
          <a href="/category/movies" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7h4"/><path d="M3 17h4"/><path d="M17 3v18"/><path d="M17 7h4"/><path d="M17 17h4"/></svg>Películas</a>
          <a href="/category/dub" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>Latino</a>
          <a href="/calendar" data-link class="nav-link-v5"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>Calendario</a>
        </div>
      </div>
      
      <div style="display: flex; align-items: center; gap: 12px;">
        <button id="desktop-search-trigger" style="display: flex; align-items: center; justify-content: space-between; width: 220px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; color: #a1a1aa; font-size: 13px; cursor: pointer; transition: all 0.2s;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 16px; height: 16px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Buscar anime...</span>
          </div>
          <kbd style="display: inline-flex; font-family: monospace; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 10px;">⌘K</kbd>
        </button>

        <div class="nav-notifications" id="nav-notifications" style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; transition: all 0.3s ease; color: #a1a1aa;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          <span id="notif-badge" style="display:none; position: absolute; top: 8px; right: 8px; background: #ef4444; width: 8px; height: 8px; border-radius: 50%;"></span>
          
          <div id="notif-dropdown" style="display:none; position: absolute; top: 45px; right: 0; width: 320px; background: rgba(9,9,11,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 15px; z-index: 100; cursor: default; box-shadow: 0 10px 40px rgba(0,0,0,0.5);">
             <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
               <h4 style="margin: 0; color: white; font-family: 'Outfit';">Notificaciones</h4>
               <span id="mark-read-btn" style="font-size: 11px; color: #ef4444; cursor: pointer; font-weight: 800;">Marcar Leídas</span>
             </div>
             <div id="notif-list" style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
               <div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>
             </div>
          </div>
        </div>

        <a id="profile-link" href="/auth" data-link style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #ef4444, #b91c1c); display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; box-shadow: 0 4px 14px rgba(220,38,38,0.2);">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="14" cy="7" r="4"/></svg>
        </a>
      </div>
    </div>
  </nav>

  <style>
    .nav-link-v5 {
      display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #a1a1aa; text-decoration: none; transition: all 0.2s;
    }
    .nav-link-v5 svg { width: 16px; height: 16px; }
    .nav-link-v5:hover, .nav-link-v5.active { background: rgba(255,255,255,0.05); color: white; }
    #desktop-search-trigger:hover { background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.2) !important; color: white !important; }
    .nav-notifications:hover { background: rgba(255,255,255,0.1); color: white !important; }
    
    @media (max-width: 768px) {
      .nav-links-v5 { display: none !important; }
      #desktop-search-trigger { width: auto !important; padding: 8px !important; border-radius: 50% !important; justify-content: center !important; }
      #desktop-search-trigger span, #desktop-search-trigger kbd { display: none !important; }
      .nav-logo-text { display: none !important; }
    }
  </style>

  <nav class="mobile-nav bottom-nav" id="bottomNav" style="position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: rgba(9,9,11,0.9); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-top: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-around; padding: 8px 16px; display: none;">
     <a href="/" data-link class="nav-item" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
       <span style="font-size: 10px; font-weight: 500;">Inicio</span>
     </a>
     <a href="#" class="nav-item" id="mobile-search-btn" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
       <span style="font-size: 10px; font-weight: 500;">Buscar</span>
     </a>
     <a href="/favorites" data-link class="nav-item" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
       <span style="font-size: 10px; font-weight: 500;">Favs</span>
     </a>
     <a id="mobile-profile-link" href="/auth" data-link class="nav-item" style="display: flex; flex-direction: column; align-items: center; gap: 4px; color: #a1a1aa; text-decoration: none; transition: color 0.2s;">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="14" cy="7" r="4"/></svg>
       <span class="nav-label" style="font-size: 10px; font-weight: 500;">Perfil</span>
     </a>
  </nav>
`;document.body.insertBefore(b,v);const w=()=>{const e=document.getElementById("profile-link"),t=document.getElementById("mobile-profile-link"),o=document.getElementById("sidebar-profile-link"),a=document.getElementById("profile-avatar-container"),n=document.getElementById("profile-username-text"),i=p.isLoggedIn(),r=p.getUser(),s=i?"/profile":"/auth";if(e&&(e.setAttribute("href",s),i?(a&&a.classList.add("active-border"),n&&(n.textContent=(r==null?void 0:r.username)||"Perfil")):(a&&a.classList.remove("active-border"),n&&(n.textContent="Entrar"))),t){t.setAttribute("href",s);const l=t.querySelector(".nav-label");l&&(l.textContent=i?"Perfil":"Entrar")}if(o){o.setAttribute("href",s);const l=o.querySelector("span");l&&(l.textContent=i?"Mi Perfil":"Entrar")}},k=e=>{const t=document.getElementById("bottomNav");if(!t)return;const o=t.querySelectorAll(".nav-item");o.forEach(n=>{n.classList.remove("active");const i=n.querySelector("svg");i&&i.setAttribute("stroke-width","1.8")});let a=-1;if(e==="/"||e.startsWith("/anime/")||e.startsWith("/category/")||e.startsWith("/watch/")||e==="/calendar"?a=0:e==="/favorites"?a=2:(e==="/profile"||e==="/auth")&&(a=3),a!==-1&&o[a]){o[a].classList.add("active");const n=o[a].querySelector("svg");n&&n.setAttribute("stroke-width","2.2")}};S.subscribe(e=>{k(e.currentRoute),c.isActive&&setTimeout(()=>{c.updateFocusables(),c.focusFirstAvailable()},400)});window.updateNavbarAuth=w;w();k(window.location.pathname);const g=e=>{e&&e.preventDefault(),I.open()},x=document.getElementById("desktop-search-trigger");x&&x.addEventListener("click",g);const m=document.getElementById("open-search-btn");m&&m.addEventListener("click",g);const y=document.getElementById("mobile-search-btn");y&&y.addEventListener("click",g);const T=async()=>{const e=document.getElementById("nav-notifications"),t=document.getElementById("notif-badge"),o=document.getElementById("notif-dropdown"),a=document.getElementById("notif-list"),n=document.getElementById("mark-read-btn");if(!e)return;const i=async()=>{await u.getUnreadCount()>0?(t.style.display="block",e.style.color="#ff0000"):(t.style.display="none",e.style.color="inherit")},r=async()=>{const s=await u.getNotifications();if(s.length===0){a.innerHTML='<div style="color:var(--text-muted); font-size:12px; text-align:center; padding: 20px 0;">No hay notificaciones nuevas</div>';return}a.innerHTML=s.map(l=>`
      <a href="/anime/${l.animeId}" data-link style="display: flex; gap: 10px; padding: 10px; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); ${l.isRead?"opacity: 0.6;":"background: rgba(255,0,0,0.05);"}">
        <img src="${l.cover}" style="width: 40px; height: 55px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1;">
          <div style="color: white; font-size: 12px; font-weight: 700; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${l.title}</div>
          <div style="color: var(--accent); font-size: 10px; font-weight: 800;">¡Nuevo episodio disponible!</div>
          <div style="color: var(--text-muted); font-size: 9px; margin-top: 4px;">${new Date(l.timestamp).toLocaleDateString()}</div>
        </div>
      </a>
    `).join("")};e.addEventListener("click",async s=>{if(s.target===n)return;const l=o.style.display==="block";o.style.display=l?"none":"block",l||await r()}),n.addEventListener("click",async s=>{s.stopPropagation(),await u.markAllAsRead(),await i(),await r()}),document.addEventListener("click",s=>{e.contains(s.target)||(o.style.display="none")}),p.isLoggedIn()&&await u.checkNewEpisodes(),await i()},M=()=>{const e=document.getElementById("tv-mode-toggle"),t=document.getElementById("tv-mode-text"),o=document.getElementById("header-tv-toggle"),a=s=>{t&&(t.textContent=s?"📺 Modo TV: ON":"📺 Modo TV: OFF"),e&&(s?e.classList.add("active"):e.classList.remove("active")),o&&(s?(o.classList.add("active"),o.style.background="rgba(255, 0, 85, 0.2)",o.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",o.style.border="1px solid rgba(255, 0, 85, 0.4)"):(o.classList.remove("active"),o.style.background="rgba(255,255,255,0.05)",o.style.boxShadow="none",o.style.border="none"))},n=()=>{c.isActive?(c.destroy(),a(!1)):(c.init(),a(!0))};e&&e.addEventListener("click",s=>{s.preventDefault(),n()}),o&&o.addEventListener("click",s=>{s.preventDefault(),n()});const i=localStorage.getItem("tvMode")==="true",r=(/AniRD-AndroidTV|SmartTV|GoogleTV|AppleTV|HbbTV|LG NetCast|Opera TV|Tizen|Web0S|Nexus Player|AndroidTV|Roku|AFT|Silk|FireTV|Amazon|Chromecast|DroidTV|TV\s+Box|Smart_TV|MiBox|Shield/i.test(navigator.userAgent)||navigator.userAgent.toLowerCase().includes("tv"))&&!navigator.userAgent.includes("AniRD-AndroidMobile");i||localStorage.getItem("tvMode")===null&&r?(c.init(),a(!0)):a(!1)},z=async()=>{let e=await h.getSetting("theme",null);if(e||(e=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"),e==="light"?document.body.classList.add("light-theme"):document.body.classList.remove("light-theme"),p.isLoggedIn())try{const t=await p.fetchFromServer();t&&await h.syncFromServer(t)}catch{console.error("Sync fail")}await T(),setTimeout(M,200)};z();"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.js").catch(console.warn);window.AniRDBridge={isPlaying:()=>{const e=document.body.classList.contains("player-active")||document.querySelector(".watch-container")!==null,t=document.querySelector("video")!==null,o=document.querySelector("#video-container iframe, iframe")!==null;return e&&(t||o)},enterPip:()=>{document.body.classList.add("pip-mode")},exitPip:()=>{document.body.classList.remove("pip-mode")},play:()=>{const e=document.querySelector("video");if(e)e.play().catch(t=>console.error("Play error:",t));else{const t=document.querySelector("iframe");t&&t.contentWindow&&t.contentWindow.postMessage(JSON.stringify({event:"command",func:"playVideo"}),"*")}},pause:()=>{const e=document.querySelector("video");if(e)e.pause();else{const t=document.querySelector("iframe");t&&t.contentWindow&&t.contentWindow.postMessage(JSON.stringify({event:"command",func:"pauseVideo"}),"*")}},togglePlayPause:()=>{const e=document.querySelector("video");e&&(e.paused?e.play().catch(t=>console.error("Play error:",t)):e.pause())},nextEpisode:()=>{const e=document.querySelector('.next-episode-btn, #next-ep-btn, button[title*="Siguiente"], a[title*="Siguiente"]');e&&e.click()},prevEpisode:()=>{const e=document.querySelector('.prev-episode-btn, #prev-ep-btn, button[title*="Anterior"], a[title*="Anterior"]');e&&e.click()},seekForward:e=>{const t=document.querySelector("video");t&&(t.currentTime=Math.min(t.duration||0,t.currentTime+e))},seekBack:e=>{const t=document.querySelector("video");t&&(t.currentTime=Math.max(0,t.currentTime-e))},handleBack:()=>{const e=document.querySelector('.modal.active, .dropdown.open, #notif-dropdown[style*="block"]');return e?(e.id==="notif-dropdown"?e.style.display="none":e.classList.remove("active","open"),!0):!1},loginWithToken:e=>{e&&p.loginWithToken(e).then(()=>{window.updateNavbarAuth&&window.updateNavbarAuth()}).catch(t=>console.error("Auto login token error:",t))},notifyPlayback:(e,t)=>{window.Android&&window.Android.onPlaybackChanged&&window.Android.onPlaybackChanged(e,t)}};setInterval(()=>{const e=document.querySelector("video");if(e&&!e.dataset.hasAniRDListener){e.dataset.hasAniRDListener="true";const t=()=>{const o=document.querySelector(".watch-anime-title, .anime-title, h1, h2"),a=o?o.textContent.trim():"AniRD Video";window.AniRDBridge&&window.AniRDBridge.notifyPlayback&&window.AniRDBridge.notifyPlayback(a,!e.paused)};e.addEventListener("play",t),e.addEventListener("pause",t),e.addEventListener("ended",()=>{window.AniRDBridge&&window.AniRDBridge.notifyPlayback&&window.AniRDBridge.notifyPlayback("AniRD",!1)})}},1e3);
