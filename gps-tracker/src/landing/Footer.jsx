import { Col, Container, Row } from 'react-bootstrap'
import { scrollToId } from './LandingNav'

const COLS = [
  ['Product', [['features', 'Features'], ['how', 'How it works'], ]],
  ['Company', [['about', 'About us'], ['contact', 'Contact'],]],
]

export default function Footer({ onLaunch }) {
  const go = (e, id) => {
    e.preventDefault()
    scrollToId(id)
  }
  return (
    <footer className="lp-footer">
      <Container>
        <Row className="gy-4">
          <Col lg={5}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-mark">
                <i className="bi bi-geo-alt-fill" />
              </span>
              <span className="brand-name fs-5">TrackPulse</span>
            </div>
            <p className="text-secondary" style={{ maxWidth: 360 }}>
              Real-time GPS tracking and fleet intelligence for teams that keep things moving.
            </p>
            <div className="socials">
              {['twitter-x', 'linkedin', 'github', 'youtube'].map((s) => (
                <a key={s} href="#!" onClick={(e) => e.preventDefault()} aria-label={s}>
                  <i className={`bi bi-${s}`} />
                </a>
              ))}
            </div>
          </Col>
          {COLS.map(([title, links]) => (
            <Col xs={6} lg={2} key={title}>
              <h6>{title}</h6>
              <ul className="list-unstyled">
                {links.map(([id, label]) => (
                  <li key={label}>
                    <a href={`#${id}`} onClick={(e) => go(e, id)}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
          <Col lg={3}>
            <h6>Try it now</h6>
            <p className="text-secondary small">Open the live dashboard with simulated vehicles.</p>
            <button className="btn btn-primary btn-sm" onClick={onLaunch}>
              Login
            </button>
          </Col>
        </Row>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TrackPulse. All rights reserved.</span>
          <span>
            <a href="#!" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#!" onClick={(e) => e.preventDefault()}>Terms</a>
          </span>
        </div>
      </Container>
    </footer>
  )
}
