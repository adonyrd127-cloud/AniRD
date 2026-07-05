/**
 * AniRD Toast Notification System
 * Sistema de notificaciones toast reutilizables con animaciones suaves
 */

let toastContainer = null;
let toastQueue = [];
let isProcessing = false;

const TOAST_ICONS = {
  success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  notification: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`
};

const TOAST_COLORS = {
  success: { bg: 'rgba(70, 211, 105, 0.12)', border: 'rgba(70, 211, 105, 0.3)', text: '#46d369', icon: '#46d369' },
  error: { bg: 'rgba(229, 9, 20, 0.12)', border: 'rgba(229, 9, 20, 0.3)', text: '#e50914', icon: '#e50914' },
  info: { bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa', icon: '#60a5fa' },
  warning: { bg: 'rgba(232, 124, 3, 0.12)', border: 'rgba(232, 124, 3, 0.3)', text: '#e87c03', icon: '#e87c03' },
  notification: { bg: 'rgba(229, 9, 20, 0.12)', border: 'rgba(229, 9, 20, 0.25)', text: '#ffffff', icon: '#e50914' }
};

function ensureContainer() {
  if (toastContainer) return toastContainer;
  toastContainer = document.createElement('div');
  toastContainer.id = 'anird-toast-container';
  toastContainer.innerHTML = `<style>
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
  </style>`;
  document.body.appendChild(toastContainer);
  return toastContainer;
}

function processQueue() {
  if (isProcessing || toastQueue.length === 0) return;
  isProcessing = true;
  const toast = toastQueue.shift();
  showToast(toast);
}

function showToast({ type = 'info', title = '', message = '', duration = 4000, action = null, onClose = null }) {
  const container = ensureContainer();
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;
  const icon = TOAST_ICONS[type] || TOAST_ICONS.info;

  const el = document.createElement('div');
  el.className = 'anird-toast';
  el.style.background = colors.bg;
  el.style.borderColor = colors.border;
  el.style.setProperty('--duration', `${duration}ms`);

  let actionHTML = '';
  if (action) {
    actionHTML = `<button class="toast-action" data-toast-action style="background: ${colors.border}; color: ${colors.text};">${action.label}</button>`;
  }

  el.innerHTML = `
    <div class="toast-icon" style="background: ${colors.bg}; color: ${colors.icon};">${icon}</div>
    <div class="toast-content">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      ${message ? `<div class="toast-message">${message}</div>` : ''}
      ${actionHTML}
    </div>
    <button class="toast-close" data-toast-close>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div class="toast-progress" style="background: ${colors.icon};"></div>
  `;

  // Action handler
  const actionBtn = el.querySelector('[data-toast-action]');
  if (actionBtn && action && action.onClick) {
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      action.onClick();
      removeToast(el, onClose);
    });
  }

  // Close handler
  el.querySelector('[data-toast-close]').addEventListener('click', () => removeToast(el, onClose));

  container.appendChild(el);

  // Auto remove
  const timeout = setTimeout(() => removeToast(el, onClose), duration);
  el._timeout = timeout;

  // Hover pause
  el.addEventListener('mouseenter', () => { clearTimeout(el._timeout); el.querySelector('.toast-progress').style.animationPlayState = 'paused'; });
  el.addEventListener('mouseleave', () => {
    el._timeout = setTimeout(() => removeToast(el, onClose), 2000);
    el.querySelector('.toast-progress').style.animationPlayState = 'running';
  });
}

function removeToast(el, onClose) {
  if (el._removed) return;
  el._removed = true;
  clearTimeout(el._timeout);
  el.classList.add('removing');
  setTimeout(() => {
    el.remove();
    if (onClose) onClose();
    isProcessing = false;
    processQueue();
  }, 350);
}

export const Toast = {
  show(options) {
    toastQueue.push(options);
    processQueue();
  },
  success(title, message, duration) {
    this.show({ type: 'success', title, message, duration });
  },
  error(title, message, duration) {
    this.show({ type: 'error', title, message, duration: duration || 5000 });
  },
  info(title, message, duration) {
    this.show({ type: 'info', title, message, duration });
  },
  warning(title, message, duration) {
    this.show({ type: 'warning', title, message, duration });
  },
  notify(title, message, action, duration) {
    this.show({ type: 'notification', title, message, action, duration: duration || 6000 });
  }
};