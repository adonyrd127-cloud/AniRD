import{X as L}from"./vendor-DIPEJTOH.js";class z{constructor(){this.tokenKey="anird_auth_token",this.userKey="anird_user",this.host=window.location.hostname||"localhost",this.baseUrl=`http://${this.host}:3005/api/v1/auth`,this.userUrl=`http://${this.host}:3005/api/v1/user`}getToken(){return localStorage.getItem(this.tokenKey)}getUser(){const e=localStorage.getItem(this.userKey);return e?JSON.parse(e):null}isLoggedIn(){return!!this.getToken()}async login(e,a){try{const i=await(await fetch(`${this.baseUrl}/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:a})})).json();if(!i.success)throw new Error(i.message);return localStorage.setItem(this.tokenKey,i.token),localStorage.setItem(this.userKey,JSON.stringify(i.user)),i}catch(t){throw console.error("Fetch error:",t),t instanceof TypeError?new Error(`Error de conexión al servidor (${this.baseUrl}).`):t}}async register(e,a){try{const i=await(await fetch(`${this.baseUrl}/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:a})})).json();if(!i.success)throw new Error(i.message);return localStorage.setItem(this.tokenKey,i.token),localStorage.setItem(this.userKey,JSON.stringify(i.user)),i}catch(t){throw console.error("Fetch error:",t),t instanceof TypeError?new Error(`Error de conexión al servidor (${this.baseUrl}). Asegúrate de que el puerto 3005 esté abierto.`):t}}logout(){localStorage.removeItem(this.tokenKey),localStorage.removeItem(this.userKey);try{console.log("[Auth] Borrando base de datos IndexedDB local AniRD_DB al cerrar sesión...");const e=indexedDB.deleteDatabase("AniRD_DB"),a=()=>{window.location.href="/"};e.onsuccess=a,e.onerror=a,e.onblocked=a,setTimeout(a,800)}catch(e){console.error("[Auth] Error borrando DB:",e),window.location.href="/"}}async syncWithServer(e){return this.isLoggedIn()?await(await fetch(`${this.userUrl}/sync`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.getToken()}`},body:JSON.stringify(e),keepalive:!0})).json():null}async fetchFromServer(){if(!this.isLoggedIn())return null;const a=await(await fetch(`${this.userUrl}/sync`,{headers:{Authorization:`Bearer ${this.getToken()}`}})).json();return a.success?a.syncData:null}}const M=new z,n=new L("AniRD_DB");n.version(3).stores({history:"++id, animeId, episodeId, progress, duration, timestamp, updatedAt",favorites:"animeId, title, cover, addedAt",following:"animeId, title, cover, broadcast, addedAt",lists:"++id, name, animeIds, createdAt",cache:"key, data, expiresAt",settings:"key, value",notifications:"++id, animeId, isRead, timestamp"});n.open().catch(async s=>{console.error("[Dexie] Error crítico al abrir la base de datos AniRD_DB:",s);try{console.log("[Dexie] Intentando restablecer base de datos local para auto-recuperación..."),await L.delete("AniRD_DB"),console.log("[Dexie] Base de datos borrada con éxito. Recargando página...")}catch(e){console.error("[Dexie] Fallo al borrar base de datos:",e)}window.location.reload()});const T={async triggerSync(){try{if(M.isLoggedIn()){const s=await this.getAllData();await M.syncWithServer(s),console.log("[Sync] Sincronización en la nube exitosa.")}}catch(s){console.error("[Sync] Error sincronizando con el servidor:",s)}},async addToHistory(s,e,a,t,i={}){const g=Date.now(),f=await n.history.where({animeId:s,episodeId:e}).first();let l;return f?l=await n.history.update(f.id,{progress:a,duration:t,updatedAt:g,...i}):l=await n.history.add({animeId:s,episodeId:e,progress:a,duration:t,timestamp:g,updatedAt:g,...i}),this.triggerSync(),l},async getContinueWatching(){const s=await n.history.orderBy("updatedAt").reverse().toArray(),e=new Map;return s.forEach(t=>{e.has(t.animeId)||e.set(t.animeId,t)}),Array.from(e.values()).filter(t=>!t.duration||t.duration===0?!0:t.progress/t.duration*100<90).slice(0,20)},async toggleFavorite(s){var t,i;const e=s.mal_id||s.id||s.animeId;return await n.favorites.get(e)?(await n.favorites.delete(e),this.triggerSync(),!1):(await n.favorites.add({animeId:e,title:s.title,cover:((i=(t=s.images)==null?void 0:t.jpg)==null?void 0:i.large_image_url)||s.cover||"",type:s.type||"",score:s.score||"",episodes:s.episodes||null,status:s.status||"",broadcast:s.broadcast||null,addedAt:Date.now()}),this.triggerSync(),!0)},async isFavorite(s){return s?!!await n.favorites.get(Number(s)):!1},async getFavorites(){return await n.favorites.orderBy("addedAt").reverse().toArray()},async toggleFollowing(s){var t,i;const e=s.mal_id||s.id||s.animeId;return await n.following.get(e)?(await n.following.delete(e),this.triggerSync(),!1):(await n.following.add({animeId:e,title:s.title,cover:((i=(t=s.images)==null?void 0:t.jpg)==null?void 0:i.large_image_url)||s.cover||"",status:s.status||"",broadcast:s.broadcast||null,addedAt:Date.now(),lastNotified:Date.now()}),this.triggerSync(),!0)},async isFollowing(s){return s?!!await n.following.get(Number(s)):!1},async getFollowing(){return await n.following.orderBy("addedAt").reverse().toArray()},async getSetting(s,e=null){const a=await n.settings.get(s);return a?a.value:e},async setSetting(s,e){return await n.settings.put({key:s,value:e})},async getAllData(){return{favorites:await n.favorites.toArray(),following:await n.following.toArray(),history:await n.history.toArray(),lists:await n.lists.toArray()}},async syncFromServer(s){if(s)return await n.transaction("rw",[n.favorites,n.following,n.history,n.lists],async()=>{const e=await n.history.toArray(),a=s.history||[],t=new Map;e.forEach(o=>{const r=`${o.animeId}_${o.episodeId}`;t.set(r,o)});let i=!1;a.forEach(o=>{const r=`${o.animeId}_${o.episodeId}`,p=t.get(r);if(!p)t.set(r,o);else{const u=o.updatedAt||o.timestamp||0,c=p.updatedAt||p.timestamp||0;u>c?t.set(r,o):c>u&&(i=!0)}}),e.length!==t.size&&(i=!0);const g=await n.favorites.toArray(),f=s.favorites||[],l=new Map;g.forEach(o=>l.set(Number(o.animeId),o)),f.forEach(o=>{const r=Number(o.animeId),p=l.get(r);if(!p)l.set(r,o);else{const u=o.addedAt||0,c=p.addedAt||0;u>c?l.set(r,o):c>u&&(i=!0)}}),g.length!==l.size&&(i=!0);const m=await n.following.toArray(),w=s.following||[],h=new Map;m.forEach(o=>h.set(Number(o.animeId),o)),w.forEach(o=>{const r=Number(o.animeId),p=h.get(r);if(!p)h.set(r,o);else{const u=o.addedAt||0,c=p.addedAt||0;u>c?h.set(r,o):c>u&&(i=!0)}}),m.length!==h.size&&(i=!0);const b=await n.lists.toArray(),v=s.lists||[],d=new Map;b.forEach(o=>d.set(o.id,o)),v.forEach(o=>{const r=o.id,p=d.get(r);if(!p)d.set(r,o);else{const u=o.createdAt||0,c=p.createdAt||0;u>c?d.set(r,o):c>u&&(i=!0)}}),b.length!==d.size&&(i=!0),await n.history.clear();const y=Array.from(t.values()).map(o=>{const{id:r,...p}=o;return p});await n.history.bulkAdd(y),await n.favorites.clear(),await n.favorites.bulkAdd(Array.from(l.values())),await n.following.clear(),await n.following.bulkAdd(Array.from(h.values())),await n.lists.clear(),await n.lists.bulkAdd(Array.from(d.values())),i&&(console.log("[Sync] Detectados cambios locales más recientes. Subiendo fusión al servidor..."),setTimeout(()=>this.triggerSync(),0))})}},R=Object.freeze(Object.defineProperty({__proto__:null,db:n,dbService:T},Symbol.toStringTag,{value:"Module"}));class j{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.queue=Promise.resolve(),this.minDelay=400,this.cache=new Map,this.inflight=new Map,this.cacheTTL=10*60*1e3}async request(e,a={},t={}){const i=new URL(`${this.baseUrl}${e}`);Object.keys(a).forEach(m=>i.searchParams.append(m,a[m]));const g=i.toString(),f=this.cache.get(g);if(f&&f.expires>Date.now())return f.data;if(this.inflight.has(g))return this.inflight.get(g);const l=(async()=>{const m=async()=>{let h=0,b=2;for(;h<b;){h++;try{const v=await fetch(g,{signal:t.signal});if(v.status===429){await new Promise(y=>setTimeout(y,1500*h));continue}if(!v.ok)throw new Error(`Jikan error: ${v.status}`);const d=await v.json();return this.cache.set(g,{data:d,expires:Date.now()+this.cacheTTL}),d}catch(v){if(h>=b)throw v;await new Promise(d=>setTimeout(d,800))}}},w=this.queue.then(async()=>{const h=await m();return await new Promise(b=>setTimeout(b,this.minDelay)),h});return this.queue=w.catch(()=>{}),await w})();this.inflight.set(g,l);try{return await l}finally{this.inflight.delete(g)}}}class P{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(e,a={}){const t=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:e,variables:a})});if(!t.ok)throw new Error(`AniList error: ${t.status}`);return(await t.json()).data}async getAnimeList(e={}){var i;const t=await this.request(`
      query ($format: MediaFormat, $genre: String, $sort: [MediaSort], $season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
          media(format: $format, genre: $genre, sort: $sort, season: $season, seasonYear: $seasonYear, type: ANIME, isAdult: false) {
            id
            idMal
            title { romaji english native }
            coverImage { extraLarge large medium color }
            bannerImage
            format
            episodes
            meanScore
            seasonYear
            status
            genres
            description
          }
        }
      }
    `,{page:1,perPage:24,...e});return((i=t==null?void 0:t.Page)==null?void 0:i.media)||[]}async getAnimeByIdMal(e){const a=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          id
          idMal
          title { romaji english native }
          coverImage { extraLarge large medium color }
          bannerImage
          format
          episodes
          meanScore
          seasonYear
          status
          genres
          description
        }
      }
    `;try{const t=await this.request(a,{id:Number(e)});return(t==null?void 0:t.Media)||null}catch{return null}}}class C{constructor(){const e=window.location.hostname||"localhost";this.port=3005,this.baseUrl=`http://${e}:${this.port}/api/v1`,this.apiKey="dev-anime1v-key"}async request(e,a={}){const t=new URL(`${this.baseUrl}${e}`);Object.keys(a).forEach(i=>t.searchParams.append(i,a[i]));try{const i=await fetch(t.toString(),{headers:{"X-API-Key":this.apiKey}});if(!i.ok)throw new Error(`Local API error: ${i.status}`);return i.json()}catch(i){return console.error(`Error en petición local a ${e}:`,i),{success:!1,message:i.message}}}}class B{constructor(){this.providers={jikan:new j,anilist:new P,local:new C},this.cache=new Map}formatAniListMedia(e){return Array.isArray(e)?e.map(a=>this.formatSingleAniList(a)):this.formatSingleAniList(e)}formatSingleAniList(e){var a,t,i,g,f,l,m,w,h,b,v,d,y;return e?{mal_id:e.idMal||e.id,title:((a=e.title)==null?void 0:a.english)||((t=e.title)==null?void 0:t.romaji)||((i=e.title)==null?void 0:i.native)||"Anime",title_english:((g=e.title)==null?void 0:g.english)||((f=e.title)==null?void 0:f.romaji),images:{jpg:{large_image_url:((l=e.coverImage)==null?void 0:l.extraLarge)||((m=e.coverImage)==null?void 0:m.large),image_url:((w=e.coverImage)==null?void 0:w.large)||((h=e.coverImage)==null?void 0:h.medium)},webp:{large_image_url:((b=e.coverImage)==null?void 0:b.extraLarge)||((v=e.coverImage)==null?void 0:v.large),image_url:((d=e.coverImage)==null?void 0:d.large)||((y=e.coverImage)==null?void 0:y.medium)}},score:e.meanScore?(e.meanScore/10).toFixed(1):null,type:e.format==="TV"?"TV":e.format==="MOVIE"?"Movie":e.format||"TV",episodes:e.episodes,status:e.status==="RELEASING"?"Currently Airing":e.status,synopsis:e.description?e.description.replace(/<[^>]*>?/gm,""):""}:null}async getAnimeSearch(e,a={}){return await this.providers.jikan.request("/anime",{q:e,limit:20},a)}async searchLocal(e){if(!e)return{success:!1,data:{results:[]}};try{let a=await this.providers.local.request("/anime/search",{q:e});if((!a.success||!a.data.results.length)&&e.length>5){const t=e.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();t!==e&&(a=await this.providers.local.request("/anime/search",{q:t}))}if(!a.success||!a.data.results.length){const t=e.split(" ")[0];t.length>3&&(a=await this.providers.local.request("/anime/search",{q:t}))}return a}catch{return{success:!1,data:{results:[]}}}}async getAnimeInfo(e){try{if(typeof e=="string"&&(e.includes("http")||e.includes("anime/")))return await this.providers.local.request("/anime/info",{url:e});if(this.cache.has(e))return this.cache.get(e);try{const t=await this.providers.jikan.request(`/anime/${e}/full`);if(t!=null&&t.data)return this.cache.set(e,t),t}catch(t){console.warn(`[API] Jikan info failed for ${e}, trying AniList fallback:`,t.message)}const a=await this.providers.anilist.getAnimeByIdMal(e);if(a){const t={data:this.formatSingleAniList(a)};return this.cache.set(e,t),t}return{success:!1,data:null}}catch{return{success:!1,data:null}}}async getEpisode(e){return await this.providers.local.request("/anime/episode",{url:e})}async getTrending(e=1){var t;try{const i=await this.providers.jikan.request("/top/anime",{filter:"airing",limit:24,page:e});if(((t=i==null?void 0:i.data)==null?void 0:t.length)>0)return i}catch(i){console.warn("[API] Jikan trending failed, using AniList:",i.message)}const a=await this.providers.anilist.getAnimeList({sort:["TRENDING_DESC","POPULARITY_DESC"],page:e});return{data:this.formatAniListMedia(a)}}async getMovies(e=1){var t;try{const i=await this.providers.jikan.request("/top/anime",{filter:"bypopularity",limit:24,page:e});if(((t=i==null?void 0:i.data)==null?void 0:t.length)>0){const g=i.data.filter(f=>f.type==="Movie");if(g.length>0)return{data:g}}}catch(i){console.warn("[API] Jikan movies failed, using AniList:",i.message)}const a=await this.providers.anilist.getAnimeList({format:"MOVIE",sort:["POPULARITY_DESC"],page:e});return{data:this.formatAniListMedia(a)}}async getLatest(e=1){var l;try{const m=await this.providers.jikan.request("/seasons/now",{limit:24,page:e});if(((l=m==null?void 0:m.data)==null?void 0:l.length)>0)return m}catch(m){console.warn("[API] Jikan latest failed, using AniList:",m.message)}const a=new Date,t=a.getMonth(),g=["WINTER","SPRING","SUMMER","FALL"][Math.floor(t/3)],f=await this.providers.anilist.getAnimeList({season:g,seasonYear:a.getFullYear(),sort:["POPULARITY_DESC"],page:e});return{data:this.formatAniListMedia(f)}}async getDubbed(e=1){var t;try{const i=await this.providers.jikan.request("/top/anime",{limit:24,page:e});if(((t=i==null?void 0:i.data)==null?void 0:t.length)>0)return i}catch(i){console.warn("[API] Jikan dubbed failed, using AniList:",i.message)}const a=await this.providers.anilist.getAnimeList({sort:["POPULARITY_DESC"],page:e});return{data:this.formatAniListMedia(a)}}async getByGenre(e,a=1){var f;const t={1:"Action",2:"Adventure",4:"Comedy",8:"Drama",10:"Fantasy",22:"Romance",24:"Sci-Fi",36:"Slice of Life"},i=t[String(e)]||t[String(e).split(",")[0]]||"Action";try{const l=await this.providers.jikan.request("/top/anime",{limit:24,page:a});if(((f=l==null?void 0:l.data)==null?void 0:f.length)>0){const m=l.data.filter(w=>{var h;return(h=w.genres)==null?void 0:h.some(b=>b.name.toLowerCase()===i.toLowerCase()||b.mal_id==e)});if(m.length>0)return{data:m}}}catch(l){console.warn("[API] Jikan genre failed, using AniList:",l.message)}const g=await this.providers.anilist.getAnimeList({genre:i,sort:["POPULARITY_DESC"],page:a});return{data:this.formatAniListMedia(g)}}async getSchedule(){var e;try{const a=await this.providers.jikan.request("/seasons/now");if(((e=a==null?void 0:a.data)==null?void 0:e.length)>0)return a}catch{}return await this.getLatest()}async getAnimeRelations(e){try{return await this.providers.jikan.request(`/anime/${e}/relations`)}catch{return{data:[]}}}async getAnimeCharacters(e){try{return await this.providers.jikan.request(`/anime/${e}/characters`)}catch{return{data:[]}}}async getAnilistBanner(e){var t;const a="query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }";try{return(t=(await this.providers.anilist.request(a,{id:Number(e)})).Media)==null?void 0:t.bannerImage}catch{return null}}async getAnimeRecommendations(e){try{return await this.providers.jikan.request(`/anime/${e}/recommendations`)}catch{return{data:[]}}}async getAnilistEpisodes(e){var t;const a=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;try{return((t=(await this.providers.anilist.request(a,{id:Number(e)})).Media)==null?void 0:t.streamingEpisodes)||[]}catch(i){return console.warn("Error al cargar episodios desde AniList:",i),[]}}}const x=new B,U=Object.freeze(Object.defineProperty({__proto__:null,AnimeAPI:B,apiService:x},Symbol.toStringTag,{value:"Module"}));class N extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._renderSkeleton()}set data(e){this._anime=e,this.render()}_renderSkeleton(){const e=this.getAttribute("mode")==="thumbnail";this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; width: ${e?"320px":"185px"}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #18181b 25%, #27272a 50%, #18181b 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 16px; }
        .sk-img { width: 100%; aspect-ratio: ${e?"16/9":"3/4.2"}; margin-bottom: 12px; }
      </style>
      <div class="sk sk-img"></div>
    `}render(){var v,d,y,o,r,p;if(!this._anime)return;const e=this.getAttribute("mode")==="thumbnail",a=((d=(v=this._anime.images)==null?void 0:v.webp)==null?void 0:d.large_image_url)||((o=(y=this._anime.images)==null?void 0:y.jpg)==null?void 0:o.large_image_url)||((p=(r=this._anime.images)==null?void 0:r.jpg)==null?void 0:p.image_url)||this._anime.image||this._anime.thumbnail||"",t=this._anime.title_english||this._anime.title||"Anime",i=this._anime.mal_id||this._anime.id,g=this._anime.score||this._anime.rating||"?.?",f=this._anime.type||"TV",l=this._anime.episodes?`${this._anime.episodes} eps`:"",m=this._anime.progress||0,w=this._anime.duration_watched||0,h=w>0?Math.min(m/w*100,100):0,b=this._anime.status==="Currently Airing";this.shadowRoot.innerHTML=`
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
      <a href="/anime/${i}" data-link class="card-inner">
        <div class="img-container">
          <img src="${a}" alt="${t}" loading="lazy" referrerpolicy="no-referrer">
        </div>
        <div class="gradient-overlay"></div>
        <div class="hover-border"></div>
        
        ${g!=="?.?"?`
        <div class="badge-score">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>${g}</span>
        </div>`:""}

        ${b?`
        <div class="badge-airing">
          <div class="dot"></div>
          EN EMISIÓN
        </div>`:""}

        <div class="info-bottom">
          <h3 class="title">${t}</h3>
          <div class="meta">
            ${`<span class="meta-type">${f}</span>`}
            ${l?'<span class="meta-dot">·</span>':""}
            ${l?`<span class="meta-eps">${l}</span>`:""}
          </div>
        </div>

        ${h>0?`<div class="progress-bar"><div class="progress-fill" style="width:${h}%"></div></div>`:""}
      </a>
    `}}customElements.define("anime-card",N);class D{async render(){const e=document.createElement("div");return e.className="home-page-wrapper",e.innerHTML=`
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
    `).join("")}async afterRender(){const e=document.getElementById("hero-container-v4"),a=document.getElementById("trending-grid"),t=document.getElementById("movies-grid"),i=document.getElementById("continue-grid"),g=document.getElementById("continue-section"),f=document.getElementById("api-error-banner"),l=document.getElementById("api-error-msg");let m=!1;const w=async(h,b,v)=>{try{const d=await h();return d&&d.data&&d.data.length>0?b&&this._renderGrid(b,d.data):(b&&(b.innerHTML=`<p style="color:rgba(255,255,255,0.3);padding:20px;font-size:13px;">Sin resultados para ${v}</p>`),m=!0),d}catch(d){return console.error(`[AniRD] Error cargando ${v}:`,d),b&&(b.innerHTML=`<p style="color:rgba(255,100,100,0.5);padding:20px;font-size:13px;">Error al cargar ${v}</p>`),m=!0,null}};try{const h=document.getElementById("latest-grid"),b=document.getElementById("latino-grid"),v=document.getElementById("action-grid"),[d]=await Promise.all([w(()=>x.getTrending(),a,"Populares"),w(()=>x.getMovies(),t,"Películas"),w(()=>x.getLatest(),h,"Últimos"),w(()=>x.getDubbed(),b,"Latino"),w(()=>x.getByGenre("1,2"),v,"Acción")]);if(m&&f&&(f.style.display="flex",l&&(l.textContent="Algunas secciones no pudieron cargar. Verifica que el servidor esté activo.")),d&&d.data&&d.data.length>0){const y=d.data.slice(0,5),o=await Promise.all(y.map(u=>x.getAnilistBanner(u.mal_id).then(c=>{var k,A;return c||((A=(k=u.images)==null?void 0:k.jpg)==null?void 0:A.large_image_url)}).catch(()=>{var c,k;return(k=(c=u.images)==null?void 0:c.jpg)==null?void 0:k.large_image_url})));let r=0;const p=u=>{var I,_,$;const c=y[u];if(!c)return;const k=o[u]||((_=(I=c.images)==null?void 0:I.jpg)==null?void 0:_.large_image_url)||"";let A=y.map((S,E)=>`<button class="indicator ${E===u?"active":""}" onclick="window.setHeroIndex(${E})"></button>`).join("");window.setHeroIndex=S=>{r=S,p(r),clearInterval(this._heroInterval),this._heroInterval=setInterval(()=>{r=(r+1)%y.length,p(r)},7e3)},e.innerHTML=`
            <div class="hero-v5">
              <div class="hero-backdrop-v5" style="background-image: url('${k}')"></div>
              <div class="hero-overlay-1"></div>
              <div class="hero-overlay-2"></div>
              <div class="hero-overlay-3"></div>
              <div class="hero-content-v5 page-enter">
                <div class="hero-badges">
                  ${c.status==="Currently Airing"?'<div class="badge-airing"><div class="dot"></div>EN EMISIÓN</div>':""}
                  ${c.score?`<div class="badge-score"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span>${c.score}</span></div>`:""}
                </div>
                <h1 class="hero-title-v5">${c.title_english||c.title||"Sin título"}</h1>
                <div class="hero-meta">
                  ${c.type?`<span>${c.type}</span>`:""}
                  ${c.episodes?`<span>${c.episodes} episodios</span>`:""}
                  ${c.year?`<span>${c.year}</span>`:""}
                </div>
                <p class="hero-synopsis">${(c.synopsis||"Sin sinopsis disponible.").slice(0,200)}${(($=c.synopsis)==null?void 0:$.length)>200?"...":""}</p>
                <div class="hero-actions-v5">
                  <a href="/anime/${c.mal_id}" data-link class="btn-play">▶ VER AHORA</a>
                  <a href="/anime/${c.mal_id}" data-link class="btn-info">MÁS INFO</a>
                </div>
              </div>
              <div class="indicators">${A}</div>
            </div>
          `};p(0),this._heroInterval=setInterval(()=>{r=(r+1)%y.length,p(r)},8e3)}else e.innerHTML=`
          <div class="hero-v4" style="background: linear-gradient(135deg, #0a0a14 0%, #1a0510 100%);">
            <div class="hero-content-v4">
              <h1 class="hero-title-v4" style="color:rgba(255,255,255,0.5);">AniRD</h1>
              <p class="hero-subtitle-v4">Conectando con el servidor...</p>
            </div>
          </div>
        `;try{const y=await T.getContinueWatching();if(y&&y.length>0){g.style.display="block";const o=y.slice(0,8);await Promise.all(o.map(async r=>{try{const p=document.createElement("anime-card");if(p.setAttribute("mode","thumbnail"),i.appendChild(p),r.animeTitle&&r.animeCover)p.data={mal_id:r.animeId,title:r.animeTitle,images:{jpg:{large_image_url:r.animeCover}},type:r.animeType||"",score:r.animeScore||"",currentEpisode:r.episodeId,progress:r.progress||0,duration_watched:r.duration||0},x.getAnimeInfo(r.animeId).then(u=>{u!=null&&u.data&&(p.data={...u.data,currentEpisode:r.episodeId,progress:r.progress||0})}).catch(()=>{});else{const u=await x.getAnimeInfo(r.animeId);u!=null&&u.data&&(p.data={...u.data,currentEpisode:r.episodeId,progress:r.progress||0})}}catch{}}))}}catch{}}catch(h){console.error("[AniRD HomePage] Error general:",h),f&&(f.style.display="flex",l&&(l.textContent=`Error de carga: ${h.message}. Verifica que el servidor esté activo en el puerto correcto.`))}}destroy(){this._heroInterval&&(clearInterval(this._heroInterval),this._heroInterval=null)}_renderGrid(e,a){!e||!a||(e.innerHTML="",a.forEach(t=>{const i=document.createElement("anime-card");i.data=t,e.appendChild(i)}))}}const O=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"}));export{O as H,x as a,n as b,M as c,T as d,R as e,U as f};
