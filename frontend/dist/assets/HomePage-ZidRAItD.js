import{a as c}from"./main-CtB6XwmH.js";import{d as f}from"./db-DDVpz0tJ.js";import"./AnimeCard-CoH8iiLz.js";import"./vendor-Cmt3X8aB.js";class k{async render(){const i=document.createElement("div");return i.innerHTML=`
      <style>
        .hero {
          position: relative;
          height: 500px;
          display: flex;
          align-items: center;
          padding: 0 4%;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .hero-backdrop {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: brightness(0.4);
          z-index: -1;
        }
        .hero-content {
          max-width: 800px;
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: 3rem;
          margin-bottom: 15px;
          color: white;
        }
        .hero-desc {
          font-size: 1.1rem;
          color: var(--text-secondary);
          margin-bottom: 25px;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .page-container {
          padding: 20px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .section-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          margin: 2rem 0 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .section-title::before {
            content: '';
            width: 4px;
            height: 24px;
            background: var(--accent);
            border-radius: 2px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
      </style>
      <div id="hero-container"></div>
      <div class="page-container">
        <div id="continue-watching-section" style="display:none;">
          <h2 class="section-title">Continuar Viendo</h2>
          <div class="anime-grid" id="continue-grid"></div>
        </div>

        <h2 class="section-title">Animes Populares</h2>
        <div class="anime-grid" id="trending-grid"></div>
      </div>
    `,i}async afterRender(){const i=document.getElementById("trending-grid"),g=document.getElementById("continue-grid"),h=document.getElementById("continue-watching-section"),l=await f.getContinueWatching();if(l.length>0){h.style.display="block";for(const e of l.slice(0,6))try{const d=(await c.getAnimeInfo(e.animeId)).data,a=document.createElement("anime-card");a.data=d,a.addEventListener("anime-click",()=>{window.history.pushState(null,null,`/watch/${e.animeId}/${e.episodeId}`),window.dispatchEvent(new Event("popstate"))}),g.appendChild(a)}catch(t){console.error(t)}}for(let e=0;e<6;e++){const t=document.createElement("anime-card");i.appendChild(t)}try{const e=await c.getTrending();if(i.innerHTML="",e&&e.data){const t=e.data.slice(0,5),d=await Promise.all(t.map(o=>c.getAnilistBanner(o.mal_id)));let a=0;const u=document.getElementById("hero-container"),p=o=>{var r,m;const n=t[o],s=d[o]||((m=(r=n.images)==null?void 0:r.jpg)==null?void 0:m.large_image_url);u.innerHTML=`
                  <style>
                    .hero-fade-in { animation: fadeIn 0.8s ease-out; }
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    .hero {
                      position: relative;
                      height: 550px;
                      display: flex;
                      align-items: center;
                      padding: 0 6%;
                      overflow: hidden;
                      background: #0a0a14;
                    }
                    .hero-backdrop {
                      position: absolute;
                      inset: 0;
                      background-image: url('${s}');
                      background-size: cover;
                      background-position: center 20%;
                      filter: brightness(0.4);
                      z-index: 1;
                    }
                    .hero::after {
                      content: '';
                      position: absolute;
                      inset: 0;
                      background: linear-gradient(90deg, #0a0a14 0%, rgba(10,10,20,0.6) 50%, transparent 100%);
                      z-index: 2;
                    }
                    .hero-content {
                      position: relative;
                      z-index: 3;
                      max-width: 700px;
                    }
                  </style>
                  <div class="hero hero-fade-in">
                    <div class="hero-backdrop"></div>
                    <div class="hero-content">
                      <h1 class="hero-title" style="text-shadow: 0 2px 10px rgba(0,0,0,0.5)">${n.title}</h1>
                      <p class="hero-desc" style="text-shadow: 0 1px 5px rgba(0,0,0,0.5)">${n.synopsis||"Disfruta de este increíble anime en AniRD."}</p>
                      <a href="/anime/${n.mal_id}" data-link class="btn-play" style="background:var(--accent); color:black; padding:14px 35px; border-radius:8px; font-weight:700; text-decoration:none; display:inline-block; transition: transform 0.2s;">VER DETALLES</a>
                    </div>
                  </div>
                `};p(0),this.heroInterval=setInterval(()=>{a=(a+1)%t.length,p(a)},7e3),e.data.slice(0,12).forEach(o=>{const n=document.createElement("anime-card");n.data=o,n.addEventListener("anime-click",s=>{const r=s.detail.mal_id;window.history.pushState(null,null,`/anime/${r}`),window.dispatchEvent(new Event("popstate"))}),i.appendChild(n)})}}catch(e){console.error("Failed to load trending",e),i.innerHTML="<p>Error al cargar los animes.</p>"}}}export{k as default};
