const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-CMAm-BoN.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{_ as b}from"./page-watchpage-CrWFVdXK.js";import{c as y,b as w,d as h}from"./page-homepage-CMAm-BoN.js";class S{constructor(){this.isActive=!1,this.focusedElement=null,this.focusableElements=[],this.handleKeyDownBound=this.handleKeyDown.bind(this),this.mutationObserver=null,this.scrollContainer=null,this.iframeFocused=!1,this._onWindowBlur=this._onWindowBlur.bind(this),this._onWindowFocus=this._onWindowFocus.bind(this)}autoDetect(){const e=navigator.userAgent||"";if(e.includes("AniRD-AndroidMobile")){console.log("📱 [AniRD] App móvil de Android detectada, asegurando modo móvil..."),localStorage.setItem("tvMode","false"),this.destroy();return}const s=e.includes("AniRD-AndroidTV"),f=localStorage.getItem("tvMode")==="true";(s||f)&&(console.log("📺 [AniRD] TV detectado, activando modo TV automáticamente..."),setTimeout(()=>this.init(),150))}init(){this.isActive||(this.isActive=!0,document.body.classList.add("tv-mode"),localStorage.setItem("tvMode","true"),this._updateScrollContainer(),window.addEventListener("keydown",this.handleKeyDownBound,{capture:!0}),this.setupMutationObserver(),this.lockWindowScroll(),window.addEventListener("blur",this._onWindowBlur),window.addEventListener("focus",this._onWindowFocus),setTimeout(()=>{this.updateFocusables(),this.focusFirstAvailable()},350),console.log("📺 AniRD Spatial Navigation (Smart TV Mode) initialized."))}_updateScrollContainer(){this.scrollContainer=document.getElementById("app")||document.body}destroy(){this.isActive&&(this.isActive=!1,document.body.classList.remove("tv-mode"),localStorage.setItem("tvMode","false"),window.removeEventListener("keydown",this.handleKeyDownBound,{capture:!0}),window.removeEventListener("blur",this._onWindowBlur),window.removeEventListener("focus",this._onWindowFocus),this.unlockWindowScroll(),this._iframeEscapeInterval&&(clearInterval(this._iframeEscapeInterval),this._iframeEscapeInterval=null),this.mutationObserver&&(this.mutationObserver.disconnect(),this.mutationObserver=null),this.focusedElement&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null),document.querySelectorAll(".focused").forEach(e=>e.classList.remove("focused")),this.scrollContainer=null,this.iframeFocused=!1,console.log("📺 AniRD Spatial Navigation (Smart TV Mode) destroyed."))}lockWindowScroll(){this.scrollListener=e=>{(window.scrollY!==0||window.scrollX!==0)&&window.scrollTo(0,0),document.documentElement.scrollTop!==0&&(document.documentElement.scrollTop=0),document.body.scrollTop!==0&&(document.body.scrollTop=0)},window.addEventListener("scroll",this.scrollListener,{passive:!0}),window.scrollTo(0,0)}unlockWindowScroll(){this.scrollListener&&(window.removeEventListener("scroll",this.scrollListener,{passive:!0}),this.scrollListener=null)}setupMutationObserver(){this.mutationObserver&&this.mutationObserver.disconnect(),this.mutationObserver=new MutationObserver(()=>{this.updateTimeout&&clearTimeout(this.updateTimeout),this.updateTimeout=setTimeout(()=>{this.isActive&&this.updateFocusables()},200)}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0})}updateFocusables(){if(!this.isActive)return;this._updateScrollContainer(),[".server-pill",".lang-pill",".carousel-btn",".genre-item",".tab-item",".ep-card-animex",".settings-option",".auth-btn"].forEach(r=>{document.querySelectorAll(r).forEach(t=>{t.hasAttribute("tabindex")||t.setAttribute("tabindex","0")})});const s=["a[href]","button",'input:not([type="hidden"])',"select","textarea",'[tabindex]:not([tabindex="-1"])',"anime-card",".anime-card",".episode-btn",".sidebar-link",".search-bar-desktop",".header-profile-btn","#header-tv-toggle",".server-btn",".player-control-btn",".category-item",".sidebar-categories-trigger",".control-btn-v5",".server-pill-v5",".lang-pill-v5",".btn-more-v5",".ep-search-input-v5",".sidebar-icon-btn",".ep-item-horizontal-v5",".related-card-v5",".video-wrapper-v5",".tab-item",'[role="button"]',".server-pill",".lang-pill",".carousel-btn",".genre-item",".settings-option",".auth-btn"].join(", "),f=Array.from(document.querySelectorAll(s));this.focusableElements=f.filter(r=>{if(r.disabled||r.getAttribute("aria-disabled")==="true")return!1;if(r.id==="tv-mode-toggle"||r.id==="header-tv-toggle")return!0;const t=r.getBoundingClientRect();if(t.width===0||t.height===0)return!1;const n=window.getComputedStyle(r);if(n.display==="none"||n.visibility==="hidden"||n.opacity==="0")return!1;let o=r.parentElement;for(;o;){if(window.getComputedStyle(o).display==="none")return!1;o=o.parentElement}return!0}),this.focusedElement&&!this.focusableElements.includes(this.focusedElement)&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null,this.focusFirstAvailable())}focusFirstAvailable(){if(this.focusableElements.length>0){let e=this.focusableElements.find(s=>s.classList.contains("sidebar-link")||s.tagName==="ANIME-CARD"||s.classList.contains("ep-item-horizontal-v5"));e||(e=this.focusableElements[0]),this.focusElement(e)}}focusElement(e){if(e){if(this.focusedElement&&(this.focusedElement.classList.remove("focused"),typeof this.focusedElement.blur=="function"&&this.focusedElement.blur()),this.focusedElement=e,this.focusedElement.classList.add("focused"),typeof this.focusedElement.focus=="function")try{this.focusedElement.focus({preventScroll:!0})}catch{this.focusedElement.focus()}this._scrollElementIntoView(e)}}_scrollElementIntoView(e){const s=this.scrollContainer;if(!s||s===document.body){e.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"});return}const f=s.getBoundingClientRect(),r=e.getBoundingClientRect(),t=r.top-f.top+s.scrollTop,n=t+r.height,o=s.scrollTop+s.clientHeight,i=80;t-i<s.scrollTop?s.scrollTo({top:t-i,behavior:"smooth"}):n+i>o&&s.scrollTo({top:n+i-s.clientHeight,behavior:"smooth"})}_onWindowBlur(){setTimeout(()=>{if(document.activeElement&&document.activeElement.tagName==="IFRAME"){console.log("📺 [AniRD] Foco capturado por iframe — recuperando..."),document.activeElement.blur();const e=document.querySelector(".player-controls-v5 .control-btn-v5");e&&this.focusElement(e)}},150)}_onWindowFocus(){if(document.activeElement&&document.activeElement.tagName==="IFRAME"){document.activeElement.blur();const e=document.querySelector(".player-controls-v5 .control-btn-v5");e&&this.focusElement(e)}}handleKeyDown(e){var r;if(!this.isActive)return;const s=document.activeElement?document.activeElement.tagName:"",f=s==="INPUT"||s==="TEXTAREA";if(s==="IFRAME"){document.activeElement.blur();const t=document.querySelector(".player-controls-v5 .control-btn-v5");t&&this.focusElement(t),e.preventDefault(),e.stopPropagation();return}if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){if(f&&["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault(),e.stopPropagation();const t=e.key.replace("Arrow","").toLowerCase();this.moveFocus(t);return}if(e.key==="Enter"){if(f)return;if(this.focusedElement)if(e.preventDefault(),e.stopPropagation(),this.focusedElement.tagName==="ANIME-CARD"){const t=(r=this.focusedElement.shadowRoot)==null?void 0:r.querySelector("a");t?t.click():this.focusedElement.click()}else if(this.focusedElement.classList.contains("video-wrapper-v5")){console.log("📺 [AniRD] Video seleccionado → Activando pantalla completa CSS");const t=document.getElementById("video-container");if(t){document.body.classList.toggle("tv-fullscreen-active");const n=document.body.classList.contains("tv-fullscreen-active");t.classList.toggle("tv-fullscreen-active",n);const o=document.querySelector("#btn-fullscreen-watch span");o&&(o.textContent=n?"Salir Pantalla":"Pantalla Completa")}return}else this.focusedElement.click();return}if(e.key==="Backspace"||e.key==="Escape"){if(f&&e.key==="Backspace")return;const t=document.getElementById("searchOverlay");if(t&&t.classList.contains("active"))return;const n=document.getElementById("video-container");if(n&&n.classList.contains("tv-fullscreen-active")){n.classList.remove("tv-fullscreen-active"),document.body.classList.remove("tv-fullscreen-active");const o=document.querySelector("#btn-fullscreen-watch span");o&&(o.textContent="Pantalla Completa"),e.preventDefault(),e.stopPropagation();return}e.preventDefault(),e.stopPropagation(),window.history.back()}}moveFocus(e){if(this.updateFocusables(),this.focusableElements.length===0)return;if(!this.focusedElement||!this.focusableElements.includes(this.focusedElement)){this.focusFirstAvailable();return}const s=this.focusedElement.getBoundingClientRect(),f=s.left+s.width/2,r=s.top+s.height/2;let t=null,n=1/0;for(const o of this.focusableElements){if(o===this.focusedElement)continue;const i=o.getBoundingClientRect(),c=i.left+i.width/2,l=i.top+i.height/2,a=c-f,d=l-r;let u=0,m=0,p=!1;switch(e){case"right":a>5&&(u=a,m=Math.abs(d),p=!0);break;case"left":a<-5&&(u=-a,m=Math.abs(d),p=!0);break;case"down":d>5&&(u=d,m=Math.abs(a),p=!0);break;case"up":d<-5&&(u=-d,m=Math.abs(a),p=!0);break}if(p){const v=u+m*3;v<n&&(n=v,t=o)}}if(t)this.focusElement(t);else if((e==="down"||e==="up")&&this.scrollContainer&&this.scrollContainer!==document.body){const o=e==="down"?300:-300;this.scrollContainer.scrollBy({top:o,behavior:"smooth"})}}}const E=new S;if(typeof document<"u"){const g=()=>E.autoDetect();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g,{once:!0}):setTimeout(g,100)}class L{constructor(e){this.params=e,this.user=y.getUser(),this.activeTab="list",this.followedAnimes=[],this.favoriteAnimes=[],this.stats={favs:0,list:0,epis:0}}async render(){if(!this.user)return window.location.href="/auth",document.createElement("div");this.followedAnimes=await w.following.toArray(),this.favoriteAnimes=await w.favorites.toArray(),this.stats={favs:this.favoriteAnimes.length,list:this.followedAnimes.length,epis:await w.history.count()};const e=document.createElement("div");return e.className="page-container",e.innerHTML=`
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
        <button class="tab-btn-v5" data-tab="my-lists">MIS LISTAS</button>
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
    `,e}async afterRender(){const e=document.getElementById("profile-tab-content"),s=document.querySelectorAll(".tab-btn-v5"),f=async t=>{if(this.activeTab=t,s.forEach(n=>n.classList.toggle("active",n.dataset.tab===t)),t==="list"){let o=function(i){if(!i||!i.day||!i.time||!i.timezone)return null;const l={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6}[i.day];if(l===void 0)return null;const[a,d]=i.time.split(":").map(Number),u=new Date(new Date().toLocaleString("en-US",{timeZone:i.timezone}));let m=new Date(u);m.setHours(a,d,0,0);let p=l-u.getDay();(p<0||p===0&&m<u)&&(p+=7),m.setDate(m.getDate()+p);const v=m-u;if(v<=0)return null;const A=Math.floor(v/(1e3*60*60*24)),x=Math.floor(v/(1e3*60*60)%24);return A>0?`${A}d ${x}h para nuevo cap.`:x>0?`${x}h para nuevo cap.`:"¡Nuevo cap en breve!"};e.innerHTML='<div class="grid-v5" id="grid-follow"></div>';const n=document.getElementById("grid-follow");this.followedAnimes.length>0?this.followedAnimes.forEach(i=>{const c=document.createElement("anime-card"),l={mal_id:i.animeId,title:i.title,images:{jpg:{large_image_url:i.cover}}};c.data=l,n.appendChild(c),Promise.all([b(async()=>{const{db:a}=await import("./page-homepage-CMAm-BoN.js").then(d=>d.e);return{db:a}},__vite__mapDeps([0,1])).then(({db:a})=>a.history.where("animeId").equals(String(i.animeId)).reverse().sortBy("timestamp")),b(async()=>{const{apiService:a}=await import("./page-homepage-CMAm-BoN.js").then(d=>d.f);return{apiService:a}},__vite__mapDeps([0,1])).then(({apiService:a})=>a.getAnimeInfo(i.animeId))]).then(([a,d])=>{let u={...l};if(a&&a.length>0&&(u.currentEpisode=a[0].episodeId),d&&d.data)if(d.data.status==="Currently Airing"){const m=o(d.data.broadcast);m&&(u.nextEpisodeText=m),u.status="EN EMISIÓN"}else d.data.status==="Finished Airing"&&(u.status="FINALIZADO");c.data=u})}):e.innerHTML='<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'}if(t==="favs"){e.innerHTML='<div class="grid-v5" id="grid-favs"></div>';const n=document.getElementById("grid-favs");this.favoriteAnimes.length>0?this.favoriteAnimes.forEach(o=>{const i=document.createElement("anime-card"),c={mal_id:o.animeId,title:o.title,images:{jpg:{large_image_url:o.cover}},status:o.status,broadcast:o.broadcast};i.data=c,n.appendChild(i),b(async()=>{const{apiService:l}=await import("./page-homepage-CMAm-BoN.js").then(a=>a.f);return{apiService:l}},__vite__mapDeps([0,1])).then(({apiService:l})=>{l.getAnimeInfo(o.animeId).then(a=>{a&&a.data&&(i.data={...c,status:a.data.status,broadcast:a.data.broadcast,episodes:a.data.episodes,score:a.data.score})})})}):e.innerHTML='<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'}if(t==="my-lists"){const n=await w.lists.orderBy("createdAt").reverse().toArray();e.innerHTML=`
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px;">
            ${n.map(o=>`
              <a href="/lists" data-link class="glass-card-hover" style="display: flex; align-items: center; gap: 14px; padding: 16px 20px; text-decoration: none; min-width: 200px; flex: 1; max-width: 300px;">
                <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(229,9,20,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e50914" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </div>
                <div>
                  <div style="color: white; font-size: 14px; font-weight: 700; font-family: 'Outfit';">${o.name}</div>
                  <div style="color: var(--text-muted); font-size: 11px; font-weight: 600;">${(o.animeIds||[]).length} anime${(o.animeIds||[]).length!==1?"s":""}</div>
                </div>
              </a>
            `).join("")}
          </div>
          <a href="/lists" data-link class="btn-v4-primary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 12px 24px; border-radius: 14px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Gestionar Listas
          </a>
        `}if(t==="settings"){const n=await h.getSetting("theme","dark"),o=await h.getSetting("audio_pref","sub");e.innerHTML=`
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
                <option value="dark" ${n==="dark"?"selected":""}>Modo Oscuro</option>
                <option value="light" ${n==="light"?"selected":""}>Modo Claro</option>
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
        `,document.getElementById("audio-pref").addEventListener("change",async i=>await h.setSetting("audio_pref",i.target.value)),document.getElementById("theme-pref").addEventListener("change",async i=>{const c=i.target.value;await h.setSetting("theme",c),document.body.classList.toggle("light-theme",c==="light")}),document.getElementById("tv-mode-pref").addEventListener("change",i=>{const c=i.target.value==="on";c?E.init():E.destroy();const l=document.getElementById("header-tv-toggle");l&&(c?(l.classList.add("active"),l.style.background="rgba(255, 0, 85, 0.2)",l.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",l.style.border="1px solid rgba(255, 0, 85, 0.4)"):(l.classList.remove("active"),l.style.background="rgba(255,255,255,0.05)",l.style.boxShadow="none",l.style.border="none"))}),document.getElementById("sync-btn").addEventListener("click",async i=>{i.target.textContent="Procesando...";const c=await h.getAllData();await y.syncWithServer(c),window.location.reload()}),document.getElementById("reset-db-btn").addEventListener("click",async i=>{if(confirm("¿Estás seguro de que deseas restablecer la base de datos local? Tu historial y favoritos se descargarán de nuevo de la nube de forma limpia.")){i.target.textContent="Restableciendo...";try{await(await b(async()=>{const{default:l}=await import("./vendor-DIPEJTOH.js").then(a=>a.d);return{default:l}},[])).default.delete("AniRD_DB"),window.location.reload()}catch(c){alert("Error al restablecer la base de datos: "+c.message),window.location.reload()}}}),document.getElementById("logout-btn").addEventListener("click",()=>y.logout())}};s.forEach(t=>{t.addEventListener("click",()=>f(t.dataset.tab))});const r=document.getElementById("sync-btn-profile-mobile");r&&r.addEventListener("click",async()=>{const t=r.innerHTML;r.innerHTML="Sincronizando...";try{const n=await h.getAllData();await y.syncWithServer(n),r.innerHTML="¡Sincronizado con éxito!",setTimeout(()=>{window.location.reload()},1500)}catch(n){r.innerHTML=`Error: ${n.message}`,setTimeout(()=>{r.innerHTML=t},3e3)}}),await f("list")}}const k=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));export{k as P,E as s};
