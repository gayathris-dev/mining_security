import { useEffect } from 'react'
import LandingNav, { scrollToId } from './LandingNav'
import Hero from './Hero'
import { About, Contact, Features, HowItWorks, Pricing } from './Sections'
import Footer from './Footer'

export default function Landing({ onLaunch }) {
  // Fade-in on scroll for every element with .reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="landing" data-bs-theme="dark">
      <LandingNav onLaunch={onLaunch} />
      <Hero onLaunch={onLaunch} />
      <Features />
      <HowItWorks onLaunch={onLaunch} />
      <Pricing onContact={() => scrollToId('contact')} />
      <About />
      <Contact />
      <Footer onLaunch={onLaunch} />
    </div>
  )
}
