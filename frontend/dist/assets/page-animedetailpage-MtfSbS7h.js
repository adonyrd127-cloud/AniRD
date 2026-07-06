import{d as u,a as b,b as T}from"./page-homepage-hw3Gvt4E.js";let v=null,z=[],L=!1;const S={success:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',error:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',notification:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'},E={success:{bg:"rgba(70, 211, 105, 0.12)",border:"rgba(70, 211, 105, 0.3)",text:"#46d369",icon:"#46d369"},error:{bg:"rgba(229, 9, 20, 0.12)",border:"rgba(229, 9, 20, 0.3)",text:"#e50914",icon:"#e50914"},info:{bg:"rgba(59, 130, 246, 0.12)",border:"rgba(59, 130, 246, 0.3)",text:"#60a5fa",icon:"#60a5fa"},warning:{bg:"rgba(232, 124, 3, 0.12)",border:"rgba(232, 124, 3, 0.3)",text:"#e87c03",icon:"#e87c03"},notification:{bg:"rgba(229, 9, 20, 0.12)",border:"rgba(229, 9, 20, 0.25)",text:"#ffffff",icon:"#e50914"}};function B(){return v||(v=document.createElement("div"),v.id="anird-toast-container",v.innerHTML=`<style>
    #anird-toast-container {
      position: fixed; top: 84px; right: 20px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px;
      pointer-events: none; max-width: 380px; width: 100%;
      padding-top: 0;
    }
    .anird-toast {
      pointer-events: auto;
      display: flex; align-items: flex-start; gap: 12px;
      padding: 14px 18px;
      border-radius: 14px;
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
      animation: toastSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      transform: translateX(120%);
      opacity: 0;
      cursor: default;
      position: relative;
      overflow: hidden;
    }
    .anird-toast.removing {
      animation: toastSlideOut 0.35s cubic-bezier(0.55, 0, 1, 0.45) forwards;
    }
    .anird-toast .toast-icon {
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 10px; margin-top: 1px;
    }
    .anird-toast .toast-content { flex: 1; min-width: 0; }
    .anird-toast .toast-title {
      font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
      color: #ffffff; margin-bottom: 3px; line-height: 1.3;
    }
    .anird-toast .toast-message {
      font-size: 12px; color: #a1a1aa; line-height: 1.4;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .anird-toast .toast-close {
      flex-shrink: 0; background: none; border: none; color: #6b6b6b; cursor: pointer;
      padding: 4px; border-radius: 6px; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .anird-toast .toast-close:hover { color: white; background: rgba(255,255,255,0.08); }
    .anird-toast .toast-progress {
      position: absolute; bottom: 0; left: 0; height: 2px;
      border-radius: 0 0 14px 14px; animation: toastProgress var(--duration) linear forwards;
    }
    .anird-toast .toast-action {
      display: inline-flex; align-items: center; gap: 4px;
      margin-top: 8px; padding: 5px 12px; border-radius: 8px;
      font-size: 11px; font-weight: 700; cursor: pointer;
      border: none; transition: all 0.2s; text-decoration: none;
    }
    .anird-toast .toast-action:hover { filter: brightness(1.2); }

    @keyframes toastSlideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes toastSlideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(120%); opacity: 0; }
    }
    @keyframes toastProgress {
      from { width: 100%; }
      to { width: 0%; }
    }

    @media (max-width: 480px) {
      #anird-toast-container { right: 10px; left: 10px; max-width: none; }
      .anird-toast { padding: 12px 14px; }
    }
  </style>`,document.body.appendChild(v),v)}function I(){if(L||z.length===0)return;L=!0;const s=z.shift();O(s)}function O({type:s="info",title:a="",message:n="",duration:l=4e3,action:t=null,onClose:r=null}){const p=B(),e=E[s]||E.info,d=S[s]||S.info,i=document.createElement("div");i.className="anird-toast",i.style.background=e.bg,i.style.borderColor=e.border,i.style.setProperty("--duration",`${l}ms`);let g="";t&&(g=`<button class="toast-action" data-toast-action style="background: ${e.border}; color: ${e.text};">${t.label}</button>`),i.innerHTML=`
    <div class="toast-icon" style="background: ${e.bg}; color: ${e.icon};">${d}</div>
    <div class="toast-content">
      ${a?`<div class="toast-title">${a}</div>`:""}
      ${n?`<div class="toast-message">${n}</div>`:""}
      ${g}
    </div>
    <button class="toast-close" data-toast-close>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="toast-progress" style="background: ${e.icon};"></div>
  `;const h=i.querySelector("[data-toast-action]");h&&t&&t.onClick&&h.addEventListener("click",c=>{c.stopPropagation(),t.onClick(),k(i,r)}),i.querySelector("[data-toast-close]").addEventListener("click",()=>k(i,r)),p.appendChild(i);const x=setTimeout(()=>k(i,r),l);i._timeout=x,i.addEventListener("mouseenter",()=>{clearTimeout(i._timeout),i.querySelector(".toast-progress").style.animationPlayState="paused"}),i.addEventListener("mouseleave",()=>{i._timeout=setTimeout(()=>k(i,r),2e3),i.querySelector(".toast-progress").style.animationPlayState="running"})}function k(s,a){s._removed||(s._removed=!0,clearTimeout(s._timeout),s.classList.add("removing"),setTimeout(()=>{s.remove(),a&&a(),L=!1,I()},350))}const C={show(s){z.push(s),I()},success(s,a,n){this.show({type:"success",title:s,message:a,duration:n})},error(s,a,n){this.show({type:"error",title:s,message:a,duration:n||5e3})},info(s,a,n){this.show({type:"info",title:s,message:a,duration:n})},warning(s,a,n){this.show({type:"warning",title:s,message:a,duration:n})},notify(s,a,n,l){this.show({type:"notification",title:s,message:a,action:n,duration:l||6e3})}};let y=null;const _=`
  <style>
    .anird-modal-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      animation: anirdModalOverlayIn 0.25s ease-out forwards;
      opacity: 0;
    }
    .anird-modal-overlay.closing {
      animation: anirdModalOverlayOut 0.2s ease-in forwards;
    }
    .anird-modal {
      background: rgba(18, 18, 26, 0.95);
      backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03) inset;
      max-width: 480px; width: 100%;
      max-height: 85vh;
      overflow: hidden;
      display: flex; flex-direction: column;
      animation: anirdModalIn 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      transform: scale(0.92) translateY(20px);
      opacity: 0;
    }
    .anird-modal.closing {
      animation: anirdModalOut 0.2s cubic-bezier(0.55, 0, 1, 0.45) forwards;
    }
    .anird-modal.size-sm { max-width: 360px; }
    .anird-modal.size-lg { max-width: 640px; }
    .anird-modal.size-xl { max-width: 800px; }

    .anird-modal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 24px 0;
      flex-shrink: 0;
    }
    .anird-modal-title {
      font-family: 'Outfit', sans-serif;
      font-size: 18px; font-weight: 800; color: #ffffff;
      margin: 0;
    }
    .anird-modal-close {
      width: 32px; height: 32px; border-radius: 10px;
      background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
      color: #a1a1aa; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .anird-modal-close:hover { background: rgba(255, 255, 255, 0.1); color: white; }

    .anird-modal-body {
      padding: 16px 24px 24px;
      overflow-y: auto;
      flex: 1;
      scrollbar-width: thin;
      scrollbar-color: rgba(255,255,255,0.1) transparent;
    }
    .anird-modal-body::-webkit-scrollbar { width: 4px; }
    .anird-modal-body::-webkit-scrollbar-track { background: transparent; }
    .anird-modal-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

    .anird-modal-footer {
      display: flex; align-items: center; justify-content: flex-end; gap: 10px;
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      flex-shrink: 0;
    }

    /* Danger zone variant */
    .anird-modal.danger .anird-modal-title { color: #e50914; }
    .anird-modal.danger { border-color: rgba(229, 9, 20, 0.15); }

    @keyframes anirdModalOverlayIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes anirdModalOverlayOut { from { opacity: 1; } to { opacity: 0; } }
    @keyframes anirdModalIn { from { transform: scale(0.92) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
    @keyframes anirdModalOut { from { transform: scale(1) translateY(0); opacity: 1; } to { transform: scale(0.92) translateY(20px); opacity: 0; } }

    @media (max-width: 480px) {
      .anird-modal { border-radius: 16px; max-height: 90vh; }
      .anird-modal-overlay { padding: 12px; }
      .anird-modal-header { padding: 16px 18px 0; }
      .anird-modal-body { padding: 12px 18px 18px; }
      .anird-modal-footer { padding: 12px 18px; }
    }
  </style>
`;function A({title:s="",content:a="",size:n="",danger:l=!1,footer:t="",onClose:r=null,closeOnOverlay:p=!0}){y&&w();const e=document.createElement("div");e.className="anird-modal-overlay",e.innerHTML=`
    ${_}
    <div class="anird-modal ${n?"size-"+n:""} ${l?"danger":""}">
      <div class="anird-modal-header">
        <h3 class="anird-modal-title">${s}</h3>
        <button class="anird-modal-close" data-modal-close>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="anird-modal-body">${a}</div>
      ${t?`<div class="anird-modal-footer">${t}</div>`:""}
    </div>
  `;const d=e.querySelector(".anird-modal"),i=()=>{e.classList.add("closing"),d.classList.add("closing"),setTimeout(()=>{e.remove(),y=null,r&&r()},200)};p&&e.addEventListener("click",h=>{h.target===e&&i()}),e.querySelector("[data-modal-close]").addEventListener("click",i);const g=h=>{h.key==="Escape"&&(i(),document.removeEventListener("keydown",g))};return document.addEventListener("keydown",g),y={overlay:e,close:i},document.body.appendChild(e),document.body.style.overflow="hidden",e._cleanup=()=>{document.body.style.overflow=""},{close:i,el:d}}function w(){y&&(y.close(),document.body.style.overflow="",y=null)}function M({title:s,message:a,confirmText:n="Confirmar",cancelText:l="Cancelar",danger:t=!1}){return new Promise(r=>{const p=`
      <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">${l}</button>
      <button class="btn-v4-primary" data-modal-confirm style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; ${t?"background: #e50914; border-color: #e50914;":""}">${n}</button>
    `,{el:e}=A({title:s,content:`<p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">${a}</p>`,footer:p,danger:t,size:"sm",onClose:()=>r(!1)});e.querySelector("[data-modal-confirm]").addEventListener("click",()=>{w(),r(!0)}),e.querySelector("[data-modal-cancel]").addEventListener("click",()=>{w(),r(!1)})})}function R({title:s,message:a,placeholder:n="",defaultValue:l="",confirmText:t="Aceptar"}){return new Promise(r=>{const p=`
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">${a}</p>
      <input type="text" id="anird-modal-input" placeholder="${n}" value="${l}"
        style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05); color: white; font-size: 14px; font-family: 'Inter', sans-serif;
        outline: none; transition: border-color 0.2s;"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
      >
    `,e=`
      <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">Cancelar</button>
      <button class="btn-v4-primary" data-modal-confirm style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;">${t}</button>
    `,{el:d}=A({title:s,content:p,footer:e,size:"sm",onClose:()=>r(null)}),i=d.querySelector("#anird-modal-input");setTimeout(()=>i.focus(),400);const g=()=>{const h=i.value.trim();w(),r(h||null)};d.querySelector("[data-modal-confirm]").addEventListener("click",g),d.querySelector("[data-modal-cancel]").addEventListener("click",()=>{w(),r(null)}),i.addEventListener("keydown",h=>{h.key==="Enter"&&g()})})}class P{constructor(a){this.params=a,this.animeId=a.id,this.anime=null,this.characters=[],this.recommendations=[],this.relations=[],this.isFavorite=!1,this.isFollowing=!1}async render(){const a=document.createElement("div");return a.className="page-enter",a.style.cssText="position: fixed; inset: 0; z-index: 100;",a.innerHTML=`
      <div style="position:absolute;inset:0;z-index:0;background:#09090b;"></div>
      <div style="position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;">
        <div class="loader-spinner" style="width:50px;height:50px;border:3px solid #ef4444;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;"></div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
      </div>
    `,this.loadData(a),a}async loadData(a){var h,x,c;let n="sub";try{n=await u.getSetting("audio_pref","sub")}catch(o){console.warn("Could not get audio_pref, using default",o)}const l=(o,f=15e3)=>Promise.race([o,new Promise((m,$)=>setTimeout(()=>$(new Error("Timeout")),f))]);let t,r,p,e,d,i;try{[t,r,p,e,d,i]=await l(Promise.all([b.getAnimeInfo(this.animeId),b.providers.jikan.request(`/anime/${this.animeId}/characters`).catch(()=>({data:[]})),b.providers.jikan.request(`/anime/${this.animeId}/recommendations`).catch(()=>({data:[]})),u.isFavorite(this.animeId).catch(()=>!1),u.isFollowing(this.animeId).catch(()=>!1),b.getAnimeRelations(this.animeId).catch(()=>({data:[]}))]))}catch(o){console.error("[AnimeDetailPage] Error fetching data:",o),t={data:null},r={data:[]},p={data:[]},e=!1,d=!1,i={data:[]}}if(this.anime=(t==null?void 0:t.data)||null,this.characters=(r==null?void 0:r.data)||[],this.recommendations=(p==null?void 0:p.data)||[],this.isFavorite=e||!1,this.isFollowing=d||!1,this.relations=(i==null?void 0:i.data)||[],!this.anime){console.error("[AnimeDetailPage] No se pudo cargar anime con ID:",this.animeId),a.innerHTML=`
        <div style="position:fixed;inset:0;z-index:0;background:#09090b;"></div>
        <div style="position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:40px 20px;text-align:center;">
          <div style="font-size:64px;margin-bottom:20px;filter:drop-shadow(0 0 20px rgba(229,9,20,0.3));">😵</div>
          <h2 style="font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;color:white;margin:0 0 12px;">No se pudo cargar el anime</h2>
          <p style="color:#a1a1aa;font-size:14px;max-width:400px;line-height:1.6;margin:0 0 30px;">
            Hubo un error al obtener la información. Puede ser un problema de conexión o el servidor Jikan no respondió a tiempo.
          </p>
          <div style="display:flex;gap:12px;">
            <button onclick="window.location.reload()" style="padding:12px 28px;border-radius:50px;background:#dc2626;color:white;border:none;font-weight:700;font-size:14px;cursor:pointer;font-family:'Outfit',sans-serif;display:flex;align-items:center;gap:8px;box-shadow:0 4px 14px rgba(220,38,38,0.3);">
              🔄 Reintentar
            </button>
            <button onclick="window.history.back()" style="padding:12px 28px;border-radius:50px;background:rgba(255,255,255,0.1);color:white;border:1px solid rgba(255,255,255,0.1);font-weight:600;font-size:14px;cursor:pointer;font-family:'Outfit',sans-serif;">
              ← Volver
            </button>
          </div>
        </div>
      `,document.title="Error — AniRD";return}const g=await b.getAnilistBanner(this.animeId).catch(()=>null)||((x=(h=this.anime.images)==null?void 0:h.jpg)==null?void 0:x.large_image_url)||"";document.title=`${this.anime.title_english||this.anime.title} — AniRD`,a.innerHTML=`
      <style>
        .page-bg {
          position: absolute; inset: 0; z-index: 0;
          background: url('${g}') center/cover no-repeat;
          filter: brightness(0.3) blur(20px);
          transform: scale(1.1);
        }
        .sheet-overlay {
          position: absolute; inset: 0; z-index: 100;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .sheet-panel {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 100%; max-width: 600px;
          background: rgba(9, 9, 11, 0.95); /* zinc-950 with slight transparency */
          backdrop-filter: blur(20px);
          box-shadow: 10px 0 40px rgba(0,0,0,0.5);
          z-index: 101;
          overflow-y: auto;
          scrollbar-width: none;
          transform: translateX(-100%);
          animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          display: flex; flex-direction: column;
        }
        .sheet-panel::-webkit-scrollbar { display: none; }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        .sheet-banner {
          position: relative; height: 260px; flex-shrink: 0;
        }
        .sheet-banner img { width: 100%; height: 100%; object-fit: cover; }
        .sheet-banner-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, #09090b, rgba(9,9,11,0.4), transparent);
        }
        .sheet-close {
          position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
          background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s; z-index: 10;
        }
        .sheet-close:hover { background: rgba(0,0,0,0.7); }

        .sheet-title-container {
          position: absolute; bottom: 16px; left: 20px; right: 20px;
        }
        .sheet-title {
          font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 900; color: white;
          line-height: 1.1; margin: 0 0 8px 0; text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .sheet-meta-badges { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .sheet-score { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: #fbbf24; }
        .sheet-type { font-size: 14px; color: #d4d4d8; }

        .sheet-actions {
          display: flex; gap: 12px; padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .btn-play-sheet {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #dc2626; color: white; padding: 12px; border-radius: 9999px; font-weight: 600;
          text-decoration: none; transition: transform 0.2s, background 0.2s; font-size: 14px;
        }
        .btn-play-sheet:hover { transform: scale(1.02); background: #b91c1c; }
        .btn-icon-sheet {
          width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; color: #a1a1aa; cursor: pointer; transition: all 0.2s;
        }
        .btn-icon-sheet:hover { color: white; border-color: rgba(255,255,255,0.2); }
        .btn-icon-sheet.active { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.1); }

        .sheet-tabs {
          display: flex; padding: 0 20px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .sheet-tab {
          padding: 12px 16px; font-size: 14px; font-weight: 500; color: #71717a; cursor: pointer; position: relative; transition: color 0.2s;
        }
        .sheet-tab.active { color: white; }
        .sheet-tab.active::after {
          content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: #ef4444; border-radius: 2px 2px 0 0;
        }
        .mobile-only-tab { display: none; }
        @media (max-width: 1023px) {
          .mobile-only-tab { display: block; }
        }

        .sheet-content { padding: 20px; flex: 1; }
        .tab-panel { display: none; animation: fadeIn 0.3s; }
        .tab-panel.active { display: block; }

        /* Info Grid */
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 12px; }
        .info-card-label { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #71717a; margin-bottom: 4px; }
        .info-card-value { font-size: 14px; font-weight: 500; color: white; }

        .section-heading { font-size: 12px; font-weight: 600; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0; }
        .badge-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .badge-pill { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #d4d4d8; padding: 4px 10px; border-radius: 6px; font-size: 12px; }
        .badge-pill.status { background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2); }

        .synopsis-text { font-size: 14px; color: #a1a1aa; line-height: 1.6; }

        /* Characters Grid */
        .chars-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .char-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px; }
        .char-img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
        .char-info { min-width: 0; }
        .char-name { font-size: 13px; font-weight: 500; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .char-role { font-size: 11px; color: #71717a; }

        /* Recommendations Grid */
        .recs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; }

        /* Episodes */
        .episodes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-top: 16px; }
        .ep-card { position: relative; border-radius: 12px; overflow: hidden; text-decoration: none; display: block; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.2s; }
        .ep-card:hover { transform: translateY(-4px); border-color: rgba(220,38,38,0.3); }
        .ep-card img { width: 100%; aspect-ratio: 16/9; object-fit: cover; }
        .ep-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); display: flex; align-items: flex-end; padding: 8px; }
        .ep-card-title { color: white; font-size: 11px; font-weight: 600; }
        .ep-watched-badge { position: absolute; top: 8px; right: 8px; background: #a855f7; color: white; font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 4px; }

        /* Relations Panel (Desktop Only) */
        .relations-panel {
          position: fixed; top: 90px; left: 630px; right: 30px; bottom: 30px;
          z-index: 101;
          overflow-y: auto;
          scrollbar-width: none;
          display: flex; flex-direction: column; gap: 20px;
          animation: fadeIn 0.4s ease-out;
        }
        .relations-panel::-webkit-scrollbar { display: none; }
        
        .relations-panel-title {
          font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 800; color: white;
          margin: 0; padding-bottom: 10px; border-bottom: 2px solid rgba(255,255,255,0.08);
          letter-spacing: -0.02em;
        }
        
        .relations-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        
        .relation-item-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 16px;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .relation-item-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(220, 38, 38, 0.3);
          transform: translateY(-2px);
        }
        
        .relation-badge {
          display: inline-block;
          align-self: flex-start;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .relation-badge.prequel {
          background: rgba(59, 130, 246, 0.1);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.2);
        }
        .relation-badge.sequel {
          background: rgba(16, 185, 129, 0.1);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        .relation-badge.other {
          background: rgba(255, 255, 255, 0.06);
          color: #d4d4d8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .relation-item-title {
          font-size: 14px; font-weight: 600; color: white;
          line-height: 1.3;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        
        .relation-item-meta {
          font-size: 11px; color: #71717a; font-weight: 500;
        }
        
        .no-relations-message {
          color: #71717a; font-size: 14px; text-align: center; padding: 40px 0; width: 100%; grid-column: 1 / -1;
        }

        @media (max-width: 1023px) {
          .relations-panel { display: none !important; }
        }
      </style>

      <div class="page-bg"></div>
      <div class="sheet-overlay" id="sheet-overlay"></div>
      <div class="sheet-panel">
        <div class="sheet-banner">
          <img src="${g}" alt="">
          <div class="sheet-banner-overlay"></div>
          <button class="sheet-close" id="sheet-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <div class="sheet-title-container">
            <h1 class="sheet-title">${this.anime.title_english||this.anime.title}</h1>
            <div class="sheet-meta-badges">
              ${this.anime.score?`<div class="sheet-score"><svg viewBox="0 0 24 24" fill="currentColor" style="width:16px;height:16px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${this.anime.score}</div>`:""}
              ${this.anime.type?`<div class="sheet-type">${this.anime.type}</div>`:""}
              ${this.anime.episodes?`<div class="sheet-type">${this.anime.episodes} eps</div>`:""}
            </div>
          </div>
        </div>

        <div class="sheet-actions">
          <a href="/watch/${this.animeId}/1/${n}?title=${encodeURIComponent(this.anime.title)}" data-link class="btn-play-sheet">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Reproducir
          </a>
          <button class="btn-icon-sheet ${this.isFavorite?"active":""}" id="fav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button class="btn-icon-sheet" id="share-btn" title="Compartir">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
          </button>
        </div>

        <div class="sheet-tabs">
          <div class="sheet-tab active" data-tab="info">Información</div>
          <div class="sheet-tab" data-tab="episodes">Episodios</div>
          <div class="sheet-tab" data-tab="characters">Personajes</div>
          <div class="sheet-tab" data-tab="recommendations">Recomendados</div>
          <div class="sheet-tab mobile-only-tab" data-tab="relations">Relaciones</div>
        </div>

        <div class="sheet-content">
          <!-- INFO TAB -->
          <div class="tab-panel active" id="tab-info">
            <div class="info-grid">
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> Año</div>
                <div class="info-card-value">${this.anime.year||"N/A"}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> Tipo</div>
                <div class="info-card-value">${this.anime.type||"N/A"}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> Duración</div>
                <div class="info-card-value">${this.anime.duration||"N/A"}</div>
              </div>
              <div class="info-card">
                <div class="info-card-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> Puntuación</div>
                <div class="info-card-value">${this.anime.score||"N/A"}</div>
              </div>
            </div>

            <h4 class="section-heading">Estado</h4>
            <div class="badge-list">
              <div class="badge-pill ${this.anime.status==="Currently Airing"?"status":""}">${this.anime.status==="Currently Airing"?"En Emisión":this.anime.status}</div>
              ${this.anime.rating?`<div class="badge-pill">${this.anime.rating}</div>`:""}
              ${this.anime.source?`<div class="badge-pill">${this.anime.source}</div>`:""}
            </div>

            ${((c=this.anime.studios)==null?void 0:c.length)>0?`
              <h4 class="section-heading">Estudio</h4>
              <div class="badge-list">
                ${this.anime.studios.map(o=>`<div class="badge-pill">${o.name}</div>`).join("")}
              </div>
            `:""}

            <h4 class="section-heading">Géneros</h4>
            <div class="badge-list">
              ${this.anime.genres.map(o=>`<div class="badge-pill" style="background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2);">${o.name}</div>`).join("")}
            </div>

            <h4 class="section-heading" style="margin-top: 8px;">Sinopsis</h4>
            <p class="synopsis-text">${this.anime.synopsis||"Sin sinopsis disponible."}</p>
          </div>

          <!-- EPISODES TAB -->
          <div class="tab-panel" id="tab-episodes">
             <div id="episodes-container" style="text-align:center; color:#71717a; padding: 20px;">Cargando episodios...</div>
          </div>

          <!-- CHARACTERS TAB -->
          <div class="tab-panel" id="tab-characters">
            ${this.characters.length>0?`
              <div class="chars-grid">
                ${this.characters.slice(0,20).map(o=>{var f,m;return`
                  <div class="char-card">
                    <img class="char-img" src="${(m=(f=o.character.images)==null?void 0:f.jpg)==null?void 0:m.image_url}" alt="${o.character.name}">
                    <div class="char-info">
                      <div class="char-name">${o.character.name}</div>
                      <div class="char-role">${o.role}</div>
                    </div>
                  </div>
                `}).join("")}
              </div>
            `:'<div style="color:#71717a;text-align:center;padding:20px;">No hay personajes disponibles.</div>'}
          </div>

          <!-- RECS TAB -->
          <div class="tab-panel" id="tab-recommendations">
            ${this.recommendations.length>0?`
              <div class="recs-grid">
                ${this.recommendations.slice(0,10).map(o=>`
                  <anime-card data='${JSON.stringify({mal_id:o.entry.mal_id,title:o.entry.title,images:o.entry.images,score:"?.?"}).replace(/'/g,"&#39;")}'></anime-card>
                `).join("")}
              </div>
            `:'<div style="color:#71717a;text-align:center;padding:20px;">No hay recomendaciones.</div>'}
          </div>

          <!-- RELATIONS TAB (MOBILE ONLY) -->
          <div class="tab-panel" id="tab-relations">
            <div class="relations-list" style="display: grid;">
              ${this.renderRelationsHtml()}
            </div>
          </div>
        </div>
      </div>

      <!-- Relations Panel (Desktop Only) -->
      <div class="relations-panel">
        <h2 class="relations-panel-title">Precuelas y Secuelas</h2>
        <div class="relations-list">
          ${this.renderRelationsHtml()}
        </div>
      </div>
    `,setTimeout(()=>{this.afterRender()},50)}async afterRender(){if(!document.getElementById("sheet-close"))return;const n=document.getElementById("fav-btn"),l=document.getElementById("follow-btn");n&&n.addEventListener("click",async()=>{this.isFavorite?(await u.removeFavorite(this.animeId),this.isFavorite=!1,n.classList.remove("active")):(await u.addFavorite({...this.anime,addedAt:Date.now()}),this.isFavorite=!0,n.classList.add("active"))}),l&&l.addEventListener("click",async()=>{this.isFollowing?(await u.toggleFollowing({...this.anime,addedAt:Date.now()}),this.isFollowing=!1,l.classList.remove("active"),C.info("Dejaste de seguir",this.anime.title)):(await u.toggleFollowing({...this.anime,addedAt:Date.now()}),this.isFollowing=!0,l.classList.add("active"),C.success("Siguiendo",`Ahora sigues ${this.anime.title}`))});const t=document.querySelectorAll(".sheet-tab"),r=document.querySelectorAll(".tab-panel");t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(d=>d.classList.remove("active")),r.forEach(d=>d.classList.remove("active")),e.classList.add("active"),document.getElementById("tab-"+e.dataset.tab).classList.add("active")})});const p=()=>{const e=document.querySelector(".sheet-panel"),d=document.querySelector(".sheet-overlay"),i=document.querySelector(".relations-panel");if(e&&d){e.style.animation="slideOut 0.3s forwards",d.style.animation="fadeOut 0.3s forwards",i&&(i.style.animation="fadeOut 0.3s forwards");const g=document.createElement("style");g.innerHTML=`
           @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(-100%); } }
           @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
         `,document.head.appendChild(g),setTimeout(()=>{window.history.back()},300)}else window.history.back()};document.getElementById("sheet-close").addEventListener("click",p),document.getElementById("sheet-overlay").addEventListener("click",p),this.loadEpisodes()}async loadEpisodes(){var e,d,i,g,h,x;const a=document.getElementById("episodes-container"),n=await u.getSetting("audio_pref","sub");let l=new Set;try{const c=await T.history.where({animeId:String(this.animeId)}).toArray();l=new Set(c.map(o=>Number(o.episodeId)))}catch{}let t=null;try{const c=[this.anime.title,this.anime.title_english,this.anime.title_japanese,...this.anime.title_synonyms||[]].filter(Boolean);let o=null;for(const f of c){const m=await b.searchLocal(f);if(m!=null&&m.success&&((d=(e=m.data)==null?void 0:e.results)==null?void 0:d.length)>0){o=m;break}}if(o){const f=o.data.results.find($=>c.some(j=>$.title.toLowerCase().includes(j.toLowerCase())))||o.data.results[0],m=await b.getAnimeInfo(f.url);(i=m==null?void 0:m.data)!=null&&i.episodes&&(t=m.data.episodes.length)}}catch{}if(!t){if(this.anime.status==="Currently Airing")try{const c=await b.providers.jikan.request(`/anime/${this.animeId}/episodes`);if(((g=c==null?void 0:c.data)==null?void 0:g.length)>0){const o=c.pagination.last_visible_page;if(o>1){const f=await b.providers.jikan.request(`/anime/${this.animeId}/episodes?page=${o}`);t=f.data[f.data.length-1].mal_id}else t=c.data[c.data.length-1].mal_id}}catch{}t||(t=this.anime.episodes||12)}const r=((x=(h=this.anime.images)==null?void 0:h.jpg)==null?void 0:x.large_image_url)||"",p=`?title=${encodeURIComponent(this.anime.title)}`;a.innerHTML=`
      <div class="episodes-grid">
        ${Array.from({length:t},(c,o)=>o+1).map(c=>{const o=l.has(c);return`
            <a href="/watch/${this.animeId}/${c}/${n}${p}" data-link class="ep-card">
              <img src="${r}" loading="lazy" style="${o?"opacity: 0.5; filter: grayscale(1);":""}">
              <div class="ep-card-overlay">
                <span class="ep-card-title">Ep. ${c}</span>
              </div>
              ${o?'<div class="ep-watched-badge">Visto</div>':""}
            </a>
          `}).join("")}
    `}renderRelationsHtml(){if(!this.relations||this.relations.length===0)return'<div class="no-relations-message">No se encontraron precuelas, secuelas u otras conexiones.</div>';let a="";const n=[...this.relations].sort((l,t)=>{const r=l.relation.toLowerCase(),p=t.relation.toLowerCase();return r==="prequel"||r==="sequel"?-1:p==="prequel"||p==="sequel"?1:0});for(const l of n){const t=l.relation,r=t.toLowerCase()==="prequel"?"prequel":t.toLowerCase()==="sequel"?"sequel":"other",p=t==="Prequel"?"Precuela":t==="Sequel"?"Secuela":t==="Alternative version"?"Versión Alternativa":t==="Side story"?"Historia Paralela":t==="Spin-off"?"Spin-off":t==="Parent story"?"Historia Principal":t==="Summary"?"Resumen":t;for(const e of l.entry){const d=e.type==="anime",i=d?`/anime/${e.mal_id}`:e.url;a+=`
          <a href="${i}" ${d?"data-link":'target="_blank" rel="noopener noreferrer"'} class="relation-item-card">
            <span class="relation-badge ${r}">${p}</span>
            <div class="relation-item-title">${e.name}</div>
            <div class="relation-item-meta">${e.type.toUpperCase()}</div>
          </a>
        `}}return a}}const F=Object.freeze(Object.defineProperty({__proto__:null,default:P},Symbol.toStringTag,{value:"Module"}));export{F as A,C as T,M as c,R as p};
