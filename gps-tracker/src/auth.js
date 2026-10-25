// ---------------------------------------------------------------------------
// DEMO AUTH – front-end only.
//
// This keeps the UI flow working (login -> dashboard -> logout) but it is NOT
// secure: anything in a browser bundle can be read by visitors. Before going
// live, replace `login()` with a call to your backend (e.g. POST /api/login
// that returns a session cookie or JWT) and verify the session on the server.
// ---------------------------------------------------------------------------

export const DEMO_CREDENTIALS = { adminId: 'admin123', password: 'admin' }

const KEY = 'trackpulse.session'

function read(storage) {
  try {
    return JSON.parse(storage.getItem(KEY))
  } catch {
    return null
  }
}

export function getSession() {
  return read(sessionStorage) || read(localStorage)
}

export function logout() {
  try {
    sessionStorage.removeItem(KEY)
    localStorage.removeItem(KEY)
  } catch {
    /* storage unavailable – nothing to clear */
  }
}

/** Resolves with the session user, or rejects with an Error whose message is shown in the form. */
export async function login({ adminId, password, remember }) {
  // TODO: replace this block with a real API request
  await new Promise((r) => setTimeout(r, 900))
  const ok = adminId.trim() === DEMO_CREDENTIALS.adminId && password === DEMO_CREDENTIALS.password
  if (!ok) throw new Error('Incorrect Admin ID or password. Please try again.')

  const session = { name: 'Fleet Admin', adminId: DEMO_CREDENTIALS.adminId, role: 'Administrator', at: Date.now() }
  try {
    ;(remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(session))
  } catch {
    /* session lives in memory only if storage is blocked */
  }
  return session
}
