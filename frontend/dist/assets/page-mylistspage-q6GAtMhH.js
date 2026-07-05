import{b as l,a as h}from"./page-homepage-hw3Gvt4E.js";import{T as c,p as g,c as u}from"./page-animedetailpage-DDd-KS4a.js";import"./vendor-DIPEJTOH.js";const x=document.createElement("style");x.textContent=`
  .anird-tooltip {
    position: absolute; z-index: 9000;
    background: rgba(24, 24, 27, 0.97);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fafafa; font-size: 12px; font-weight: 600;
    font-family: 'Inter', sans-serif;
    padding: 7px 12px; border-radius: 10px;
    white-space: nowrap; pointer-events: none;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    opacity: 0; transform: translateY(4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  .anird-tooltip.visible { opacity: 1; transform: translateY(0); }

  .anird-tooltip[data-tooltip-pos="top"] { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(4px); }
  .anird-tooltip[data-tooltip-pos="top"].visible { transform: translateX(-50%) translateY(0); }

  .anird-tooltip[data-tooltip-pos="bottom"] { top: calc(100% + 8px); left: 50%; transform: translateX(-50%) translateY(-4px); }
  .anird-tooltip[data-tooltip-pos="bottom"].visible { transform: translateX(-50%) translateY(0); }

  .anird-tooltip[data-tooltip-pos="left"] { right: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(4px); }
  .anird-tooltip[data-tooltip-pos="left"].visible { transform: translateY(-50%) translateX(0); }

  .anird-tooltip[data-tooltip-pos="right"] { left: calc(100% + 8px); top: 50%; transform: translateY(-50%) translateX(-4px); }
  .anird-tooltip[data-tooltip-pos="right"].visible { transform: translateY(-50%) translateX(0); }
`;document.head.appendChild(x);document.addEventListener("click",()=>{});const f=document.createElement("style");f.textContent=`
  .anird-dropdown-menu {
    position: absolute; z-index: 8000;
    background: rgba(18, 18, 26, 0.97);
    backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 6px;
    box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03) inset;
    opacity: 0; visibility: hidden;
    transform: translateY(-8px) scale(0.96);
    transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    pointer-events: none;
    overflow: hidden;
  }
  .anird-dropdown-menu.open {
    opacity: 1; visibility: visible;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }
  .anird-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 9px 12px;
    background: none; border: none; border-radius: 10px;
    color: #d4d4d8; font-size: 13px; font-weight: 500;
    font-family: 'Inter', sans-serif;
    cursor: pointer; transition: all 0.15s;
    text-align: left;
  }
  .anird-dropdown-item:hover:not(:disabled) { background: rgba(255,255,255,0.06); color: white; }
  .anird-dropdown-item.active { color: var(--accent); background: rgba(229, 9, 20, 0.08); }
  .anird-dropdown-item.danger { color: #e50914; }
  .anird-dropdown-item.danger:hover { background: rgba(229, 9, 20, 0.1); }
  .anird-dropdown-item:disabled { opacity: 0.35; cursor: not-allowed; }
  .anird-dropdown-icon { display: flex; align-items: center; color: inherit; flex-shrink: 0; }
  .anird-dropdown-label { flex: 1; }
  .anird-dropdown-badge {
    font-size: 10px; font-weight: 800; color: #a1a1aa;
    background: rgba(255,255,255,0.06); padding: 2px 7px;
    border-radius: 6px;
  }
  .anird-dropdown-separator {
    height: 1px; background: rgba(255,255,255,0.06); margin: 4px 8px;
  }
`;document.head.appendChild(f);class L{constructor(){this.lists=[],this.activeListId=null,this.listAnimeMap=new Map}async render(){const t=document.createElement("div");return t.className="page-enter page-container",t.innerHTML=`
      <style>
        .lists-hero {
          padding: 110px 5% 40px;
          position: relative;
        }
        .lists-hero::before {
          content: ''; position: absolute; inset: 0; top: 70px;
          background: radial-gradient(ellipse at 20% 50%, rgba(229,9,20,0.08) 0%, transparent 60%);
          pointer-events: none;
        }
        .lists-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px; position: relative; z-index: 1;
        }
        .lists-header h1 {
          font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 900;
          color: white; margin: 0;
        }
        .lists-header h1 span { color: var(--accent); }
        .lists-header-sub {
          color: var(--text-muted); font-size: 13px; font-weight: 600; margin-top: 4px;
        }
        .btn-new-list {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 11px 22px; border-radius: 14px;
          background: var(--accent); color: white;
          border: none; cursor: pointer;
          font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 700;
          box-shadow: 0 4px 20px rgba(229, 9, 20, 0.3);
          transition: all 0.2s;
        }
        .btn-new-list:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(229, 9, 20, 0.4); filter: brightness(1.1); }
        .btn-new-list:active { transform: translateY(0); }

        .lists-tabs {
          display: flex; gap: 6px; padding: 0 5%; margin-bottom: 24px;
          overflow-x: auto; scrollbar-width: none;
        }
        .lists-tabs::-webkit-scrollbar { display: none; }
        .list-tab {
          padding: 10px 20px; border-radius: 12px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          color: #a1a1aa; font-size: 13px; font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer; transition: all 0.25s; white-space: nowrap;
          display: flex; align-items: center; gap: 8px;
        }
        .list-tab:hover { background: rgba(255,255,255,0.08); color: white; }
        .list-tab.active {
          background: rgba(229, 9, 20, 0.12); border-color: rgba(229, 9, 20, 0.3);
          color: #e50914;
        }
        .list-tab-count {
          font-size: 10px; font-weight: 800;
          background: rgba(255,255,255,0.06); padding: 2px 7px;
          border-radius: 6px; color: #6b6b6b;
        }
        .list-tab.active .list-tab-count { background: rgba(229, 9, 20, 0.15); color: #e50914; }

        .lists-content { padding: 0 5% 120px; }

        .lists-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 24px;
        }

        .empty-state {
          text-align: center; padding: 80px 20px;
        }
        .empty-state-icon {
          width: 80px; height: 80px; border-radius: 24px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .empty-state h3 {
          font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 800;
          color: white; margin-bottom: 8px;
        }
        .empty-state p { color: var(--text-muted); font-size: 13px; max-width: 360px; margin: 0 auto 24px; line-height: 1.5; }

        .list-anime-card {
          position: relative; border-radius: 14px; overflow: hidden;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s; cursor: pointer;
        }
        .list-anime-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.12); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
        .list-anime-card img { width: 100%; aspect-ratio: 3/4.2; object-fit: cover; display: block; }
        .list-anime-card .card-info { padding: 12px; }
        .list-anime-card .card-title { font-size: 13px; font-weight: 700; color: white; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .list-anime-card .card-meta { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
        .list-anime-card .remove-btn {
          position: absolute; top: 8px; right: 8px;
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          color: #a1a1aa; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; transition: all 0.2s; font-size: 14px;
        }
        .list-anime-card:hover .remove-btn { opacity: 1; }
        .list-anime-card .remove-btn:hover { background: #e50914; color: white; border-color: #e50914; }

        @media (max-width: 640px) {
          .lists-header { flex-direction: column; align-items: flex-start; gap: 16px; }
          .lists-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; }
        }
      </style>

      <div class="lists-hero">
        <div class="lists-header">
          <div>
            <h1>Mis <span>Listas</span></h1>
            <p class="lists-header-sub">Organiza tu anime como quieras</p>
          </div>
          <button class="btn-new-list" id="btn-create-list">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva Lista
          </button>
        </div>
      </div>

      <div class="lists-tabs" id="lists-tabs"></div>
      <div class="lists-content" id="lists-content"></div>
    `,t}async afterRender(){await this.loadLists(),this._bindEvents()}async loadLists(){if(this.lists=await l.lists.orderBy("createdAt").reverse().toArray(),this.lists.length===0){const t=[{name:"Para Ver",animeIds:[],createdAt:Date.now()-3},{name:"Viendo",animeIds:[],createdAt:Date.now()-2},{name:"Completados",animeIds:[],createdAt:Date.now()-1},{name:"Favoritos Absolutos",animeIds:[],createdAt:Date.now()}];await l.lists.bulkAdd(t,{allKeys:!0}),this.lists=await l.lists.toArray(),c.success("Listas creadas","Se crearon 4 listas predeterminadas para ti")}!this.activeListId&&this.lists.length>0&&(this.activeListId=this.lists[0].id),this._renderTabs(),await this._renderContent()}_renderTabs(){const t=document.getElementById("lists-tabs");t&&(t.innerHTML=this.lists.map(a=>`
      <button class="list-tab ${a.id===this.activeListId?"active":""}" data-list-id="${a.id}">
        ${a.name}
        <span class="list-tab-count">${(a.animeIds||[]).length}</span>
      </button>
    `).join(""),t.querySelectorAll(".list-tab").forEach(a=>{a.addEventListener("click",()=>{this.activeListId=parseInt(a.dataset.listId),this._renderTabs(),this._renderContent()})}))}async _renderContent(){var r,s;const t=document.getElementById("lists-content");if(!t)return;const a=this.lists.find(e=>e.id===this.activeListId);if(!a){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>
          <h3>Crea tu primera lista</h3>
          <p>Organiza tus animes favoritos en listas personalizadas para encontrarlos fácilmente.</p>
          <button class="btn-new-list" onclick="document.getElementById('btn-create-list').click()">Crear Lista</button>
        </div>
      `;return}const i=a.animeIds||[];if(i.length===0){t.innerHTML=`
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          </div>
          <h3>${a.name} está vacía</h3>
          <p>Busca un anime y agregalo a esta lista desde su página de detalles.</p>
          <a href="/" data-link class="btn-new-list" style="text-decoration:none; display:inline-flex;">Explorar Anime</a>
        </div>
      `;return}t.innerHTML=`<div class="lists-grid" id="lists-anime-grid">
      ${Array.from({length:i.length},()=>`
        <div class="list-anime-card" style="opacity: 0.5; pointer-events: none;">
          <div class="skeleton" style="width:100%; aspect-ratio:3/4.2; border-radius: 0;"></div>
          <div class="card-info"><div class="skeleton" style="height:12px; width:80%; margin-bottom:6px;"></div><div class="skeleton" style="height:10px; width:40%;"></div></div>
        </div>
      `).join("")}
    </div>`;const n=document.getElementById("lists-anime-grid");for(const e of i)try{const d=await h.getAnimeInfo(e),o=d==null?void 0:d.data;if(!o)continue;const p=document.createElement("div");p.className="list-anime-card",p.innerHTML=`
          <a href="/anime/${e}" data-link style="display:block; text-decoration:none;">
            <img src="${((s=(r=o.images)==null?void 0:r.jpg)==null?void 0:s.large_image_url)||""}" alt="${o.title}" loading="lazy">
            <div class="card-info">
              <div class="card-title">${o.title}</div>
              <div class="card-meta">${o.score?"★ "+o.score:""} ${o.type||""} ${o.episodes?"· "+o.episodes+" eps":""}</div>
            </div>
          </a>
          <button class="remove-btn" data-remove-anime="${e}" title="Quitar de la lista">✕</button>
        `,p.querySelector(".remove-btn").addEventListener("click",async b=>{b.preventDefault(),b.stopPropagation(),await this._removeAnimeFromList(this.activeListId,e)}),n.appendChild(p);const m=n.querySelector('.list-anime-card[style*="opacity: 0.5"]');m&&m.remove()}catch(d){console.warn("Error loading anime for list:",e,d)}n.querySelectorAll('.list-anime-card[style*="opacity: 0.5"]').forEach(e=>e.remove())}async _removeAnimeFromList(t,a){const i=await l.lists.get(t);if(!i)return;const n=(i.animeIds||[]).filter(r=>r!==a);await l.lists.update(t,{animeIds:n}),c.success("Anime removido","Se eliminó de la lista correctamente"),await this.loadLists()}_bindEvents(){const t=document.getElementById("btn-create-list");t&&t.addEventListener("click",async()=>{const i=await g({title:"Nueva Lista",message:"Dale un nombre a tu nueva lista:",placeholder:"Ej: Top Isekai, Animes de Invierno...",confirmText:"Crear"});i&&(await l.lists.add({name:i,animeIds:[],createdAt:Date.now()}),c.success("Lista creada",`"${i}" se creó exitosamente`),this.activeListId=(await l.lists.orderBy("id").reverse().first()).id,await this.loadLists())});const a=document.getElementById("lists-tabs");a&&a.addEventListener("contextmenu",i=>{const n=i.target.closest(".list-tab");if(!n)return;i.preventDefault();const r=parseInt(n.dataset.listId),s=this.lists.find(e=>e.id===r);s&&(c.notify(`Lista: ${s.name}`,"Clic izquierdo para editar nombre, o espera...",{label:"Eliminar",onClick:async()=>{var d;await u({title:"Eliminar lista",message:`¿Estás seguro de eliminar "${s.name}"? Los animes no se eliminarán de tus favoritos o historial.`,confirmText:"Eliminar",danger:!0})&&(await l.lists.delete(r),c.success("Lista eliminada",`"${s.name}" fue eliminada`),this.activeListId===r&&(this.activeListId=((d=this.lists[0])==null?void 0:d.id)||null),await this.loadLists())}}),n.addEventListener("dblclick",async()=>{const e=await g({title:"Renombrar Lista",message:`Nuevo nombre para "${s.name}":`,defaultValue:s.name,confirmText:"Guardar"});e&&e!==s.name&&(await l.lists.update(r,{name:e}),c.success("Lista renombrada",`"${e}"`),await this.loadLists())},{once:!0}))})}}export{L as default};
