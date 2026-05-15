import { apiService } from '../services/api.js';

export class SearchPalette {
  constructor(router) {
    this.router = router;
    this.timeout = null;
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
          background: var(--bg-overlay);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 15vh;
          opacity: 0;
          visibility: hidden;
          transition: all var(--transition-smooth);
        }

        .search-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .search-modal {
          width: 100%;
          max-width: 640px;
          background: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-elevated);
          transform: scale(0.95);
          transition: transform var(--transition-smooth);
        }

        .search-overlay.active .search-modal {
          transform: scale(1);
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid var(--glass-border);
        }

        .search-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 1.1rem;
          outline: none;
        }

        .search-input-wrapper input::placeholder {
          color: var(--text-muted);
        }

        kbd {
          padding: 4px 8px;
          background: var(--surface);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .result-group {
          padding: 12px 0;
        }

        .result-group h4 {
          padding: 0 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--text-muted);
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .result-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
          cursor: pointer;
          transition: background var(--transition-fast);
          text-decoration: none;
          color: inherit;
        }

        .result-item:hover,
        .result-item.selected {
          background: var(--surface-hover);
        }

        .result-item img {
          width: 40px;
          height: 60px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .result-item-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .result-item-title {
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 400px;
        }

        .result-item-meta {
          font-size: 0.8rem;
          color: var(--text-secondary);
        }
      </style>
      <div class="search-modal">
        <div class="search-input-wrapper">
          <span style="color: var(--text-muted)">🔍</span>
          <input type="text" id="palette-input" placeholder="Buscar animes, géneros, episodios..." autocomplete="off">
          <kbd class="shortcut">ESC</kbd>
        </div>
        <div class="search-results" id="palette-results" style="max-height: 400px; overflow-y: auto;">
          <!-- Resultados aquí -->
          <div class="result-group" id="initial-suggestions">
             <h4>Sugerencias</h4>
             <a href="/category/popular" data-link class="result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <span style="font-size: 1.2rem;">🔥</span>
               <div class="result-item-info">
                 <div class="result-item-title">Animes Populares</div>
               </div>
             </a>
             <a href="/category/movies" data-link class="result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <span style="font-size: 1.2rem;">🎬</span>
               <div class="result-item-info">
                 <div class="result-item-title">Películas</div>
               </div>
             </a>
             <a href="/calendar" data-link class="result-item" onclick="document.getElementById('searchOverlay').classList.remove('active');">
               <span style="font-size: 1.2rem;">📅</span>
               <div class="result-item-info">
                 <div class="result-item-title">Calendario de Emisiones</div>
               </div>
             </a>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
    this.input = this.container.querySelector('#palette-input');
    this.resultsContainer = this.container.querySelector('#palette-results');
  }

  bindEvents() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }

      // Escape to close
      if (e.key === 'Escape' && this.container.classList.contains('active')) {
        this.close();
      }
    });

    // Close on click outside
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    // Handle input
    this.input.addEventListener('input', (e) => {
      const query = e.target.value.trim();

      clearTimeout(this.timeout);

      if (query.length < 3) {
        this.resultsContainer.innerHTML = `
          <div class="result-group">
            <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
              Escribe al menos 3 caracteres...
            </div>
          </div>
        `;
        return;
      }

      this.resultsContainer.innerHTML = `
        <div class="result-group">
          <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
            Buscando...
          </div>
        </div>
      `;

      this.timeout = setTimeout(async () => {
        try {
          const res = await apiService.getAnimeSearch(query);
          const results = (res.data || []).slice(0, 8);

          if (results.length > 0) {
            this.resultsContainer.innerHTML = `
              <div class="result-group">
                <h4>Animes</h4>
                <div class="result-items">
                  ${results.map(anime => `
                    <a href="/anime/${anime.mal_id || anime.id}" data-link class="result-item search-result-item">
                      <img src="${anime.images?.jpg?.image_url || anime.image || ''}" alt="" loading="lazy">
                      <div class="result-item-info">
                        <div class="result-item-title">${anime.title}</div>
                        <div class="result-item-meta">${anime.type || 'TV'} • ${anime.year || anime.status || ''}</div>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>
              <div class="result-group">
                 <a href="/search?q=${encodeURIComponent(query)}" data-link class="result-item" style="justify-content: center; color: var(--accent);">
                    Ver todos los resultados para "${query}"
                 </a>
              </div>
            `;

            // Agregar el manejador para cerrar el overlay al hacer clic en un resultado
            this.resultsContainer.querySelectorAll('.search-result-item, a[data-link]').forEach(item => {
              item.addEventListener('click', () => {
                this.close();
              });
            });

          } else {
            this.resultsContainer.innerHTML = `
              <div class="result-group">
                <div class="result-item" style="pointer-events: none; color: var(--text-muted);">
                  No se encontraron resultados para "${query}"
                </div>
              </div>
            `;
          }
        } catch (e) {
          console.error("Search error:", e);
          this.resultsContainer.innerHTML = `
            <div class="result-group">
              <div class="result-item" style="pointer-events: none; color: var(--danger);">
                Error al realizar la búsqueda
              </div>
            </div>
          `;
        }
      }, 400);
    });

    // Submit form (Enter key)
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
    this.input.value = '';
    // Restore initial suggestions state could be done here if needed
  }
}
