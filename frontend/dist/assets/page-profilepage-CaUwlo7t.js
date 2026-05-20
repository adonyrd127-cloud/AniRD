const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-BLqD5dcZ.js","assets/vendor-Cmt3X8aB.js"])))=>i.map(i=>d[i]);
import{_ as f}from"./page-favoritespage-B_Ku10Wz.js";import{a as m}from"./page-authpage-B004jQin.js";import{b,d as p}from"./page-homepage-BLqD5dcZ.js";import"./vendor-Cmt3X8aB.js";class _{constructor(i){this.params=i,this.user=m.getUser(),this.activeTab="list",this.followedAnimes=[],this.favoriteAnimes=[],this.stats={favs:0,list:0,epis:0}}async render(){if(!this.user)return window.location.href="/auth",document.createElement("div");this.followedAnimes=await b.following.toArray(),this.favoriteAnimes=await b.favorites.toArray(),this.stats={favs:this.favoriteAnimes.length,list:this.followedAnimes.length,epis:await b.history.count()};const i=document.createElement("div");return i.className="page-container",i.innerHTML=`
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
    `,i}async afterRender(){const i=document.getElementById("profile-tab-content"),h=document.querySelectorAll(".tab-btn-v5"),x=async l=>{if(this.activeTab=l,h.forEach(r=>r.classList.toggle("active",r.dataset.tab===l)),l==="list"){let n=function(t){if(!t||!t.day||!t.time||!t.timezone)return null;const d={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6}[t.day];if(d===void 0)return null;const[e,s]=t.time.split(":").map(Number),o=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone}));let c=new Date(o);c.setHours(e,s,0,0);let u=d-o.getDay();(u<0||u===0&&c<o)&&(u+=7),c.setDate(c.getDate()+u);const v=c-o;if(v<=0)return null;const y=Math.floor(v/(1e3*60*60*24)),g=Math.floor(v/(1e3*60*60)%24);return y>0?`${y}d ${g}h para nuevo cap.`:g>0?`${g}h para nuevo cap.`:"¡Nuevo cap en breve!"};i.innerHTML='<div class="grid-v5" id="grid-follow"></div>';const r=document.getElementById("grid-follow");this.followedAnimes.length>0?this.followedAnimes.forEach(t=>{const a=document.createElement("anime-card"),d={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}}};a.data=d,r.appendChild(a),Promise.all([f(async()=>{const{db:e}=await import("./page-homepage-BLqD5dcZ.js").then(s=>s.c);return{db:e}},__vite__mapDeps([0,1])).then(({db:e})=>e.history.where("animeId").equals(String(t.animeId)).reverse().sortBy("timestamp")),f(async()=>{const{apiService:e}=await import("./page-homepage-BLqD5dcZ.js").then(s=>s.e);return{apiService:e}},__vite__mapDeps([0,1])).then(({apiService:e})=>e.getAnimeInfo(t.animeId))]).then(([e,s])=>{let o={...d};if(e&&e.length>0&&(o.currentEpisode=e[0].episodeId),s&&s.data)if(s.data.status==="Currently Airing"){const c=n(s.data.broadcast);c&&(o.nextEpisodeText=c),o.status="EN EMISIÓN"}else s.data.status==="Finished Airing"&&(o.status="FINALIZADO");a.data=o})}):i.innerHTML='<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'}if(l==="favs"){i.innerHTML='<div class="grid-v5" id="grid-favs"></div>';const r=document.getElementById("grid-favs");this.favoriteAnimes.length>0?this.favoriteAnimes.forEach(n=>{const t=document.createElement("anime-card"),a={mal_id:n.animeId,title:n.title,images:{jpg:{large_image_url:n.cover}},status:n.status,broadcast:n.broadcast};t.data=a,r.appendChild(t),f(async()=>{const{apiService:d}=await import("./page-homepage-BLqD5dcZ.js").then(e=>e.e);return{apiService:d}},__vite__mapDeps([0,1])).then(({apiService:d})=>{d.getAnimeInfo(n.animeId).then(e=>{e&&e.data&&(t.data={...a,status:e.data.status,broadcast:e.data.broadcast,episodes:e.data.episodes,score:e.data.score})})})}):i.innerHTML='<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'}if(l==="settings"){const r=await p.getSetting("theme","dark"),n=await p.getSetting("audio_pref","sub");i.innerHTML=`
          <div class="settings-card-v5 page-enter">
            <h3 style="margin-bottom:30px; font-family:'Outfit'">Configuración Premium</h3>
            <div class="settings-item-v4">
              <label>Audio por defecto</label>
              <select id="audio-pref" class="select-v4">
                <option value="sub" ${n==="sub"?"selected":""}>Subtitulado (Japonés)</option>
                <option value="dub" ${n==="dub"?"selected":""}>Latino (Doblaje)</option>
              </select>
            </div>
            <div class="settings-item-v4">
              <label>Tema visual</label>
              <select id="theme-pref" class="select-v4">
                <option value="dark" ${r==="dark"?"selected":""}>Modo Oscuro</option>
                <option value="light" ${r==="light"?"selected":""}>Modo Claro</option>
              </select>
            </div>
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.05); margin:30px 0">
            <div style="display:flex; gap:15px">
              <button id="sync-btn" class="btn-v4-primary" style="flex:1">Sincronizar Datos</button>
              <button id="logout-btn" class="btn-v4-secondary" style="flex:1; background:rgba(255,0,0,0.1); color:#ff4444">Cerrar Sesión</button>
            </div>
          </div>
        `,document.getElementById("audio-pref").addEventListener("change",async t=>await p.setSetting("audio_pref",t.target.value)),document.getElementById("theme-pref").addEventListener("change",async t=>{const a=t.target.value;await p.setSetting("theme",a),document.body.classList.toggle("light-theme",a==="light")}),document.getElementById("sync-btn").addEventListener("click",async t=>{t.target.textContent="Procesando...";const a=await p.getAllData();await m.syncWithServer(a),window.location.reload()}),document.getElementById("logout-btn").addEventListener("click",()=>m.logout())}};h.forEach(l=>{l.addEventListener("click",()=>x(l.dataset.tab))}),await x("list")}}export{_ as default};
