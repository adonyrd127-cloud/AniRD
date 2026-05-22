import{X as T}from"./vendor-DIPEJTOH.js";class M{constructor(){this.tokenKey="anird_auth_token",this.userKey="anird_user",this.host=window.location.hostname||"localhost",this.baseUrl=`http://${this.host}:3005/api/v1/auth`,this.userUrl=`http://${this.host}:3005/api/v1/user`}getToken(){return localStorage.getItem(this.tokenKey)}getUser(){const e=localStorage.getItem(this.userKey);return e?JSON.parse(e):null}isLoggedIn(){return!!this.getToken()}async login(e,i){try{const t=await(await fetch(`${this.baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:i})})).json();if(!t.success)throw new Error(t.message);return localStorage.setItem(this.tokenKey,t.token),localStorage.setItem(this.userKey,JSON.stringify(t.user)),t}catch(s){throw console.error("Fetch error:",s),new Error(`Error de conexión al servidor (${this.baseUrl}).`)}}async register(e,i){try{const t=await(await fetch(`${this.baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:i})})).json();if(!t.success)throw new Error(t.message);return localStorage.setItem(this.tokenKey,t.token),localStorage.setItem(this.userKey,JSON.stringify(t.user)),t}catch(s){throw console.error("Fetch error:",s),new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`)}}logout(){localStorage.removeItem(this.tokenKey),localStorage.removeItem(this.userKey);try{console.log("[Auth] Borrando base de datos IndexedDB local AniRD_DB al cerrar sesión...");const e=indexedDB.deleteDatabase("AniRD_DB"),i=()=>{window.location.href="/"};e.onsuccess=i,e.onerror=i,e.onblocked=i,setTimeout(i,800)}catch(e){console.error("[Auth] Error borrando DB:",e),window.location.href="/"}}async syncWithServer(e){return this.isLoggedIn()?await(await fetch(`${this.userUrl}/sync`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getToken()}`},body:JSON.stringify(e),keepalive:!0})).json():null}async fetchFromServer(){if(!this.isLoggedIn())return null;const i=await(await fetch(`${this.userUrl}/sync`,{headers:{Authorization:`Bearer ${this.getToken()}`}})).json();return i.success?i.syncData:null}}const $=new M,r=new T("AniRD_DB");r.version(3).stores({history:"++id, animeId, episodeId, progress, duration, timestamp, updatedAt",favorites:"animeId, title, cover, addedAt",following:"animeId, title, cover, broadcast, addedAt",lists:"++id, name, animeIds, createdAt",cache:"key, data, expiresAt",settings:"key, value",notifications:"++id, animeId, isRead, timestamp"});r.open().catch(async o=>{console.error("[Dexie] Error crítico al abrir la base de datos AniRD_DB:",o);try{console.log("[Dexie] Intentando restablecer base de datos local para auto-recuperación..."),await T.delete("AniRD_DB"),console.log("[Dexie] Base de datos borrada con éxito. Recargando página...")}catch(e){console.error("[Dexie] Fallo al borrar base de datos:",e)}window.location.reload()});const B={async triggerSync(){try{if($.isLoggedIn()){const o=await this.getAllData();await $.syncWithServer(o),console.log("[Sync] Sincronización en la nube exitosa.")}}catch(o){console.error("[Sync] Error sincronizando con el servidor:",o)}},async addToHistory(o,e,i,s,t={}){const v=Date.now(),y=await r.history.where({animeId:o,episodeId:e}).first();let h;return y?h=await r.history.update(y.id,{progress:i,duration:s,updatedAt:v,...t}):h=await r.history.add({animeId:o,episodeId:e,progress:i,duration:s,timestamp:v,updatedAt:v,...t}),this.triggerSync(),h},async getContinueWatching(){const o=await r.history.orderBy("updatedAt").reverse().toArray(),e=new Map;return o.forEach(s=>{e.has(s.animeId)||e.set(s.animeId,s)}),Array.from(e.values()).filter(s=>!s.duration||s.duration===0?!0:s.progress/s.duration*100<90).slice(0,20)},async toggleFavorite(o){var s,t;const e=o.mal_id||o.id||o.animeId;return await r.favorites.get(e)?(await r.favorites.delete(e),this.triggerSync(),!1):(await r.favorites.add({animeId:e,title:o.title,cover:((t=(s=o.images)==null?void 0:s.jpg)==null?void 0:t.large_image_url)||o.cover||"",type:o.type||"",score:o.score||"",episodes:o.episodes||null,status:o.status||"",broadcast:o.broadcast||null,addedAt:Date.now()}),this.triggerSync(),!0)},async isFavorite(o){return o?!!await r.favorites.get(Number(o)):!1},async getFavorites(){return await r.favorites.orderBy("addedAt").reverse().toArray()},async toggleFollowing(o){var s,t;const e=o.mal_id||o.id||o.animeId;return await r.following.get(e)?(await r.following.delete(e),this.triggerSync(),!1):(await r.following.add({animeId:e,title:o.title,cover:((t=(s=o.images)==null?void 0:s.jpg)==null?void 0:t.large_image_url)||o.cover||"",status:o.status||"",broadcast:o.broadcast||null,addedAt:Date.now(),lastNotified:Date.now()}),this.triggerSync(),!0)},async isFollowing(o){return o?!!await r.following.get(Number(o)):!1},async getFollowing(){return await r.following.orderBy("addedAt").reverse().toArray()},async getSetting(o,e=null){const i=await r.settings.get(o);return i?i.value:e},async setSetting(o,e){return await r.settings.put({key:o,value:e})},async getAllData(){return{favorites:await r.favorites.toArray(),following:await r.following.toArray(),history:await r.history.toArray()}},async syncFromServer(o){if(o)return await r.transaction("rw",[r.favorites,r.following,r.history],async()=>{const e=await r.history.toArray(),i=o.history||[],s=new Map;e.forEach(a=>{const d=`${a.animeId}_${a.episodeId}`;s.set(d,a)});let t=!1;i.forEach(a=>{const d=`${a.animeId}_${a.episodeId}`,l=s.get(d);if(!l)s.set(d,a);else{const f=a.updatedAt||a.timestamp||0,g=l.updatedAt||l.timestamp||0;f>g?s.set(d,a):g>f&&(t=!0)}}),e.length!==s.size&&(t=!0);const v=await r.favorites.toArray(),y=o.favorites||[],h=new Map;v.forEach(a=>h.set(Number(a.animeId),a)),y.forEach(a=>{const d=Number(a.animeId),l=h.get(d);if(!l)h.set(d,a);else{const f=a.addedAt||0,g=l.addedAt||0;f>g?h.set(d,a):g>f&&(t=!0)}}),v.length!==h.size&&(t=!0);const w=await r.following.toArray(),c=o.following||[],p=new Map;w.forEach(a=>p.set(Number(a.animeId),a)),c.forEach(a=>{const d=Number(a.animeId),l=p.get(d);if(!l)p.set(d,a);else{const f=a.addedAt||0,g=l.addedAt||0;f>g?p.set(d,a):g>f&&(t=!0)}}),w.length!==p.size&&(t=!0),await r.history.clear();const b=Array.from(s.values()).map(a=>{const{id:d,...l}=a;return l});await r.history.bulkAdd(b),await r.favorites.clear(),await r.favorites.bulkAdd(Array.from(h.values())),await r.following.clear(),await r.following.bulkAdd(Array.from(p.values())),t&&(console.log("[Sync] Detectados cambios locales más recientes. Subiendo fusión al servidor..."),setTimeout(()=>this.triggerSync(),0))})}},U=Object.freeze(Object.defineProperty({__proto__:null,db:r,dbService:B},Symbol.toStringTag,{value:"Module"}));class D{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.lastRequest=0,this.minDelay=500,this.cache=new Map,this.inflight=new Map,this.cacheTTL=10*60*1e3}async request(e,i={}){const s=new URL(`${this.baseUrl}${e}`);Object.keys(i).forEach(h=>s.searchParams.append(h,i[h]));const t=s.toString(),v=this.cache.get(t);if(v&&v.expires>Date.now())return v.data;if(this.inflight.has(t))return this.inflight.get(t);const y=(async()=>{const h=Date.now(),w=Math.max(0,this.lastRequest+this.minDelay-h);w>0&&await new Promise(b=>setTimeout(b,w)),this.lastRequest=Date.now();let c=await fetch(t);if(c.status===429&&(await new Promise(b=>setTimeout(b,2e3)),c=await fetch(t)),!c.ok)throw new Error(`Jikan error: ${c.status}`);const p=await c.json();return this.cache.set(t,{data:p,expires:Date.now()+this.cacheTTL}),this.inflight.delete(t),p})();return this.inflight.set(t,y),y}}class z{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(e,i={}){const s=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:i})});if(!s.ok)throw new Error(`AniList error: ${s.status}`);return(await s.json()).data}}class N{constructor(){const e=window.location.hostname||"localhost";this.port=3005,this.baseUrl=`http://${e}:${this.port}/api/v1`,this.apiKey="dev-anime1v-key"}async request(e,i={}){const s=new URL(`${this.baseUrl}${e}`);Object.keys(i).forEach(t=>s.searchParams.append(t,i[t]));try{const t=await fetch(s.toString(),{headers:{"X-API-Key":this.apiKey}});if(!t.ok)throw new Error(`Local API error: ${t.status}`);return t.json()}catch(t){return console.error(`Error en petición local a ${e}:`,t),{success:!1,message:t.message}}}}class j{constructor(){this.providers={jikan:new D,anilist:new z,local:new N},this.cache=new Map}async getAnimeSearch(e){return await this.providers.jikan.request("/anime",{q:e,limit:20})}async searchLocal(e){if(!e)return{success:!1,data:{results:[]}};try{let i=await this.providers.local.request("/anime/search",{q:e});if((!i.success||!i.data.results.length)&&e.length>5){const s=e.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();s!==e&&(i=await this.providers.local.request("/anime/search",{q:s}))}if(!i.success||!i.data.results.length){const s=e.split(" ")[0];s.length>3&&(i=await this.providers.local.request("/anime/search",{q:s}))}return i}catch{return{success:!1,data:{results:[]}}}}async getAnimeInfo(e){try{if(typeof e=="string"&&(e.includes("http")||e.includes("anime/")))return await this.providers.local.request("/anime/info",{url:e});if(this.cache.has(e))return this.cache.get(e);const i=await this.providers.jikan.request(`/anime/${e}/full`);return this.cache.set(e,i),i}catch{return{success:!1,data:null}}}async getEpisode(e){return await this.providers.local.request("/anime/episode",{url:e})}async getTrending(e=1){return await this.providers.jikan.request("/top/anime",{filter:"airing",limit:24,page:e})}async getMovies(e=1){return await this.providers.jikan.request("/top/anime",{type:"movie",filter:"bypopularity",limit:24,page:e})}async getLatest(e=1){return await this.providers.jikan.request("/seasons/now",{limit:24,page:e})}async getDubbed(e=1){try{return await this.providers.jikan.request("/anime",{producers:"1191,108",limit:24,page:e,order_by:"popularity",sort:"desc"})}catch{return{data:[]}}}async getByGenre(e,i=1){return await this.providers.jikan.request("/anime",{genres:e,order_by:"popularity",limit:24,page:i})}async getSchedule(){return await this.providers.jikan.request("/seasons/now")}async getAnimeRelations(e){return await this.providers.jikan.request(`/anime/${e}/relations`)}async getAnimeCharacters(e){return await this.providers.jikan.request(`/anime/${e}/characters`)}async getAnilistBanner(e){var s;const i="query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }";try{return(s=(await this.providers.anilist.request(i,{id:e})).Media)==null?void 0:s.bannerImage}catch{return null}}async getAnimeRecommendations(e){return await this.providers.jikan.request(`/anime/${e}/recommendations`)}async getAnilistEpisodes(e){var s;const i=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;try{return((s=(await this.providers.anilist.request(i,{id:e})).Media)==null?void 0:s.streamingEpisodes)||[]}catch(t){return console.warn("Error al cargar episodios desde AniList:",t),[]}}}const x=new j,O=Object.freeze(Object.defineProperty({__proto__:null,AnimeAPI:j,apiService:x},Symbol.toStringTag,{value:"Module"}));class q extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._renderSkeleton()}set data(e){this._anime=e,this.render()}_renderSkeleton(){const e=this.getAttribute("mode")==="thumbnail";this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; width: ${e?"320px":"185px"}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 22px; }
        .sk-img { width: 100%; aspect-ratio: ${e?"16/9":"2/3"}; margin-bottom: 12px; }
        .sk-t { height: 14px; border-radius: 7px; margin-bottom: 6px; }
        .sk-t2 { height: 10px; width: 60%; border-radius: 5px; }
      </style>
      <div><div class="sk sk-img"></div><div class="sk sk-t"></div><div class="sk sk-t2"></div></div>
    `}render(){var p,b,a,d;if(!this._anime)return;const e=this.getAttribute("mode")==="thumbnail",i=((b=(p=this._anime.images)==null?void 0:p.jpg)==null?void 0:b.large_image_url)||((d=(a=this._anime.images)==null?void 0:a.jpg)==null?void 0:d.image_url)||this._anime.image||this._anime.thumbnail||"",s=this._anime.title||"Anime",t=this._anime.mal_id||this._anime.id,v=this._anime.score||this._anime.rating||"?.?",y=this._anime.progress||0,h=this._anime.duration_watched||0,w=h>0?Math.min(y/h*100,100):0;let c=this._anime.nextEpisodeText||"";if(!c&&this._anime.status==="Currently Airing"&&this._anime.broadcast&&this._anime.broadcast.time){const l=this._anime.broadcast,f={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(f[l.day]!==void 0){const[g,A]=l.time.split(":").map(Number),m=new Date(new Date().toLocaleString("en-US",{timeZone:l.timezone||"Asia/Tokyo"}));let n=new Date(m);n.setHours(g,A,0,0);let u=f[l.day]-m.getDay();(u<0||u===0&&n<m)&&(u+=7),n.setDate(n.getDate()+u);const k=n-m;if(k>0){const S=Math.floor(k/864e5),E=Math.floor(k/36e5%24);S>0?c=`${S}d ${E}h para nuevo cap.`:E>0?c=`${E}h para nuevo cap.`:c="¡Nuevo cap en breve!"}}}this.shadowRoot.innerHTML=`
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
          <img src="${i}" alt="${s}" loading="lazy" referrerpolicy="no-referrer">
          <div class="rating-v4"><span style="color:#ff0000">★</span> ${v}</div>
          ${w>0?`<div class="progress-bar"><div class="progress-fill" style="width:${w}%"></div></div>`:""}
        </div>
        <div class="info-v4">
          <div class="meta-v4">${this._anime.type||"TV"} • ${this._anime.status||"EN EMISIÓN"}</div>
          <h3 class="title-v4">${s}</h3>
          ${this._anime.currentEpisode?`<div style="font-size: 10px; color: #ff0000; font-weight: 800; margin-top: 2px;">Visto Ep. ${this._anime.currentEpisode}</div>`:""}
          ${c?`<div style="font-size: 10px; color: #00ff88; font-weight: 800; margin-top: 2px;">⏱ ${c}</div>`:""}
        </div>
      </a>
    `}}customElements.define("anime-card",q);class L{async render(){const e=document.createElement("div");return e.innerHTML=`
      <style>
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

        @media (max-width: 768px) {
          .hero-v4 { height: 60vh; padding: 0 20px 40px; align-items: center; }
          .hero-content-v4 { padding: 25px; border-radius: 20px; text-align: center; }
          .hero-actions-v4 { justify-content: center; }
        }
      </style>
      
      <div id="hero-container-v4">
        <!-- Skeleton Hero (visible until real data loads) -->
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
            ${Array.from({length:8},()=>'<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>').join("")}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latest-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">POPULARES ESTE VERANO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('trending-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="trending-grid">
            ${Array.from({length:8},()=>'<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>').join("")}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('trending-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ANIMES EN LATINO</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latino-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="latino-grid">
            ${Array.from({length:8},()=>'<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>').join("")}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latino-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>

        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">PELÍCULAS DESTACADAS</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('movies-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="movies-grid">
            ${Array.from({length:8},()=>'<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>').join("")}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('movies-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>
        
        <div class="section-wrapper">
          <div class="section-header">
            <h2 class="section-title">ACCIÓN Y AVENTURA</h2>
          </div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('action-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v4" id="action-grid">
            ${Array.from({length:8},()=>'<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>').join("")}
          </div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('action-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
        </div>
      </div>
    `,e}async afterRender(){const e=document.getElementById("hero-container-v4"),i=document.getElementById("trending-grid"),s=document.getElementById("movies-grid"),t=document.getElementById("continue-grid"),v=document.getElementById("continue-section");try{const y=document.getElementById("latest-grid"),h=document.getElementById("latino-grid"),w=document.getElementById("action-grid"),[c,p,b,a,d]=await Promise.all([x.getTrending(),x.getMovies(),x.getLatest(),x.getDubbed(),x.getByGenre("1,2")]);if(c&&c.data){const g=c.data.slice(0,5),A=await Promise.all(g.map(u=>x.getAnilistBanner(u.mal_id)));let m=0;const n=u=>{var E,_,I;const k=g[u],S=A[u]||((_=(E=k.images)==null?void 0:E.jpg)==null?void 0:_.large_image_url);k&&(e.innerHTML=`
            <div class="hero-v4">
              <div class="hero-backdrop-v4" style="background-image: url('${S}')"></div>
              <div class="hero-content-v4 page-enter">
                <h1 class="hero-title-v4">${k.title}</h1>
                <p class="hero-subtitle-v4">${(I=k.synopsis)==null?void 0:I.slice(0,180)}...</p>
                <div class="hero-actions-v4">
                  <a href="/anime/${k.mal_id}" data-link class="btn-v4-primary"><span>▶</span> VER AHORA</a>
                  <a href="/anime/${k.mal_id}" data-link class="btn-v4-secondary">MÁS INFO</a>
                </div>
              </div>
            </div>
          `)};n(0),setInterval(()=>{m=(m+1)%g.length,n(m)},8e3)}const l=(g,A)=>{g&&A&&(g.innerHTML="",A.forEach(m=>{const n=document.createElement("anime-card");n.data=m,g.appendChild(n)}))};l(i,c==null?void 0:c.data),l(s,p==null?void 0:p.data),l(y,b==null?void 0:b.data),l(h,a==null?void 0:a.data),l(w,d==null?void 0:d.data);const f=await B.getContinueWatching();if(f.length>0){v.style.display="block";const A=f.slice(0,8).map(m=>{const n=document.createElement("anime-card");return n.setAttribute("mode","thumbnail"),t.appendChild(n),{card:n,item:m}});await Promise.all(A.map(async({card:m,item:n})=>{try{if(n.animeTitle&&n.animeCover)m.data={mal_id:n.animeId,title:n.animeTitle,images:{jpg:{large_image_url:n.animeCover}},type:n.animeType||"",score:n.animeScore||"",currentEpisode:n.episodeId,progress:n.progress||0,duration_watched:n.duration||0},x.getAnimeInfo(n.animeId).then(u=>{u&&u.data&&(m.data={...u.data,currentEpisode:n.episodeId,progress:n.progress||0,duration_watched:n.duration||0})}).catch(u=>{});else{const u=await x.getAnimeInfo(n.animeId);u&&u.data&&(m.data={...u.data,currentEpisode:n.episodeId,progress:n.progress||0,duration_watched:n.duration||0})}}catch{}}))}}catch(y){console.error(y)}}}const C=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));export{C as H,x as a,r as b,$ as c,B as d,U as e,O as f};
