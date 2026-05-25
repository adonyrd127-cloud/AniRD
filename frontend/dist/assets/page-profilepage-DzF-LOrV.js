const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-homepage-ENQx0n2_.js","assets/vendor-DIPEJTOH.js"])))=>i.map(i=>d[i]);
import{_ as g}from"./page-watchpage-Bo7CmYKv.js";import{c as y,b as E,d as h}from"./page-homepage-ENQx0n2_.js";class S{constructor(){this.isActive=!1,this.focusedElement=null,this.focusableElements=[],this.handleKeyDownBound=this.handleKeyDown.bind(this),this.mutationObserver=null,this.scrollContainer=null,this.iframeFocused=!1,this._onWindowBlur=this._onWindowBlur.bind(this),this._onWindowFocus=this._onWindowFocus.bind(this)}autoDetect(){const e=navigator.userAgent||"";if(e.includes("AniRD-AndroidMobile")){console.log("📱 [AniRD] App móvil de Android detectada, asegurando modo móvil..."),localStorage.setItem("tvMode","false"),this.destroy();return}const i=e.includes("AniRD-AndroidTV"),l=localStorage.getItem("tvMode")==="true";(i||l)&&(console.log("📺 [AniRD] TV detectado, activando modo TV automáticamente..."),setTimeout(()=>this.init(),150))}init(){this.isActive||(this.isActive=!0,document.body.classList.add("tv-mode"),localStorage.setItem("tvMode","true"),this._updateScrollContainer(),window.addEventListener("keydown",this.handleKeyDownBound,{capture:!0}),this.setupMutationObserver(),this.lockWindowScroll(),window.addEventListener("blur",this._onWindowBlur),window.addEventListener("focus",this._onWindowFocus),setTimeout(()=>{this.updateFocusables(),this.focusFirstAvailable()},350),console.log("📺 AniRD Spatial Navigation (Smart TV Mode) initialized."))}_updateScrollContainer(){this.scrollContainer=document.getElementById("app")||document.body}destroy(){this.isActive&&(this.isActive=!1,document.body.classList.remove("tv-mode"),localStorage.setItem("tvMode","false"),window.removeEventListener("keydown",this.handleKeyDownBound,{capture:!0}),window.removeEventListener("blur",this._onWindowBlur),window.removeEventListener("focus",this._onWindowFocus),this.unlockWindowScroll(),this._iframeEscapeInterval&&(clearInterval(this._iframeEscapeInterval),this._iframeEscapeInterval=null),this.mutationObserver&&(this.mutationObserver.disconnect(),this.mutationObserver=null),this.focusedElement&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null),document.querySelectorAll(".focused").forEach(e=>e.classList.remove("focused")),this.scrollContainer=null,this.iframeFocused=!1,console.log("📺 AniRD Spatial Navigation (Smart TV Mode) destroyed."))}lockWindowScroll(){this.scrollListener=e=>{(window.scrollY!==0||window.scrollX!==0)&&window.scrollTo(0,0),document.documentElement.scrollTop!==0&&(document.documentElement.scrollTop=0),document.body.scrollTop!==0&&(document.body.scrollTop=0)},window.addEventListener("scroll",this.scrollListener,{passive:!0}),window.scrollTo(0,0)}unlockWindowScroll(){this.scrollListener&&(window.removeEventListener("scroll",this.scrollListener,{passive:!0}),this.scrollListener=null)}setupMutationObserver(){this.mutationObserver&&this.mutationObserver.disconnect(),this.mutationObserver=new MutationObserver(()=>{this.updateTimeout&&clearTimeout(this.updateTimeout),this.updateTimeout=setTimeout(()=>{this.isActive&&this.updateFocusables()},200)}),this.mutationObserver.observe(document.body,{childList:!0,subtree:!0})}updateFocusables(){if(!this.isActive)return;this._updateScrollContainer();const e=["a[href]","button",'input:not([type="hidden"])',"select","textarea",'[tabindex]:not([tabindex="-1"])',"anime-card",".anime-card",".episode-btn",".sidebar-link",".search-bar-desktop",".header-profile-btn","#header-tv-toggle",".server-btn",".player-control-btn",".category-item",".sidebar-categories-trigger",".control-btn-v5",".server-pill-v5",".lang-pill-v5",".btn-more-v5",".ep-search-input-v5",".sidebar-icon-btn",".ep-item-horizontal-v5",".related-card-v5",".video-wrapper-v5",".tab-item",'[role="button"]'].join(", "),i=Array.from(document.querySelectorAll(e));this.focusableElements=i.filter(l=>{if(l.disabled||l.getAttribute("aria-disabled")==="true")return!1;if(l.id==="tv-mode-toggle"||l.id==="header-tv-toggle")return!0;const d=l.getBoundingClientRect();if(d.width===0||d.height===0)return!1;const o=window.getComputedStyle(l);if(o.display==="none"||o.visibility==="hidden"||o.opacity==="0")return!1;let n=l.parentElement;for(;n;){if(window.getComputedStyle(n).display==="none")return!1;n=n.parentElement}return!0}),this.focusedElement&&!this.focusableElements.includes(this.focusedElement)&&(this.focusedElement.classList.remove("focused"),this.focusedElement=null,this.focusFirstAvailable())}focusFirstAvailable(){if(this.focusableElements.length>0){let e=this.focusableElements.find(i=>i.classList.contains("sidebar-link")||i.tagName==="ANIME-CARD"||i.classList.contains("ep-item-horizontal-v5"));e||(e=this.focusableElements[0]),this.focusElement(e)}}focusElement(e){if(e){if(this.focusedElement&&(this.focusedElement.classList.remove("focused"),typeof this.focusedElement.blur=="function"&&this.focusedElement.blur()),this.focusedElement=e,this.focusedElement.classList.add("focused"),typeof this.focusedElement.focus=="function")try{this.focusedElement.focus({preventScroll:!0})}catch{this.focusedElement.focus()}this._scrollElementIntoView(e)}}_scrollElementIntoView(e){const i=this.scrollContainer;if(!i||i===document.body){e.scrollIntoView({behavior:"smooth",block:"nearest",inline:"nearest"});return}const l=i.getBoundingClientRect(),d=e.getBoundingClientRect(),o=d.top-l.top+i.scrollTop,n=o+d.height,a=i.scrollTop+i.clientHeight,t=80;o-t<i.scrollTop?i.scrollTo({top:o-t,behavior:"smooth"}):n+t>a&&i.scrollTo({top:n+t-i.clientHeight,behavior:"smooth"})}_onWindowBlur(){setTimeout(()=>{if(document.activeElement&&document.activeElement.tagName==="IFRAME"){console.log("📺 [AniRD] Foco capturado por iframe — recuperando..."),document.activeElement.blur();const e=document.querySelector(".player-controls-v5 .control-btn-v5");e&&this.focusElement(e)}},150)}_onWindowFocus(){if(document.activeElement&&document.activeElement.tagName==="IFRAME"){document.activeElement.blur();const e=document.querySelector(".player-controls-v5 .control-btn-v5");e&&this.focusElement(e)}}handleKeyDown(e){var d;if(!this.isActive)return;const i=document.activeElement?document.activeElement.tagName:"",l=i==="INPUT"||i==="TEXTAREA";if(i==="IFRAME"){document.activeElement.blur();const o=document.querySelector(".player-controls-v5 .control-btn-v5");o&&this.focusElement(o),e.preventDefault(),e.stopPropagation();return}if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){if(l&&["ArrowLeft","ArrowRight"].includes(e.key))return;e.preventDefault(),e.stopPropagation();const o=e.key.replace("Arrow","").toLowerCase();this.moveFocus(o);return}if(e.key==="Enter"){if(l)return;if(this.focusedElement)if(e.preventDefault(),e.stopPropagation(),this.focusedElement.tagName==="ANIME-CARD"){const o=(d=this.focusedElement.shadowRoot)==null?void 0:d.querySelector("a");o?o.click():this.focusedElement.click()}else if(this.focusedElement.classList.contains("video-wrapper-v5")){console.log("📺 [AniRD] Video seleccionado → Activando pantalla completa CSS");const o=document.getElementById("video-container");if(o){document.body.classList.toggle("tv-fullscreen-active");const n=document.body.classList.contains("tv-fullscreen-active");o.classList.toggle("tv-fullscreen-active",n);const a=document.querySelector("#btn-fullscreen-watch span");a&&(a.textContent=n?"Salir Pantalla":"Pantalla Completa")}return}else this.focusedElement.click();return}if(e.key==="Backspace"||e.key==="Escape"){if(l&&e.key==="Backspace")return;const o=document.getElementById("searchOverlay");if(o&&o.classList.contains("active"))return;const n=document.getElementById("video-container");if(n&&n.classList.contains("tv-fullscreen-active")){n.classList.remove("tv-fullscreen-active"),document.body.classList.remove("tv-fullscreen-active");const a=document.querySelector("#btn-fullscreen-watch span");a&&(a.textContent="Pantalla Completa"),e.preventDefault(),e.stopPropagation();return}e.preventDefault(),e.stopPropagation(),window.history.back()}}moveFocus(e){if(this.updateFocusables(),this.focusableElements.length===0)return;if(!this.focusedElement||!this.focusableElements.includes(this.focusedElement)){this.focusFirstAvailable();return}const i=this.focusedElement.getBoundingClientRect(),l=i.left+i.width/2,d=i.top+i.height/2;let o=null,n=1/0;for(const a of this.focusableElements){if(a===this.focusedElement)continue;const t=a.getBoundingClientRect(),c=t.left+t.width/2,r=t.top+t.height/2,s=c-l,u=r-d;let f=0,m=0,v=!1;switch(e){case"right":s>5&&(f=s,m=Math.abs(u),v=!0);break;case"left":s<-5&&(f=-s,m=Math.abs(u),v=!0);break;case"down":u>5&&(f=u,m=Math.abs(s),v=!0);break;case"up":u<-5&&(f=-u,m=Math.abs(s),v=!0);break}if(v){const p=f+m*3;p<n&&(n=p,o=a)}}if(o)this.focusElement(o);else if((e==="down"||e==="up")&&this.scrollContainer&&this.scrollContainer!==document.body){const a=e==="down"?300:-300;this.scrollContainer.scrollBy({top:a,behavior:"smooth"})}}}const x=new S;if(typeof document<"u"){const b=()=>x.autoDetect();document.readyState==="loading"?document.addEventListener("DOMContentLoaded",b,{once:!0}):setTimeout(b,100)}class L{constructor(e){this.params=e,this.user=y.getUser(),this.activeTab="list",this.followedAnimes=[],this.favoriteAnimes=[],this.stats={favs:0,list:0,epis:0}}async render(){if(!this.user)return window.location.href="/auth",document.createElement("div");this.followedAnimes=await E.following.toArray(),this.favoriteAnimes=await E.favorites.toArray(),this.stats={favs:this.favoriteAnimes.length,list:this.followedAnimes.length,epis:await E.history.count()};const e=document.createElement("div");return e.className="page-container",e.innerHTML=`
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
    `,e}async afterRender(){const e=document.getElementById("profile-tab-content"),i=document.querySelectorAll(".tab-btn-v5"),l=async o=>{if(this.activeTab=o,i.forEach(n=>n.classList.toggle("active",n.dataset.tab===o)),o==="list"){let a=function(t){if(!t||!t.day||!t.time||!t.timezone)return null;const r={Sundays:0,Mondays:1,Tuesdays:2,Wednesdays:3,Thursdays:4,Fridays:5,Saturdays:6}[t.day];if(r===void 0)return null;const[s,u]=t.time.split(":").map(Number),f=new Date(new Date().toLocaleString("en-US",{timeZone:t.timezone}));let m=new Date(f);m.setHours(s,u,0,0);let v=r-f.getDay();(v<0||v===0&&m<f)&&(v+=7),m.setDate(m.getDate()+v);const p=m-f;if(p<=0)return null;const A=Math.floor(p/(1e3*60*60*24)),w=Math.floor(p/(1e3*60*60)%24);return A>0?`${A}d ${w}h para nuevo cap.`:w>0?`${w}h para nuevo cap.`:"¡Nuevo cap en breve!"};e.innerHTML='<div class="grid-v5" id="grid-follow"></div>';const n=document.getElementById("grid-follow");this.followedAnimes.length>0?this.followedAnimes.forEach(t=>{const c=document.createElement("anime-card"),r={mal_id:t.animeId,title:t.title,images:{jpg:{large_image_url:t.cover}}};c.data=r,n.appendChild(c),Promise.all([g(async()=>{const{db:s}=await import("./page-homepage-ENQx0n2_.js").then(u=>u.e);return{db:s}},__vite__mapDeps([0,1])).then(({db:s})=>s.history.where("animeId").equals(String(t.animeId)).reverse().sortBy("timestamp")),g(async()=>{const{apiService:s}=await import("./page-homepage-ENQx0n2_.js").then(u=>u.f);return{apiService:s}},__vite__mapDeps([0,1])).then(({apiService:s})=>s.getAnimeInfo(t.animeId))]).then(([s,u])=>{let f={...r};if(s&&s.length>0&&(f.currentEpisode=s[0].episodeId),u&&u.data)if(u.data.status==="Currently Airing"){const m=a(u.data.broadcast);m&&(f.nextEpisodeText=m),f.status="EN EMISIÓN"}else u.data.status==="Finished Airing"&&(f.status="FINALIZADO");c.data=f})}):e.innerHTML='<p style="color:var(--text-muted)">Tu lista de seguimiento está vacía.</p>'}if(o==="favs"){e.innerHTML='<div class="grid-v5" id="grid-favs"></div>';const n=document.getElementById("grid-favs");this.favoriteAnimes.length>0?this.favoriteAnimes.forEach(a=>{const t=document.createElement("anime-card"),c={mal_id:a.animeId,title:a.title,images:{jpg:{large_image_url:a.cover}},status:a.status,broadcast:a.broadcast};t.data=c,n.appendChild(t),g(async()=>{const{apiService:r}=await import("./page-homepage-ENQx0n2_.js").then(s=>s.f);return{apiService:r}},__vite__mapDeps([0,1])).then(({apiService:r})=>{r.getAnimeInfo(a.animeId).then(s=>{s&&s.data&&(t.data={...c,status:s.data.status,broadcast:s.data.broadcast,episodes:s.data.episodes,score:s.data.score})})})}):e.innerHTML='<p style="color:var(--text-muted)">Aún no tienes favoritos.</p>'}if(o==="settings"){const n=await h.getSetting("theme","dark"),a=await h.getSetting("audio_pref","sub");e.innerHTML=`
          <div class="settings-card-v5 page-enter">
            <h3 style="margin-bottom:30px; font-family:'Outfit'">Configuración Premium</h3>
            <div class="settings-item-v4">
              <label>Audio por defecto</label>
              <select id="audio-pref" class="select-v4">
                <option value="sub" ${a==="sub"?"selected":""}>Subtitulado (Japonés)</option>
                <option value="dub" ${a==="dub"?"selected":""}>Latino (Doblaje)</option>
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
        `,document.getElementById("audio-pref").addEventListener("change",async t=>await h.setSetting("audio_pref",t.target.value)),document.getElementById("theme-pref").addEventListener("change",async t=>{const c=t.target.value;await h.setSetting("theme",c),document.body.classList.toggle("light-theme",c==="light")}),document.getElementById("tv-mode-pref").addEventListener("change",t=>{const c=t.target.value==="on";c?x.init():x.destroy();const r=document.getElementById("header-tv-toggle");r&&(c?(r.classList.add("active"),r.style.background="rgba(255, 0, 85, 0.2)",r.style.boxShadow="0 0 15px rgba(255, 0, 85, 0.4)",r.style.border="1px solid rgba(255, 0, 85, 0.4)"):(r.classList.remove("active"),r.style.background="rgba(255,255,255,0.05)",r.style.boxShadow="none",r.style.border="none"))}),document.getElementById("sync-btn").addEventListener("click",async t=>{t.target.textContent="Procesando...";const c=await h.getAllData();await y.syncWithServer(c),window.location.reload()}),document.getElementById("reset-db-btn").addEventListener("click",async t=>{if(confirm("¿Estás seguro de que deseas restablecer la base de datos local? Tu historial y favoritos se descargarán de nuevo de la nube de forma limpia.")){t.target.textContent="Restableciendo...";try{await(await g(async()=>{const{default:r}=await import("./vendor-DIPEJTOH.js").then(s=>s.d);return{default:r}},[])).default.delete("AniRD_DB"),window.location.reload()}catch(c){alert("Error al restablecer la base de datos: "+c.message),window.location.reload()}}}),document.getElementById("logout-btn").addEventListener("click",()=>y.logout())}};i.forEach(o=>{o.addEventListener("click",()=>l(o.dataset.tab))});const d=document.getElementById("sync-btn-profile-mobile");d&&d.addEventListener("click",async()=>{const o=d.innerHTML;d.innerHTML="Sincronizando...";try{const n=await h.getAllData();await y.syncWithServer(n),d.innerHTML="¡Sincronizado con éxito!",setTimeout(()=>{window.location.reload()},1500)}catch(n){d.innerHTML=`Error: ${n.message}`,setTimeout(()=>{d.innerHTML=o},3e3)}}),await l("list")}}const _=Object.freeze(Object.defineProperty({__proto__:null,default:L},Symbol.toStringTag,{value:"Module"}));export{_ as P,x as s};
