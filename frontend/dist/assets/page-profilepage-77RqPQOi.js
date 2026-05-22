const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-C8RU0l7O.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{_ as v}from"./page-favoritespage-Dwpj0Byw.js";import{c as b,b as m,d as p}from"./page-homepage-C8RU0l7O.js";import"./vendor-DIPEJTOH.js";class I{constructor(i){this.params=i,this.user=b.getUser(),this.activeTab="list",this.followedAnimes=[],this.favoriteAnimes=[],this.stats={favs:0,list:0,epis:0}}async render(){if(!this.user)return window.location.href="/auth",document.createElement("div");this.followedAnimes=await m.following.toArray(),this.favoriteAnimes=await m.favorites.toArray(),this.stats={favs:this.favoriteAnimes.length,list:this.followedAnimes.length,epis:await m.history.count()};const i=document.createElement("div");return i.className="page-container",i.innerHTML=`
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
    `,i}async afterRender(){const i=document.getElementById("profile-tab-content"),h=document.querySelectorAll(".tab-btn-v5"),x=async l=>{if(this.activeTab=l,h.forEach(d=>d.classList.toggle("active",d.dataset.tab===l)),l==="list"){let n=function(t){if(!t||!t.day||!t.time||!t.timezone)return null;const s={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6}[t.day];if(s===void 0)return null;const[e,o]=t.time.split(":").map(Number),r=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone}));let c=new Date(r);c.setHours(e,o,0,0);let u=s-r.getDay();(u<0||u===0&&c<r)&&(u+=7),c.setDate(c.getDate()+u);const g=c-r;if(g<=0)return null;const y=Math.floor(g/(1e3*60*60*24)),f=Math.floor(g/(1e3*60*60)%24);return y>0?`${y}d ${f}h para nuevo cap.`:f>0?`${f}h para nuevo cap.`:"¡Nuevo cap en breve!"};i.innerHTML='<div class="grid-v5" id="grid-follow"></div>';const d=document.getElementById("grid-follow");this.followedAnimes.length>0?this.followedAnimes.forEach(t=>{const a=document.createElement("anime-card"),s={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}}};a.data=s,d.appendChild(a),Promise.all([v(async()=>{const{db:e}=await import("./page-homepage-C8RU0l7O.js").then(o=>o.e);return{db:e}},__vite__mapDeps([0,1])).then(({db:e})=>e.history.where("animeId").equals(String(t.animeId)).reverse().sortBy("timestamp")),v(async()=>{const{apiService:e}=await import("./page-homepage-C8RU0l7O.js").then(o=>o.f);return{apiService:e}},__vite__mapDeps([0,1])).then(({apiService:e})=>e.getAnimeInfo(t.animeId))]).then(([e,o])=>{let r={...s};if(e&&e.length>0&&(r.currentEpisode=e[0].episodeId),o&&o.data)if(o.data.status==="Currently Airing"){const c=n(o.data.broadcast);c&&(r.nextEpisodeText=c),r.status="EN EMISIÓN"}else o.data.status==="Finished Airing"&&(r.status="FINALIZADO");a.data=r})}):i.innerHTML='<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'}if(l==="favs"){i.innerHTML='<div class="grid-v5" id="grid-favs"></div>';const d=document.getElementById("grid-favs");this.favoriteAnimes.length>0?this.favoriteAnimes.forEach(n=>{const t=document.createElement("anime-card"),a={mal_id:n.animeId,title:n.title,images:{jpg:{large_image_url:n.cover}},status:n.status,broadcast:n.broadcast};t.data=a,d.appendChild(t),v(async()=>{const{apiService:s}=await import("./page-homepage-C8RU0l7O.js").then(e=>e.f);return{apiService:s}},__vite__mapDeps([0,1])).then(({apiService:s})=>{s.getAnimeInfo(n.animeId).then(e=>{e&&e.data&&(t.data={...a,status:e.data.status,broadcast:e.data.broadcast,episodes:e.data.episodes,score:e.data.score})})})}):i.innerHTML='<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'}if(l==="settings"){const d=await p.getSetting("theme","dark"),n=await p.getSetting("audio_pref","sub");i.innerHTML=`
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
                <option value="dark" ${d==="dark"?"selected":""}>Modo Oscuro</option>
                <option value="light" ${d==="light"?"selected":""}>Modo Claro</option>
              </select>
            </div>
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.05); margin:30px 0">
            <div style="display:flex; gap:15px; flex-wrap:wrap;">
              <button id="sync-btn" class="btn-v4-primary" style="flex:1; min-width:140px;">Sincronizar Datos</button>
              <button id="reset-db-btn" class="btn-v4-secondary" style="flex:1; min-width:140px; background:rgba(255,165,0,0.1); color:#ffa500; border-color:rgba(255,165,0,0.2)">Restablecer Local</button>
              <button id="logout-btn" class="btn-v4-secondary" style="flex:1; min-width:140px; background:rgba(255,0,0,0.1); color:#ff4444">Cerrar Sesión</button>
            </div>
          </div>
        `,document.getElementById("audio-pref").addEventListener("change",async t=>await p.setSetting("audio_pref",t.target.value)),document.getElementById("theme-pref").addEventListener("change",async t=>{const a=t.target.value;await p.setSetting("theme",a),document.body.classList.toggle("light-theme",a==="light")}),document.getElementById("sync-btn").addEventListener("click",async t=>{t.target.textContent="Procesando...";const a=await p.getAllData();await b.syncWithServer(a),window.location.reload()}),document.getElementById("reset-db-btn").addEventListener("click",async t=>{if(confirm("¿Estás seguro de que deseas restablecer la base de datos local? Tu historial y favoritos se descargarán de nuevo de la nube de forma limpia.")){t.target.textContent="Restableciendo...";try{await(await v(async()=>{const{default:s}=await import("./vendor-DIPEJTOH.js").then(e=>e.d);return{default:s}},[])).default.delete("AniRD_DB"),window.location.reload()}catch(a){alert("Error al restablecer la base de datos: "+a.message),window.location.reload()}}}),document.getElementById("logout-btn").addEventListener("click",()=>b.logout())}};h.forEach(l=>{l.addEventListener("click",()=>x(l.dataset.tab))}),await x("list")}}export{I as default};
