// ============================================
// ECON EMPIRE — API Layer
// Google Apps Script backend + localStorage fallback
// ============================================

// Įrašykite čia savo Google Apps Script Web App /exec URL.
// Jei URL neteisingas arba nepasiekiamas — žaidimas veiks lokaliai (localStorage).
const API_URL = 'https://script.google.com/macros/s/AKfycbzzfWIOehBTA-17G6zsdMY1ZoqAowWIN2Xq3sYslxWOfP5KA5FZ81Kqn_GY0TVhsQR2/exec';

// ── LOCAL STORAGE DB (fallback kai nėra interneto / API neveikia) ──────────────

const DB_KEY = 'ee_localdb';

function localDB() {
  try { return JSON.parse(localStorage.getItem(DB_KEY) || '{}'); } catch { return {}; }
}
function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function localLogin(username, password) {
  const db = localDB();
  const u = db[username.toLowerCase()];
  if (!u) return { success: false, error: 'Vartotojas nerastas.' };
  if (u.password !== password) return { success: false, error: 'Neteisingas slaptažodis.' };
  return { success: true, user: { username: u.username, coins: u.coins || 0, xp: u.xp || 0, level: u.level || 1 } };
}

function localRegister(username, password) {
  const db = localDB();
  const key = username.toLowerCase();
  if (db[key]) return { success: false, error: 'Toks vartotojas jau egzistuoja.' };
  if (username.length < 3) return { success: false, error: 'Vardas turi būti bent 3 simboliai.' };
  if (password.length < 8) return { success: false, error: 'Slaptažodis turi būti bent 8 simboliai.' };
  db[key] = { username, password, coins: 0, xp: 0, level: 1 };
  saveDB(db);
  return { success: true, user: { username, coins: 0, xp: 0, level: 1 } };
}

function localUpdate(username, coins, xp, level) {
  const db = localDB();
  const key = username.toLowerCase();
  if (db[key]) {
    db[key].coins = coins;
    db[key].xp    = xp;
    db[key].level = level;
    saveDB(db);
  }
  return { success: true };
}

function localLeaderboard() {
  const db = localDB();
  const players = Object.values(db).map(u => ({
    username: u.username,
    coins:    u.coins || 0,
    xp:       u.xp    || 0,
    level:    u.level || 1,
  }));
  return { success: true, data: players };
}

function localGetAll(adminPassword) {
  if (adminPassword !== 'admin123') return { success: false, error: 'Neteisingas admin slaptažodis.' };
  const db = localDB();
  const players = Object.values(db).map(u => ({
    username: u.username,
    coins:    u.coins || 0,
    xp:       u.xp    || 0,
    level:    u.level || 1,
  }));
  return { success: true, data: players };
}

function localAdminUpdate(data) {
  if (data.adminPassword !== 'admin123') return { success: false, error: 'Nepakankamos teisės.' };
  const db  = localDB();
  const key = (data.origUsername || '').toLowerCase();
  if (!db[key]) return { success: false, error: 'Vartotojas nerastas.' };
  if (data.username) db[key].username = data.username;
  if (data.password) db[key].password = data.password;
  if (data.coins  !== undefined) db[key].coins = Number(data.coins);
  if (data.xp     !== undefined) db[key].xp    = Number(data.xp);
  if (data.level  !== undefined) db[key].level = Number(data.level);
  saveDB(db);
  return { success: true };
}

function localDeleteUser(username) {
  const db  = localDB();
  const key = username.toLowerCase();
  if (!db[key]) return { success: false, error: 'Vartotojas nerastas.' };
  delete db[key];
  saveDB(db);
  return { success: true };
}

// ── REMOTE API (Google Apps Script) ───────────────────────────────────────────

const REMOTE_OK = API_URL && /\/exec(?:\?|$)/.test(API_URL);

async function post(data = {}) {
  if (!REMOTE_OK) return null; // skip immediately, use local
  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 6000); // 6s timeout
    const res = await fetch(API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'text/plain' },
      body:    JSON.stringify(data),
      signal:  controller.signal,
    });
    clearTimeout(timeout);
    const raw = await res.text();
    try { return raw ? JSON.parse(raw) : {}; }
    catch { return { success: false, error: raw || `HTTP ${res.status}` }; }
  } catch {
    return null; // network error → fallback to local
  }
}

// ── PUBLIC API ─────────────────────────────────────────────────────────────────

const api = {

  async login(username, password) {
    const remote = await post({ action: 'login', username, password });
    if (remote && remote.success) return remote;
    // fallback
    return localLogin(username, password);
  },

  async register(username, password) {
    const remote = await post({ action: 'register', username, password });
    if (remote && remote.success) {
      // also save locally so offline works after register
      localRegister(username, password);
      return remote;
    }
    return localRegister(username, password);
  },

  async update(username, coins, xp, level) {
    localUpdate(username, coins, xp, level); // always update locally
    const remote = await post({ action: 'update', username, coins, xp, level });
    return remote && remote.success ? remote : { success: true };
  },

  async leaderboard() {
    const remote = await post({ action: 'leaderboard' });
    if (remote && remote.success) return remote;
    return localLeaderboard();
  },

  async getAll(adminPassword) {
    const remote = await post({ action: 'getAll', adminPassword });
    if (remote && remote.success) return remote;
    return localGetAll(adminPassword);
  },

  async adminUpdate(data) {
    const remote = await post({ action: 'adminUpdate', ...data });
    if (remote && remote.success) return remote;
    return localAdminUpdate(data);
  },

  async deleteUser(username) {
    localDeleteUser(username);
    const remote = await post({ action: 'deleteUser', username });
    return remote && remote.success ? remote : { success: true };
  },
};

export default api;
