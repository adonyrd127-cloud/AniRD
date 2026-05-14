import{a as i}from"./main-CtB6XwmH.js";import{d as p}from"./db-DDVpz0tJ.js";import"./vendor-Cmt3X8aB.js";class y{constructor(e){this.animeId=e.animeId,this.episodeId=parseInt(e.episodeId),this.currentLinks=[]}async render(){return this.container=document.createElement("div"),this.container.innerHTML=`
      <style>
        .watch-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 4%;
        }
        .player-wrapper {
          aspect-ratio: 16/9;
          background: #000;
          border-radius: var(--radius-md);
          overflow: hidden;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          position: relative;
        }
        .player-wrapper iframe {
          width: 100%;
          height: 100%;
          border: none;
        }
        .server-selector {
          display: flex;
          gap: 10px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        .server-btn {
          padding: 8px 16px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .server-btn.active {
          background: var(--accent);
          color: black;
          font-weight: 600;
        }
        .player-info {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-top: 20px;
        }
        .back-btn {
          color: var(--text-secondary);
          display: inline-block;
          margin-bottom: 20px;
          text-decoration: none;
        }
        .ep-nav {
          display: flex;
          gap: 10px;
        }
        .btn-nav {
          padding: 10px 20px;
          background: var(--surface);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
          transition: background 0.2s;
        }
        .btn-nav:hover {
          background: var(--surface-hover);
        }
      </style>
      <div class="watch-container">
        <a href="/anime/${this.animeId}" data-link class="back-btn">← Volver al anime</a>
        <div id="player-area" class="player-wrapper">
           <div class="loader">Cargando episodio...</div>
        </div>

        <div class="player-info">
          <div>
            <h2 id="ep-title">Episodio ${this.episodeId}</h2>
            <div class="server-selector" id="server-list"></div>
          </div>
          <div class="ep-nav">
             <a href="/watch/${this.animeId}/${this.episodeId-1}" data-link class="btn-nav" id="prev-ep" style="${this.episodeId<=1?"display:none":""}">← Anterior</a>
             <a href="/watch/${this.animeId}/${this.episodeId+1}" data-link class="btn-nav" id="next-ep">Siguiente →</a>
          </div>
        </div>
      </div>
    `,this.container}async afterRender(){var e,r;try{p.addToHistory(this.animeId,this.episodeId,0,0);const s=(await i.getAnimeInfo(this.animeId)).data,c=[s.title,s.title_english,s.title_japanese].filter(Boolean);let t=null;for(const n of c)if(t=(r=(e=(await i.getAnimeSearch(n)).data)==null?void 0:e.results)==null?void 0:r[0],t)break;if(!t)throw new Error("No se encontró el anime en los servidores de streaming.");const o=(await i.getAnimeInfo(t.url)).data.episodes.find(n=>parseInt(n.number)===this.episodeId);if(!o)throw new Error("Episodio no disponible.");const d=await i.getEpisode(o.url),l=d.data.servers.sub||d.data.servers.dub||[];if(l.length===0)throw new Error("No se encontraron servidores para este episodio.");this.currentLinks=l,this.renderServers(),this.playServer(0)}catch(a){console.error(a),document.getElementById("player-area").innerHTML=`<p style="color:red; padding: 20px;">${a.message}</p>`}}renderServers(){const e=document.getElementById("server-list");e.innerHTML=this.currentLinks.map((r,a)=>`
      <button class="server-btn ${a===0?"active":""}" data-index="${a}">${r.server}</button>
    `).join(""),e.querySelectorAll(".server-btn").forEach(r=>{r.addEventListener("click",()=>{e.querySelectorAll(".server-btn").forEach(a=>a.classList.remove("active")),r.classList.add("active"),this.playServer(parseInt(r.dataset.index))})})}playServer(e){const r=this.currentLinks[e],a=document.getElementById("player-area");a.innerHTML=`<iframe src="${r.url}" allowfullscreen sandbox="allow-forms allow-scripts allow-same-origin"></iframe>`}}export{y as default};
