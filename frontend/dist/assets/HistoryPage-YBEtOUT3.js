import{d as s}from"./db-DDVpz0tJ.js";import{a as d}from"./main-CtB6XwmH.js";import"./AnimeCard-CoH8iiLz.js";import"./vendor-Cmt3X8aB.js";class h{async render(){const e=document.createElement("div");return e.innerHTML=`
      <style>
        .page-container {
          padding: 40px 4%;
          max-width: 1400px;
          margin: 0 auto;
        }
        .history-title {
          font-family: var(--font-display);
          font-size: 2rem;
          margin-bottom: 2rem;
          color: white;
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        .history-item {
          position: relative;
        }
        .ep-badge {
          position: absolute;
          bottom: 80px;
          right: 10px;
          background: var(--accent);
          color: black;
          padding: 4px 10px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
          z-index: 10;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
      </style>
      <div class="page-container">
        <h2 class="history-title">🕒 Mi Historial</h2>
        <div class="anime-grid" id="history-results-grid"></div>
      </div>
    `,e}async afterRender(){const e=document.getElementById("history-results-grid"),i=await s.getContinueWatching();if(i.length===0){e.innerHTML='<p style="color: var(--text-secondary);">No tienes historial de reproducción aún.</p>';return}e.innerHTML="";for(const r of i)try{const o=(await d.getAnimeInfo(r.animeId)).data,t=document.createElement("div");t.className="history-item";const n=document.createElement("anime-card");n.data={...o,currentEpisode:r.episodeId},t.appendChild(n),e.appendChild(t)}catch(a){console.error("Error loading history item info",a)}}}export{h as default};
