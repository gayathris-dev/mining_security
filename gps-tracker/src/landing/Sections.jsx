import { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

function SectionHead({ eyebrow, title, text }) {
  return (
    <div className="section-head reveal">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

/* ---------------- Features ---------------- */
const FEATURES = [
  ['bi-geo-alt', '#3b82f6', 'Live tracking', 'Watch every vehicle glide across the map with second-by-second position, speed and heading.'],
  ['bi-bounding-box-circles', '#22c55e', 'Geofencing', 'Draw service zones and get notified the moment a vehicle enters or leaves them.'],
  ['bi-bell', '#ef4444', 'Instant alerts', 'Over-speeding, low fuel, signal loss and more, pushed to your dashboard as they happen.'],
  ['bi-clock-history', '#a855f7', 'Trip history', 'Replay any route, review stops and compare planned versus actual distance.'],
  ['bi-fuel-pump', '#f59e0b', 'Fuel & driver insights', 'Spot idling, harsh driving and fuel drops to cut running costs.'],
  ['bi-plug', '#06b6d4', 'Open API', 'Stream positions over WebSocket or REST into your own ERP, CRM or customer app.'],
]

export function Features() {
  return (
    <section id="features" className="lp-section">
      <Container>
        <SectionHead
          eyebrow="Features"
          title="Everything you need to run a connected fleet"
          text="From a single bike to hundreds of trucks, one simple dashboard."
        />
        <Row className="g-4">
          {FEATURES.map(([icon, color, title, text]) => (
            <Col md={6} lg={4} key={title} className="reveal">
              <div className="feature-card">
                <div className="feature-icon" style={{ background: `${color}22`, color }}>
                  <i className={`bi ${icon}`} />
                </div>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

/* ---------------- How it works ---------------- */
const STEPS = [
  ['bi-cpu', 'Install the tracker', 'Plug a GPS device into the vehicle, or use the driver mobile app. Setup takes minutes.'],
  ['bi-cloud-arrow-up', 'Stream to the cloud', 'Devices send location, speed and sensor data securely to TrackPulse every second.'],
  ['bi-speedometer2', 'Monitor and act', 'See everything live, receive alerts and use reports to make better decisions.'],
]

export function HowItWorks({ onLaunch }) {
  return (
    <section id="how" className="lp-section alt">
      <Container>
        <SectionHead eyebrow="How it works" title="Up and running in three steps" />
        <Row className="g-4">
          {STEPS.map(([icon, title, text], i) => (
            <Col md={4} key={title} className="reveal">
              <div className="step-card">
                <div className="step-num">{i + 1}</div>
                <i className={`bi ${icon} step-icon`} />
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-5 reveal">
          <Button size="lg" variant="primary" onClick={onLaunch}>
            See it in action <i className="bi bi-arrow-right ms-2" />
          </Button>
        </div>
      </Container>
    </section>
  )
}

/* ---------------- Pricing ---------------- */
const PLANS = [
  {
    name: 'Starter',
    price: '$4',
    blurb: 'For small teams getting started.',
    items: ['Up to 25 vehicles', 'Live map & trails', '30-day trip history', 'Email alerts'],
  },
  {
    name: 'Growth',
    price: '$7',
    blurb: 'For growing fleets that need more control.',
    items: ['Up to 250 vehicles', 'Geofences & driver reports', '12-month history', 'SMS & push alerts', 'API access'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    blurb: 'For large operations with custom needs.',
    items: ['Unlimited vehicles', 'SSO & roles', 'Dedicated support', 'On-prem option', 'Custom integrations'],
  },
]

export function Pricing({ onContact }) {
  return (
    <section id="pricing" className="lp-section">
      {/* <Container>
        <SectionHead
          eyebrow="Pricing"
          title="Simple, per-vehicle pricing"
          text="No hidden fees. Cancel any time. Sample prices shown per vehicle per month."
        />
        <Row className="g-4 justify-content-center">
          {PLANS.map((p) => (
            <Col md={6} lg={4} key={p.name} className="reveal">
              <div className={`price-card ${p.popular ? 'popular' : ''}`}>
                {p.popular && <span className="popular-tag">Most popular</span>}
                <h5>{p.name}</h5>
                <div className="price">
                  {p.price}
                  {p.price !== 'Custom' && <small> / vehicle / mo</small>}
                </div>
                <p className="text-secondary">{p.blurb}</p>
                <ul>
                  {p.items.map((it) => (
                    <li key={it}>
                      <i className="bi bi-check-circle-fill" /> {it}
                    </li>
                  ))}
                </ul>
                <Button variant={p.popular ? 'primary' : 'outline-light'} className="w-100" onClick={onContact}>
                  {p.price === 'Custom' ? 'Contact sales' : 'Get started'}
                </Button>
              </div>
            </Col>
          ))}
        </Row>
      </Container> */}
    </section>
  )
}

/* ---------------- About ---------------- */
const VALUES = [
  ['bi-lightning-charge', 'Fast', 'Real-time by default, never "refresh to update".'],
  ['bi-shield-check', 'Reliable', 'Built for 24/7 operations with secure data handling.'],
  ['bi-people', 'Human', 'Clean, simple tools that dispatchers and drivers actually enjoy.'],
]

export function About() {
  return (
    <section id="about" className="lp-section alt">
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6} className="reveal">
            <span className="eyebrow">About us</span>
            <h2 className="about-title">We help fleets move smarter</h2>
            <p className="text-secondary">
              TrackPulse started with a simple idea: knowing where your vehicles are should not need a training course.
              We combine GPS hardware, a fast streaming backend and a friendly interface so operators can spot problems
              early and make confident decisions.
            </p>
            <p className="text-secondary">
              Whether you run deliveries, field service, school transport or a logistics network, our platform adapts to
              the way you work.
            </p>
            <div className="about-stats">
              <div>
                <strong>500+</strong>
                <span>Vehicles tracked</span>
              </div>
              <div>
                <strong>40+</strong>
                <span>Active teams</span>
              </div>
              <div>
                <strong>12</strong>
                <span>Cities</span>
              </div>
            </div>
          </Col>
          <Col lg={6} className="reveal">
            <div className="d-grid gap-3">
              {VALUES.map(([icon, title, text]) => (
                <div className="value-card" key={title}>
                  <i className={`bi ${icon}`} />
                  <div>
                    <h6>{title}</h6>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

/* ---------------- Contact ---------------- */
const EMPTY = { name: '', email: '', company: '', message: '' }

export function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!form.name.trim()) err.name = 'Please enter your name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Enter a valid email address'
    if (form.message.trim().length < 10) err.message = 'Tell us a little more (10+ characters)'
    setErrors(err)
    if (Object.keys(err).length) return
    // TODO: send `form` to your backend / email service here
    setSent(true)
    setForm(EMPTY)
  }

  return (
    <section id="contact" className="lp-section">
      <Container>
        <SectionHead
          eyebrow="Contact"
          title="Let's talk about your fleet"
          text="Book a demo or ask us anything. We usually reply within one business day."
        />
        <Row className="g-4">
          <Col lg={5} className="reveal">
            <div className="d-grid gap-3">
              {[
                ['bi-envelope', 'Email', 'hello@trackpulse.example'],
                ['bi-telephone', 'Phone', '+00 000 000 0000'],
                ['bi-geo-alt', 'Office', '123 Example Street, Your City'],
                ['bi-clock', 'Hours', 'Mon – Sat, 9:00 – 18:00'],
              ].map(([icon, label, value]) => (
                <div className="value-card" key={label}>
                  <i className={`bi ${icon}`} />
                  <div>
                    <h6>{label}</h6>
                    <p>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Col>
          <Col lg={7} className="reveal">
            <Form className="contact-form" onSubmit={submit} noValidate>
              {sent && (
                <div className="sent-banner" role="status">
                  <i className="bi bi-check-circle-fill me-2" />
                  Thanks! Your message has been sent. We'll be in touch soon.
                </div>
              )}
              <Row className="g-3">
                <Col md={6}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control className="dark-input" value={form.name} onChange={set('name')} isInvalid={!!errors.name} placeholder="Your name" />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" className="dark-input" value={form.email} onChange={set('email')} isInvalid={!!errors.email} placeholder="you@company.com" />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Col>
                <Col xs={12}>
                  <Form.Label>Company (optional)</Form.Label>
                  <Form.Control className="dark-input" value={form.company} onChange={set('company')} placeholder="Company name" />
                </Col>
                <Col xs={12}>
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} className="dark-input" value={form.message} onChange={set('message')} isInvalid={!!errors.message} placeholder="How many vehicles do you manage? What would you like to track?" />
                  <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                </Col>
                <Col xs={12}>
                  <Button type="submit" size="lg" variant="primary">
                    Send message <i className="bi bi-send ms-2" />
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
