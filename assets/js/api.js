// ============================================
// ECON EMPIRE — API Layer
// Google Apps Script backend bridge
// ============================================

// Įrašykite čia savo Google Apps Script Web App /exec URL.
// Pvz: https://script.google.com/macros/s/AKfycb.../exec
const API_URL = 'https://script.google.com/macros/s/AKfycbzzfWIOehBTA-17G6zsdMY1ZoqAowWIN2Xq3sYslxWOfP5KA5FZ81Kqn_GY0TVhsQR2/exec';

const api = {
  login:       (username, password)         => post({ action: 'login', username, password }),
  register:    (username, password)         => post({ action: 'register', username, password }),
  update:      (username, coins, xp, level) => post({ action: 'update', username, coins, xp, level }),
  leaderboard: ()                           => post({ action: 'leaderboard' }),
  getAll:      (adminPassword)              => post({ action: 'getAll', adminPassword }),
  adminUpdate: (data)                       => post({ action: 'adminUpdate', ...data }),
  deleteUser:  (username)                   => post({ action: 'deleteUser', username }),
};

async function post(data = {}) {
  try {
    if (!API_URL || !/\/exec(?:\?|$)/.test(API_URL)) {
      return { success: false, error: 'Neteisingas API_URL. Reikia Apps Script /exec nuorodos.' };
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });

    const raw = await res.text();
    let parsed;
    try {
      parsed = raw ? JSON.parse(raw) : {};
    } catch {
      parsed = { success: false, error: raw || `HTTP ${res.status}` };
    }

    if (!res.ok) {
      const hint = res.status === 405
        ? 'HTTP 405. Patikrinkite, ar naudojate teisingą Apps Script Web App /exec URL ir ar deployment leidžia POST užklausas.'
        : `HTTP ${res.status}`;
      return { success: false, error: parsed.error || hint };
    }

    return parsed;
  } catch (e) {
    console.error('[API POST]', e);
    return { success: false, error: e.message || 'Nepavyko prisijungti prie backend.' };
  }
}

export default api;
