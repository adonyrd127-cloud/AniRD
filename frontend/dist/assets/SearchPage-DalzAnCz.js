import{a as s}from"./main-CtB6XwmH.js";import"./AnimeCard-CoH8iiLz.js";import"./vendor-Cmt3X8aB.js";class m{constructor(e){this.query=e.q}async render(){const e=document.createElement("div");return e.innerHTML=`
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .search-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          margin-bottom: 2rem;
          color: white;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 25px;
        }
      </style>
      <div class="page-container">
        <h2 class="search-title">Resultados para: "${this.query||""}"</h2>
        <div class="anime-grid" id="search-results-grid"></div>
      </div>
    `,e}async afterRender(){var a;if(!this.query)return;const e=document.getElementById("search-results-grid");for(let r=0;r<8;r++){const t=document.createElement("anime-card");e.appendChild(t)}try{const r=await s.getAnimeSearch(this.query);e.innerHTML="";const t=((a=r.data)==null?void 0:a.results)||r.data||[];if(t.length===0){e.innerHTML='<p style="color: var(--text-secondary);">No se encontraron resultados.</p>';return}t.forEach(i=>{const n=document.createElement("anime-card");n.data=i,e.appendChild(n)})}catch(r){console.error("Search failed",r),e.innerHTML='<p style="color: red;">Error al buscar animes.</p>'}}}export{m as default};
