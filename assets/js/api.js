// ============================================
// ECON EMPIRE — API Layer
// Google Apps Script backend bridge
// ============================================

// ▼▼▼ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE ▼▼▼
const API_URL = 'https://script.google.com/macros/s/AKfycbzzfWIOehBTA-17G6zsdMY1ZoqAowWIN2Xq3sYslxWOfP5KA5FZ81Kqn_GY0TVhsQR2/exec';
// ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

const api = {
  login:       (username, password)         => post({ action: 'login', username, password }),
  register:    (username, password)         => post({ action: 'register', username, password }),
  update:      (username, coins, xp, level) => post({ action: 'update', username, coins, xp, level }),
  leaderboard: ()                           => post({ action: 'leaderboard' }),
  getAll:      (adminPassword)              => post({ action: 'getAll', adminPassword }),
  adminUpdate: (data)                       => post({ action: 'adminUpdate', ...data }),
  deleteUser:  (username)                   => post({ action: 'deleteUser', username }),
};

// All requests use POST + JSON body with Content-Type: text/plain
// to avoid CORS preflight (required by Google Apps Script).
async function post(data = {}) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
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
