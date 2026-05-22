const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{_ as g}from"./page-favoritespage-BsIX1kVp.js";import{c as f,b as h,d as u}from"./page-homepage-HfrhAw2J.js";import"./vendor-DIPEJTOH.js";class S{constructor(n){this.params=n,this.user=f.getUser(),this.activeTab="list",this.followedAnimes=[],this.favoriteAnimes=[],this.stats={favs:0,list:0,epis:0}}async render(){if(!this.user)return window.location.href="/auth",document.createElement("div");this.followedAnimes=await h.following.toArray(),this.favoriteAnimes=await h.favorites.toArray(),this.stats={favs:this.favoriteAnimes.length,list:this.followedAnimes.length,epis:await h.history.count()};const n=document.createElement("div");return n.className="page-container",n.innerHTML=`
      <style>
        .profile-hero-v5 {
          height: 350px;
          position: relative;
          background: #0a0a0a;
          display: flex;
          align-items: flex-end;
          padding: 0 5% 40px;
          overflow: hidden;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .profile-hero-v5::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #ff0000 0%, #330000 100%);
          opacity: 0.15;
          filter: blur(50px);
        }
        .user-meta-v5 {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 30px;
          width: 100%;
        }
        .avatar-v5 {
          width: 120px; height: 120px;
          background: var(--accent);
          border-radius: 35px;
          display: flex; align-items: center; justify-content: center;
          font-size: 48px; font-weight: 900; color: white;
          box-shadow: 0 20px 40px rgba(255,0,0,0.3);
          border: 4px solid rgba(255,255,255,0.1);
        }
        .user-info-v5 h1 { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 900; margin: 0; }
        .user-info-v5 p { color: var(--text-muted); font-size: 12px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; }

        .stats-row-v5 { display: flex; gap: 20px; margin-left: auto; }
        .stat-chip-v5 {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          padding: 15px 25px;
          border-radius: 20px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .stat-chip-v5 b { display: block; font-size: 20px; color: white; }
        .stat-chip-v5 span { font-size: 10px; color: var(--text-muted); font-weight: 800; }

        .profile-tabs-v5 {
          display: flex;
          gap: 40px;
          padding: 0 5%;
          margin-top: -1px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(5,5,5,0.5);
          backdrop-filter: blur(20px);
        }
        .tab-btn-v5 {
          padding: 20px 0;
          background: none; border: none;
          color: var(--text-muted);
          font-weight: 800; font-size: 13px;
          cursor: pointer;
          position: relative;
          transition: color 0.3s;
        }
        .tab-btn-v5.active { color: white; }
        .tab-btn-v5.active::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; background: var(--accent); border-radius: 10px 10px 0 0;
        }

        .tab-content-v5 { padding: 40px 5% 100px; }
        .grid-v5 { display: grid; grid-template-columns: repeat(auto-fill, minmax(185px, 1fr)); gap: 30px; }

        .settings-card-v5 {
          max-width: 600px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 30px;
          padding: 40px;
        }

        .sync-btn-mobile {
          display: none;
        }

        @media (max-width: 900px) {
          .profile-hero-v5 { height: auto; padding: 100px 5% 40px; }
          .user-meta-v5 { flex-direction: column; text-align: center; }
          .stats-row-v5 { margin: 20px auto 0; }
          .profile-tabs-v5 { gap: 20px; justify-content: center; }
        }
      </style>

      <div class="profile-hero-v5">
        <div class="user-meta-v5">
          <div class="avatar-v5">${this.user.username.charAt(0).toUpperCase()}</div>
          <div class="user-info-v5">
            <p>Panel de Usuario</p>
            <h1>${this.user.username}</h1>
          </div>
          <div class="stats-row-v5">
            <div class="stat-chip-v5"><b>${this.stats.list}</b><span>SIGUIENDO</span></div>
            <div class="stat-chip-v5"><b>${this.stats.favs}</b><span>FAVORITOS</span></div>
            <div class="stat-chip-v5"><b>${this.stats.epis}</b><span>EPISODIOS</span></div>
          </div>
        </div>
      </div>

      <nav class="profile-tabs-v5">
        <button class="tab-btn-v5 active" data-tab="list">MI LISTA</button>
        <button class="tab-btn-v5" data-tab="favs">FAVORITOS</button>
        <button class="tab-btn-v5" data-tab="settings">AJUSTES</button>
      </nav>

      <div class="tab-content-v5" id="profile-tab-content">
        <!-- Contenido dinámico -->
      </div>
      
      <div class="sync-btn-mobile" id="sync-btn-profile-mobile">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-secondary);">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
        </svg>
        Sincronizar con Orange Pi
      </div>
    `,n}async afterRender(){const n=document.getElementById("profile-tab-content"),x=document.querySelectorAll(".tab-btn-v5"),y=async d=>{if(this.activeTab=d,x.forEach(i=>i.classList.toggle("active",i.dataset.tab===d)),d==="list"){let o=function(t){if(!t||!t.day||!t.time||!t.timezone)return null;const s={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6}[t.day];if(s===void 0)return null;const[e,r]=t.time.split(":").map(Number),l=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone}));let c=new Date(l);c.setHours(e,r,0,0);let v=s-l.getDay();(v<0||v===0&&c<l)&&(v+=7),c.setDate(c.getDate()+v);const b=c-l;if(b<=0)return null;const w=Math.floor(b/(1e3*60*60*24)),m=Math.floor(b/(1e3*60*60)%24);return w>0?`${w}d ${m}h para nuevo cap.`:m>0?`${m}h para nuevo cap.`:"¡Nuevo cap en breve!"};n.innerHTML='<div class="grid-v5" id="grid-follow"></div>';const i=document.getElementById("grid-follow");this.followedAnimes.length>0?this.followedAnimes.forEach(t=>{const a=document.createElement("anime-card"),s={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}}};a.data=s,i.appendChild(a),Promise.all([g(async()=>{const{db:e}=await import("./page-homepage-HfrhAw2J.js").then(r=>r.e);return{db:e}},__vite__mapDeps([0,1])).then(({db:e})=>e.history.where("animeId").equals(String(t.animeId)).reverse().sortBy("timestamp")),g(async()=>{const{apiService:e}=await import("./page-homepage-HfrhAw2J.js").then(r=>r.f);return{apiService:e}},__vite__mapDeps([0,1])).then(({apiService:e})=>e.getAnimeInfo(t.animeId))]).then(([e,r])=>{let l={...s};if(e&&e.length>0&&(l.currentEpisode=e[0].episodeId),r&&r.data)if(r.data.status==="Currently Airing"){const c=o(r.data.broadcast);c&&(l.nextEpisodeText=c),l.status="EN EMISIÓN"}else r.data.status==="Finished Airing"&&(l.status="FINALIZADO");a.data=l})}):n.innerHTML='<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'}if(d==="favs"){n.innerHTML='<div class="grid-v5" id="grid-favs"></div>';const i=document.getElementById("grid-favs");this.favoriteAnimes.length>0?this.favoriteAnimes.forEach(o=>{const t=document.createElement("anime-card"),a={mal_id:o.animeId,title:o.title,images:{jpg:{large_image_url:o.cover}},status:o.status,broadcast:o.broadcast};t.data=a,i.appendChild(t),g(async()=>{const{apiService:s}=await import("./page-homepage-HfrhAw2J.js").then(e=>e.f);return{apiService:s}},__vite__mapDeps([0,1])).then(({apiService:s})=>{s.getAnimeInfo(o.animeId).then(e=>{e&&e.data&&(t.data={...a,status:e.data.status,broadcast:e.data.broadcast,episodes:e.data.episodes,score:e.data.score})})})}):n.innerHTML='<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'}if(d==="settings"){const i=await u.getSetting("theme","dark"),o=await u.getSetting("audio_pref","sub");n.innerHTML=`
          <div class="settings-card-v5 page-enter">
            <h3 style="margin-bottom:30px; font-family:'Outfit'">Configuración Premium</h3>
            <div class="settings-item-v4">
              <label>Audio por defecto</label>
              <select id="audio-pref" class="select-v4">
                <option value="sub" ${o==="sub"?"selected":""}>Subtitulado (Japonés)</option>
                <option value="dub" ${o==="dub"?"selected":""}>Latino (Doblaje)</option>
              </select>
            </div>
            <div class="settings-item-v4">
              <label>Tema visual</label>
              <select id="theme-pref" class="select-v4">
                <option value="dark" ${i==="dark"?"selected":""}>Modo Oscuro</option>
                <option value="light" ${i==="light"?"selected":""}>Modo Claro</option>
              </select>
            </div>
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.05); margin:30px 0">
            <div style="display:flex; gap:15px; flex-wrap:wrap;">
              <button id="sync-btn" class="btn-v4-primary" style="flex:1; min-width:140px;">Sincronizar Datos</button>
              <button id="reset-db-btn" class="btn-v4-secondary" style="flex:1; min-width:140px; background:rgba(255,165,0,0.1); color:#ffa500; border-color:rgba(255,165,0,0.2)">Restablecer Local</button>
              <button id="logout-btn" class="btn-v4-secondary" style="flex:1; min-width:140px; background:rgba(255,0,0,0.1); color:#ff4444">Cerrar Sesión</button>
            </div>
          </div>
        `,document.getElementById("audio-pref").addEventListener("change",async t=>await u.setSetting("audio_pref",t.target.value)),document.getElementById("theme-pref").addEventListener("change",async t=>{const a=t.target.value;await u.setSetting("theme",a),document.body.classList.toggle("light-theme",a==="light")}),document.getElementById("sync-btn").addEventListener("click",async t=>{t.target.textContent="Procesando...";const a=await u.getAllData();await f.syncWithServer(a),window.location.reload()}),document.getElementById("reset-db-btn").addEventListener("click",async t=>{if(confirm("¿Estás seguro de que deseas restablecer la base de datos local? Tu historial y favoritos se descargarán de nuevo de la nube de forma limpia.")){t.target.textContent="Restableciendo...";try{await(await g(async()=>{const{default:s}=await import("./vendor-DIPEJTOH.js").then(e=>e.d);return{default:s}},[])).default.delete("AniRD_DB"),window.location.reload()}catch(a){alert("Error al restablecer la base de datos: "+a.message),window.location.reload()}}}),document.getElementById("logout-btn").addEventListener("click",()=>f.logout())}};x.forEach(d=>{d.addEventListener("click",()=>y(d.dataset.tab))});const p=document.getElementById("sync-btn-profile-mobile");p&&p.addEventListener("click",async()=>{const d=p.innerHTML;p.innerHTML="Sincronizando...";try{const i=await u.getAllData();await f.syncWithServer(i),p.innerHTML="¡Sincronizado con éxito!",setTimeout(()=>{window.location.reload()},1500)}catch(i){p.innerHTML=`Error: ${i.message}`,setTimeout(()=>{p.innerHTML=d},3e3)}}),await y("list")}}export{S as default};
