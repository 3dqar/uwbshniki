// ============================================
// ECON EMPIRE — UI Helpers
// ============================================

export function toast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span><span>${msg}</span>`;
  c.appendChild(el);
  requestAnimationFrame(() => el.classList.add('visible'));
  setTimeout(() => { el.classList.remove('visible'); setTimeout(() => el.remove(), 300); }, 2800);
}

export function setActive(page) {
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.page === page);
  });
}

export function countUp(el, target, duration = 900, prefix = '', suffix = '') {
  const start = parseInt(el.dataset.prev || 0);
  el.dataset.prev = target;
  const diff = target - start;
  const startTime = performance.now();
  const step = (now) => {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    const val = Math.floor(start + diff * ease);
    el.textContent = prefix + val.toLocaleString('lt-LT') + suffix;
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function loading(el, on = true) {
  if (on) el.classList.add('shimmer');
  else el.classList.remove('shimmer');
}

export function ripple(btn) {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    r.className = 'ripple-effect';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
  });
}

export function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K';
  return Math.floor(n).toLocaleString('lt-LT');
}
