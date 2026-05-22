import{a}from"./page-homepage-C8RU0l7O.js";import"./vendor-DIPEJTOH.js";class c{constructor(t){this.category=t.name,this.page=1,this.loading=!1,this.hasMore=!0,this.titles={popular:"Animes Populares",movies:"Películas de Anime",latest:"Últimos Lanzamientos",dub:"Animes en Latino",action:"Acción",adventure:"Aventura",comedy:"Comedia",drama:"Drama",fantasy:"Fantasía",music:"Musical",romance:"Romance","sci-fi":"Ciencia Ficción",seinen:"Seinen",shoujo:"Shoujo",shounen:"Shounen","slice-of-life":"Recuentos de la Vida",sports:"Deportes",supernatural:"Sobrenatural",thriller:"Thriller"},this.genres={action:1,adventure:2,comedy:4,drama:8,fantasy:10,music:19,romance:22,"sci-fi":24,seinen:42,shoujo:25,shounen:27,"slice-of-life":36,sports:30,supernatural:37,thriller:41}}async render(){const t=document.createElement("div");return t.innerHTML=`
      <style>
        .page-container {
          padding: 100px 4% 60px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .category-header {
            margin-bottom: 40px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .category-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          color: white;
          font-weight: 900;
          letter-spacing: -0.03em;
          margin: 0;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        .loader {
            padding: 40px;
            text-align: center;
            color: var(--accent);
            font-weight: bold;
        }
        @media (max-width: 768px) {
            .page-container { padding-top: 80px; }
            .category-title { font-size: 1.8rem; }
            .anime-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        }
      </style>
      <div class="page-container">
        <div class="category-header">
            <h2 class="category-title">${this.titles[this.category]||"Explorar"}</h2>
        </div>
        <div class="anime-grid" id="category-grid">
          ${Array.from({length:12},()=>'<div class="skeleton-card"><div class="skeleton skeleton-img"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text short"></div></div>').join("")}
        </div>
        <div id="grid-loader" class="loader" style="display:none;">Cargando más...</div>
      </div>
    `,t}async afterRender(){this.grid=document.getElementById("category-grid"),this.loader=document.getElementById("grid-loader"),await this.loadMore(),this.scrollHandler=()=>{this.loading||!this.hasMore||window.innerHeight+window.scrollY>=document.body.offsetHeight-500&&this.loadMore()},window.addEventListener("scroll",this.scrollHandler)}async loadMore(){var t;if(!this.loading){this.loading=!0,this.loader.style.display="block";try{let e;const i=this.genres[this.category];if(i)e=await a.getByGenre(i,this.page);else switch(this.category){case"popular":e=await a.getTrending(this.page);break;case"movies":e=await a.getMovies(this.page);break;case"latest":e=await a.getLatest(this.page);break;case"dub":e=await a.getDubbed(this.page);break;default:e=await a.getTrending(this.page)}const s=((t=e.data)==null?void 0:t.results)||e.data||[];s.length===0?(this.hasMore=!1,this.page===1&&(this.grid.innerHTML='<div style="color:var(--text-muted); padding:40px; text-align:center; grid-column: 1 / -1; font-size:1.2rem;">No se encontraron animes en esta categoría.</div>')):(this.page===1&&(this.grid.innerHTML=""),s.forEach(n=>{const r=document.createElement("anime-card");r.data=n,this.grid.appendChild(r)}),this.page++)}catch(e){console.error("Failed to load more items",e)}finally{this.loading=!1,this.loader.style.display="none"}}}}export{c as default};
