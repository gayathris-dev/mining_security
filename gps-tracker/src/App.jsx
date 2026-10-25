import { useCallback, useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import Landing from './landing/Landing'
import Login from './Login'
import { getSession, logout } from './auth'

// Hash routes: ''  -> landing, '#/login' -> admin login, '#/app' -> dashboard (needs a session)
const currentRoute = () => {
  const h = window.location.hash
  if (h === '#/app') return 'app'
  if (h === '#/login') return 'login'
  return 'landing'
}

export default function App() {
  const [route, setRoute] = useState(currentRoute())
  const [user, setUser] = useState(getSession())

  useEffect(() => {
    const onHash = () => setRoute(currentRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = useCallback((hash) => {
    if (window.location.hash === hash) setRoute(currentRoute())
    else window.location.hash = hash
  }, [])

  const goHome = useCallback(() => {
    history.pushState('', document.title, window.location.pathname + window.location.search)
    setRoute('landing')
  }, [])

  // Route guard: dashboard needs a session, login page is skipped when already signed in
  const view = route === 'app' && !user ? 'login' : route === 'login' && user ? 'app' : route

  useEffect(() => {
    if (view !== route) navigate(view === 'landing' ? '' : `#/${view}`)
  }, [view, route, navigate])

  useEffect(() => {
    document.body.classList.toggle('app-mode', view === 'app')
    if (view !== 'app') window.scrollTo(0, 0)
  }, [view])

  const handleLogin = (session) => {
    setUser(session)
    navigate('#/app')
  }
  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('#/login')
  }

  if (view === 'login') return <Login onSuccess={handleLogin} onHome={goHome} />
  if (view === 'app') return <Dashboard user={user} onHome={goHome} onLogout={handleLogout} />
  return <Landing onLaunch={() => navigate('#/app')} />
}
