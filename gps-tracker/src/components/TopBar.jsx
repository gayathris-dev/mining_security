import { useEffect, useState } from 'react'
import { Container, Dropdown } from 'react-bootstrap'
import { formatClock } from '../utils'

const TABS = [
  ['live', 'Live tracking', 'bi-map'],
  ['drivers', 'Drivers & loads', 'bi-person-vcard'],
]

export default function TopBar({ paused, onTogglePause, alertCount, onHome, onLogout, user, tab, onTab }) {
  const initials = (user?.name || 'Admin')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="topbar">
      <Container fluid className="d-flex align-items-center gap-3 px-0">
        <button
          className="d-flex align-items-center gap-2 bg-transparent border-0 p-0 text-reset"
          onClick={onHome}
          title="Back to website"
        >
          <div className="brand-mark">
            <i className="bi bi-geo-alt-fill" />
          </div>
          <span className="brand-name">TrackPulse</span>
        </button>

        <nav className="tab-nav d-flex gap-1 ms-lg-3">
          {TABS.map(([key, label, icon]) => (
            <a
              key={key}
              href="#!"
              className={`nav-pill ${tab === key ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault()
                onTab(key)
              }}
            >
              <i className={`bi ${icon} me-1`} />
              <span className="d-none d-sm-inline">{label}</span>
            </a>
          ))}
        </nav>

        <div className="ms-auto d-flex align-items-center gap-2">
          <span className="live-chip d-none d-sm-inline-flex">
            <span className={`pulse-dot ${paused ? 'paused' : ''}`} />
            {paused ? 'Paused' : 'Live'} · {formatClock(now)}
          </span>
          <button className="icon-btn" onClick={onTogglePause} title={paused ? 'Resume live feed' : 'Pause live feed'}>
            <i className={`bi ${paused ? 'bi-play-fill' : 'bi-pause-fill'}`} />
          </button>
          <button className="icon-btn" title="Alerts">
            <i className="bi bi-bell" />
            {alertCount > 0 && <span className="count">{alertCount > 99 ? '99+' : alertCount}</span>}
          </button>
          <Dropdown align="end">
            <Dropdown.Toggle as="div" role="button" className="avatar" id="user-menu">
              {initials}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Header>
                {user?.name || 'Fleet Admin'}
                <div className="text-secondary fw-normal">{user?.adminId && `ID: ${user.adminId}`}</div>
              </Dropdown.Header>
              <Dropdown.Item>Profile</Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={onLogout}>
                <i className="bi bi-box-arrow-right me-2" />
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Container>
    </header>
  )
}
