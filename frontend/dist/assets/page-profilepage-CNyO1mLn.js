const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-HfrhAw2J.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{_ as g}from"./page-favoritespage-BsIX1kVp.js";import{c as b,b as w,d as h}from"./page-homepage-HfrhAw2J.js";class S{constructor(){this.isActive=!1,this.focusedElement=null,this.focusableElements=[],this.handleKeyDownBound=this.handleKeyDown.bind(this),this.mutationObserver=null}init(){this.isActive||(this.isActive=!0,document.body.classList.add("tv-mode"),localStorage.setItem("tvMode","true"),window.addEventListener("keydown",this.handleKeyDownBound,{capture:!0}),this.setupMutationObserver(),setTimeout(()=>{this.updateFocusables(),this.focusFirstAvailable()},300),console.log("📺 AniRD Spatial Navigation (Smart TV Mode) initialized."))}destroy(){if(!this.isActive)return;this.isActive=!1,document.body.classList.remove("tv-mode"),localStorage.setItem("tvMode","false"),window.removeEventListener("keydown",this.handleKeyDownBound,{capture:!0}),this.mutationObserver&&(this.mutationObserver.disconnect(),this.mutationObserver=null),this.focusedElement&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null),document.querySelectorAll(".focused").forEach(r=>r.classList.remove("focused")),console.log("📺 AniRD Spatial Navigation (Smart TV Mode) destroyed.")}setupMutationObserver(){this.mutationObserver&&this.mutationObserver.disconnect(),this.mutationObserver=new MutationObserver(()=>{this.updateTimeout&&clearTimeout(this.updateTimeout),this.updateTimeout=setTimeout(()=>{this.isActive&&this.updateFocusables()},200)}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0})}updateFocusables(){if(!this.isActive)return;const e=["a[href]","button",'input:not([type="hidden"])',"select","textarea",'[tabindex]:not([tabindex="-1"])',"anime-card",".anime-card",".episode-btn",".sidebar-link",".search-bar-desktop",".header-profile-btn","#header-tv-toggle",".server-btn",".player-control-btn",".category-item",".sidebar-categories-trigger",".control-btn-v5",".server-pill-v5",".lang-pill-v5",".btn-more-v5",".ep-search-input-v5",".sidebar-icon-btn",".ep-item-horizontal-v5",".related-card-v5",".video-wrapper-v5",'[role="button"]'].join(", "),r=Array.from(document.querySelectorAll(e));this.focusableElements=r.filter(d=>{if(d.disabled||d.getAttribute("aria-disabled")==="true")return!1;if(d.id==="tv-mode-toggle"||d.id==="header-tv-toggle")return!0;const f=d.getBoundingClientRect();if(f.width===0||f.height===0)return!1;const s=window.getComputedStyle(d);if(s.display==="none"||s.visibility==="hidden"||s.opacity==="0")return!1;let o=d.parentElement;for(;o;){if(window.getComputedStyle(o).display==="none")return!1;o=o.parentElement}return!0}),this.focusedElement&&!this.focusableElements.includes(this.focusedElement)&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null,this.focusFirstAvailable())}focusFirstAvailable(){if(this.focusableElements.length>0){let e=this.focusableElements.find(r=>r.classList.contains("sidebar-link")||r.tagName==="ANIME-CARD"||r.classList.contains("ep-item-horizontal-v5"));e||(e=this.focusableElements[0]),this.focusElement(e)}}focusElement(e){e&&(this.focusedElement&&(this.focusedElement.classList.remove("focused"),typeof this.focusedElement.blur=="function"&&this.focusedElement.blur()),this.focusedElement=e,this.focusedElement.classList.add("focused"),typeof this.focusedElement.focus=="function"&&this.focusedElement.focus(),this.focusedElement.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"}))}handleKeyDown(e){var f;if(!this.isActive)return;const r=document.activeElement?document.activeElement.tagName:"",d=r==="INPUT"||r==="TEXTAREA";if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){if(d&&["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault(),e.stopPropagation();const s=e.key.replace("Arrow","").toLowerCase();this.moveFocus(s);return}if(e.key==="Enter"){if(d)return;if(this.focusedElement)if(e.preventDefault(),e.stopPropagation(),console.log("📺 TV D-pad Select: Enter key triggered on element:",this.focusedElement),this.focusedElement.tagName==="ANIME-CARD"){const s=(f=this.focusedElement.shadowRoot)==null?void 0:f.querySelector("a");s?s.click():this.focusedElement.click()}else if(this.focusedElement.classList.contains("video-wrapper-v5")){const s=this.focusedElement.querySelector("iframe");if(s){console.log("📺 TV D-pad: Transferring focus to video iframe."),s.focus();return}}else this.focusedElement.click();return}if(e.key==="Backspace"||e.key==="Escape"){if(d&&e.key==="Backspace")return;const s=document.getElementById("searchOverlay");if(s&&s.classList.contains("active"))return;e.preventDefault(),e.stopPropagation(),console.log("📺 TV D-pad Back: navigating history back"),window.history.back()}}moveFocus(e){if(this.updateFocusables(),this.focusableElements.length===0)return;if(!this.focusedElement||!this.focusableElements.includes(this.focusedElement)){this.focusFirstAvailable();return}const r=this.focusedElement.getBoundingClientRect(),d=r.left+r.width/2,f=r.top+r.height/2;let s=null,o=1/0;for(const c of this.focusableElements){if(c===this.focusedElement)continue;const t=c.getBoundingClientRect(),n=t.left+t.width/2,a=t.top+t.height/2,i=n-d,l=a-f;let u=0,p=0,m=!1;switch(e){case"right":i>5&&(u=i,p=Math.abs(l),m=!0);break;case"left":i<-5&&(u=-i,p=Math.abs(l),m=!0);break;case"down":l>5&&(u=l,p=Math.abs(i),m=!0);break;case"up":l<-5&&(u=-l,p=Math.abs(i),m=!0);break}if(m){const v=u+p*3;v<o&&(o=v,s=c)}}s?this.focusElement(s):console.log(`📺 No focusable candidate found in direction: ${e}`)}}const x=new S;class k{constructor(e){this.params=e,this.user=b.getUser(),this.activeTab="list",this.followedAnimes=[],this.favoriteAnimes=[],this.stats={favs:0,list:0,epis:0}}async render(){if(!this.user)return window.location.href="/auth",document.createElement("div");this.followedAnimes=await w.following.toArray(),this.favoriteAnimes=await w.favorites.toArray(),this.stats={favs:this.favoriteAnimes.length,list:this.followedAnimes.length,epis:await w.history.count()};const e=document.createElement("div");return e.className="page-container",e.innerHTML=`
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
    `,e}async afterRender(){const e=document.getElementById("profile-tab-content"),r=document.querySelectorAll(".tab-btn-v5"),d=async s=>{if(this.activeTab=s,r.forEach(o=>o.classList.toggle("active",o.dataset.tab===s)),s==="list"){let c=function(t){if(!t||!t.day||!t.time||!t.timezone)return null;const a={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6}[t.day];if(a===void 0)return null;const[i,l]=t.time.split(":").map(Number),u=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone}));let p=new Date(u);p.setHours(i,l,0,0);let m=a-u.getDay();(m<0||m===0&&p<u)&&(m+=7),p.setDate(p.getDate()+m);const v=p-u;if(v<=0)return null;const E=Math.floor(v/(1e3*60*60*24)),y=Math.floor(v/(1e3*60*60)%24);return E>0?`${E}d ${y}h para nuevo cap.`:y>0?`${y}h para nuevo cap.`:"¡Nuevo cap en breve!"};e.innerHTML='<div class="grid-v5" id="grid-follow"></div>';const o=document.getElementById("grid-follow");this.followedAnimes.length>0?this.followedAnimes.forEach(t=>{const n=document.createElement("anime-card"),a={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}}};n.data=a,o.appendChild(n),Promise.all([g(async()=>{const{db:i}=await import("./page-homepage-HfrhAw2J.js").then(l=>l.e);return{db:i}},__vite__mapDeps([0,1])).then(({db:i})=>i.history.where("animeId").equals(String(t.animeId)).reverse().sortBy("timestamp")),g(async()=>{const{apiService:i}=await import("./page-homepage-HfrhAw2J.js").then(l=>l.f);return{apiService:i}},__vite__mapDeps([0,1])).then(({apiService:i})=>i.getAnimeInfo(t.animeId))]).then(([i,l])=>{let u={...a};if(i&&i.length>0&&(u.currentEpisode=i[0].episodeId),l&&l.data)if(l.data.status==="Currently Airing"){const p=c(l.data.broadcast);p&&(u.nextEpisodeText=p),u.status="EN EMISIÓN"}else l.data.status==="Finished Airing"&&(u.status="FINALIZADO");n.data=u})}):e.innerHTML='<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'}if(s==="favs"){e.innerHTML='<div class="grid-v5" id="grid-favs"></div>';const o=document.getElementById("grid-favs");this.favoriteAnimes.length>0?this.favoriteAnimes.forEach(c=>{const t=document.createElement("anime-card"),n={mal_id:c.animeId,title:c.title,images:{jpg:{large_image_url:c.cover}},status:c.status,broadcast:c.broadcast};t.data=n,o.appendChild(t),g(async()=>{const{apiService:a}=await import("./page-homepage-HfrhAw2J.js").then(i=>i.f);return{apiService:a}},__vite__mapDeps([0,1])).then(({apiService:a})=>{a.getAnimeInfo(c.animeId).then(i=>{i&&i.data&&(t.data={...n,status:i.data.status,broadcast:i.data.broadcast,episodes:i.data.episodes,score:i.data.score})})})}):e.innerHTML='<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'}if(s==="settings"){const o=await h.getSetting("theme","dark"),c=await h.getSetting("audio_pref","sub");e.innerHTML=`
          <div class="settings-card-v5 page-enter">
            <h3 style="margin-bottom:30px; font-family:'Outfit'">Configuración Premium</h3>
            <div class="settings-item-v4">
              <label>Audio por defecto</label>
              <select id="audio-pref" class="select-v4">
                <option value="sub" ${c==="sub"?"selected":""}>Subtitulado (Japonés)</option>
                <option value="dub" ${c==="dub"?"selected":""}>Latino (Doblaje)</option>
              </select>
            </div>
            <div class="settings-item-v4">
              <label>Tema visual</label>
              <select id="theme-pref" class="select-v4">
                <option value="dark" ${o==="dark"?"selected":""}>Modo Oscuro</option>
                <option value="light" ${o==="light"?"selected":""}>Modo Claro</option>
              </select>
            </div>
            <div class="settings-item-v4">
              <label>Modo Smart TV (Control D-Pad)</label>
              <select id="tv-mode-pref" class="select-v4">
                <option value="off" ${localStorage.getItem("tvMode")!=="true"?"selected":""}>Apagado (PC / Móvil)</option>
                <option value="on" ${localStorage.getItem("tvMode")==="true"?"selected":""}>Encendido (Modo TV)</option>
              </select>
            </div>
            <hr style="border:none; border-top:1px solid rgba(255,255,255,0.05); margin:30px 0">
            <div style="display:flex; gap:15px; flex-wrap:wrap;">
              <button id="sync-btn" class="btn-v4-primary" style="flex:1; min-width:140px;">Sincronizar Datos</button>
              <button id="reset-db-btn" class="btn-v4-secondary" style="flex:1; min-width:140px; background:rgba(255,165,0,0.1); color:#ffa500; border-color:rgba(255,165,0,0.2)">Restablecer Local</button>
              <button id="logout-btn" class="btn-v4-secondary" style="flex:1; min-width:140px; background:rgba(255,0,0,0.1); color:#ff4444">Cerrar Sesión</button>
            </div>
          </div>
        `,document.getElementById("audio-pref").addEventListener("change",async t=>await h.setSetting("audio_pref",t.target.value)),document.getElementById("theme-pref").addEventListener("change",async t=>{const n=t.target.value;await h.setSetting("theme",n),document.body.classList.toggle("light-theme",n==="light")}),document.getElementById("tv-mode-pref").addEventListener("change",t=>{const n=t.target.value==="on";n?x.init():x.destroy();const a=document.getElementById("header-tv-toggle");a&&(n?(a.classList.add("active"),a.style.background="rgba(255, 0, 85, 0.2)",a.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",a.style.border="1px solid rgba(255, 0, 85, 0.4)"):(a.classList.remove("active"),a.style.background="rgba(255,255,255,0.05)",a.style.boxShadow="none",a.style.border="none"))}),document.getElementById("sync-btn").addEventListener("click",async t=>{t.target.textContent="Procesando...";const n=await h.getAllData();await b.syncWithServer(n),window.location.reload()}),document.getElementById("reset-db-btn").addEventListener("click",async t=>{if(confirm("¿Estás seguro de que deseas restablecer la base de datos local? Tu historial y favoritos se descargarán de nuevo de la nube de forma limpia.")){t.target.textContent="Restableciendo...";try{await(await g(async()=>{const{default:a}=await import("./vendor-DIPEJTOH.js").then(i=>i.d);return{default:a}},[])).default.delete("AniRD_DB"),window.location.reload()}catch(n){alert("Error al restablecer la base de datos: "+n.message),window.location.reload()}}}),document.getElementById("logout-btn").addEventListener("click",()=>b.logout())}};r.forEach(s=>{s.addEventListener("click",()=>d(s.dataset.tab))});const f=document.getElementById("sync-btn-profile-mobile");f&&f.addEventListener("click",async()=>{const s=f.innerHTML;f.innerHTML="Sincronizando...";try{const o=await h.getAllData();await b.syncWithServer(o),f.innerHTML="¡Sincronizado con éxito!",setTimeout(()=>{window.location.reload()},1500)}catch(o){f.innerHTML=`Error: ${o.message}`,setTimeout(()=>{f.innerHTML=s},3e3)}}),await d("list")}}const D=Object.freeze(Object.defineProperty({__proto__:null,default:k},Symbol.toStringTag,{value:"Module"}));export{D as P,x as s};
