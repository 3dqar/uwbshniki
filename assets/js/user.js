// ============================================
// ECON EMPIRE — User / Session
// UI labels: coins=Kapitalas, xp=Žinios, level=Verslo lygis
// ============================================

const BUSINESSES = [
  { level: 1,  name: 'Gatvės Kioskas',    emoji: '🛒', income: 10,   coinCost: 0,      xpCost: 0    },
  { level: 2,  name: 'Kavinė',             emoji: '☕', income: 35,   coinCost: 500,    xpCost: 100  },
  { level: 3,  name: 'Parduotuvė',         emoji: '🏪', income: 80,   coinCost: 2000,   xpCost: 300  },
  { level: 4,  name: 'Gamykla',            emoji: '🏭', income: 200,  coinCost: 8000,   xpCost: 800  },
  { level: 5,  name: 'Verslo Centras',     emoji: '🏢', income: 500,  coinCost: 25000,  xpCost: 2000 },
  { level: 6,  name: 'Investicijų Fondas', emoji: '💼', income: 1200, coinCost: 80000,  xpCost: 5000 },
  { level: 7,  name: 'Korporacija',        emoji: '🌐', income: 3000, coinCost: 250000, xpCost: 12000},
  { level: 8,  name: 'Tech Imperija',      emoji: '🚀', income: 8000, coinCost: 1000000,xpCost: 30000},
];

const XP_PER_LEVEL = 500;

export function calcLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getLevelInfo(xp) {
  const level      = calcLevel(xp);
  const current    = (xp % XP_PER_LEVEL);
  const needed     = XP_PER_LEVEL;
  const progress   = Math.min(current / needed, 1);
  const business   = BUSINESSES.find(b => b.level === Math.min(level, 8)) || BUSINESSES[7];
  const nextBiz    = BUSINESSES.find(b => b.level === Math.min(level + 1, 8)) || null;
  return { level, current, needed, progress, business, nextBiz };
}

export function getBusinessByLevel(level) {
  return BUSINESSES.find(b => b.level === Math.min(level, 8)) || BUSINESSES[0];
}

export function getAllBusinesses() {
  return BUSINESSES;
}

// ── SESSION ──────────────────────────────────

const KEY = 'ee_user';

export function getUser() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}

export function setUser(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function saveUser(data) {
  const current = getUser() || {};
  setUser({ ...current, ...data });
}

export function clearUser() {
  localStorage.removeItem(KEY);
}

export function requireAuth() {
  if (!getUser()) { window.location.href = '/login.html'; }
}

export function requireAdmin() {
  const u = getUser();
  if (!u || u.role !== 'admin') { window.location.href = '/app.html'; }
}

// ── PASSIVE INCOME TICK ───────────────────────

export function getPassiveIncome(user) {
  const info = getLevelInfo(user.xp || 0);
  return info.business.income;
}

const user = {
  getUser, setUser, saveUser, clearUser,
  requireAuth, requireAdmin,
  calcLevel, getLevelInfo, getBusinessByLevel,
  getAllBusinesses, getPassiveIncome,
};

export default user;
