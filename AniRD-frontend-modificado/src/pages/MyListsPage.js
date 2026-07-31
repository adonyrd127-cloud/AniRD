/**
 * AniRD MyListsPage — Listas Personalizadas
 * Gestión completa de listas: crear, editar, eliminar, agregar/quitar anime
 */
import { dbService, db } from '../services/db.js';
import { authService } from '../services/auth.service.js';
import { openModal, closeModal, confirmModal, promptModal } from '../components/Modal.js';
import { Toast } from '../components/Toast.js';
import { createDropdown } from '../components/Dropdown.js';
import { apiService } from '../services/api.js';
import '../components/AnimeCard.js';

export default class MyListsPage {
  constructor() {
    this.lists = [];
    this.activeListId = null;
    this.listAnimeMap = new Map();
  }

  async render() {
    const container = document.createElement('div');
    container.className = 'page-enter page-container';

    container.innerHTML = `
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
    `;

    return container;
  }

  async afterRender() {
    await this.loadLists();
    this._bindEvents();
  }

  async loadLists() {
    this.lists = await db.lists.orderBy('createdAt').reverse().toArray();

    // If no default lists exist, create them
    if (this.lists.length === 0) {
      const defaults = [
        { name: 'Para Ver', animeIds: [], createdAt: Date.now() - 3 },
        { name: 'Viendo', animeIds: [], createdAt: Date.now() - 2 },
        { name: 'Completados', animeIds: [], createdAt: Date.now() - 1 },
        { name: 'Favoritos Absolutos', animeIds: [], createdAt: Date.now() }
      ];
      const ids = await db.lists.bulkAdd(defaults, { allKeys: true });
      this.lists = await db.lists.toArray();
      Toast.success('Listas creadas', 'Se crearon 4 listas predeterminadas para ti');
    }

    if (!this.activeListId && this.lists.length > 0) {
      this.activeListId = this.lists[0].id;
    }

    this._renderTabs();
    await this._renderContent();
  }

  _renderTabs() {
    const tabsEl = document.getElementById('lists-tabs');
    if (!tabsEl) return;

    tabsEl.innerHTML = this.lists.map(list => `
      <button class="list-tab ${list.id === this.activeListId ? 'active' : ''}" data-list-id="${list.id}">
        ${list.name}
        <span class="list-tab-count">${(list.animeIds || []).length}</span>
      </button>
    `).join('');

    tabsEl.querySelectorAll('.list-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.activeListId = parseInt(tab.dataset.listId);
        this._renderTabs();
        this._renderContent();
      });
    });
  }

  async _renderContent() {
    const contentEl = document.getElementById('lists-content');
    if (!contentEl) return;

    const list = this.lists.find(l => l.id === this.activeListId);
    if (!list) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
          </div>
          <h3>Crea tu primera lista</h3>
          <p>Organiza tus animes favoritos en listas personalizadas para encontrarlos fácilmente.</p>
          <button class="btn-new-list" onclick="document.getElementById('btn-create-list').click()">Crear Lista</button>
        </div>
      `;
      return;
    }

    const animeIds = list.animeIds || [];

    if (animeIds.length === 0) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
          </div>
          <h3>${list.name} está vacía</h3>
          <p>Busca un anime y agregalo a esta lista desde su página de detalles.</p>
          <a href="/" data-link class="btn-new-list" style="text-decoration:none; display:inline-flex;">Explorar Anime</a>
        </div>
      `;
      return;
    }

    contentEl.innerHTML = `<div class="lists-grid" id="lists-anime-grid">
      ${Array.from({ length: animeIds.length }, () => `
        <div class="list-anime-card" style="opacity: 0.5; pointer-events: none;">
          <div class="skeleton" style="width:100%; aspect-ratio:3/4.2; border-radius: 0;"></div>
          <div class="card-info"><div class="skeleton" style="height:12px; width:80%; margin-bottom:6px;"></div><div class="skeleton" style="height:10px; width:40%;"></div></div>
        </div>
      `).join('')}
    </div>`;

    const grid = document.getElementById('lists-anime-grid');

    // Fetch anime details for each ID
    for (const animeId of animeIds) {
      try {
        const res = await apiService.getAnimeInfo(animeId);
        const anime = res?.data;
        if (!anime) continue;

        const card = document.createElement('div');
        card.className = 'list-anime-card';
        card.innerHTML = `
          <a href="/anime/${animeId}" data-link style="display:block; text-decoration:none;">
            <img src="${anime.images?.jpg?.large_image_url || ''}" alt="${anime.title}" loading="lazy">
            <div class="card-info">
              <div class="card-title">${anime.title}</div>
              <div class="card-meta">${anime.score ? '★ ' + anime.score : ''} ${anime.type || ''} ${anime.episodes ? '· ' + anime.episodes + ' eps' : ''}</div>
            </div>
          </a>
          <button class="remove-btn" data-remove-anime="${animeId}" title="Quitar de la lista">✕</button>
        `;

        // Remove from list
        card.querySelector('.remove-btn').addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await this._removeAnimeFromList(this.activeListId, animeId);
        });

        grid.appendChild(card);

        // Remove first skeleton
        const firstSkeleton = grid.querySelector('.list-anime-card[style*="opacity: 0.5"]');
        if (firstSkeleton) firstSkeleton.remove();
      } catch (err) {
        console.warn('Error loading anime for list:', animeId, err);
      }
    }

    // Remove remaining skeletons
    grid.querySelectorAll('.list-anime-card[style*="opacity: 0.5"]').forEach(s => s.remove());
  }

  async _removeAnimeFromList(listId, animeId) {
    const list = await db.lists.get(listId);
    if (!list) return;

    const updatedIds = (list.animeIds || []).filter(id => id !== animeId);
    await db.lists.update(listId, { animeIds: updatedIds });
    Toast.success('Anime removido', 'Se eliminó de la lista correctamente');
    await this.loadLists();
  }

  _bindEvents() {
    const createBtn = document.getElementById('btn-create-list');
    if (createBtn) {
      createBtn.addEventListener('click', async () => {
        const name = await promptModal({
          title: 'Nueva Lista',
          message: 'Dale un nombre a tu nueva lista:',
          placeholder: 'Ej: Top Isekai, Animes de Invierno...',
          confirmText: 'Crear'
        });

        if (name) {
          await db.lists.add({ name, animeIds: [], createdAt: Date.now() });
          Toast.success('Lista creada', `"${name}" se creó exitosamente`);
          this.activeListId = (await db.lists.orderBy('id').reverse().first()).id;
          await this.loadLists();
        }
      });
    }

    // Context menu for list tabs (right-click or long-press)
    const tabsEl = document.getElementById('lists-tabs');
    if (tabsEl) {
      tabsEl.addEventListener('contextmenu', (e) => {
        const tab = e.target.closest('.list-tab');
        if (!tab) return;
        e.preventDefault();
        const listId = parseInt(tab.dataset.listId);
        const list = this.lists.find(l => l.id === listId);
        if (!list) return;

        // Use toast for quick actions
        Toast.notify(
          `Lista: ${list.name}`,
          'Clic izquierdo para editar nombre, o espera...',
          {
            label: 'Eliminar',
            onClick: async () => {
              const confirmed = await confirmModal({
                title: 'Eliminar lista',
                message: `¿Estás seguro de eliminar "${list.name}"? Los animes no se eliminarán de tus favoritos o historial.`,
                confirmText: 'Eliminar',
                danger: true
              });
              if (confirmed) {
                await db.lists.delete(listId);
                Toast.success('Lista eliminada', `"${list.name}" fue eliminada`);
                if (this.activeListId === listId) {
                  this.activeListId = this.lists[0]?.id || null;
                }
                await this.loadLists();
              }
            }
          }
        );

        // Double click to rename
        tab.addEventListener('dblclick', async () => {
          const newName = await promptModal({
            title: 'Renombrar Lista',
            message: `Nuevo nombre para "${list.name}":`,
            defaultValue: list.name,
            confirmText: 'Guardar'
          });
          if (newName && newName !== list.name) {
            await db.lists.update(listId, { name: newName });
            Toast.success('Lista renombrada', `"${newName}"`);
            await this.loadLists();
          }
        }, { once: true });
      });
    }
  }
}