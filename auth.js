/* ══════════════════════════════════
   VÈLO — auth.js
   Simple client-side admin login.
   NOTE: This is a front-end-only demo gate (no server).
   Credentials live in this browser's localStorage — it stops
   casual access, not a determined attacker. For real protection
   you'd need a server-side login.
══════════════════════════════════ */

const VELO_AUTH_KEY = 'velo_admin_auth_v1';
const VELO_SESSION_KEY = 'velo_admin_session_v1';

const VELO_DEFAULT_AUTH = { username: 'admin', password: 'velo2026' };

function veloGetAuth() {
  const raw = localStorage.getItem(VELO_AUTH_KEY);
  if (!raw) {
    localStorage.setItem(VELO_AUTH_KEY, JSON.stringify(VELO_DEFAULT_AUTH));
    return Object.assign({}, VELO_DEFAULT_AUTH);
  }
  try {
    const parsed = JSON.parse(raw);
    return parsed && parsed.username && parsed.password ? parsed : Object.assign({}, VELO_DEFAULT_AUTH);
  } catch (e) {
    return Object.assign({}, VELO_DEFAULT_AUTH);
  }
}

function veloLogin(username, password) {
  const auth = veloGetAuth();
  if (username.trim() === auth.username && password === auth.password) {
    sessionStorage.setItem(VELO_SESSION_KEY, '1');
    return true;
  }
  return false;
}

function veloIsLoggedIn() {
  return sessionStorage.getItem(VELO_SESSION_KEY) === '1';
}

function veloLogout() {
  sessionStorage.removeItem(VELO_SESSION_KEY);
  window.location.href = 'admin-login.html';
}

// Call at the very top of any protected admin page.
function veloRequireLogin() {
  if (!veloIsLoggedIn()) {
    window.location.href = 'admin-login.html';
  }
}

function veloChangeCredentials(currentPassword, newUsername, newPassword) {
  const auth = veloGetAuth();
  if (currentPassword !== auth.password) return false;
  const updated = {
    username: (newUsername || '').trim() || auth.username,
    password: newPassword || auth.password
  };
  localStorage.setItem(VELO_AUTH_KEY, JSON.stringify(updated));
  return true;
}
