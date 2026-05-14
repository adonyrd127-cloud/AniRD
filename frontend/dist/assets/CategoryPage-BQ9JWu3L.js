import{a}from"./main-CtB6XwmH.js";import"./AnimeCard-CoH8iiLz.js";import"./vendor-Cmt3X8aB.js";class p{constructor(t){this.category=t.name,this.titles={popular:"Animes Populares",movies:"Películas de Anime",latest:"Últimos Lanzamientos",dub:"Animes en Latino"}}async render(){const t=document.createElement("div");return t.innerHTML=`
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .category-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 2rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .category-title::before {
          content: '';
          width: 6px;
          height: 30px;
          background: var(--accent);
          border-radius: 3px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 25px;
        }
      </style>
      <div class="page-container">
        <h2 class="category-title">${this.titles[this.category]||"Categoría"}</h2>
        <div class="anime-grid" id="category-grid"></div>
      </div>
    `,t}async afterRender(){var n;const t=document.getElementById("category-grid");for(let e=0;e<12;e++){const i=document.createElement("anime-card");t.appendChild(i)}try{let e;switch(this.category){case"popular":e=await a.getTrending();break;case"movies":e=await a.getMovies();break;case"latest":e=await a.getLatest();break;case"dub":e=await a.getDubbed();break;default:e=await a.getTrending()}t.innerHTML="";const i=((n=e.data)==null?void 0:n.results)||e.data||[];if(i.length===0){t.innerHTML="<p>No hay animes en esta categoría.</p>";return}i.forEach(s=>{const r=document.createElement("anime-card");r.data=s,r.addEventListener("anime-click",o=>{const c=o.detail.mal_id||o.detail.id;window.history.pushState(null,null,`/anime/${c}`),window.dispatchEvent(new Event("popstate"))}),t.appendChild(r)})}catch(e){console.error("Failed to load category",e),t.innerHTML='<p style="color:red">Error al cargar la categoría.</p>'}}}export{p as default};
