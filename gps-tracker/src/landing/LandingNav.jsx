import { useEffect, useState } from 'react'
import { Button, Container, Nav, Navbar } from 'react-bootstrap'

export const SECTIONS = [
  ['home', 'Home'],
  ['features', 'Features'],
  ['how', 'How it works'],
  // ['pricing', 'Pricing'],
  ['about', 'About'],
  ['contact', 'Contact'],
]

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function LandingNav({ onLaunch }) {
  const [active, setActive] = useState('home')
  const [expanded, setExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Scroll-spy: highlight the link for the section currently in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    setExpanded(false)
    scrollToId(id)
  }

  return (
    <Navbar
      fixed="top"
      expand="lg"
      expanded={expanded}
      onToggle={setExpanded}
      data-bs-theme="dark"
      className={`lp-nav ${scrolled || expanded ? 'scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand href="#home" onClick={(e) => go(e, 'home')} className="d-flex align-items-center gap-2">
          <span className="brand-mark">
            <i className="bi bi-geo-alt-fill" />
          </span>
          <span className="brand-name">TrackPulse</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="lp-nav-menu" />
        <Navbar.Collapse id="lp-nav-menu">
          <Nav className="mx-auto gap-lg-1">
            {SECTIONS.map(([id, label]) => (
              <Nav.Link key={id} href={`#${id}`} active={active === id} onClick={(e) => go(e, id)} className="lp-link">
                {label}
              </Nav.Link>
            ))}
          </Nav>
          <div className="d-flex gap-2 mt-3 mt-lg-0">
           
            <Button variant="primary" size="sm" onClick={onLaunch}>
             Login <i className="bi bi-arrow-right ms-1" />
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
