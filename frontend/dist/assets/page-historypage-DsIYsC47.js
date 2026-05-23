import{d as s,a as f}from"./page-homepage-BCn5ETVD.js";import"./vendor-DIPEJTOH.js";class b{async render(){const i=document.createElement("div");return i.innerHTML=`
      <style>
        .page-container {
          padding: 100px 4% 60px;
          max-width: 1600px;
          margin: 0 auto;
        }
        .profile-section {
            margin-bottom: 60px;
        }
        .profile-title {
          font-family: var(--font-display);
          font-size: 2.2rem;
          margin-bottom: 30px;
          color: var(--text-primary);
          font-weight: 900;
          letter-spacing: -0.03em;
          padding-bottom: 15px;
          border-bottom: 1px solid var(--glass-border);
        }
        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 30px;
        }
        .timer-overlay {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 10;
          border: 1px solid rgba(255,255,255,0.1);
          pointer-events: none;
        }
        .empty-state {
            padding: 40px;
            text-align: center;
            background: var(--bg-secondary);
            border-radius: var(--radius-lg);
            color: var(--text-secondary);
            border: 1px border dashed rgba(255,255,255,0.1);
        }
        @media (max-width: 768px) {
            .page-container { padding-top: 80px; }
            .profile-title { font-size: 1.8rem; }
            .anime-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px; }
        }
      </style>
      <div class="page-container">
        <div class="profile-section">
            <h2 class="profile-title">🕒 Mi Historial</h2>
            <div class="anime-grid" id="history-results-grid"></div>
        </div>

        <div class="profile-section">
            <h2 class="profile-title">⭐ Mis Favoritos</h2>
            <div class="anime-grid" id="favorites-results-grid"></div>
        </div>

        <div class="profile-section">
            <h2 class="profile-title">🔔 Siguiendo</h2>
            <div class="anime-grid" id="following-results-grid"></div>
        </div>

        <div class="profile-section">
            <h2 class="profile-title">⚙️ Ajustes</h2>
            <div class="settings-card">
                <style>
                    .settings-card {
                        background: var(--bg-secondary);
                        border-radius: var(--radius-lg);
                        padding: 30px;
                        border: 1px solid rgba(255,255,255,0.05);
                        display: grid;
                        gap: 25px;
                        max-width: 600px;
                    }
                    .setting-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }
                    .setting-info h4 {
                        margin: 0 0 5px 0;
                        color: var(--text-primary);
                    }
                    .setting-info p {
                        margin: 0;
                        font-size: 0.85rem;
                        color: var(--text-secondary);
                    }
                    .setting-control select, .setting-control input {
                        background: var(--bg-tertiary);
                        border: 1px solid var(--glass-border);
                        color: var(--text-primary);
                        padding: 8px 15px;
                        border-radius: 6px;
                        outline: none;
                        cursor: pointer;
                        font-family: inherit;
                    }
                    .setting-control select option {
                        background: var(--bg-tertiary);
                        color: var(--text-primary);
                    }
                </style>
                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Tema de la aplicación</h4>
                        <p>Cambia entre modo oscuro y claro.</p>
                    </div>
                    <div class="setting-control">
                        <select id="theme-select">
                            <option value="dark">Oscuro (Noche)</option>
                            <option value="light">Claro (Día)</option>
                        </select>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-info">
                        <h4>Idioma preferido</h4>
                        <p>Selección automática en el reproductor.</p>
                    </div>
                    <div class="setting-control">
                        <select id="lang-select">
                            <option value="SUB">Japonés (Subtitulado)</option>
                            <option value="DUB">Español Latino</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
      </div>
    `,i}async afterRender(){const i=document.getElementById("history-results-grid"),d=document.getElementById("favorites-results-grid"),l=document.getElementById("theme-select"),c=document.getElementById("lang-select"),u=await s.getSetting("theme","dark"),p=await s.getSetting("lang","SUB");l.value=u,c.value=p,l.addEventListener("change",async e=>{const t=e.target.value;await s.setSetting("theme",t),t==="light"?document.body.classList.add("light-theme"):document.body.classList.remove("light-theme")}),c.addEventListener("change",async e=>{await s.setSetting("lang",e.target.value)});const g=await s.getContinueWatching();if(g.length===0)i.innerHTML='<div class="empty-state">No tienes historial de reproducción aún.</div>';else{i.innerHTML="";for(const e of g)try{const t=document.createElement("anime-card");if(t.setAttribute("mode","thumbnail"),i.appendChild(t),e.animeTitle&&e.animeCover)t.data={mal_id:e.animeId,title:e.animeTitle,images:{jpg:{large_image_url:e.animeCover}},type:e.animeType||"",score:e.animeScore||"",currentEpisode:e.episodeId},f.getAnimeInfo(e.animeId).then(a=>{a&&a.data&&(t.data={...a.data,currentEpisode:e.episodeId})}).catch(a=>{});else{const o=(await f.getAnimeInfo(e.animeId)).data;t.data={...o,currentEpisode:e.episodeId}}}catch(t){console.error(t)}}const m=await s.getFavorites();m.length===0?d.innerHTML='<div class="empty-state">Aún no has guardado ningún anime en favoritos.</div>':(d.innerHTML="",m.forEach(e=>{const t=document.createElement("anime-card");t.data={mal_id:e.animeId,title:e.title,images:{jpg:{large_image_url:e.cover}},type:e.type,score:e.score},d.appendChild(t)}));const n=document.getElementById("following-results-grid"),r=await s.getFollowing();r.length===0?n.innerHTML='<div class="empty-state">No estás siguiendo ningún anime todavía.</div>':(n.innerHTML="",r.forEach(e=>{const t=document.createElement("div");t.style.position="relative";const a=document.createElement("anime-card");a.data={mal_id:e.animeId,title:e.title,images:{jpg:{large_image_url:e.cover}}};const o=document.createElement("div");o.className="timer-overlay",o.innerHTML=this.calculateCountdown(e.broadcast),t.appendChild(a),t.appendChild(o),n.appendChild(t)}))}calculateCountdown(i){if(!i||!i.day||!i.time)return"<span>Siguiente Ep: --:--</span>";try{const l=["Sundays","Mondays","Tuesdays","Wednesdays","Thursdays","Fridays","Saturdays"].indexOf(i.day),[c,u]=i.time.split(":").map(Number),p=new Date,g=9*60,m=p.getTimezoneOffset(),n=new Date(p.getTime()+(g+m)*6e4);let r=l-n.getDay();r<0&&(r+=7);const e=new Date(n);e.setDate(n.getDate()+r),e.setHours(c,u,0,0),r===0&&e<n&&e.setDate(e.getDate()+7);const t=e-n,a=Math.floor(t/(1e3*60*60)),o=Math.floor(a/24),v=a%24;return o>0?`<span>⏳ ${o}d ${v}h</span>`:`<span>⏳ ${v}h</span>`}catch{return"<span>Pronto</span>"}}}export{b as default};
