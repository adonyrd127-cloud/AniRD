import{X as S}from"./vendor-DIPEJTOH.js";class B{constructor(){this.tokenKey="anird_auth_token",this.userKey="anird_user",this.host=window.location.hostname||"localhost",this.baseUrl=`http://${this.host}:3005/api/v1/auth`,this.userUrl=`http://${this.host}:3005/api/v1/user`}getToken(){return localStorage.getItem(this.tokenKey)}getUser(){const e=localStorage.getItem(this.userKey);return e?JSON.parse(e):null}isLoggedIn(){return!!this.getToken()}async login(e,s){try{const t=await(await fetch(`${this.baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:s})})).json();if(!t.success)throw new Error(t.message);return localStorage.setItem(this.tokenKey,t.token),localStorage.setItem(this.userKey,JSON.stringify(t.user)),t}catch(i){throw console.error("Fetch error:",i),new Error(`Error de conexión al servidor (${this.baseUrl}).`)}}async register(e,s){try{const t=await(await fetch(`${this.baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:s})})).json();if(!t.success)throw new Error(t.message);return localStorage.setItem(this.tokenKey,t.token),localStorage.setItem(this.userKey,JSON.stringify(t.user)),t}catch(i){throw console.error("Fetch error:",i),new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`)}}logout(){localStorage.removeItem(this.tokenKey),localStorage.removeItem(this.userKey);try{console.log("[Auth] Borrando base de datos IndexedDB local AniRD_DB al cerrar sesión...");const e=indexedDB.deleteDatabase("AniRD_DB"),s=()=>{window.location.href="/"};e.onsuccess=s,e.onerror=s,e.onblocked=s,setTimeout(s,800)}catch(e){console.error("[Auth] Error borrando DB:",e),window.location.href="/"}}async syncWithServer(e){return this.isLoggedIn()?await(await fetch(`${this.userUrl}/sync`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getToken()}`},body:JSON.stringify(e),keepalive:!0})).json():null}async fetchFromServer(){if(!this.isLoggedIn())return null;const s=await(await fetch(`${this.userUrl}/sync`,{headers:{Authorization:`Bearer ${this.getToken()}`}})).json();return s.success?s.syncData:null}}const I=new B,o=new S("AniRD_DB");o.version(3).stores({history:"++id, animeId, episodeId, progress, duration, timestamp, updatedAt",favorites:"animeId, title, cover, addedAt",following:"animeId, title, cover, broadcast, addedAt",lists:"++id, name, animeIds, createdAt",cache:"key, data, expiresAt",settings:"key, value",notifications:"++id, animeId, isRead, timestamp"});o.open().catch(async r=>{console.error("[Dexie] Error crítico al abrir la base de datos AniRD_DB:",r);try{console.log("[Dexie] Intentando restablecer base de datos local para auto-recuperación..."),await S.delete("AniRD_DB"),console.log("[Dexie] Base de datos borrada con éxito. Recargando página...")}catch(e){console.error("[Dexie] Fallo al borrar base de datos:",e)}window.location.reload()});const $={async triggerSync(){try{if(I.isLoggedIn()){const r=await this.getAllData();await I.syncWithServer(r),console.log("[Sync] Sincronización en la nube exitosa.")}}catch(r){console.error("[Sync] Error sincronizando con el servidor:",r)}},async addToHistory(r,e,s,i,t={}){const f=Date.now(),y=await o.history.where({animeId:r,episodeId:e}).first();let d;return y?d=await o.history.update(y.id,{progress:s,duration:i,updatedAt:f,...t}):d=await o.history.add({animeId:r,episodeId:e,progress:s,duration:i,timestamp:f,updatedAt:f,...t}),this.triggerSync(),d},async getContinueWatching(){const r=await o.history.orderBy("updatedAt").reverse().toArray(),e=new Map;return r.forEach(i=>{e.has(i.animeId)||e.set(i.animeId,i)}),Array.from(e.values()).filter(i=>!i.duration||i.duration===0?!0:i.progress/i.duration*100<90).slice(0,20)},async toggleFavorite(r){var i,t;const e=r.mal_id||r.id||r.animeId;return await o.favorites.get(e)?(await o.favorites.delete(e),this.triggerSync(),!1):(await o.favorites.add({animeId:e,title:r.title,cover:((t=(i=r.images)==null?void 0:i.jpg)==null?void 0:t.large_image_url)||r.cover||"",type:r.type||"",score:r.score||"",episodes:r.episodes||null,status:r.status||"",broadcast:r.broadcast||null,addedAt:Date.now()}),this.triggerSync(),!0)},async isFavorite(r){return r?!!await o.favorites.get(Number(r)):!1},async getFavorites(){return await o.favorites.orderBy("addedAt").reverse().toArray()},async toggleFollowing(r){var i,t;const e=r.mal_id||r.id||r.animeId;return await o.following.get(e)?(await o.following.delete(e),this.triggerSync(),!1):(await o.following.add({animeId:e,title:r.title,cover:((t=(i=r.images)==null?void 0:i.jpg)==null?void 0:t.large_image_url)||r.cover||"",status:r.status||"",broadcast:r.broadcast||null,addedAt:Date.now(),lastNotified:Date.now()}),this.triggerSync(),!0)},async isFollowing(r){return r?!!await o.following.get(Number(r)):!1},async getFollowing(){return await o.following.orderBy("addedAt").reverse().toArray()},async getSetting(r,e=null){const s=await o.settings.get(r);return s?s.value:e},async setSetting(r,e){return await o.settings.put({key:r,value:e})},async getAllData(){return{favorites:await o.favorites.toArray(),following:await o.following.toArray(),history:await o.history.toArray()}},async syncFromServer(r){if(r)return await o.transaction("rw",[o.favorites,o.following,o.history],async()=>{const e=await o.history.toArray(),s=r.history||[],i=new Map;e.forEach(a=>{const l=`${a.animeId}_${a.episodeId}`;i.set(l,a)});let t=!1;s.forEach(a=>{const l=`${a.animeId}_${a.episodeId}`,c=i.get(l);if(!c)i.set(l,a);else{const v=a.updatedAt||a.timestamp||0,n=c.updatedAt||c.timestamp||0;v>n?i.set(l,a):n>v&&(t=!0)}}),e.length!==i.size&&(t=!0);const f=await o.favorites.toArray(),y=r.favorites||[],d=new Map;f.forEach(a=>d.set(Number(a.animeId),a)),y.forEach(a=>{const l=Number(a.animeId),c=d.get(l);if(!c)d.set(l,a);else{const v=a.addedAt||0,n=c.addedAt||0;v>n?d.set(l,a):n>v&&(t=!0)}}),f.length!==d.size&&(t=!0);const b=await o.following.toArray(),g=r.following||[],p=new Map;b.forEach(a=>p.set(Number(a.animeId),a)),g.forEach(a=>{const l=Number(a.animeId),c=p.get(l);if(!c)p.set(l,a);else{const v=a.addedAt||0,n=c.addedAt||0;v>n?p.set(l,a):n>v&&(t=!0)}}),b.length!==p.size&&(t=!0),await o.history.clear();const m=Array.from(i.values()).map(a=>{const{id:l,...c}=a;return c});await o.history.bulkAdd(m),await o.favorites.clear(),await o.favorites.bulkAdd(Array.from(d.values())),await o.following.clear(),await o.following.bulkAdd(Array.from(p.values())),t&&(console.log("[Sync] Detectados cambios locales más recientes. Subiendo fusión al servidor..."),setTimeout(()=>this.triggerSync(),0))})}},C=Object.freeze(Object.defineProperty({__proto__:null,db:o,dbService:$},Symbol.toStringTag,{value:"Module"}));class j{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.lastRequest=0,this.minDelay=500,this.cache=new Map,this.inflight=new Map,this.cacheTTL=10*60*1e3}async request(e,s={}){const i=new URL(`${this.baseUrl}${e}`);Object.keys(s).forEach(d=>i.searchParams.append(d,s[d]));const t=i.toString(),f=this.cache.get(t);if(f&&f.expires>Date.now())return f.data;if(this.inflight.has(t))return this.inflight.get(t);const y=(async()=>{const d=Date.now(),b=Math.max(0,this.lastRequest+this.minDelay-d);b>0&&await new Promise(m=>setTimeout(m,b)),this.lastRequest=Date.now();let g=await fetch(t);if(g.status===429&&(await new Promise(m=>setTimeout(m,2e3)),g=await fetch(t)),!g.ok)throw new Error(`Jikan error: ${g.status}`);const p=await g.json();return this.cache.set(t,{data:p,expires:Date.now()+this.cacheTTL}),this.inflight.delete(t),p})();return this.inflight.set(t,y),y}}class M{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(e,s={}){const i=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:s})});if(!i.ok)throw new Error(`AniList error: ${i.status}`);return(await i.json()).data}}class D{constructor(){const e=window.location.hostname||"localhost";this.port=3005,this.baseUrl=`http://${e}:${this.port}/api/v1`,this.apiKey="dev-anime1v-key"}async request(e,s={}){const i=new URL(`${this.baseUrl}${e}`);Object.keys(s).forEach(t=>i.searchParams.append(t,s[t]));try{const t=await fetch(i.toString(),{headers:{"X-API-Key":this.apiKey}});if(!t.ok)throw new Error(`Local API error: ${t.status}`);return t.json()}catch(t){return console.error(`Error en petición local a ${e}:`,t),{success:!1,message:t.message}}}}class T{constructor(){this.providers={jikan:new j,anilist:new M,local:new D},this.cache=new Map}async getAnimeSearch(e){return await this.providers.jikan.request("/anime",{q:e,limit:20})}async searchLocal(e){if(!e)return{success:!1,data:{results:[]}};try{let s=await this.providers.local.request("/anime/search",{q:e});if((!s.success||!s.data.results.length)&&e.length>5){const i=e.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();i!==e&&(s=await this.providers.local.request("/anime/search",{q:i}))}if(!s.success||!s.data.results.length){const i=e.split(" ")[0];i.length>3&&(s=await this.providers.local.request("/anime/search",{q:i}))}return s}catch{return{success:!1,data:{results:[]}}}}async getAnimeInfo(e){try{if(typeof e=="string"&&(e.includes("http")||e.includes("anime/")))return await this.providers.local.request("/anime/info",{url:e});if(this.cache.has(e))return this.cache.get(e);const s=await this.providers.jikan.request(`/anime/${e}/full`);return this.cache.set(e,s),s}catch{return{success:!1,data:null}}}async getEpisode(e){return await this.providers.local.request("/anime/episode",{url:e})}async getTrending(e=1){return await this.providers.jikan.request("/top/anime",{filter:"airing",limit:24,page:e})}async getMovies(e=1){return await this.providers.jikan.request("/top/anime",{type:"movie",filter:"bypopularity",limit:24,page:e})}async getLatest(e=1){return await this.providers.jikan.request("/seasons/now",{limit:24,page:e})}async getDubbed(e=1){try{return await this.providers.jikan.request("/anime",{producers:"1191,108",limit:24,page:e,order_by:"popularity",sort:"desc"})}catch{return{data:[]}}}async getByGenre(e,s=1){return await this.providers.jikan.request("/anime",{genres:e,order_by:"popularity",limit:24,page:s})}async getSchedule(){return await this.providers.jikan.request("/seasons/now")}async getAnimeRelations(e){return await this.providers.jikan.request(`/anime/${e}/relations`)}async getAnimeCharacters(e){return await this.providers.jikan.request(`/anime/${e}/characters`)}async getAnilistBanner(e){var i;const s="query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }";try{return(i=(await this.providers.anilist.request(s,{id:e})).Media)==null?void 0:i.bannerImage}catch{return null}}async getAnimeRecommendations(e){return await this.providers.jikan.request(`/anime/${e}/recommendations`)}async getAnilistEpisodes(e){var i;const s=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;try{return((i=(await this.providers.anilist.request(s,{id:e})).Media)==null?void 0:i.streamingEpisodes)||[]}catch(t){return console.warn("Error al cargar episodios desde AniList:",t),[]}}}const A=new T,L=Object.freeze(Object.defineProperty({__proto__:null,AnimeAPI:T,apiService:A},Symbol.toStringTag,{value:"Module"}));class z extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._renderSkeleton()}set data(e){this._anime=e,this.render()}_renderSkeleton(){const e=this.getAttribute("mode")==="thumbnail";this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; width: ${e?"320px":"185px"}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 22px; }
        .sk-img { width: 100%; aspect-ratio: ${e?"16/9":"2/3"}; margin-bottom: 12px; }
        .sk-t { height: 14px; border-radius: 7px; margin-bottom: 6px; }
        .sk-t2 { height: 10px; width: 60%; border-radius: 5px; }
      </style>
      <div><div class="sk sk-img"></div><div class="sk sk-t"></div><div class="sk sk-t2"></div></div>
    `}render(){var p,m,a,l;if(!this._anime)return;const e=this.getAttribute("mode")==="thumbnail",s=((m=(p=this._anime.images)==null?void 0:p.jpg)==null?void 0:m.large_image_url)||((l=(a=this._anime.images)==null?void 0:a.jpg)==null?void 0:l.image_url)||this._anime.image||this._anime.thumbnail||"",i=this._anime.title||"Anime",t=this._anime.mal_id||this._anime.id,f=this._anime.score||this._anime.rating||"?.?",y=this._anime.progress||0,d=this._anime.duration_watched||0,b=d>0?Math.min(y/d*100,100):0;let g=this._anime.nextEpisodeText||"";if(!g&&this._anime.status==="Currently Airing"&&this._anime.broadcast&&this._anime.broadcast.time){const c=this._anime.broadcast,v={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(v[c.day]!==void 0){const[n,x]=c.time.split(":").map(Number),h=new Date(new Date().toLocaleString("en-US",{timeZone:c.timezone||"Asia/Tokyo"}));let u=new Date(h);u.setHours(n,x,0,0);let w=v[c.day]-h.getDay();(w<0||w===0&&u<h)&&(w+=7),u.setDate(u.getDate()+w);const k=u-h;if(k>0){const _=Math.floor(k/864e5),E=Math.floor(k/36e5%24);_>0?g=`${_}d ${E}h para nuevo cap.`:E>0?g=`${E}h para nuevo cap.`:g="¡Nuevo cap en breve!"}}}this.shadowRoot.innerHTML=`
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
      <a href="/anime/${t}" data-link class="card-v4">
        <div class="img-box">
          <img src="${s}" alt="${i}" loading="lazy" referrerpolicy="no-referrer">
          <div class="rating-v4"><span style="color:#ff0000">★</span> ${f}</div>
          ${b>0?`<div class="progress-bar"><div class="progress-fill" style="width:${b}%"></div></div>`:""}
        </div>
        <div class="info-v4">
          <div class="meta-v4">${this._anime.type||"TV"} • ${this._anime.status||"EN EMISIÓN"}</div>
          <h3 class="title-v4">${i}</h3>
          ${this._anime.currentEpisode?`<div style="font-size: 10px; color: #ff0000; font-weight: 800; margin-top: 2px;">Visto Ep. ${this._anime.currentEpisode}</div>`:""}
          ${g?`<div style="font-size: 10px; color: #00ff88; font-weight: 800; margin-top: 2px;">⏱ ${g}</div>`:""}
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
    `).join("")}async afterRender(){const e=document.getElementById("hero-container-v4"),s=document.getElementById("trending-grid"),i=document.getElementById("movies-grid"),t=document.getElementById("continue-grid"),f=document.getElementById("continue-section"),y=document.getElementById("api-error-banner"),d=document.getElementById("api-error-msg");let b=!1;const g=async(p,m,a)=>{try{const l=await p();return l&&l.data&&l.data.length>0?m&&this._renderGrid(m,l.data):(m&&(m.innerHTML=`<p style="color:rgba(255,255,255,0.3);padding:20px;font-size:13px;">Sin resultados para ${a}</p>`),b=!0),l}catch(l){return console.error(`[AniRD] Error cargando ${a}:`,l),m&&(m.innerHTML=`<p style="color:rgba(255,100,100,0.5);padding:20px;font-size:13px;">Error al cargar ${a}</p>`),b=!0,null}};try{const p=document.getElementById("latest-grid"),m=document.getElementById("latino-grid"),a=document.getElementById("action-grid"),[l]=await Promise.all([g(()=>A.getTrending(),s,"Populares"),g(()=>A.getMovies(),i,"Películas"),g(()=>A.getLatest(),p,"Últimos"),g(()=>A.getDubbed(),m,"Latino"),g(()=>A.getByGenre("1,2"),a,"Acción")]);if(b&&y&&(y.style.display="flex",d&&(d.textContent="Algunas secciones no pudieron cargar. Verifica que el servidor esté activo.")),l&&l.data&&l.data.length>0){const c=l.data.slice(0,5),v=await Promise.all(c.map(h=>A.getAnilistBanner(h.mal_id).then(u=>{var w,k;return u||((k=(w=h.images)==null?void 0:w.jpg)==null?void 0:k.large_image_url)}).catch(()=>{var u,w;return(w=(u=h.images)==null?void 0:u.jpg)==null?void 0:w.large_image_url})));let n=0;const x=h=>{var k,_;const u=c[h];if(!u)return;const w=v[h]||((_=(k=u.images)==null?void 0:k.jpg)==null?void 0:_.large_image_url)||"";e.innerHTML=`
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
        `;try{const c=await $.getContinueWatching();if(c&&c.length>0){f.style.display="block";const v=c.slice(0,8);await Promise.all(v.map(async n=>{try{const x=document.createElement("anime-card");if(x.setAttribute("mode","thumbnail"),t.appendChild(x),n.animeTitle&&n.animeCover)x.data={mal_id:n.animeId,title:n.animeTitle,images:{jpg:{large_image_url:n.animeCover}},type:n.animeType||"",score:n.animeScore||"",currentEpisode:n.episodeId,progress:n.progress||0,duration_watched:n.duration||0},A.getAnimeInfo(n.animeId).then(h=>{h!=null&&h.data&&(x.data={...h.data,currentEpisode:n.episodeId,progress:n.progress||0})}).catch(()=>{});else{const h=await A.getAnimeInfo(n.animeId);h!=null&&h.data&&(x.data={...h.data,currentEpisode:n.episodeId,progress:n.progress||0})}}catch{}}))}}catch{}}catch(p){console.error("[AniRD HomePage] Error general:",p),y&&(y.style.display="flex",d&&(d.textContent=`Error de carga: ${p.message}. Verifica que el servidor esté activo en el puerto correcto.`))}}destroy(){this._heroInterval&&(clearInterval(this._heroInterval),this._heroInterval=null)}_renderGrid(e,s){!e||!s||(e.innerHTML="",s.forEach(i=>{const t=document.createElement("anime-card");t.data=i,e.appendChild(t)}))}}const P=Object.freeze(Object.defineProperty({__proto__:null,default:q},Symbol.toStringTag,{value:"Module"}));export{P as H,A as a,o as b,I as c,$ as d,C as e,L as f};
