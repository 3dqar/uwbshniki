// ============================================
// ECON EMPIRE — API Layer
// Google Apps Script backend bridge
// ============================================

const API_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

const api = {
  login:       (username, password)        => post({ action: 'login', username, password }),
  register:    (username, password)        => post({ action: 'register', username, password }),
  update:      (username, coins, xp, level)=> post({ action: 'update', username, coins, xp, level }),
  leaderboard: ()                          => get({ action: 'leaderboard' }),
  getAll:      (adminPassword)             => get({ action: 'getAll', adminPassword }),
  adminUpdate: (data)                      => post({ action: 'adminUpdate', ...data }),
  deleteUser:  (username)                  => post({ action: 'deleteUser', username }),
};

async function get(params = {}) {
  try {
    const url = new URL(API_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('[API GET]', e);
    return { success: false, error: e.message };
  }
}

async function post(data = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('[API POST]', e);
    return { success: false, error: e.message };
  }
}

export default api;
