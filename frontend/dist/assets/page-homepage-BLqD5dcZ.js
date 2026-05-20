import{X as S}from"./vendor-Cmt3X8aB.js";const o=new S("AniRD_DB");o.version(3).stores({history:"++id, animeId, episodeId, progress, duration, timestamp, updatedAt",favorites:"animeId, title, cover, addedAt",following:"animeId, title, cover, broadcast, addedAt",lists:"++id, name, animeIds, createdAt",cache:"key, data, expiresAt",settings:"key, value",notifications:"++id, animeId, isRead, timestamp"});const B={async addToHistory(e,t,s,i){const a=Date.now(),d=await o.history.where({animeId:e,episodeId:t}).first();return d?o.history.update(d.id,{progress:s,duration:i,updatedAt:a}):o.history.add({animeId:e,episodeId:t,progress:s,duration:i,timestamp:a,updatedAt:a})},async getContinueWatching(){const e=await o.history.orderBy("updatedAt").reverse().toArray(),t=new Map;return e.forEach(i=>{t.has(i.animeId)||t.set(i.animeId,i)}),Array.from(t.values()).filter(i=>!i.duration||i.duration===0?!0:i.progress/i.duration*100<90).slice(0,20)},async toggleFavorite(e){var i,a;const t=e.mal_id||e.id||e.animeId;return await o.favorites.get(t)?(await o.favorites.delete(t),!1):(await o.favorites.add({animeId:t,title:e.title,cover:((a=(i=e.images)==null?void 0:i.jpg)==null?void 0:a.large_image_url)||e.cover||"",type:e.type||"",score:e.score||"",episodes:e.episodes||null,status:e.status||"",broadcast:e.broadcast||null,addedAt:Date.now()}),!0)},async isFavorite(e){return e?!!await o.favorites.get(Number(e)):!1},async getFavorites(){return await o.favorites.orderBy("addedAt").reverse().toArray()},async toggleFollowing(e){var i,a;const t=e.mal_id||e.id||e.animeId;return await o.following.get(t)?(await o.following.delete(t),!1):(await o.following.add({animeId:t,title:e.title,cover:((a=(i=e.images)==null?void 0:i.jpg)==null?void 0:a.large_image_url)||e.cover||"",status:e.status||"",broadcast:e.broadcast||null,addedAt:Date.now(),lastNotified:Date.now()}),!0)},async isFollowing(e){return e?!!await o.following.get(Number(e)):!1},async getFollowing(){return await o.following.orderBy("addedAt").reverse().toArray()},async getSetting(e,t=null){const s=await o.settings.get(e);return s?s.value:t},async setSetting(e,t){return await o.settings.put({key:e,value:t})},async getAllData(){return{favorites:await o.favorites.toArray(),following:await o.following.toArray(),history:await o.history.toArray()}},async syncFromServer(e){if(e)return await o.transaction("rw",[o.favorites,o.following,o.history],async()=>{e.favorites&&(await o.favorites.clear(),await o.favorites.bulkAdd(e.favorites)),e.following&&(await o.following.clear(),await o.following.bulkAdd(e.following)),e.history&&(await o.history.clear(),await o.history.bulkAdd(e.history))})}},N=Object.freeze(Object.defineProperty({__proto__:null,db:o,dbService:B},Symbol.toStringTag,{value:"Module"}));class M{constructor(){this.baseUrl="https://api.jikan.moe/v4",this.lastRequest=0,this.minDelay=500,this.cache=new Map,this.inflight=new Map,this.cacheTTL=10*60*1e3}async request(t,s={}){const i=new URL(`${this.baseUrl}${t}`);Object.keys(s).forEach(m=>i.searchParams.append(m,s[m]));const a=i.toString(),d=this.cache.get(a);if(d&&d.expires>Date.now())return d.data;if(this.inflight.has(a))return this.inflight.get(a);const f=(async()=>{const m=Date.now(),w=Math.max(0,this.lastRequest+this.minDelay-m);w>0&&await new Promise(h=>setTimeout(h,w)),this.lastRequest=Date.now();let r=await fetch(a);if(r.status===429&&(await new Promise(h=>setTimeout(h,2e3)),r=await fetch(a)),!r.ok)throw new Error(`Jikan error: ${r.status}`);const p=await r.json();return this.cache.set(a,{data:p,expires:Date.now()+this.cacheTTL}),this.inflight.delete(a),p})();return this.inflight.set(a,f),f}}class T{constructor(){this.baseUrl="https://graphql.anilist.co"}async request(t,s={}){const i=await fetch(this.baseUrl,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:t,variables:s})});if(!i.ok)throw new Error(`AniList error: ${i.status}`);return(await i.json()).data}}class q{constructor(){const t=window.location.hostname||"localhost";this.port=3005,this.baseUrl=`http://${t}:${this.port}/api/v1`,this.apiKey="dev-anime1v-key"}async request(t,s={}){const i=new URL(`${this.baseUrl}${t}`);Object.keys(s).forEach(a=>i.searchParams.append(a,s[a]));try{const a=await fetch(i.toString(),{headers:{"X-API-Key":this.apiKey}});if(!a.ok)throw new Error(`Local API error: ${a.status}`);return a.json()}catch(a){return console.error(`Error en petición local a ${t}:`,a),{success:!1,message:a.message}}}}class j{constructor(){this.providers={jikan:new M,anilist:new T,local:new q},this.cache=new Map}async getAnimeSearch(t){return await this.providers.jikan.request("/anime",{q:t,limit:20})}async searchLocal(t){if(!t)return{success:!1,data:{results:[]}};try{let s=await this.providers.local.request("/anime/search",{q:t});if((!s.success||!s.data.results.length)&&t.length>5){const i=t.split(/[:\(\-]|Season|Movie|Part/i)[0].trim();i!==t&&(s=await this.providers.local.request("/anime/search",{q:i}))}if(!s.success||!s.data.results.length){const i=t.split(" ")[0];i.length>3&&(s=await this.providers.local.request("/anime/search",{q:i}))}return s}catch{return{success:!1,data:{results:[]}}}}async getAnimeInfo(t){try{if(typeof t=="string"&&(t.includes("http")||t.includes("anime/")))return await this.providers.local.request("/anime/info",{url:t});if(this.cache.has(t))return this.cache.get(t);const s=await this.providers.jikan.request(`/anime/${t}/full`);return this.cache.set(t,s),s}catch{return{success:!1,data:null}}}async getEpisode(t){return await this.providers.local.request("/anime/episode",{url:t})}async getTrending(t=1){return await this.providers.jikan.request("/top/anime",{filter:"airing",limit:24,page:t})}async getMovies(t=1){return await this.providers.jikan.request("/top/anime",{type:"movie",filter:"bypopularity",limit:24,page:t})}async getLatest(t=1){return await this.providers.jikan.request("/seasons/now",{limit:24,page:t})}async getDubbed(t=1){try{return await this.providers.jikan.request("/anime",{producers:"1191,108",limit:24,page:t,order_by:"popularity",sort:"desc"})}catch{return{data:[]}}}async getByGenre(t,s=1){return await this.providers.jikan.request("/anime",{genres:t,order_by:"popularity",limit:24,page:s})}async getSchedule(){return await this.providers.jikan.request("/seasons/now")}async getAnimeRelations(t){return await this.providers.jikan.request(`/anime/${t}/relations`)}async getAnimeCharacters(t){return await this.providers.jikan.request(`/anime/${t}/characters`)}async getAnilistBanner(t){var i;const s="query ($id: Int) { Media (idMal: $id, type: ANIME) { bannerImage } }";try{return(i=(await this.providers.anilist.request(s,{id:t})).Media)==null?void 0:i.bannerImage}catch{return null}}async getAnimeRecommendations(t){return await this.providers.jikan.request(`/anime/${t}/recommendations`)}async getAnilistEpisodes(t){var i;const s=`
      query ($id: Int) {
        Media (idMal: $id, type: ANIME) {
          streamingEpisodes {
            title
            thumbnail
          }
        }
      }
    `;try{return((i=(await this.providers.anilist.request(s,{id:t})).Media)==null?void 0:i.streamingEpisodes)||[]}catch(a){return console.warn("Error al cargar episodios desde AniList:",a),[]}}}const y=new j,P=Object.freeze(Object.defineProperty({__proto__:null,AnimeAPI:j,apiService:y},Symbol.toStringTag,{value:"Module"}));class z extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this._renderSkeleton()}set data(t){this._anime=t,this.render()}_renderSkeleton(){const t=this.getAttribute("mode")==="thumbnail";this.shadowRoot.innerHTML=`
      <style>
        :host { display: block; width: ${t?"320px":"185px"}; flex-shrink: 0; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .sk { background: linear-gradient(90deg, #1a1a1a 25%, #252525 50%, #1a1a1a 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite ease-in-out; border-radius: 22px; }
        .sk-img { width: 100%; aspect-ratio: ${t?"16/9":"2/3"}; margin-bottom: 12px; }
        .sk-t { height: 14px; border-radius: 7px; margin-bottom: 6px; }
        .sk-t2 { height: 10px; width: 60%; border-radius: 5px; }
      </style>
      <div><div class="sk sk-img"></div><div class="sk sk-t"></div><div class="sk sk-t2"></div></div>
    `}render(){var p,h,k,x;if(!this._anime)return;const t=this.getAttribute("mode")==="thumbnail",s=((h=(p=this._anime.images)==null?void 0:p.jpg)==null?void 0:h.large_image_url)||((x=(k=this._anime.images)==null?void 0:k.jpg)==null?void 0:x.image_url)||this._anime.image||this._anime.thumbnail||"",i=this._anime.title||"Anime",a=this._anime.mal_id||this._anime.id,d=this._anime.score||this._anime.rating||"?.?",f=this._anime.progress||0,m=this._anime.duration_watched||0,w=m>0?Math.min(f/m*100,100):0;let r=this._anime.nextEpisodeText||"";if(!r&&this._anime.status==="Currently Airing"&&this._anime.broadcast&&this._anime.broadcast.time){const g=this._anime.broadcast,E={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6};if(E[g.day]!==void 0){const[u,b]=g.time.split(":").map(Number),l=new Date(new Date().toLocaleString("en-US",{timeZone:g.timezone||"Asia/Tokyo"}));let n=new Date(l);n.setHours(u,b,0,0);let c=E[g.day]-l.getDay();(c<0||c===0&&n<l)&&(c+=7),n.setDate(n.getDate()+c);const v=n-l;if(v>0){const _=Math.floor(v/864e5),A=Math.floor(v/36e5%24);_>0?r=`${_}d ${A}h para nuevo cap.`:A>0?r=`${A}h para nuevo cap.`:r="¡Nuevo cap en breve!"}}}this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
          width: ${t?"320px":"185px"};
          flex-shrink: 0;
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
          aspect-ratio: ${t?"16/9":"2/3"};
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
      <a href="/anime/${a}" data-link class="card-v4">
        <div class="img-box">
          <img src="${s}" alt="${i}" loading="lazy" referrerpolicy="no-referrer">
          <div class="rating-v4"><span style="color:#ff0000">★</span> ${d}</div>
          ${w>0?`<div class="progress-bar"><div class="progress-fill" style="width:${w}%"></div></div>`:""}
        </div>
        <div class="info-v4">
          <div class="meta-v4">${this._anime.type||"TV"} • ${this._anime.status||"EN EMISIÓN"}</div>
          <h3 class="title-v4">${i}</h3>
          ${this._anime.currentEpisode?`<div style="font-size: 10px; color: #ff0000; font-weight: 800; margin-top: 2px;">Visto Ep. ${this._anime.currentEpisode}</div>`:""}
          ${r?`<div style="font-size: 10px; color: #00ff88; font-weight: 800; margin-top: 2px;">⏱ ${r}</div>`:""}
        </div>
      </a>
    `}}customElements.define("anime-card",z);class D{async render(){const t=document.createElement("div");return t.innerHTML=`
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
    `,t}async afterRender(){const t=document.getElementById("hero-container-v4"),s=document.getElementById("trending-grid"),i=document.getElementById("movies-grid"),a=document.getElementById("continue-grid"),d=document.getElementById("continue-section");try{const f=document.getElementById("latest-grid"),m=document.getElementById("latino-grid"),w=document.getElementById("action-grid"),[r,p,h,k,x]=await Promise.all([y.getTrending(),y.getMovies(),y.getLatest(),y.getDubbed(),y.getByGenre("1,2")]);if(r&&r.data){const u=r.data.slice(0,5),b=await Promise.all(u.map(c=>y.getAnilistBanner(c.mal_id)));let l=0;const n=c=>{var A,$,I;const v=u[c],_=b[c]||(($=(A=v.images)==null?void 0:A.jpg)==null?void 0:$.large_image_url);v&&(t.innerHTML=`
            <div class="hero-v4">
              <div class="hero-backdrop-v4" style="background-image: url('${_}')"></div>
              <div class="hero-content-v4 page-enter">
                <h1 class="hero-title-v4">${v.title}</h1>
                <p class="hero-subtitle-v4">${(I=v.synopsis)==null?void 0:I.slice(0,180)}...</p>
                <div class="hero-actions-v4">
                  <a href="/anime/${v.mal_id}" data-link class="btn-v4-primary"><span>▶</span> VER AHORA</a>
                  <a href="/anime/${v.mal_id}" data-link class="btn-v4-secondary">MÁS INFO</a>
                </div>
              </div>
            </div>
          `)};n(0),setInterval(()=>{l=(l+1)%u.length,n(l)},8e3)}const g=(u,b)=>{u&&b&&(u.innerHTML="",b.forEach(l=>{const n=document.createElement("anime-card");n.data=l,u.appendChild(n)}))};g(s,r==null?void 0:r.data),g(i,p==null?void 0:p.data),g(f,h==null?void 0:h.data),g(m,k==null?void 0:k.data),g(w,x==null?void 0:x.data);const E=await B.getContinueWatching();if(E.length>0){d.style.display="block";const b=E.slice(0,8).map(l=>{const n=document.createElement("anime-card");return n.setAttribute("mode","thumbnail"),a.appendChild(n),{card:n,item:l}});await Promise.all(b.map(async({card:l,item:n})=>{try{const c=await y.getAnimeInfo(n.animeId);c&&c.data&&(l.data={...c.data,currentEpisode:n.episodeId,progress:n.progress||0,duration_watched:n.duration||0})}catch{}}))}}catch(f){console.error(f)}}}const C=Object.freeze(Object.defineProperty({__proto__:null,default:D},Symbol.toStringTag,{value:"Module"}));export{C as H,y as a,o as b,N as c,B as d,P as e};
