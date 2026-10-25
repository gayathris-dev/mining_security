import { useState } from 'react'
import { STATUS } from '../utils'
import LeafletMap from './LeafletMap'
import GoogleMapView from './GoogleMapView'

// Set VITE_GOOGLE_MAPS_API_KEY in .env to use Google Maps.
// Without a key (or if Google rejects it) the free OpenStreetMap map is shown instead.
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

export default function MapView(props) {
  const { vehicles, selected, onSelect, follow, setFollow, showTrails, setShowTrails, dark, setDark, onFitAll, fitSignal } = props
  const [googleError, setGoogleError] = useState(null)
  const useGoogle = !!GOOGLE_KEY && !googleError
  const common = { vehicles, selected, onSelect, follow, showTrails, dark, fitSignal }

  return (
    <section className="panel map-panel">
      {useGoogle ? (
        <GoogleMapView apiKey={GOOGLE_KEY} onFail={setGoogleError} {...common} />
      ) : (
        <LeafletMap {...common} />
      )}

      {GOOGLE_KEY && googleError && (
        <div className="map-warning" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />
          Google Maps unavailable: {googleError} Showing OpenStreetMap instead.
        </div>
      )}

      <div className="map-toolbar">
        <button className={`map-btn ${follow ? 'on' : ''}`} onClick={() => setFollow(!follow)}>
          <i className="bi bi-crosshair" /> Follow
        </button>
        <button className={`map-btn ${showTrails ? 'on' : ''}`} onClick={() => setShowTrails(!showTrails)}>
          <i className="bi bi-bezier2" /> Trails
        </button>
        <button className="map-btn" onClick={() => setDark(!dark)}>
          <i className={`bi ${dark ? 'bi-sun' : 'bi-moon-stars'}`} /> {dark ? 'Light map' : 'Dark map'}
        </button>
        <button className="map-btn" onClick={onFitAll}>
          <i className="bi bi-arrows-fullscreen" /> Fit all
        </button>
      </div>

      <div className="map-legend">
        {Object.entries(STATUS).map(([k, s]) => (
          <span key={k}>
            <span className="legend-dot" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
    </section>
  )
}
