/**
 * AniRD Modal Component
 * Modal reutilizable con glassmorphism y animaciones suaves
 */

let activeModal = null;

const modalStyles = `
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
`;

export function openModal({ title = '', content = '', size = '', danger = false, footer = '', onClose = null, closeOnOverlay = true }) {
  // Close existing modal
  if (activeModal) closeModal();

  const overlay = document.createElement('div');
  overlay.className = 'anird-modal-overlay';
  overlay.innerHTML = `
    ${modalStyles}
    <div class="anird-modal ${size ? 'size-' + size : ''} ${danger ? 'danger' : ''}">
      <div class="anird-modal-header">
        <h3 class="anird-modal-title">${title}</h3>
        <button class="anird-modal-close" data-modal-close>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="anird-modal-body">${content}</div>
      ${footer ? `<div class="anird-modal-footer">${footer}</div>` : ''}
    </div>
  `;

  const modalEl = overlay.querySelector('.anird-modal');

  const doClose = () => {
    overlay.classList.add('closing');
    modalEl.classList.add('closing');
    setTimeout(() => {
      overlay.remove();
      activeModal = null;
      if (onClose) onClose();
    }, 200);
  };

  // Close on overlay click
  if (closeOnOverlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) doClose();
    });
  }

  // Close button
  overlay.querySelector('[data-modal-close]').addEventListener('click', doClose);

  // Escape key
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      doClose();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  activeModal = { overlay, close: doClose };
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Restore scroll on close
  const origOnClose = onClose;
  overlay._cleanup = () => {
    document.body.style.overflow = '';
  };
  const origDoClose = doClose;

  return { close: doClose, el: modalEl };
}

export function closeModal() {
  if (activeModal) {
    activeModal.close();
    document.body.style.overflow = '';
    activeModal = null;
  }
}

export function confirmModal({ title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', danger = false }) {
  return new Promise((resolve) => {
    const footer = `
      <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">${cancelText}</button>
      <button class="btn-v4-primary" data-modal-confirm style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700; ${danger ? 'background: #e50914; border-color: #e50914;' : ''}">${confirmText}</button>
    `;

    const { el } = openModal({
      title, content: `<p style="color: #a1a1aa; font-size: 14px; line-height: 1.6;">${message}</p>`,
      footer, danger, size: 'sm',
      onClose: () => resolve(false)
    });

    el.querySelector('[data-modal-confirm]').addEventListener('click', () => { closeModal(); resolve(true); });
    el.querySelector('[data-modal-cancel]').addEventListener('click', () => { closeModal(); resolve(false); });
  });
}

export function promptModal({ title, message, placeholder = '', defaultValue = '', confirmText = 'Aceptar' }) {
  return new Promise((resolve) => {
    const content = `
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 16px;">${message}</p>
      <input type="text" id="anird-modal-input" placeholder="${placeholder}" value="${defaultValue}"
        style="width: 100%; padding: 12px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05); color: white; font-size: 14px; font-family: 'Inter', sans-serif;
        outline: none; transition: border-color 0.2s;"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'"
      >
    `;
    const footer = `
      <button class="btn-v4-secondary" data-modal-cancel style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;">Cancelar</button>
      <button class="btn-v4-primary" data-modal-confirm style="padding: 10px 20px; border-radius: 12px; font-size: 13px; font-weight: 700;">${confirmText}</button>
    `;

    const { el } = openModal({
      title, content, footer, size: 'sm',
      onClose: () => resolve(null)
    });

    const input = el.querySelector('#anird-modal-input');
    setTimeout(() => input.focus(), 400);

    const submit = () => {
      const val = input.value.trim();
      closeModal();
      resolve(val || null);
    };

    el.querySelector('[data-modal-confirm]').addEventListener('click', submit);
    el.querySelector('[data-modal-cancel]').addEventListener('click', () => { closeModal(); resolve(null); });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
  });
}