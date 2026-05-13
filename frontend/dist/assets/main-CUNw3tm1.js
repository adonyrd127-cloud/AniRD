const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HomePage-DEVJ82fT.js","assets/api-Ba0UQCNI.js","assets/AnimeDetailPage-DCezqb0m.js"])))=>i.map(i=>d[i]);
import{t as e}from"./vendor-DdhT1N-e.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var t=e(e=>({theme:`dark`,isDataSaver:!1,setTheme:t=>e({theme:t}),toggleDataSaver:()=>e(e=>({isDataSaver:!e.isDataSaver})),currentRoute:`/`,setCurrentRoute:t=>e({currentRoute:t}),isSearchOpen:!1,setSearchOpen:t=>e({isSearchOpen:t})})),n=`modulepreload`,r=function(e){return`/`+e},i={},a=function(e,t,a){let o=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),s=document.querySelector(`meta[property=csp-nonce]`),c=s?.nonce||s?.getAttribute(`nonce`);function l(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}o=l(t.map(t=>{if(t=r(t,a),t in i)return;i[t]=!0;let o=t.endsWith(`.css`),s=o?`[rel="stylesheet"]`:``;if(a)for(let n=e.length-1;n>=0;n--){let r=e[n];if(r.href===t&&(!o||r.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${s}`))return;let l=document.createElement(`link`);if(l.rel=o?`stylesheet`:n,o||(l.as=`script`),l.crossOrigin=``,l.href=t,c&&l.setAttribute(`nonce`,c),document.head.appendChild(l),o)return new Promise((e,n)=>{l.addEventListener(`load`,e),l.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function s(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return o.then(t=>{for(let e of t||[])e.status===`rejected`&&s(e.reason);return e().catch(s)})},o={"/":()=>a(()=>import(`./HomePage-DEVJ82fT.js`),__vite__mapDeps([0,1])),"/anime":()=>a(()=>import(`./AnimeDetailPage-DCezqb0m.js`),__vite__mapDeps([2,1])),"/watch":()=>a(()=>import(`./WatchPage-XEXlIFTe.js`),[]),"/history":()=>a(()=>import(`./HistoryPage-Bm1SEIOM.js`),[]),"/favorites":()=>a(()=>import(`./FavoritesPage-Bkdh3KgV.js`),[]),"/calendar":()=>a(()=>import(`./CalendarPage-CjckR6KT.js`),[])},s=class{constructor(e){this.root=e,this.init()}init(){window.addEventListener(`popstate`,()=>this.handleRoute()),document.body.addEventListener(`click`,e=>{let t=e.target.closest(`a[data-link]`);t&&(e.preventDefault(),this.navigate(t.getAttribute(`href`)))}),this.handleRoute()}navigate(e){window.history.pushState(null,null,e),this.handleRoute()}async handleRoute(){let e=window.location.pathname,n=`/`,r={};if(e.startsWith(`/anime/`))n=`/anime`,r.id=e.split(`/`)[2];else if(e.startsWith(`/watch/`)){n=`/watch`;let t=e.split(`/`);r.animeId=t[2],r.episodeId=t[3]}else o[e]&&(n=e);t.getState().setCurrentRoute(e);let i=o[n]||o[`/`];this.root.innerHTML=`<div style="padding: 50px; text-align: center; color: white;">Cargando...</div>`;try{let e=(await i()).default,t=new e(r);this.root.innerHTML=``,this.root.appendChild(await t.render()),t.afterRender&&t.afterRender()}catch(e){console.error(`Error loading route`,e),this.root.innerHTML=`<div style="padding: 50px; text-align: center; color: red;">Error al cargar la página</div>`}}},c=document.getElementById(`app`),l=document.createElement(`header`);l.innerHTML=`
  <style>
    .top-nav {
      background: rgba(10, 10, 15, 0.9);
      backdrop-filter: blur(10px);
      padding: 15px 4%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 100;
      border-bottom: 1px solid var(--surface);
    }
    .logo {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
    }
    .nav-links {
      display: flex;
      gap: 15px;
    }
    .nav-links a {
      color: var(--text-secondary);
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover {
      color: white;
    }
  </style>
  <nav class="top-nav">
    <a href="/" data-link class="logo">AniRD</a>
    <div class="nav-links">
      <a href="/" data-link>Inicio</a>
      <a href="/calendar" data-link>Calendario</a>
      <a href="/history" data-link>Historial</a>
      <a href="/favorites" data-link>Favoritos</a>
    </div>
  </nav>
`,document.body.insertBefore(l,c),new s(c),`serviceWorker`in navigator&&window.addEventListener(`load`,()=>{navigator.serviceWorker.register(`/sw.js`).then(e=>{console.log(`SW registered: `,e)}).catch(e=>{console.log(`SW registration failed: `,e)})});