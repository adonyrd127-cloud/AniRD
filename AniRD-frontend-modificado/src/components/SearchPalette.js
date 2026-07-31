import { apiService } from '../services/api.js';

export class SearchPalette {
  constructor(router) {
    this.router = router;
    this.timeout = null;
    this.abortController = null;
    this.render();
    this.bindEvents();
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'search-overlay';
    this.container.id = 'searchOverlay';

    this.container.innerHTML = `
      <style>
        .search-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10vh;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease-out;
        }

        .search-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .search-modal {
          width: 100%;
          max-width: 672px; /* max-w-2xl */
          margin: 0 16px;
          background: rgba(24, 24, 27, 0.95); /* zinc-900/95 */
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          transform: scale(0.95) translateY(-20px);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .search-overlay.active .search-modal {
          transform: scale(1) translateY(0);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .search-input-wrapper svg {
          width: 20px;
          height: 20px;
          color: #a1a1aa; /* zinc-400 */
        }

        .search-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          font-size: 1rem;
          font-family: 'Inter', sans-serif;
          outline: none;
        }

        .search-input-wrapper input::placeholder {
          color: #71717a; /* zinc-500 */
        }

        .clear-btn {
          background: none; border: none; padding: 0; margin: 0;
          color: #a1a1aa; cursor: pointer; display: none;
          transition: color 0.2s;
        }
        .clear-btn:hover { color: white; }
        .clear-btn.visible { display: flex; align-items: center; justify-content: center; }

        kbd {
          padding: 2px 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          font-size: 12px;
          color: #71717a;
          font-family: sans-serif;
        }
        @media (max-width: 640px) { kbd { display: none; } }

        .search-results {
          max-height: 60vh;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .search-results::-webkit-scrollbar { width: 6px; }
        .search-results::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .explore-group { padding: 16px; }
        .explore-title { font-size: 12px; font-weight: 500; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; padding: 0 8px; }
        .explore-item {
          display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 12px;
          border-radius: 12px; font-size: 14px; color: #d4d4d8; text-decoration: none;
          background: transparent; border: none; cursor: pointer; transition: all 0.2s;
        }
        .explore-item:hover { background: rgba(255,255,255,0.05); color: white; }
        
        .result-group { padding: 8px; }
        .result-item {
          display: flex; align-items: center; gap: 16px; width: 100%; padding: 12px;
          border-radius: 12px; text-decoration: none; transition: all 0.2s; cursor: pointer;
        }
        .result-item:hover { background: rgba(255,255,255,0.05); }

        .result-item img {
          width: 48px; height: 64px; border-radius: 8px; object-fit: cover; flex-shrink: 0;
        }

        .result-item-info { flex: 1; min-width: 0; text-align: left; }
        .result-item-title {
          font-size: 14px; font-weight: 500; color: white; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          transition: color 0.2s;
        }
        .result-item:hover .result-item-title { color: #f87171; /* red-400 */ }
        
        .result-item-meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #a1a1aa; }
        .score-meta { color: #fbbf24; display: flex; align-items: center; gap: 4px; }

        .result-item-genres { display: flex; gap: 6px; flex-shrink: 0; }
        .genre-badge {
          background: rgba(255,255,255,0.05); color: #a1a1aa;
          padding: 2px 8px; border-radius: 9999px; font-size: 10px;
        }

        .loading-state, .empty-state {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 48px 0; color: #71717a;
        }
        .loading-state svg { animation: spin 1s linear infinite; color: #ef4444; width: 24px; height: 24px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      </style>
      <div class="search-modal">
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" id="palette-input" placeholder="Buscar anime..." autocomplete="off">
          <button class="clear-btn" id="palette-clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <kbd>ESC</kbd>
        </div>
        <div class="search-results" id="palette-results">
          <!-- Default Explore State -->
          <div class="explore-group" id="explore-state">
             <div class="explore-title">Explorar</div>
             <a href="/category/popular" data-link class="explore-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
               Populares
             </a>
             <a href="/category/movies" data-link class="explore-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
               Películas
             </a>
             <a href="/calendar" data-link class="explore-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
               Emisión
             </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.input = this.container.querySelector('#palette-input');
    this.resultsContainer = this.container.querySelector('#palette-results');
    this.clearBtn = this.container.querySelector('#palette-clear');
    this.exploreStateHtml = this.container.querySelector('#explore-state').outerHTML;
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.container.classList.contains('active')) {
        this.close();
      }
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });

    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.input.focus();
      this.clearBtn.classList.remove('visible');
      this.resultsContainer.innerHTML = this.exploreStateHtml;
    });

    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      if (query.length > 0) {
        this.clearBtn.classList.add('visible');
      } else {
        this.clearBtn.classList.remove('visible');
      }

      if (this.abortController) this.abortController.abort();
      this.abortController = new AbortController();
      const signal = this.abortController.signal;

      if (query.length === 0) {
        this.resultsContainer.innerHTML = this.exploreStateHtml;
        return;
      }

      this.resultsContainer.innerHTML = `
        <div class="loading-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        </div>
      `;

      this.timeout = setTimeout(async () => {
        try {
          const res = await apiService.getAnimeSearch(query, { signal });
          if (signal.aborted) return;
          const results = (res.data || []).slice(0, 10);

          if (results.length > 0) {
            this.resultsContainer.innerHTML = `
              <div class="result-group">
                ${results.map(anime => `
                  <a href="/anime/${anime.mal_id || anime.id}" data-link class="result-item search-result-item">
                    <img src="${anime.images?.jpg?.image_url || anime.image || ''}" alt="">
                    <div class="result-item-info">
                      <div class="result-item-title">${anime.title_english || anime.title}</div>
                      <div class="result-item-meta">
                        ${anime.type ? `<span>${anime.type}</span>` : ''}
                        ${anime.score ? `<span class="score-meta">★ ${anime.score}</span>` : ''}
                        ${anime.year ? `<span>${anime.year}</span>` : ''}
                      </div>
                    </div>
                    <div class="result-item-genres">
                      ${(anime.genres || []).slice(0, 2).map(g => `<span class="genre-badge">${g.name}</span>`).join('')}
                    </div>
                  </a>
                `).join('')}
              </div>
            `;

            this.resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
              item.addEventListener('click', () => this.close());
            });

          } else {
            this.resultsContainer.innerHTML = `
              <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:32px;height:32px;margin-bottom:12px;opacity:0.3;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <p>No se encontraron resultados para "${query}"</p>
              </div>
            `;
          }
        } catch (e) {
          if (e.name === 'AbortError') return;
        }
      }, 400);
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = this.input.value.trim();
        if (query) {
          this.close();
          this.router.navigate(`/search?q=${encodeURIComponent(query)}`);
        }
      }
    });
  }

  open() {
    this.container.classList.add('active');
    this.input.focus();
  }

  close() {
    this.container.classList.remove('active');
  }
}
