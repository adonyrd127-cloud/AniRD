import{X as S}from"./vendor-DIPEJTOH.js";class B{constructor(){this.tokenKey="anird_auth_token",this.userKey="anird_user",this.host=window.location.hostname||"localhost",this.baseUrl=`http://${this.host}:3005/api/v1/auth`,this.userUrl=`http://${this.host}:3005/api/v1/user`}getToken(){return localStorage.getItem(this.tokenKey)}getUser(){const e=localStorage.getItem(this.userKey);return e?JSON.parse(e):null}isLoggedIn(){return!!this.getToken()}async login(e,t){try{const s=await(await fetch(`${this.baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})})).json();if(!s.success)throw new Error(s.message);return localStorage.setItem(this.tokenKey,s.token),localStorage.setItem(this.userKey,JSON.stringify(s.user)),s}catch(i){throw console.error("Fetch error:",i),new Error(`Error de conexión al servidor (${this.baseUrl}).`)}}async register(e,t){try{const s=await(await fetch(`${this.baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})})).json();if(!s.success)throw new Error(s.message);return localStorage.setItem(this.tokenKey,s.token),localStorage.setItem(this.userKey,JSON.stringify(s.user)),s}catch(i){throw console.error("Fetch error:",i),new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`)}}logout(){localStorage.removeItem(this.tokenKey),localStorage.removeItem(this.userKey);try{console.log("[Auth] Borrando base de datos IndexedDB local AniRD_DB al cerrar sesión...");const e=indexedDB.deleteDatabase("AniRD_DB"),t=()=>{window.location.href="/"};e.onsuccess=t,e.onerror=t,e.onblocked=t,setTimeout(t,800)}catch(e){console.error("[Auth] Error borrando DB:",e),window.location.href="/"}}async syncWithServer(e){return this.isLoggedIn()?await(await fetch(`${this.userUrl}/sync`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getToken()}`},body:JSON.stringify(e),keepalive:!0})).json():null}async fetchFromServer(){if(!this.isLoggedIn())return null;const t=await(await fetch(`${this.userUrl}/sync`,{headers:{Authorization:`Bearer ${this.getToken()}`}})).json();return t.success?t.syncData:null}}const I=new B,o=new S("AniRD_DB");o.version(3).stores({history:"++id, animeId, episodeId, progress, duration, timestamp, updatedAt",favorites:"animeId, title, cover, addedAt",following:"animeId, title, cover, broadcast, addedAt",lists:"++id, name, animeIds, createdAt",cache:"key, data, expiresAt",settings:"key, value",notifications:"++id, animeId, isRead, timestamp"});o.open().catch(async r=>{console.error("[Dexie] Error crítico al abrir la base de datos AniRD_DB:",r);try{console.log("[Dexie] Intentando restablecer base de datos local para auto-recuperación..."),await S.delete("AniRD_DB"),console.log("[Dexie] Base de datos borrada con éxito. Recargando página...")}catch(e){console.error("[Dexie] Fallo al borrar base de datos:",e)}window.location.reload()});const $={async triggerSync(){try{if(I.isLoggedIn()){const r=await this.getAllData();await I.syncWithServer(r),console.log("[Sync] Sincronización en la nube exitosa.")}}catch(r){console.error("[Sync] Error sincronizando con el servidor:",r)}},async addToHistory(r,e,t,i,s={}){const p=Date.now(),f=await o.history.where({animeId:r,episodeId:e}).first();let h;return f?h=await o.history.update(f.id,{progress:t,duration:i,updatedAt:p,...s}):h=await o.history.add({animeId:r,episodeId:e,progress:t,duration:i,timestamp:p,updatedAt:p,...s}),this.triggerSync(),h},async getContinueWatching(){const r=await o.history.orderBy("updatedAt").reverse().toArray(),e=new Map;return r.forEach(i=>{e.has(i.animeId)||e.set(i.animeId,i)}),Array.from(e.values()).filter(i=>!i.duration||i.duration===0?!0:i.progress/i.duration*100<90).slice(0,20)},async toggleFavorite(r){var i,s;const e=r.mal_id||r.id||r.animeId;return await o.favorites.get(e)?(await o.favorites.delete(e),this.triggerSync(),!1):(await o.favorites.add({animeId:e,title:r.title,cover:((s=(i=r.images)==null?void 0:i.jpg)==null?void 0:s.large_image_url)||r.cover||"",type:r.type||"",score:r.score||"",episodes:r.episodes||null,status:r.status||"",broadcast:r.broadcast||null,addedAt:Date.now()}),this.triggerSync(),!0)},async isFavorite(r){return r?!!await o.favorites.get(Number(r)):!1},async getFavorites(){return await o.favorites.orderBy("addedAt").reverse().toArray()},async toggleFollowing(r){var i,s;const e=r.mal_id||r.id||r.animeId;return await o.following.get(e)?(await o.following.delete(e),this.triggerSync(),!1):(await o.following.add({animeId:e,title:r.title,cover:((s=(i=r.images)==null?void 0:i.jpg)==null?void 0:s.large_image_url)||r.cover||"",status:r.status||"",broadcast:r.broadcast||null,addedAt:Date.now(),lastNotified:Date.now()}),this.triggerSync(),!0)},async isFollowing(r){return r?!!await o.following.get(Number(r)):!1},async getFollowing(){return await o.following.orderBy("addedAt").reverse().toArray()},async getSetting(r,e=null){const t=await o.settings.get(r);return t?t.value:e},async setSetting(r,e){return await o.settings.put({key:r,value:e})},async getAllData(){return{favorites:await o.favorites.toArray(),following:await o.following.toArray(),history:await o.history.toArray()}},async syncFromServer(r){if(r)return await o.transaction("rw",[o.favorites,o.following,o.history],async()=>{const e=await o.history.toArray(),t=r.history||[],i=new Map;e.forEach(a=>{const l=`${a.animeId}_${a.episodeId}`;i.set(l,a)});let s=!1;t.forEach(a=>{const l=`${a.animeId}_${a.episodeId}`,c=i.get(l);if(!c)i.set(l,a);else{const y=a.updatedAt||a.timestamp||0,n=c.updatedAt||c.timestamp||0;y>n?i.set(l,a):n>y&&(s=!0)}}),e.length!==i.size&&(s=!0);const p=await o.favorites.toArray(),f=r.favorites||[],h=new Map;p.forEach(a=>h.set(Number(a.animeId),a)),f.forEach(a=>{const l=Number(a.animeId),c=h.get(l);if(!c)h.set(l,a);else{const y=a.addedAt||0,n=c.addedAt||0;y>n?h.set(l,a):n>y&&(s=!0)}}),p.length!==h.size&&(s=!0);const b=await o.following.toArray(),m=r.following||[],d=new Map;b.forEach(a=>d.set(Number(a.animeId),a)),m.forEach(a=>{const l=Number(a.animeId),c=d.get(l);if(!c)d.set(l,a);else{const y=a.addedAt||0,n=c.addedAt||0;y>n?d.set(l,a):n>y&&(s=!0)}}),b.length!==d.size&&(s=!0),await o.history.clear();const v=Array.from(i.values()).map(a=>{const{id:l,...c}=a;return c});await o.history.bulkAdd(v),await o.favorites.clear(),await o.favorites.bulkAdd(Array.from(h.values())),await o.following.clear(),await o.following.bulkAdd(Array.from(d.values())),s&&(console.log("[Sync] Detectados cambios locales más recientes. Subiendo fusión al servidor..."),setTimeout(()=>this.triggerSync(),0))})}},C=Object.freeze(Object.defineProperty({__proto__:null,db:o,dbService:$},Symbol.toStringTag,{value:"Module"}));class j{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.lastRequest=0,this.minDelay=500,this.cache=new Map,this.inflight=new Map,this.cacheTTL=10*60*1e3}async request(e,t={},i={}){const s=new URL(`${this.baseUrl}${e}`);Object.keys(t).forEach(b=>s.searchParams.append(b,t[b]));const p=s.toString(),f=this.cache.get(p);if(f&&f.expires>Date.now())return f.data;if(this.inflight.has(p))return this.inflight.get(p);const h=(async()=>{const b=Date.now(),m=Math.max(0,this.lastRequest+this.minDelay-b);m>0&&await new Promise(a=>setTimeout(a,m)),this.lastRequest=Date.now();let d=await fetch(p,{signal:i.signal});if(d.status===429&&(await new Promise(a=>setTimeout(a,2e3)),d=await fetch(p,{signal:i.signal})),!d.ok)throw new Error(`Jikan error: ${d.status}`);const v=await d.json();return this.cache.set(p,{data:v,expires:Date.now()+this.cacheTTL}),this.inflight.delete(p),v})();return this.inflight.set(p,h),h}}class M{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(e,t={}){const i=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:t})});if(!i.ok)throw new Error(`AniList error: ${i.status}`);return(await i.json()).data}}class D{constructor(){const e=window.location.hostname||"localhost";this.port=3005,this.baseUrl=`http://${e}:${this.port}/api/v1`,this.apiKey="dev-anime1v-key"}async request(e,t={}){const i=new URL(`${this.baseUrl}${e}`);Object.keys(t).forEach(s=>i.searchParams.append(s,t[s]));try{const s=await fetch(i.toString(),{headers:{"X-API-Key":this.apiKey}});if(!s.ok)throw new Error(`Local API error: ${s.status}`);return s.json()}catch(s){return console.error(`Error en petición local a ${e}:`,s),{success:!1,message:s.message}}}}class T{constructor(){this.providers={jikan:new j,anilist:new M,local:new D},this.cache=new Map}async getAnimeSearch(e,t={}){return await this.providers.jikan.request("/anime",{q:e,limit:20},t)}async searchLocal(e){if(!e)return{success:!1,data:{results:[]}};try{let t=await this.providers.local.request("/anime/search",{q:e});if((!t.success||!t.data.results.length)&&e.length>5){const i=e.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();i!==e&&(t=await this.providers.local.request("/anime/search",{q:i}))}if(!t.success||!t.data.results.length){const i=e.split(" ")[0];i.length>3&&(t=await this.providers.local.request("/anime/search",{q:i}))}return t}catch{return{success:!1,data:{results:[]}}}}async getAnimeInfo(e){try{if(typeof e=="string"&&(e.includes("http")||e.includes("anime/")))return await this.providers.local.request("/anime/info",{url:e});if(this.cache.has(e))return this.cache.get(e);const t=await this.providers.jikan.request(`/anime/${e}/full`);return this.cache.set(e,t),t}catch{return{success:!1,data:null}}}async getEpisode(e){return await this.providers.local.request("/anime/episode",{url:e})}async getTrending(e=1){return await this.providers.jikan.request("/top/anime",{filter:"airing",limit:24,page:e})}async getMovies(e=1){return await this.providers.jikan.request("/top/anime",{type:"movie",filter:"bypopularity",limit:24,page:e})}async getLatest(e=1){return await this.providers.jikan.request("/seasons/now",{limit:24,page:e})}async getDubbed(e=1){try{return await this.providers.jikan.request("/anime",{producers:"1191,108",limit:24,page:e,order_by:"popularity",sort:"desc"})}catch{return{data:[]}}}async getByGenre(e,t=1){return await this.providers.jikan.request("/anime",{genres:e,order_by:"popularity",limit:24,page:t})}async getSchedule(){return await this.providers.jikan.request("/seasons/now")}async getAnimeRelations(e){return await this.providers.jikan.request(`/anime/${e}/relations`)}async getAnimeCharacters(e){return await this.providers.jikan.request(`/anime/${e}/characters`)}async getAnilistBanner(e){var i;const t="query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }";try{return(i=(await this.providers.anilist.request(t,{id:e})).Media)==null?void 0:i.bannerImage}catch{return null}}async getAnimeRecommendations(e){return await this.providers.jikan.request(`/anime/${e}/recommendations`)}async getAnilistEpisodes(e){var i;const t=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;try{return((i=(await this.providers.anilist.request(t,{id:e})).Media)==null?void 0:i.streamingEpisodes)||[]}catch(s){return console.warn("Error al cargar episodios desde AniList:",s),[]}}}const A=new T,L=Object.freeze(Object.defineProperty({__proto__:null,AnimeAPI:T,apiService:A},Symbol.toStringTag,{value:"Module"}));class z extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._renderSkeleton()}set data(e){this._anime=e,this.render()}_renderSkeleton(){const e=this.getAttribute("mode")==="thumbnail";this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; width: ${e?"320px":"185px"}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 22px; }
        .sk-img { width: 100%; aspect-ratio: ${e?"16/9":"2/3"}; margin-bottom: 12px; }
        .sk-t { height: 14px; border-radius: 7px; margin-bottom: 6px; }
        .sk-t2 { height: 10px; width: 60%; border-radius: 5px; }
      </style>
      <div><div class="sk sk-img"></div><div class="sk sk-t"></div><div class="sk sk-t2"></div></div>
    `}render(){var d,v,a,l;if(!this._anime)return;const e=this.getAttribute("mode")==="thumbnail",t=((v=(d=this._anime.images)==null?void 0:d.jpg)==null?void 0:v.large_image_url)||((l=(a=this._anime.images)==null?void 0:a.jpg)==null?void 0:l.image_url)||this._anime.image||this._anime.thumbnail||"",i=this._anime.title||"Anime",s=this._anime.mal_id||this._anime.id,p=this._anime.score||this._anime.rating||"?.?",f=this._anime.progress||0,h=this._anime.duration_watched||0,b=h>0?Math.min(f/h*100,100):0;let m=this._anime.nextEpisodeText||"";if(!m&&this._anime.status==="Currently Airing"&&this._anime.broadcast&&this._anime.broadcast.time){const c=this._anime.broadcast,y={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(y[c.day]!==void 0){const[n,x]=c.time.split(":").map(Number),g=new Date(new Date().toLocaleString("en-US",{timeZone:c.timezone||"Asia/Tokyo"}));let u=new Date(g);u.setHours(n,x,0,0);let w=y[c.day]-g.getDay();(w<0||w===0&&u<g)&&(w+=7),u.setDate(u.getDate()+w);const k=u-g;if(k>0){const _=Math.floor(k/864e5),E=Math.floor(k/36e5%24);_>0?m=`${_}d ${E}h para nuevo cap.`:E>0?m=`${E}h para nuevo cap.`:m="¡Nuevo cap en breve!"}}}this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: ${e?"320px":"185px"};
          flex-shrink: 0;
        }
        @media (max-width: 768px) {
          :host {
            width: ${e?"180px":"135px"} !important;
          }
          .img-box {
            border-radius: 14px !important;
            margin-bottom: 8px !important;
          }
          .title-v4 {
            font-size: 11px !important;
          }
          .meta-v4 {
            font-size: 8px !important;
          }
          .rating-v4 {
            top: 6px !important;
            left: 6px !important;
            padding: 2px 6px !important;
            font-size: 9px !important;
            border-radius: 6px !important;
          }
        }
        .card-v4 {
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          text-decoration: none;
          color: white;
          display: flex;
          flex-direction: column;
        }
        .card-v4:hover {
          transform: translateY(-8px);
        }
        .img-box {
          width: 100%;
          aspect-ratio: ${e?"16/9":"2/3"};
          border-radius: 22px;
          overflow: hidden;
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: 12px;
          position: relative;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          transition: border-color 0.3s ease;
        }
        .card-v4:hover .img-box {
          border-color: rgba(255, 0, 0, 0.5);
          box-shadow: 0 20px 40px rgba(255, 0, 0, 0.15);
        }
        img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .card-v4:hover img { transform: scale(1.08); }

        .rating-v4 {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          padding: 4px 10px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 900;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
        }
        .progress-fill {
          height: 100%;
          background: #ff0000;
          border-radius: 0 2px 2px 0;
          transition: width 0.3s ease;
        }

        .info-v4 { padding: 0 4px; }
        .title-v4 {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0 0 4px 0;
          color: #f4f4f5;
        }
        .meta-v4 {
          font-size: 9px;
          color: #71717a;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 0.05em;
        }
      </style>
      <a href="/anime/${s}" data-link class="card-v4">
        <div class="img-box">
          <img src="${t}" alt="${i}" loading="lazy" referrerpolicy="no-referrer">
          <div class="rating-v4"><span style="color:#ff0000">★</span> ${p}</div>
          ${b>0?`<div class="progress-bar"><div class="progress-fill" style="width:${b}%"></div></div>`:""}
        </div>
        <div class="info-v4">
          <div class="meta-v4">${this._anime.type||"TV"} • ${this._anime.status||"EN EMISIÓN"}</div>
          <h3 class="title-v4">${i}</h3>
          ${this._anime.currentEpisode?`<div style="font-size: 10px; color: #ff0000; font-weight: 800; margin-top: 2px;">Visto Ep. ${this._anime.currentEpisode}</div>`:""}
          ${m?`<div style="font-size: 10px; color: #00ff88; font-weight: 800; margin-top: 2px;">⏱ ${m}</div>`:""}
        </div>
      </a>
    `}}customElements.define("anime-card",z);class q{async render(){const e=document.createElement("div");return e.className="home-page-wrapper",e.innerHTML=`
      <style>
        /* ✅ FIX CRÍTICO: wrapper que garantiza que el contenido empiece DEBAJO del nav fijo */
        .home-page-wrapper {
          padding-top: 70px;
          min-height: 100vh;
          background: var(--bg-dark);
        }

        /* En TV mode el #app ya empieza en top: 70px, así que quitamos el padding */
        body.tv-mode .home-page-wrapper {
          padding-top: 0 !important;
        }

        .hero-v4 {
          height: 75vh;
          position: relative;
          display: flex;
          align-items: flex-end;
          padding: 0 5% 80px;
          overflow: hidden;
          background: #000;
        }
        .hero-backdrop-v4 {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 20%;
          z-index: 0;
          transition: background-image 0.8s ease-in-out;
        }
        .hero-backdrop-v4::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, #050505 5%, transparent 100%),
                      linear-gradient(to right, #050505 10%, transparent 70%);
        }
        .hero-content-v4 {
          position: relative;
          z-index: 10;
          max-width: 700px;
          padding: 40px 0;
        }
        .hero-title-v4 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 15px;
          letter-spacing: -0.04em;
          color: white;
        }
        .hero-subtitle-v4 {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 30px;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .hero-actions-v4 { display: flex; gap: 15px; }
        
        .home-sections-v4 { padding: 60px 5% 100px; max-width: 1600px; margin: 0 auto; }
        .horizontal-scroll-v4 { display: flex; gap: 20px; overflow-x: auto; padding: 10px 0 30px; scrollbar-width: none; }
        .horizontal-scroll-v4::-webkit-scrollbar { display: none; }

        /* ✅ FIX: Error state visible para cuando la API falla */
        .home-error-banner {
          background: rgba(255, 50, 50, 0.08);
          border: 1px solid rgba(255, 50, 50, 0.25);
          color: rgba(255,200,200,0.9);
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        @media (max-width: 768px) {
          .hero-v4 { height: 60vh; padding: 0 20px 40px; align-items: center; }
          .hero-content-v4 { padding: 25px; border-radius: 20px; text-align: center; }
          .hero-actions-v4 { justify-content: center; }
        }
      </style>
      
      <div id="hero-container-v4">
        <!-- Skeleton Hero (visible hasta que carguen los datos reales) -->
        <div class="skeleton-hero">
          <div class="skeleton-hero-content">
            <div class="skeleton skeleton-hero-title"></div>
            <div class="skeleton skeleton-hero-text"></div>
            <div class="skeleton skeleton-hero-text" style="width:50%"></div>
            <div class="skeleton skeleton-hero-btn"></div>
          </div>
        </div>
      </div>

      <div class="home-sections-v4">
        <div id="api-error-banner" class="home-error-banner" style="display:none;">
          ⚠️ <span id="api-error-msg">Algunas secciones no pudieron cargar. Verificando conexión...</span>
        </div>

        <div id="continue-section" class="section-wrapper" style="display:none;">
          <div class="section-header">
            <h2 class="section-title">CONTINUAR VIENDO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('continue-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="continue-grid"></div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('continue-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ÚLTIMOS LANZAMIENTOS</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latest-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="latest-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latest-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">POPULARES ESTE VERANO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('trending-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="trending-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('trending-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ANIMES EN LATINO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latino-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="latino-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latino-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">PELÍCULAS DESTACADAS</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('movies-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="movies-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('movies-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>
        
        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ACCIÓN Y AVENTURA</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('action-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="action-grid">
            ${this._skeletonCards(8)}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('action-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>
      </div>
    `,e}_skeletonCards(e){return Array.from({length:e},()=>`
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `).join("")}async afterRender(){const e=document.getElementById("hero-container-v4"),t=document.getElementById("trending-grid"),i=document.getElementById("movies-grid"),s=document.getElementById("continue-grid"),p=document.getElementById("continue-section"),f=document.getElementById("api-error-banner"),h=document.getElementById("api-error-msg");let b=!1;const m=async(d,v,a)=>{try{const l=await d();return l&&l.data&&l.data.length>0?v&&this._renderGrid(v,l.data):(v&&(v.innerHTML=`<p style="color:rgba(255,255,255,0.3);padding:20px;font-size:13px;">Sin resultados para ${a}</p>`),b=!0),l}catch(l){return console.error(`[AniRD] Error cargando ${a}:`,l),v&&(v.innerHTML=`<p style="color:rgba(255,100,100,0.5);padding:20px;font-size:13px;">Error al cargar ${a}</p>`),b=!0,null}};try{const d=document.getElementById("latest-grid"),v=document.getElementById("latino-grid"),a=document.getElementById("action-grid"),[l]=await Promise.all([m(()=>A.getTrending(),t,"Populares"),m(()=>A.getMovies(),i,"Películas"),m(()=>A.getLatest(),d,"Últimos"),m(()=>A.getDubbed(),v,"Latino"),m(()=>A.getByGenre("1,2"),a,"Acción")]);if(b&&f&&(f.style.display="flex",h&&(h.textContent="Algunas secciones no pudieron cargar. Verifica que el servidor esté activo.")),l&&l.data&&l.data.length>0){const c=l.data.slice(0,5),y=await Promise.all(c.map(g=>A.getAnilistBanner(g.mal_id).then(u=>{var w,k;return u||((k=(w=g.images)==null?void 0:w.jpg)==null?void 0:k.large_image_url)}).catch(()=>{var u,w;return(w=(u=g.images)==null?void 0:u.jpg)==null?void 0:w.large_image_url})));let n=0;const x=g=>{var k,_;const u=c[g];if(!u)return;const w=y[g]||((_=(k=u.images)==null?void 0:k.jpg)==null?void 0:_.large_image_url)||"";e.innerHTML=`
            <div class="hero-v4">
              <div class="hero-backdrop-v4" style="background-image: url('${w}')"></div>
              <div class="hero-content-v4 page-enter">
                <h1 class="hero-title-v4">${u.title||"Sin título"}</h1>
                <p class="hero-subtitle-v4">${(u.synopsis||"").slice(0,180)}${u.synopsis?"...":""}</p>
                <div class="hero-actions-v4">
                  <a href="/anime/${u.mal_id}" data-link class="btn-v4-primary"><span>▶</span> VER AHORA</a>
                  <a href="/anime/${u.mal_id}" data-link class="btn-v4-secondary">MÁS INFO</a>
                </div>
              </div>
            </div>
          `};x(0),this._heroInterval=setInterval(()=>{n=(n+1)%c.length,x(n)},8e3)}else e.innerHTML=`
          <div class="hero-v4" style="background: linear-gradient(135deg, #0a0a14 0%, #1a0510 100%);">
            <div class="hero-content-v4">
              <h1 class="hero-title-v4" style="color:rgba(255,255,255,0.5);">AniRD</h1>
              <p class="hero-subtitle-v4">Conectando con el servidor...</p>
            </div>
          </div>
        `;try{const c=await $.getContinueWatching();if(c&&c.length>0){p.style.display="block";const y=c.slice(0,8);await Promise.all(y.map(async n=>{try{const x=document.createElement("anime-card");if(x.setAttribute("mode","thumbnail"),s.appendChild(x),n.animeTitle&&n.animeCover)x.data={mal_id:n.animeId,title:n.animeTitle,images:{jpg:{large_image_url:n.animeCover}},type:n.animeType||"",score:n.animeScore||"",currentEpisode:n.episodeId,progress:n.progress||0,duration_watched:n.duration||0},A.getAnimeInfo(n.animeId).then(g=>{g!=null&&g.data&&(x.data={...g.data,currentEpisode:n.episodeId,progress:n.progress||0})}).catch(()=>{});else{const g=await A.getAnimeInfo(n.animeId);g!=null&&g.data&&(x.data={...g.data,currentEpisode:n.episodeId,progress:n.progress||0})}}catch{}}))}}catch{}}catch(d){console.error("[AniRD HomePage] Error general:",d),f&&(f.style.display="flex",h&&(h.textContent=`Error de carga: ${d.message}. Verifica que el servidor esté activo en el puerto correcto.`))}}destroy(){this._heroInterval&&(clearInterval(this._heroInterval),this._heroInterval=null)}_renderGrid(e,t){!e||!t||(e.innerHTML="",t.forEach(i=>{const s=document.createElement("anime-card");s.data=i,e.appendChild(s)}))}}const P=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"}));export{P as H,A as a,o as b,I as c,$ as d,C as e,L as f};
