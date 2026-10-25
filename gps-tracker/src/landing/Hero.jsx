import { Button, Col, Container, Row } from 'react-bootstrap'
import { scrollToId } from './LandingNav'

// Roads + the paths the animated vehicles follow (viewBox 400x300)
const ROADS = [
  'M-10 220 C 80 200, 120 120, 210 130 S 340 60, 410 40',
  'M40 310 C 70 230, 150 220, 190 160 S 260 90, 250 -10',
  'M-10 90 C 100 110, 160 180, 260 190 S 370 240, 410 270',
]
const DOTS = [
  { path: ROADS[0], color: '#22c55e', dur: 11 },
  { path: ROADS[1], color: '#3b82f6', dur: 9 },
  { path: ROADS[2], color: '#f59e0b', dur: 13 },
  { path: ROADS[0], color: '#a855f7', dur: 15, begin: -6 },
]

export default function Hero({ onLaunch }) {
  return (
    <section id="home" className="lp-hero">
      <div className="hero-glow" />
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6} className="reveal">
            <span className="lp-pill">
              <span className="pulse-dot" /> Real-time fleet visibility
            </span>
            <h1 className="hero-title">
              Know where every vehicle is, <span className="grad">right now.</span>
            </h1>
            <p className="hero-sub">
              TrackPulse turns raw GPS pings into a live map, smart alerts and clear reports, so your team can cut idle
              time, save fuel and keep drivers safe.
            </p>
            <div className="d-flex flex-wrap gap-3 mt-4">
              <Button size="lg" variant="primary" onClick={onLaunch}>
                <i className="bi bi-play-circle me-2" />
                Login
              </Button>
              <Button size="lg" variant="outline-light" onClick={() => scrollToId('features')}>
                Explore features
              </Button>
            </div>
            <div className="hero-stats">
              <div>
                <strong>1 sec</strong>
                <span>Update interval</span>
              </div>
              <div>
                <strong>99.9%</strong>
                <span>Uptime target</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Monitoring</span>
              </div>
            </div>
          </Col>

          <Col lg={6} className="reveal">
            <div className="hero-mock">
              <div className="mock-bar">
                <span />
                <span />
                <span />
                <small>trackpulse.app / live</small>
              </div>
              <div className="mock-map">
                <svg viewBox="0 0 400 300" className="mock-svg" aria-hidden="true">
                  <defs>
                    <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                      <path d="M28 0H0V28" fill="none" stroke="#1d2638" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#grid)" />
                  <circle cx="200" cy="150" r="110" fill="rgba(59,130,246,.05)" stroke="#3b82f6" strokeDasharray="5 7" />
                  {ROADS.map((d, i) => (
                    <path key={i} d={d} fill="none" stroke="#2b3750" strokeWidth="7" strokeLinecap="round" />
                  ))}
                  {DOTS.map((dot, i) => (
                    <g key={i}>
                      <circle r="14" fill={dot.color} opacity=".18" />
                      <circle r="6" fill={dot.color} stroke="#fff" strokeWidth="2" />
                      <animateMotion dur={`${dot.dur}s`} begin={`${dot.begin || 0}s`} repeatCount="indefinite" path={dot.path} />
                    </g>
                  ))}
                </svg>
                <div className="mock-chip chip-a">
                  <i className="bi bi-truck text-success" /> KA 01 AB 1234 · 54 km/h
                </div>
                <div className="mock-chip chip-b">
                  <i className="bi bi-exclamation-triangle-fill text-warning" /> Low fuel · Car 4
                </div>
              </div>
              <div className="mock-stats">
                <div>
                  <b>9</b> Moving
                </div>
                <div>
                  <b>2</b> Idle
                </div>
                <div>
                  <b>1</b> Offline
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
