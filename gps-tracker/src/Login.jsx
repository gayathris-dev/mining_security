import { useState } from 'react'
import { Alert, Button, Form, InputGroup, Spinner } from 'react-bootstrap'
import { DEMO_CREDENTIALS, login } from './auth'

const ROADS = [
  'M-10 220 C 80 200, 120 120, 210 130 S 340 60, 410 40',
  'M40 310 C 70 230, 150 220, 190 160 S 260 90, 250 -10',
  'M-10 90 C 100 110, 160 180, 260 190 S 370 240, 410 270',
]
const DOTS = [
  { path: ROADS[0], color: '#22c55e', dur: 11 },
  { path: ROADS[1], color: '#3b82f6', dur: 9 },
  { path: ROADS[2], color: '#f59e0b', dur: 13 },
]

export default function Login({ onSuccess, onHome }) {
  const [form, setForm] = useState({ adminId: '', password: '', remember: true })
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [capsOn, setCapsOn] = useState(false)

  const set = (k) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
    setServerError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    const err = {}
    if (!form.adminId.trim()) err.adminId = 'Enter your Admin ID'
    if (!form.password) err.password = 'Enter your password'
    setErrors(err)
    if (Object.keys(err).length) return

    setLoading(true)
    try {
      const user = await login(form)
      onSuccess(user)
    } catch (ex) {
      setServerError(ex.message)
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm((f) => ({ ...f, ...DEMO_CREDENTIALS }))
    setErrors({})
    setServerError('')
  }

  return (
    <div className="login-page" data-bs-theme="dark">
      {/* ---------- Brand panel ---------- */}
      <aside className="login-brand d-none d-lg-flex">
        <div className="hero-glow" />
        <button className="login-logo" onClick={onHome}>
          <span className="brand-mark">
            <i className="bi bi-geo-alt-fill" />
          </span>
          <span className="brand-name">TrackPulse</span>
        </button>

        <div className="login-brand-body">
          <h2>
            Your whole fleet, <span className="grad">one live map.</span>
          </h2>
          <p>Sign in to monitor vehicles, review alerts and keep every trip on track.</p>

          <div className="login-map">
            <svg viewBox="0 0 400 300" aria-hidden="true">
              <defs>
                <pattern id="lgrid" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M28 0H0V28" fill="none" stroke="#1d2638" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#lgrid)" />
              {ROADS.map((d, i) => (
                <path key={i} d={d} fill="none" stroke="#2b3750" strokeWidth="7" strokeLinecap="round" />
              ))}
              {DOTS.map((dot, i) => (
                <g key={i}>
                  <circle r="14" fill={dot.color} opacity=".18" />
                  <circle r="6" fill={dot.color} stroke="#fff" strokeWidth="2" />
                  <animateMotion dur={`${dot.dur}s`} repeatCount="indefinite" path={dot.path} />
                </g>
              ))}
            </svg>
            <div className="mock-chip chip-a">
              <span className="pulse-dot" /> 12 vehicles online
            </div>
          </div>
        </div>

        <small className="login-foot">© {new Date().getFullYear()} TrackPulse</small>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main className="login-form-wrap">
        <div className="login-card">
          <button className="login-logo d-lg-none mb-4" onClick={onHome}>
            <span className="brand-mark">
              <i className="bi bi-geo-alt-fill" />
            </span>
            <span className="brand-name">TrackPulse</span>
          </button>

          <span className="lp-pill mb-3">
            <i className="bi bi-shield-lock" /> Admin console
          </span>
          <h1 className="login-title">Welcome back</h1>
          <p className="text-secondary mb-4">Sign in with your administrator account to continue.</p>

          {serverError && (
            <Alert variant="danger" className="py-2 small d-flex gap-2 align-items-center" role="alert">
              <i className="bi bi-exclamation-octagon-fill" />
              {serverError}
            </Alert>
          )}

          <Form onSubmit={submit} noValidate>
            <Form.Group className="mb-3" controlId="login-adminid">
              <Form.Label>Admin ID</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text className="dark-input">
                  <i className="bi bi-person-badge" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  className="dark-input"
                  placeholder="Enter your Admin ID"
                  autoComplete="username"
                  autoFocus
                  value={form.adminId}
                  onChange={set('adminId')}
                  isInvalid={!!errors.adminId}
                />
                <Form.Control.Feedback type="invalid">{errors.adminId}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3" controlId="login-password">
              <div className="d-flex justify-content-between">
                <Form.Label>Password</Form.Label>
                <a
                  href="#!"
                  className="small link-primary text-decoration-none"
                  onClick={(e) => {
                    e.preventDefault()
                    alert('Password reset is not connected yet. Hook this up to your backend.')
                  }}
                >
                  Forgot password?
                </a>
              </div>
              <InputGroup hasValidation>
                <InputGroup.Text className="dark-input">
                  <i className="bi bi-lock" />
                </InputGroup.Text>
                <Form.Control
                  type={show ? 'text' : 'password'}
                  className="dark-input"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={set('password')}
                  onKeyUp={(e) => setCapsOn(e.getModifierState && e.getModifierState('CapsLock'))}
                  isInvalid={!!errors.password}
                />
                <Button
                  variant="outline-secondary"
                  className="pw-toggle"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  type="button"
                >
                  <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} />
                </Button>
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </InputGroup>
              {capsOn && (
                <div className="small text-warning mt-1">
                  <i className="bi bi-capslock me-1" />
                  Caps Lock is on
                </div>
              )}
            </Form.Group>

            <Form.Check
              id="login-remember"
              type="checkbox"
              label="Keep me signed in on this device"
              className="mb-4 small"
              checked={form.remember}
              onChange={set('remember')}
            />

            <Button type="submit" size="lg" variant="primary" className="w-100" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" /> Signing in…
                </>
              ) : (
                <>
                  Sign in <i className="bi bi-arrow-right ms-1" />
                </>
              )}
            </Button>
          </Form>

          <div className="demo-box mt-4">
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div className="small">
                <strong>Demo access</strong>
                <div className="text-secondary">
                  ID: {DEMO_CREDENTIALS.adminId} · Password: {DEMO_CREDENTIALS.password}
                </div>
              </div>
              <Button size="sm" variant="outline-light" onClick={fillDemo} type="button">
                Autofill
              </Button>
            </div>
          </div>

          <button className="back-link" onClick={onHome}>
            <i className="bi bi-arrow-left" /> Back to website
          </button>
        </div>
      </main>
    </div>
  )
}
