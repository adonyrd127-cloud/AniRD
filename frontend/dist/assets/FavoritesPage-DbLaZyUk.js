import{d as r}from"./db-DDVpz0tJ.js";import"./AnimeCard-CoH8iiLz.js";import"./vendor-Cmt3X8aB.js";class l{async render(){const e=document.createElement("div");return e.innerHTML=`
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
    `,e}async afterRender(){const e=document.getElementById("favorites-grid"),a=await r.getFavorites();if(a.length===0){e.innerHTML=`
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--surface); border-radius: 12px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">⭐</div>
          <h2 style="color: white; margin-bottom: 10px;">Aún no tienes favoritos</h2>
          <p style="color: var(--text-secondary);">Explora el catálogo y guarda los animes que más te gusten.</p>
          <a href="/" data-link class="btn-play" style="margin-top:20px; display:inline-block; background:var(--accent); color:black; padding:12px 25px; border-radius:8px; font-weight:700; text-decoration:none;">Explorar Inicio</a>
        </div>
      `;return}e.innerHTML="",a.forEach(t=>{const i=document.createElement("anime-card");i.data={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}},type:t.type,score:t.score,episodes:t.episodes},e.appendChild(i)})}}export{l as default};
