const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{d as f}from"./page-homepage-HfrhAw2J.js";const y="modulepreload",v=function(l){return"/"+l},m={},h=function(n,i,r){let s=Promise.resolve();if(i&&i.length>0){document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),e=(t==null?void 0:t.nonce)||(t==null?void 0:t.getAttribute("nonce"));s=Promise.allSettled(i.map(a=>{if(a=v(a),a in m)return;m[a]=!0;const c=a.endsWith(".css"),p=c?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${p}`))return;const o=document.createElement("link");if(o.rel=c?"stylesheet":y,c||(o.as="script"),o.crossOrigin="",o.href=a,e&&o.setAttribute("nonce",e),document.head.appendChild(o),c)return new Promise((u,g)=>{o.addEventListener("load",u),o.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${a}`)))})}))}function d(t){const e=new Event("vite:preloadError",{cancelable:!0});if(e.payload=t,window.dispatchEvent(e),!e.defaultPrevented)throw t}return s.then(t=>{for(const e of t||[])e.status==="rejected"&&d(e.reason);return n().catch(d)})};class x{async render(){const n=document.createElement("div");return n.innerHTML=`
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
    `,n}async afterRender(){const n=document.getElementById("favorites-grid"),i=await f.getFavorites();if(i.length===0){n.innerHTML=`
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--surface); border-radius: 12px;">
          <div style="font-size: 4rem; margin-bottom: 20px;">⭐</div>
          <h2 style="color: white; margin-bottom: 10px;">Aún no tienes favoritos</h2>
          <p style="color: var(--text-secondary);">Explora el catálogo y guarda los animes que más te gusten.</p>
          <a href="/" data-link class="btn-play" style="margin-top:20px; display:inline-block; background:var(--accent); color:black; padding:12px 25px; border-radius:8px; font-weight:700; text-decoration:none;">Explorar Inicio</a>
        </div>
      `;return}n.innerHTML="",i.forEach(r=>{const s=document.createElement("anime-card"),d={mal_id:r.animeId,title:r.title,images:{jpg:{large_image_url:r.cover}},type:r.type,score:r.score,episodes:r.episodes,status:r.status,broadcast:r.broadcast};s.data=d,n.appendChild(s),h(async()=>{const{apiService:t}=await import("./page-homepage-HfrhAw2J.js").then(e=>e.f);return{apiService:t}},__vite__mapDeps([0,1])).then(({apiService:t})=>{t.getAnimeInfo(r.animeId).then(e=>{e&&e.data&&(s.data={...d,status:e.data.status,broadcast:e.data.broadcast,episodes:e.data.episodes,score:e.data.score})})})})}}const E=Object.freeze(Object.defineProperty({__proto__:null,default:x},Symbol.toStringTag,{value:"Module"}));export{E as F,h as _};
