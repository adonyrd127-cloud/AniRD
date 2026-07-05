import{d as w,a as u,b as z}from"./page-homepage-hw3Gvt4E.js";let v=null,E=[],S=!1;const A={success:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',error:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',info:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',warning:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',notification:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>'},j={success:{bg:"rgba(70, 211, 105, 0.12)",border:"rgba(70, 211, 105, 0.3)",text:"#46d369",icon:"#46d369"},error:{bg:"rgba(229, 9, 20, 0.12)",border:"rgba(229, 9, 20, 0.3)",text:"#e50914",icon:"#e50914"},info:{bg:"rgba(59, 130, 246, 0.12)",border:"rgba(59, 130, 246, 0.3)",text:"#60a5fa",icon:"#60a5fa"},warning:{bg:"rgba(232, 124, 3, 0.12)",border:"rgba(232, 124, 3, 0.3)",text:"#e87c03",icon:"#e87c03"},notification:{bg:"rgba(229, 9, 20, 0.12)",border:"rgba(229, 9, 20, 0.25)",text:"#ffffff",icon:"#e50914"}};function T(){return v||(v=document.createElement("div"),v.id="anird-toast-container",v.innerHTML=`<style>
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
  </style>`,document.body.appendChild(v),v)}function B(){if(S||E.length===0)return;S=!0;const l=E.shift();O(l)}function O({type:l="info",title:o="",message:s="",duration:c=4e3,action:t=null,onClose:r=null}){const g=T(),e=j[l]||j.info,d=A[l]||A.info,i=document.createElement("div");i.className="anird-toast",i.style.background=e.bg,i.style.borderColor=e.border,i.style.setProperty("--duration",`${c}ms`);let n="";t&&(n=`<button class="toast-action" data-toast-action style="background: ${e.border}; color: ${e.text};">${t.label}</button>`),i.innerHTML=`
    <div class="toast-icon" style="background: ${e.bg}; color: ${e.icon};">${d}</div>
    <div class="toast-content">
      ${o?`<div class="toast-title">${o}</div>`:""}
      ${s?`<div class="toast-message">${s}</div>`:""}
      ${n}
    </div>
    <button class="toast-close" data-toast-close>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="toast-progress" style="background: ${e.icon};"></div>
  `;const m=i.querySelector("[data-toast-action]");m&&t&&t.onClick&&m.addEventListener("click",p=>{p.stopPropagation(),t.onClick(),L(i,r)}),i.querySelector("[data-toast-close]").addEventListener("click",()=>L(i,r)),g.appendChild(i);const f=setTimeout(()=>L(i,r),c);i._timeout=f,i.addEventListener("mouseenter",()=>{clearTimeout(i._timeout),i.querySelector(".toast-progress").style.animationPlayState="paused"}),i.addEventListener("mouseleave",()=>{i._timeout=setTimeout(()=>L(i,r),2e3),i.querySelector(".toast-progress").style.animationPlayState="running"})}function L(l,o){l._removed||(l._removed=!0,clearTimeout(l._timeout),l.classList.add("removing"),setTimeout(()=>{l.remove(),o&&o(),S=!1,B()},350))}const k={show(l){E.push(l),B()},success(l,o,s){this.show({type:"success",title:l,message:o,duration:s})},error(l,o,s){this.show({type:"error",title:l,message:o,duration:s||5e3})},info(l,o,s){this.show({type:"info",title:l,message:o,duration:s})},warning(l,o,s){this.show({type:"warning",title:l,message:o,duration:s})},notify(l,o,s,c){this.show({type:"notification",title:l,message:o,action:s,duration:c||6e3})}};let $=null;const q=`
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
`;function C({title:l="",content:o="",size:s="",danger:c=!1,footer:t="",onClose:r=null,closeOnOverlay:g=!0}){$&&y();const e=document.createElement("div");e.className="anird-modal-overlay",e.innerHTML=`
    ${q}
    <div class="anird-modal ${s?"size-"+s:""} ${c?"danger":""}">
      <div class="anird-modal-header">
        <h3 class="anird-modal-title">${l}</h3>
        <button class="anird-modal-close" data-modal-close>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="anird-modal-body">${o}</div>
      ${t?`<div class="anird-modal-footer">${t}</div>`:""}
    </div>
  `;const d=e.querySelector(".anird-modal"),i=()=>{e.classList.add("closing"),d.classList.add("closing"),setTimeout(()=>{e.remove(),$=null,r&&r()},200)};g&&e.addEventListener("click",m=>{m.target===e&&i()}),e.querySelector("[data-modal-close]").addEventListener("click",i);const n=m=>{m.key==="Escape"&&(i(),document.removeEventListener("keydown",n))};return document.addEventListener("keydown",n),$={overlay:e,close:i},document.body.appendChild(e),document.body.style.overflow="hidden",e._cleanup=()=>{document.body.style.overflow=""},{close:i,el:d}}function y(){$&&($.close(),document.body.style.overflow="",$=null)}function M({title:l,message:o,confirmText:s="Confirmar",cancelText:c="Cancelar",danger:t=!1}){return new Promise(r=>{const g=`
      <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">${c}</button>
      <button class="btn-v4-primary" data-modal-confirm style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; ${t?"background: #e50914; border-color: #e50914;":""}">${s}</button>
    `,{el:e}=C({title:l,content:`<p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">${o}</p>`,footer:g,danger:t,size:"sm",onClose:()=>r(!1)});e.querySelector("[data-modal-confirm]").addEventListener("click",()=>{y(),r(!0)}),e.querySelector("[data-modal-cancel]").addEventListener("click",()=>{y(),r(!1)})})}function N({title:l,message:o,placeholder:s="",defaultValue:c="",confirmText:t="Aceptar"}){return new Promise(r=>{const g=`
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">${o}</p>
      <input type="text" id="anird-modal-input" placeholder="${s}" value="${c}"
        style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05); color: white; font-size: 14px; font-family: 'Inter', sans-serif;
        outline: none; transition: border-color 0.2s;"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
      >
    `,e=`
      <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">Cancelar</button>
      <button class="btn-v4-primary" data-modal-confirm style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;">${t}</button>
    `,{el:d}=C({title:l,content:g,footer:e,size:"sm",onClose:()=>r(null)}),i=d.querySelector("#anird-modal-input");setTimeout(()=>i.focus(),400);const n=()=>{const m=i.value.trim();y(),r(m||null)};d.querySelector("[data-modal-confirm]").addEventListener("click",n),d.querySelector("[data-modal-cancel]").addEventListener("click",()=>{y(),r(null)}),i.addEventListener("keydown",m=>{m.key==="Enter"&&n()})})}class _{constructor(o){this.params=o,this.animeId=o.id,this.anime=null,this.characters=[],this.recommendations=[],this.relations=[],this.isFavorite=!1,this.isFollowing=!1}async render(){var m,f,p;const o=await w.getSetting("audio_pref","sub"),s=(a,b=15e3)=>Promise.race([a,new Promise((h,x)=>setTimeout(()=>x(new Error("Timeout")),b))]);let c,t,r,g,e,d;try{[c,t,r,g,e,d]=await s(Promise.all([u.getAnimeInfo(this.animeId),u.providers.jikan.request(`/anime/${this.animeId}/characters`).catch(()=>({data:[]})),u.providers.jikan.request(`/anime/${this.animeId}/recommendations`).catch(()=>({data:[]})),w.isFavorite(this.animeId).catch(()=>!1),w.isFollowing(this.animeId).catch(()=>!1),u.getAnimeRelations(this.animeId).catch(()=>({data:[]}))]))}catch(a){console.error("[AnimeDetailPage] Error fetching data:",a),c={data:null},t={data:[]},r={data:[]},g=!1,e=!1,d={data:[]}}if(this.anime=(c==null?void 0:c.data)||null,this.characters=(t==null?void 0:t.data)||[],this.recommendations=(r==null?void 0:r.data)||[],this.isFavorite=g||!1,this.isFollowing=e||!1,this.relations=(d==null?void 0:d.data)||[],!this.anime){console.error("[AnimeDetailPage] No se pudo cargar anime con ID:",this.animeId);const a=document.createElement("div");return a.className="page-enter",a.innerHTML=`
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
      `,document.title="Error — AniRD",a}const i=await u.getAnilistBanner(this.animeId).catch(()=>null)||((f=(m=this.anime.images)==null?void 0:m.jpg)==null?void 0:f.large_image_url)||"";document.title=`${this.anime.title_english||this.anime.title||"Anime"} — AniRD`;const n=document.createElement("div");return n.className="page-enter",n.innerHTML=`
      <style>
        .page-bg {
          position: fixed; inset: 0; z-index: 0;
          background: url('${i}') center/cover no-repeat;
          filter: brightness(0.3) blur(20px);
          transform: scale(1.1);
        }
        .sheet-overlay {
          position: fixed; inset: 0; z-index: 100;
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
          <img src="${i}" alt="">
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
          <a href="/watch/${this.animeId}/1/${o}?title=${encodeURIComponent(this.anime.title)}" data-link class="btn-play-sheet">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" style="width:18px;height:18px;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Reproducir
          </a>
          <button class="btn-icon-sheet ${this.isFavorite?"active":""}" id="fav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
          <button class="btn-icon-sheet ${this.isFollowing?"active":""}" id="follow-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </button>
          <button class="btn-icon-sheet" id="add-to-list-btn" title="Agregar a lista">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:20px;height:20px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
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

            ${((p=this.anime.studios)==null?void 0:p.length)>0?`
              <h4 class="section-heading">Estudio</h4>
              <div class="badge-list">
                ${this.anime.studios.map(a=>`<div class="badge-pill">${a.name}</div>`).join("")}
              </div>
            `:""}

            <h4 class="section-heading">Géneros</h4>
            <div class="badge-list">
              ${this.anime.genres.map(a=>`<div class="badge-pill" style="background: rgba(220,38,38,0.1); color: #fca5a5; border-color: rgba(220,38,38,0.2);">${a.name}</div>`).join("")}
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
                ${this.characters.slice(0,20).map(a=>{var b,h;return`
                  <div class="char-card">
                    <img class="char-img" src="${(h=(b=a.character.images)==null?void 0:b.jpg)==null?void 0:h.image_url}" alt="${a.character.name}">
                    <div class="char-info">
                      <div class="char-name">${a.character.name}</div>
                      <div class="char-role">${a.role}</div>
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
                ${this.recommendations.slice(0,10).map(a=>`
                  <anime-card data='${JSON.stringify({mal_id:a.entry.mal_id,title:a.entry.title,images:a.entry.images,score:"?.?"}).replace(/'/g,"&#39;")}'></anime-card>
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
    `,n}async afterRender(){const o=document.getElementById("fav-btn"),s=document.getElementById("follow-btn");o&&o.addEventListener("click",async()=>{const e=await w.toggleFavorite({...this.anime,addedAt:Date.now()});this.isFavorite=e,e?(o.classList.add("active"),k.success("Guardado",`Añadiste ${this.anime.title} a favoritos`)):(o.classList.remove("active"),k.info("Quitado",`Eliminaste ${this.anime.title} de favoritos`))}),s&&s.addEventListener("click",async()=>{const e=await w.toggleFollowing({...this.anime,addedAt:Date.now()});this.isFollowing=e,e?(s.classList.add("active"),k.success("Siguiendo",`Ahora sigues ${this.anime.title}`)):(s.classList.remove("active"),k.info("Dejaste de seguir",this.anime.title))});const c=document.getElementById("add-to-list-btn");c&&c.addEventListener("click",async()=>{const e=await z.lists.toArray();if(e.length===0){k.warning("Sin listas",'Crea tu primera lista desde la sección "Mis Listas"');return}const d=e.map(n=>({...n,hasAnime:(n.animeIds||[]).includes(Number(this.animeId))})),i=`
          <p style="color: #a1a1aa; font-size: 13px; margin-bottom: 16px;">Selecciona las listas donde quieras agregar <strong style="color: white;">${this.anime.title}</strong>:</p>
          <div style="display: flex; flex-direction: column; gap: 6px;" id="list-checkboxes">
            ${d.map(n=>`
              <label style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-radius: 12px; background: ${n.hasAnime?"rgba(229,9,20,0.08)":"rgba(255,255,255,0.03)"}; border: 1px solid ${n.hasAnime?"rgba(229,9,20,0.2)":"rgba(255,255,255,0.06)"}; cursor: pointer; transition: all 0.2s;">
                <input type="checkbox" data-list-id="${n.id}" ${n.hasAnime?"checked":""} style="accent-color: #e50914; width: 16px; height: 16px;">
                <span style="flex: 1; color: white; font-size: 14px; font-weight: 600;">${n.name}</span>
                <span style="font-size: 11px; color: #6b6b6b;">${(n.animeIds||[]).length} anime${(n.animeIds||[]).length!==1?"s":""}</span>
              </label>
            `).join("")}
          </div>
        `;C({title:"Agregar a Lista",content:i,size:"sm",footer:`
            <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">Cancelar</button>
            <button class="btn-v4-primary" id="save-list-selection" style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;">Guardar</button>
          `}),setTimeout(()=>{const n=document.getElementById("save-list-selection"),m=document.querySelector("[data-modal-cancel]");n&&n.addEventListener("click",async()=>{const f=document.querySelectorAll('#list-checkboxes input[type="checkbox"]');for(const p of f){const a=parseInt(p.dataset.listId),h=(await z.lists.get(a)).animeIds||[],x=Number(this.animeId);p.checked&&!h.includes(x)?(h.push(x),await z.lists.update(a,{animeIds:h})):!p.checked&&h.includes(x)&&await z.lists.update(a,{animeIds:h.filter(I=>I!==x)})}y(),k.success("Listas actualizadas",`${this.anime.title} se guardó en tus listas`),c.classList.add("active")}),m&&m.addEventListener("click",()=>y())},100)});const t=document.querySelectorAll(".sheet-tab"),r=document.querySelectorAll(".tab-panel");t.forEach(e=>{e.addEventListener("click",()=>{t.forEach(d=>d.classList.remove("active")),r.forEach(d=>d.classList.remove("active")),e.classList.add("active"),document.getElementById("tab-"+e.dataset.tab).classList.add("active")})});const g=()=>{const e=document.querySelector(".sheet-panel"),d=document.querySelector(".sheet-overlay"),i=document.querySelector(".relations-panel");if(e&&d){e.style.animation="slideOut 0.3s forwards",d.style.animation="fadeOut 0.3s forwards",i&&(i.style.animation="fadeOut 0.3s forwards");const n=document.createElement("style");n.innerHTML=`
           @keyframes slideOut { from { transform: translateX(0); } to { transform: translateX(-100%); } }
           @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
         `,document.head.appendChild(n),setTimeout(()=>{window.history.back()},300)}else window.history.back()};document.getElementById("sheet-close").addEventListener("click",g),document.getElementById("sheet-overlay").addEventListener("click",g),this.loadEpisodes()}async loadEpisodes(){var e,d,i,n,m,f;const o=document.getElementById("episodes-container"),s=await w.getSetting("audio_pref","sub");let c=new Set;try{const p=await z.history.where({animeId:String(this.animeId)}).toArray();c=new Set(p.map(a=>Number(a.episodeId)))}catch{}let t=null;try{const p=[this.anime.title,this.anime.title_english,this.anime.title_japanese,...this.anime.title_synonyms||[]].filter(Boolean);let a=null;for(const b of p){const h=await u.searchLocal(b);if(h!=null&&h.success&&((d=(e=h.data)==null?void 0:e.results)==null?void 0:d.length)>0){a=h;break}}if(a){const b=a.data.results.find(x=>p.some(I=>x.title.toLowerCase().includes(I.toLowerCase())))||a.data.results[0],h=await u.getAnimeInfo(b.url);(i=h==null?void 0:h.data)!=null&&i.episodes&&(t=h.data.episodes.length)}}catch{}if(!t){if(this.anime.status==="Currently Airing")try{const p=await u.providers.jikan.request(`/anime/${this.animeId}/episodes`);if(((n=p==null?void 0:p.data)==null?void 0:n.length)>0){const a=p.pagination.last_visible_page;if(a>1){const b=await u.providers.jikan.request(`/anime/${this.animeId}/episodes?page=${a}`);t=b.data[b.data.length-1].mal_id}else t=p.data[p.data.length-1].mal_id}}catch{}t||(t=this.anime.episodes||12)}const r=((f=(m=this.anime.images)==null?void 0:m.jpg)==null?void 0:f.large_image_url)||"",g=`?title=${encodeURIComponent(this.anime.title)}`;o.innerHTML=`
      <div class="episodes-grid">
        ${Array.from({length:t},(p,a)=>a+1).map(p=>{const a=c.has(p);return`
            <a href="/watch/${this.animeId}/${p}/${s}${g}" data-link class="ep-card">
              <img src="${r}" loading="lazy" style="${a?"opacity: 0.5; filter: grayscale(1);":""}">
              <div class="ep-card-overlay">
                <span class="ep-card-title">Ep. ${p}</span>
              </div>
              ${a?'<div class="ep-watched-badge">Visto</div>':""}
            </a>
          `}).join("")}
    `}renderRelationsHtml(){if(!this.relations||this.relations.length===0)return'<div class="no-relations-message">No se encontraron precuelas, secuelas u otras conexiones.</div>';let o="";const s=[...this.relations].sort((c,t)=>{const r=c.relation.toLowerCase(),g=t.relation.toLowerCase();return r==="prequel"||r==="sequel"?-1:g==="prequel"||g==="sequel"?1:0});for(const c of s){const t=c.relation,r=t.toLowerCase()==="prequel"?"prequel":t.toLowerCase()==="sequel"?"sequel":"other",g=t==="Prequel"?"Precuela":t==="Sequel"?"Secuela":t==="Alternative version"?"Versión Alternativa":t==="Side story"?"Historia Paralela":t==="Spin-off"?"Spin-off":t==="Parent story"?"Historia Principal":t==="Summary"?"Resumen":t;for(const e of c.entry){const d=e.type==="anime",i=d?`/anime/${e.mal_id}`:e.url;o+=`
          <a href="${i}" ${d?"data-link":'target="_blank" rel="noopener noreferrer"'} class="relation-item-card">
            <span class="relation-badge ${r}">${g}</span>
            <div class="relation-item-title">${e.name}</div>
            <div class="relation-item-meta">${e.type.toUpperCase()}</div>
          </a>
        `}}return o}}const R=Object.freeze(Object.defineProperty({__proto__:null,default:_},Symbol.toStringTag,{value:"Module"}));export{R as A,k as T,M as c,N as p};
