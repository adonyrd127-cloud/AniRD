/**
 * AniRD Tooltip & Dropdown Components
 * Tooltips con delay inteligente y Dropdowns animados
 */

let activeDropdown = null;

// === TOOLTIP ===
export function initTooltips(root = document) {
  root.querySelectorAll('[data-tooltip]').forEach(el => {
    if (el._tooltipInit) return;
    el._tooltipInit = true;
    el.style.position = el.style.position || 'relative';

    const text = el.getAttribute('data-tooltip');
    const position = el.getAttribute('data-tooltip-pos') || 'top';

    const tip = document.createElement('div');
    tip.className = 'anird-tooltip';
    tip.textContent = text;
    tip.setAttribute('data-tooltip-pos', position);
    el.appendChild(tip);

    el.addEventListener('mouseenter', () => {
      clearTimeout(el._tipTimeout);
      el._tipTimeout = setTimeout(() => tip.classList.add('visible'), 400);
    });
    el.addEventListener('mouseleave', () => {
      clearTimeout(el._tipTimeout);
      tip.classList.remove('visible');
    });
  });
}

// Inject tooltip styles once
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
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
`;
document.head.appendChild(tooltipStyle);

// === DROPDOWN ===
export function createDropdown({ trigger, items = [], position = 'bottom-right', width = 'auto' }) {
  const menu = document.createElement('div');
  menu.className = 'anird-dropdown-menu';
  menu.style.minWidth = width;

  menu.innerHTML = items.map(item => {
    if (item.separator) return '<div class="anird-dropdown-separator"></div>';
    return `
      <button class="anird-dropdown-item ${item.danger ? 'danger' : ''} ${item.active ? 'active' : ''}"
        data-dropdown-action="${item.action || ''}"
        ${item.disabled ? 'disabled' : ''}>
        ${item.icon ? `<span class="anird-dropdown-icon">${item.icon}</span>` : ''}
        <span class="anird-dropdown-label">${item.label}</span>
        ${item.badge ? `<span class="anird-dropdown-badge">${item.badge}</span>` : ''}
      </button>
    `;
  }).join('');

  // Position
  if (position.includes('bottom')) { menu.style.top = 'calc(100% + 6px)'; }
  if (position.includes('top')) { menu.style.bottom = 'calc(100% + 6px)'; }
  if (position.includes('left')) { menu.style.right = 0; }
  if (position.includes('right')) { menu.style.left = 0; }

  trigger.style.position = 'relative';
  trigger.appendChild(menu);

  const toggle = (show) => {
    if (show === undefined) show = !menu.classList.contains('open');
    if (show) {
      // Close other dropdowns
      if (activeDropdown && activeDropdown !== menu) {
        activeDropdown.classList.remove('open');
      }
      menu.classList.add('open');
      activeDropdown = menu;
    } else {
      menu.classList.remove('open');
      if (activeDropdown === menu) activeDropdown = null;
    }
  };

  trigger.addEventListener('click', (e) => {
    if (e.target.closest('[data-dropdown-action]')) {
      const action = e.target.closest('[data-dropdown-action]').dataset.dropdownAction;
      const item = items.find(i => i.action === action);
      if (item && item.onClick) item.onClick(e);
      toggle(false);
      return;
    }
    e.stopPropagation();
    toggle();
  });

  return { toggle, menu };
}

// Close all dropdowns on outside click
document.addEventListener('click', () => {
  if (activeDropdown) {
    activeDropdown.classList.remove('open');
    activeDropdown = null;
  }
});

// Inject dropdown styles
const dropdownStyle = document.createElement('style');
dropdownStyle.textContent = `
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
`;
document.head.appendChild(dropdownStyle);