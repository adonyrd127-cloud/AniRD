import{X as B}from"./vendor-DIPEJTOH.js";class M{constructor(){this.tokenKey="anird_auth_token",this.userKey="anird_user",this.host=window.location.hostname||"localhost",this.baseUrl=`http://${this.host}:3005/api/v1/auth`,this.userUrl=`http://${this.host}:3005/api/v1/user`}getToken(){return localStorage.getItem(this.tokenKey)}getUser(){const e=localStorage.getItem(this.userKey);return e?JSON.parse(e):null}isLoggedIn(){return!!this.getToken()}async login(e,t){try{const r=await(await fetch(`${this.baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})})).json();if(!r.success)throw new Error(r.message);return localStorage.setItem(this.tokenKey,r.token),localStorage.setItem(this.userKey,JSON.stringify(r.user)),r}catch(i){throw console.error("Fetch error:",i),new Error(`Error de conexión al servidor (${this.baseUrl}).`)}}async register(e,t){try{const r=await(await fetch(`${this.baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})})).json();if(!r.success)throw new Error(r.message);return localStorage.setItem(this.tokenKey,r.token),localStorage.setItem(this.userKey,JSON.stringify(r.user)),r}catch(i){throw console.error("Fetch error:",i),new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`)}}logout(){localStorage.removeItem(this.tokenKey),localStorage.removeItem(this.userKey);try{console.log("[Auth] Borrando base de datos IndexedDB local AniRD_DB al cerrar sesión...");const e=indexedDB.deleteDatabase("AniRD_DB"),t=()=>{window.location.href="/"};e.onsuccess=t,e.onerror=t,e.onblocked=t,setTimeout(t,800)}catch(e){console.error("[Auth] Error borrando DB:",e),window.location.href="/"}}async syncWithServer(e){return this.isLoggedIn()?await(await fetch(`${this.userUrl}/sync`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getToken()}`},body:JSON.stringify(e),keepalive:!0})).json():null}async fetchFromServer(){if(!this.isLoggedIn())return null;const t=await(await fetch(`${this.userUrl}/sync`,{headers:{Authorization:`Bearer ${this.getToken()}`}})).json();return t.success?t.syncData:null}}const z=new M,n=new B("AniRD_DB");n.version(3).stores({history:"++id, animeId, episodeId, progress, duration, timestamp, updatedAt",favorites:"animeId, title, cover, addedAt",following:"animeId, title, cover, broadcast, addedAt",lists:"++id, name, animeIds, createdAt",cache:"key, data, expiresAt",settings:"key, value",notifications:"++id, animeId, isRead, timestamp"});n.open().catch(async s=>{console.error("[Dexie] Error crítico al abrir la base de datos AniRD_DB:",s);try{console.log("[Dexie] Intentando restablecer base de datos local para auto-recuperación..."),await B.delete("AniRD_DB"),console.log("[Dexie] Base de datos borrada con éxito. Recargando página...")}catch(e){console.error("[Dexie] Fallo al borrar base de datos:",e)}window.location.reload()});const T={async triggerSync(){try{if(z.isLoggedIn()){const s=await this.getAllData();await z.syncWithServer(s),console.log("[Sync] Sincronización en la nube exitosa.")}}catch(s){console.error("[Sync] Error sincronizando con el servidor:",s)}},async addToHistory(s,e,t,i,r={}){const p=Date.now(),b=await n.history.where({animeId:s,episodeId:e}).first();let c;return b?c=await n.history.update(b.id,{progress:t,duration:i,updatedAt:p,...r}):c=await n.history.add({animeId:s,episodeId:e,progress:t,duration:i,timestamp:p,updatedAt:p,...r}),this.triggerSync(),c},async getContinueWatching(){const s=await n.history.orderBy("updatedAt").reverse().toArray(),e=new Map;return s.forEach(i=>{e.has(i.animeId)||e.set(i.animeId,i)}),Array.from(e.values()).filter(i=>!i.duration||i.duration===0?!0:i.progress/i.duration*100<90).slice(0,20)},async toggleFavorite(s){var i,r;const e=s.mal_id||s.id||s.animeId;return await n.favorites.get(e)?(await n.favorites.delete(e),this.triggerSync(),!1):(await n.favorites.add({animeId:e,title:s.title,cover:((r=(i=s.images)==null?void 0:i.jpg)==null?void 0:r.large_image_url)||s.cover||"",type:s.type||"",score:s.score||"",episodes:s.episodes||null,status:s.status||"",broadcast:s.broadcast||null,addedAt:Date.now()}),this.triggerSync(),!0)},async isFavorite(s){return s?!!await n.favorites.get(Number(s)):!1},async getFavorites(){return await n.favorites.orderBy("addedAt").reverse().toArray()},async toggleFollowing(s){var i,r;const e=s.mal_id||s.id||s.animeId;return await n.following.get(e)?(await n.following.delete(e),this.triggerSync(),!1):(await n.following.add({animeId:e,title:s.title,cover:((r=(i=s.images)==null?void 0:i.jpg)==null?void 0:r.large_image_url)||s.cover||"",status:s.status||"",broadcast:s.broadcast||null,addedAt:Date.now(),lastNotified:Date.now()}),this.triggerSync(),!0)},async isFollowing(s){return s?!!await n.following.get(Number(s)):!1},async getFollowing(){return await n.following.orderBy("addedAt").reverse().toArray()},async getSetting(s,e=null){const t=await n.settings.get(s);return t?t.value:e},async setSetting(s,e){return await n.settings.put({key:s,value:e})},async getAllData(){return{favorites:await n.favorites.toArray(),following:await n.following.toArray(),history:await n.history.toArray()}},async syncFromServer(s){if(s)return await n.transaction("rw",[n.favorites,n.following,n.history],async()=>{const e=await n.history.toArray(),t=s.history||[],i=new Map;e.forEach(a=>{const l=`${a.animeId}_${a.episodeId}`;i.set(l,a)});let r=!1;t.forEach(a=>{const l=`${a.animeId}_${a.episodeId}`,d=i.get(l);if(!d)i.set(l,a);else{const f=a.updatedAt||a.timestamp||0,o=d.updatedAt||d.timestamp||0;f>o?i.set(l,a):o>f&&(r=!0)}}),e.length!==i.size&&(r=!0);const p=await n.favorites.toArray(),b=s.favorites||[],c=new Map;p.forEach(a=>c.set(Number(a.animeId),a)),b.forEach(a=>{const l=Number(a.animeId),d=c.get(l);if(!d)c.set(l,a);else{const f=a.addedAt||0,o=d.addedAt||0;f>o?c.set(l,a):o>f&&(r=!0)}}),p.length!==c.size&&(r=!0);const y=await n.following.toArray(),w=s.following||[],g=new Map;y.forEach(a=>g.set(Number(a.animeId),a)),w.forEach(a=>{const l=Number(a.animeId),d=g.get(l);if(!d)g.set(l,a);else{const f=a.addedAt||0,o=d.addedAt||0;f>o?g.set(l,a):o>f&&(r=!0)}}),y.length!==g.size&&(r=!0),await n.history.clear();const m=Array.from(i.values()).map(a=>{const{id:l,...d}=a;return d});await n.history.bulkAdd(m),await n.favorites.clear(),await n.favorites.bulkAdd(Array.from(c.values())),await n.following.clear(),await n.following.bulkAdd(Array.from(g.values())),r&&(console.log("[Sync] Detectados cambios locales más recientes. Subiendo fusión al servidor..."),setTimeout(()=>this.triggerSync(),0))})}},R=Object.freeze(Object.defineProperty({__proto__:null,db:n,dbService:T},Symbol.toStringTag,{value:"Module"}));class D{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.lastRequest=0,this.minDelay=500,this.cache=new Map,this.inflight=new Map,this.cacheTTL=10*60*1e3}async request(e,t={},i={}){const r=new URL(`${this.baseUrl}${e}`);Object.keys(t).forEach(y=>r.searchParams.append(y,t[y]));const p=r.toString(),b=this.cache.get(p);if(b&&b.expires>Date.now())return b.data;if(this.inflight.has(p))return this.inflight.get(p);const c=(async()=>{const y=Date.now(),w=Math.max(0,this.lastRequest+this.minDelay-y);w>0&&await new Promise(a=>setTimeout(a,w)),this.lastRequest=Date.now();let g=await fetch(p,{signal:i.signal});if(g.status===429&&(await new Promise(a=>setTimeout(a,2e3)),g=await fetch(p,{signal:i.signal})),!g.ok)throw new Error(`Jikan error: ${g.status}`);const m=await g.json();return this.cache.set(p,{data:m,expires:Date.now()+this.cacheTTL}),this.inflight.delete(p),m})();return this.inflight.set(p,c),c}}class C{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(e,t={}){const i=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:t})});if(!i.ok)throw new Error(`AniList error: ${i.status}`);return(await i.json()).data}}class q{constructor(){const e=window.location.hostname||"localhost";this.port=3005,this.baseUrl=`http://${e}:${this.port}/api/v1`,this.apiKey="dev-anime1v-key"}async request(e,t={}){const i=new URL(`${this.baseUrl}${e}`);Object.keys(t).forEach(r=>i.searchParams.append(r,t[r]));try{const r=await fetch(i.toString(),{headers:{"X-API-Key":this.apiKey}});if(!r.ok)throw new Error(`Local API error: ${r.status}`);return r.json()}catch(r){return console.error(`Error en petición local a ${e}:`,r),{success:!1,message:r.message}}}}class j{constructor(){this.providers={jikan:new D,anilist:new C,local:new q},this.cache=new Map}async getAnimeSearch(e,t={}){return await this.providers.jikan.request("/anime",{q:e,limit:20},t)}async searchLocal(e){if(!e)return{success:!1,data:{results:[]}};try{let t=await this.providers.local.request("/anime/search",{q:e});if((!t.success||!t.data.results.length)&&e.length>5){const i=e.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();i!==e&&(t=await this.providers.local.request("/anime/search",{q:i}))}if(!t.success||!t.data.results.length){const i=e.split(" ")[0];i.length>3&&(t=await this.providers.local.request("/anime/search",{q:i}))}return t}catch{return{success:!1,data:{results:[]}}}}async getAnimeInfo(e){try{if(typeof e=="string"&&(e.includes("http")||e.includes("anime/")))return await this.providers.local.request("/anime/info",{url:e});if(this.cache.has(e))return this.cache.get(e);const t=await this.providers.jikan.request(`/anime/${e}/full`);return this.cache.set(e,t),t}catch{return{success:!1,data:null}}}async getEpisode(e){return await this.providers.local.request("/anime/episode",{url:e})}async getTrending(e=1){return await this.providers.jikan.request("/top/anime",{filter:"airing",limit:24,page:e})}async getMovies(e=1){return await this.providers.jikan.request("/top/anime",{type:"movie",filter:"bypopularity",limit:24,page:e})}async getLatest(e=1){return await this.providers.jikan.request("/seasons/now",{limit:24,page:e})}async getDubbed(e=1){try{return await this.providers.jikan.request("/anime",{producers:"1191,108",limit:24,page:e,order_by:"popularity",sort:"desc"})}catch{return{data:[]}}}async getByGenre(e,t=1){return await this.providers.jikan.request("/anime",{genres:e,order_by:"popularity",limit:24,page:t})}async getSchedule(){return await this.providers.jikan.request("/seasons/now")}async getAnimeRelations(e){return await this.providers.jikan.request(`/anime/${e}/relations`)}async getAnimeCharacters(e){return await this.providers.jikan.request(`/anime/${e}/characters`)}async getAnilistBanner(e){var i;const t="query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }";try{return(i=(await this.providers.anilist.request(t,{id:e})).Media)==null?void 0:i.bannerImage}catch{return null}}async getAnimeRecommendations(e){return await this.providers.jikan.request(`/anime/${e}/recommendations`)}async getAnilistEpisodes(e){var i;const t=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;try{return((i=(await this.providers.anilist.request(t,{id:e})).Media)==null?void 0:i.streamingEpisodes)||[]}catch(r){return console.warn("Error al cargar episodios desde AniList:",r),[]}}}const x=new j,H=Object.freeze(Object.defineProperty({__proto__:null,AnimeAPI:j,apiService:x},Symbol.toStringTag,{value:"Module"}));class N extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._renderSkeleton()}set data(e){this._anime=e,this.render()}_renderSkeleton(){const e=this.getAttribute("mode")==="thumbnail";this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; width: ${e?"320px":"185px"}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 16px; }
        .sk-img { width: 100%; aspect-ratio: ${e?"16/9":"3/4.2"}; margin-bottom: 12px; }
      </style>
      <div class="sk sk-img"></div>
    `}render(){var a,l,d,f,o,v;if(!this._anime)return;const e=this.getAttribute("mode")==="thumbnail",t=((l=(a=this._anime.images)==null?void 0:a.webp)==null?void 0:l.large_image_url)||((f=(d=this._anime.images)==null?void 0:d.jpg)==null?void 0:f.large_image_url)||((v=(o=this._anime.images)==null?void 0:o.jpg)==null?void 0:v.image_url)||this._anime.image||this._anime.thumbnail||"",i=this._anime.title_english||this._anime.title||"Anime",r=this._anime.mal_id||this._anime.id,p=this._anime.score||this._anime.rating||"?.?",b=this._anime.type||"TV",c=this._anime.episodes?`${this._anime.episodes} eps`:"",y=this._anime.progress||0,w=this._anime.duration_watched||0,g=w>0?Math.min(y/w*100,100):0,m=this._anime.status==="Currently Airing";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: ${e?"280px":"185px"};
          flex-shrink: 0;
          cursor: pointer;
        }
        @media (max-width: 768px) {
          :host { width: ${e?"240px":"145px"}; }
        }
        .card-inner {
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          background: #18181b;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          text-decoration: none;
          display: block;
          transform: translateY(0);
        }
        :host(:hover) .card-inner {
          transform: scale(1.05) translateY(-8px);
        }
        .img-container {
          aspect-ratio: ${e?"16/9":"3/4.2"};
          width: 100%;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        :host(:hover) img {
          transform: scale(1.1);
        }
        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 40%, transparent 100%);
          opacity: 0.8;
          pointer-events: none;
        }
        .hover-border {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          border: 2px solid transparent;
          transition: border-color 0.3s ease;
          pointer-events: none;
          z-index: 10;
        }
        :host(:hover) .hover-border {
          border-color: rgba(239, 68, 68, 0.5); /* border-red-500/50 */
        }
        
        .badge-score {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 2px 8px;
          z-index: 5;
        }
        .badge-score svg { width: 12px; height: 12px; fill: #fbbf24; color: #fbbf24; }
        .badge-score span { font-size: 11px; font-weight: 700; color: white; font-family: 'Inter', sans-serif; }

        .badge-airing {
          position: absolute;
          top: 10px;
          right: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          border-radius: 9999px;
          background: rgba(220, 38, 38, 0.9);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: 2px 8px;
          z-index: 5;
          font-size: 10px;
          font-weight: 600;
          color: white;
          font-family: 'Inter', sans-serif;
        }
        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .4; }
        }

        .info-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 12px;
          padding-top: 32px;
          z-index: 5;
        }
        .title {
          font-family: 'Inter', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .meta-type {
          font-size: 10px;
          font-weight: 500;
          color: #d4d4d8;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .meta-dot {
          color: #52525b;
        }
        .meta-eps {
          font-size: 10px;
          color: #a1a1aa;
        }
        
        .progress-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 10;
        }
        .progress-fill {
          height: 100%;
          background: #dc2626;
          border-radius: 0 2px 2px 0;
        }
      </style>
      <a href="/anime/${r}" data-link class="card-inner">
        <div class="img-container">
          <img src="${t}" alt="${i}" loading="lazy" referrerpolicy="no-referrer">
        </div>
        <div class="gradient-overlay"></div>
        <div class="hover-border"></div>
        
        ${p!=="?.?"?`
        <div class="badge-score">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>${p}</span>
        </div>`:""}

        ${m?`
        <div class="badge-airing">
          <div class="dot"></div>
          EN EMISIÓN
        </div>`:""}

        <div class="info-bottom">
          <h3 class="title">${i}</h3>
          <div class="meta">
            ${`<span class="meta-type">${b}</span>`}
            ${c?'<span class="meta-dot">·</span>':""}
            ${c?`<span class="meta-eps">${c}</span>`:""}
          </div>
        </div>

        ${g>0?`<div class="progress-bar"><div class="progress-fill" style="width:${g}%"></div></div>`:""}
      </a>
    `}}customElements.define("anime-card",N);class L{async render(){const e=document.createElement("div");return e.className="home-page-wrapper",e.innerHTML=`
      <style>
        /* ✅ FIX CRÍTICO: El nav es fijo pero el hero va de fondo */
        .home-page-wrapper {
          min-height: 100vh;
          background: #09090b; /* zinc-950 */
        }

        .hero-v5 {
          height: 75vh;
          min-height: 500px;
          max-height: 800px;
          position: relative;
          overflow: hidden;
          background: #09090b;
        }
        .hero-backdrop-v5 {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center 20%;
          z-index: 0;
          transition: background-image 0.8s ease-in-out, transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-v5:hover .hero-backdrop-v5 {
          transform: scale(1.05);
        }
        .hero-overlay-1 { position: absolute; inset: 0; background: linear-gradient(to right, rgba(9,9,11,0.95), rgba(9,9,11,0.6), rgba(9,9,11,0.3)); z-index: 1; }
        .hero-overlay-2 { position: absolute; inset: 0; background: linear-gradient(to top, #09090b, rgba(9,9,11,0.2), transparent); z-index: 2; }
        .hero-overlay-3 { position: absolute; bottom: 0; left: 0; right: 0; height: 160px; background: linear-gradient(to top, #09090b, transparent); z-index: 3; }
        
        .hero-content-v5 {
          position: absolute;
          z-index: 10;
          bottom: 0;
          left: 0;
          right: 0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5% 60px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          height: 100%;
        }
        
        .hero-badges { display: flex; gap: 8px; margin-bottom: 12px; }
        .badge-airing { display: flex; align-items: center; gap: 6px; background: rgba(220,38,38,0.9); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: white; }
        .badge-score { display: flex; align-items: center; gap: 4px; background: rgba(245,158,11,0.2); border: 1px solid rgba(245,158,11,0.3); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #fbbf24; }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: white; animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        .hero-title-v5 {
          font-family: 'Inter', sans-serif;
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
          margin: 0 0 12px 0;
        }
        .hero-meta { display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; color: #d4d4d8; margin-bottom: 16px; font-weight: 500; }
        .hero-synopsis { font-size: 15px; color: #a1a1aa; max-width: 600px; line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        
        .hero-actions-v5 { display: flex; gap: 12px; }
        .btn-play { background: #dc2626; color: white; border-radius: 9999px; padding: 12px 28px; font-weight: 600; display: flex; align-items: center; gap: 8px; text-decoration: none; box-shadow: 0 10px 15px -3px rgba(220,38,38,0.3); transition: all 0.3s; font-size: 14px; }
        .btn-play:hover { background: #b91c1c; transform: scale(1.05); }
        .btn-info { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1); color: white; backdrop-filter: blur(4px); border-radius: 9999px; padding: 12px 24px; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: all 0.3s; font-size: 14px; }
        .btn-info:hover { background: rgba(255,255,255,0.15); transform: scale(1.05); }

        .indicators { position: absolute; bottom: 24px; right: 5%; display: flex; gap: 8px; z-index: 20; }
        .indicator { width: 12px; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.2); transition: all 0.3s; cursor: pointer; border: none; padding: 0; }
        .indicator.active { width: 32px; background: #dc2626; }

        .home-sections-v5 { padding: 40px 0 100px; max-width: 1600px; margin: 0 auto; }
        .section-wrapper { position: relative; margin-bottom: 40px; }
        .section-wrapper:hover .scroll-btn { opacity: 1; }
        .section-header { padding: 0 5%; margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
        .section-title { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 700; color: white; margin: 0; }
        
        .horizontal-scroll-v5 { 
          display: flex; gap: 16px; overflow-x: auto; padding: 10px 5% 30px; scrollbar-width: none; 
          scroll-behavior: smooth;
        }
        .horizontal-scroll-v5::-webkit-scrollbar { display: none; }
        
        .scroll-btn {
          position: absolute; top: 50%; transform: translateY(-50%); z-index: 20;
          width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.1); color: white; cursor: pointer;
          display: none; align-items: center; justify-content: center; backdrop-filter: blur(4px);
          opacity: 0; transition: all 0.3s;
        }
        @media (min-width: 768px) {
          .scroll-btn { display: flex; }
        }
        .scroll-btn:hover { background: rgba(0,0,0,0.8); border-color: rgba(255,255,255,0.2); }
        .scroll-left { left: 1%; }
        .scroll-right { right: 1%; }
        
        .fade-edge-left { position: absolute; left: 0; top: 0; bottom: 0; width: 5%; background: linear-gradient(to right, #09090b, transparent); pointer-events: none; z-index: 10; display: none; }
        .fade-edge-right { position: absolute; right: 0; top: 0; bottom: 0; width: 5%; background: linear-gradient(to left, #09090b, transparent); pointer-events: none; z-index: 10; display: none; }
        @media (min-width: 768px) {
          .fade-edge-left, .fade-edge-right { display: block; }
        }

        .home-error-banner {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: #fca5a5;
          padding: 14px 20px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          margin: 0 5% 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      </style>
      
      <div id="hero-container-v4">
        <!-- Skeleton Hero -->
        <div class="hero-v5">
          <div class="hero-overlay-2"></div>
        </div>
      </div>

      <div class="home-sections-v5">
        <div id="api-error-banner" class="home-error-banner" style="display:none;">
          ⚠️ <span id="api-error-msg">Algunas secciones no pudieron cargar.</span>
        </div>

        <div id="continue-section" class="section-wrapper" style="display:none;">
          <div class="section-header"><h2 class="section-title">CONTINUAR VIENDO</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('continue-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="continue-grid"></div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('continue-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">ÚLTIMOS LANZAMIENTOS</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latest-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="latest-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latest-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">POPULARES ESTE VERANO</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('trending-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="trending-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('trending-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">ANIMES EN LATINO</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('latino-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="latino-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('latino-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>

        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">PELÍCULAS DESTACADAS</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('movies-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="movies-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('movies-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>
        
        <div class="section-wrapper">
          <div class="section-header"><h2 class="section-title">ACCIÓN Y AVENTURA</h2></div>
          <button class="scroll-btn scroll-left" onclick="document.getElementById('action-grid').scrollBy({left: -800, behavior: 'smooth'})">❮</button>
          <div class="horizontal-scroll-v5" id="action-grid">${this._skeletonCards(8)}</div>
          <button class="scroll-btn scroll-right" onclick="document.getElementById('action-grid').scrollBy({left: 800, behavior: 'smooth'})">❯</button>
          <div class="fade-edge-left"></div><div class="fade-edge-right"></div>
        </div>
      </div>
    `,e}_skeletonCards(e){return Array.from({length:e},()=>`
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    `).join("")}async afterRender(){const e=document.getElementById("hero-container-v4"),t=document.getElementById("trending-grid"),i=document.getElementById("movies-grid"),r=document.getElementById("continue-grid"),p=document.getElementById("continue-section"),b=document.getElementById("api-error-banner"),c=document.getElementById("api-error-msg");let y=!1;const w=async(g,m,a)=>{try{const l=await g();return l&&l.data&&l.data.length>0?m&&this._renderGrid(m,l.data):(m&&(m.innerHTML=`<p style="color:rgba(255,255,255,0.3);padding:20px;font-size:13px;">Sin resultados para ${a}</p>`),y=!0),l}catch(l){return console.error(`[AniRD] Error cargando ${a}:`,l),m&&(m.innerHTML=`<p style="color:rgba(255,100,100,0.5);padding:20px;font-size:13px;">Error al cargar ${a}</p>`),y=!0,null}};try{const g=document.getElementById("latest-grid"),m=document.getElementById("latino-grid"),a=document.getElementById("action-grid"),[l]=await Promise.all([w(()=>x.getTrending(),t,"Populares"),w(()=>x.getMovies(),i,"Películas"),w(()=>x.getLatest(),g,"Últimos"),w(()=>x.getDubbed(),m,"Latino"),w(()=>x.getByGenre("1,2"),a,"Acción")]);if(y&&b&&(b.style.display="flex",c&&(c.textContent="Algunas secciones no pudieron cargar. Verifica que el servidor esté activo.")),l&&l.data&&l.data.length>0){const d=l.data.slice(0,5),f=await Promise.all(d.map(u=>x.getAnilistBanner(u.mal_id).then(h=>{var k,A;return h||((A=(k=u.images)==null?void 0:k.jpg)==null?void 0:A.large_image_url)}).catch(()=>{var h,k;return(k=(h=u.images)==null?void 0:h.jpg)==null?void 0:k.large_image_url})));let o=0;const v=u=>{var _,I,$;const h=d[u];if(!h)return;const k=f[u]||((I=(_=h.images)==null?void 0:_.jpg)==null?void 0:I.large_image_url)||"";let A=d.map((E,S)=>`<button class="indicator ${S===u?"active":""}" onclick="window.setHeroIndex(${S})"></button>`).join("");window.setHeroIndex=E=>{o=E,v(o),clearInterval(this._heroInterval),this._heroInterval=setInterval(()=>{o=(o+1)%d.length,v(o)},7e3)},e.innerHTML=`
            <div class="hero-v5">
              <div class="hero-backdrop-v5" style="background-image: url('${k}')"></div>
              <div class="hero-overlay-1"></div>
              <div class="hero-overlay-2"></div>
              <div class="hero-overlay-3"></div>
              <div class="hero-content-v5 page-enter">
                <div class="hero-badges">
                  ${h.status==="Currently Airing"?'<div class="badge-airing"><div class="dot"></div>EN EMISIÓN</div>':""}
                  ${h.score?`<div class="badge-score"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span>${h.score}</span></div>`:""}
                </div>
                <h1 class="hero-title-v5">${h.title_english||h.title||"Sin título"}</h1>
                <div class="hero-meta">
                  ${h.type?`<span>${h.type}</span>`:""}
                  ${h.episodes?`<span>${h.episodes} episodios</span>`:""}
                  ${h.year?`<span>${h.year}</span>`:""}
                </div>
                <p class="hero-synopsis">${(h.synopsis||"Sin sinopsis disponible.").slice(0,200)}${(($=h.synopsis)==null?void 0:$.length)>200?"...":""}</p>
                <div class="hero-actions-v5">
                  <a href="/anime/${h.mal_id}" data-link class="btn-play">▶ VER AHORA</a>
                  <a href="/anime/${h.mal_id}" data-link class="btn-info">MÁS INFO</a>
                </div>
              </div>
              <div class="indicators">${A}</div>
            </div>
          `};v(0),this._heroInterval=setInterval(()=>{o=(o+1)%d.length,v(o)},8e3)}else e.innerHTML=`
          <div class="hero-v4" style="background: linear-gradient(135deg, #0a0a14 0%, #1a0510 100%);">
            <div class="hero-content-v4">
              <h1 class="hero-title-v4" style="color:rgba(255,255,255,0.5);">AniRD</h1>
              <p class="hero-subtitle-v4">Conectando con el servidor...</p>
            </div>
          </div>
        `;try{const d=await T.getContinueWatching();if(d&&d.length>0){p.style.display="block";const f=d.slice(0,8);await Promise.all(f.map(async o=>{try{const v=document.createElement("anime-card");if(v.setAttribute("mode","thumbnail"),r.appendChild(v),o.animeTitle&&o.animeCover)v.data={mal_id:o.animeId,title:o.animeTitle,images:{jpg:{large_image_url:o.animeCover}},type:o.animeType||"",score:o.animeScore||"",currentEpisode:o.episodeId,progress:o.progress||0,duration_watched:o.duration||0},x.getAnimeInfo(o.animeId).then(u=>{u!=null&&u.data&&(v.data={...u.data,currentEpisode:o.episodeId,progress:o.progress||0})}).catch(()=>{});else{const u=await x.getAnimeInfo(o.animeId);u!=null&&u.data&&(v.data={...u.data,currentEpisode:o.episodeId,progress:o.progress||0})}}catch{}}))}}catch{}}catch(g){console.error("[AniRD HomePage] Error general:",g),b&&(b.style.display="flex",c&&(c.textContent=`Error de carga: ${g.message}. Verifica que el servidor esté activo en el puerto correcto.`))}}destroy(){this._heroInterval&&(clearInterval(this._heroInterval),this._heroInterval=null)}_renderGrid(e,t){!e||!t||(e.innerHTML="",t.forEach(i=>{const r=document.createElement("anime-card");r.data=i,e.appendChild(r)}))}}const U=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));export{U as H,x as a,n as b,z as c,T as d,R as e,H as f};
