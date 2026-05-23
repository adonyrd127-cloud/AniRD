const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-BCn5ETVD.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{_ as s}from"./page-watchpage-BB3XeofP.js";import{d}from"./page-homepage-BCn5ETVD.js";import"./vendor-DIPEJTOH.js";class g{async render(){const a=document.createElement("div");return a.innerHTML=`
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
      </style>
      <div class="page-container">
        <h1 class="title">❤️ Mis Favoritos</h1>
        <div class="anime-grid" id="favorites-grid">
           <div style="color: var(--text-secondary);">Cargando favoritos...</div>
        </div>
      </div>
    `,a}async afterRender(){const a=document.getElementById("favorites-grid"),o=await d.getFavorites();if(o.length===0){a.innerHTML=`
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--surface); border-radius: 12px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">⭐</div>
          <h2 style="color: white; margin-bottom: 10px;">Aún no tienes favoritos</h2>
          <p style="color: var(--text-secondary);">Explora el catálogo y guarda los animes que más te gusten.</p>
          <a href="/" data-link class="btn-play" style="margin-top:20px; display:inline-block; background:var(--accent); color:black; padding:12px 25px; border-radius:8px; font-weight:700; text-decoration:none;">Explorar Inicio</a>
        </div>
      `;return}a.innerHTML="",o.forEach(t=>{const i=document.createElement("anime-card"),n={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}},type:t.type,score:t.score,episodes:t.episodes,status:t.status,broadcast:t.broadcast};i.data=n,a.appendChild(i),s(async()=>{const{apiService:r}=await import("./page-homepage-BCn5ETVD.js").then(e=>e.f);return{apiService:r}},__vite__mapDeps([0,1])).then(({apiService:r})=>{r.getAnimeInfo(t.animeId).then(e=>{e&&e.data&&(i.data={...n,status:e.data.status,broadcast:e.data.broadcast,episodes:e.data.episodes,score:e.data.score})})})})}}export{g as default};
