import { useEffect, useRef, useState } from 'react'
import { CENTER, GEOFENCE_RADIUS_M } from '../hooks/useFleet'
import { loadGoogleMaps } from '../googleLoader'
import { STATUS } from '../utils'

const DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#1a2232' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b0f17' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8b95a7' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2b3750' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3a4a6b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0b0f17' }] },
]
const ARROW = 'M12 2 L20 21 L12 17 L4 21 Z'
const ll = ([lat, lng]) => ({ lat, lng })

export default function GoogleMapView({ apiKey, vehicles, selected, onSelect, follow, showTrails, dark, fitSignal, onFail }) {
  const el = useRef(null)
  const mapRef = useRef(null)
  const markers = useRef(new Map())
  const lines = useRef(new Map())
  const onSelectRef = useRef(onSelect)
  const [ready, setReady] = useState(false)
  onSelectRef.current = onSelect

  // Create the map once
  useEffect(() => {
    let cancelled = false
    const authFail = () => onFail('Google rejected the API key (check billing, enabled APIs and referrer restrictions).')
    window.addEventListener('gm-auth-failure', authFail)

    loadGoogleMaps(apiKey)
      .then((gm) => {
        if (cancelled || !el.current) return
        const map = new gm.Map(el.current, {
          center: ll(CENTER),
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          clickableIcons: false,
        })
        new gm.Circle({
          map,
          center: ll(CENTER),
          radius: GEOFENCE_RADIUS_M,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 1.5,
          fillColor: '#3b82f6',
          fillOpacity: 0.04,
          clickable: false,
        })
        markers.current = new Map()
        lines.current = new Map()
        mapRef.current = map
        setReady(true)
      })
      .catch((e) => !cancelled && onFail(e.message))

    return () => {
      cancelled = true
      window.removeEventListener('gm-auth-failure', authFail)
      markers.current.forEach((m) => m.setMap(null))
      lines.current.forEach((l) => l.setMap(null))
      mapRef.current = null
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  // Dark / light map style
  useEffect(() => {
    if (ready) mapRef.current.setOptions({ styles: dark ? DARK_STYLE : [] })
  }, [ready, dark])

  // Sync markers and trails with the vehicles
  useEffect(() => {
    if (!ready) return
    const gm = window.google.maps
    const map = mapRef.current
    const live = new Set(vehicles.map((v) => v.id))

    markers.current.forEach((m, id) => {
      if (!live.has(id)) {
        m.setMap(null)
        markers.current.delete(id)
      }
    })
    lines.current.forEach((l, id) => {
      if (!live.has(id)) {
        l.setMap(null)
        lines.current.delete(id)
      }
    })

    vehicles.forEach((v) => {
      const isSel = selected?.id === v.id
      const color = STATUS[v.status].color
      const icon = {
        path: ARROW,
        anchor: new gm.Point(12, 12),
        rotation: v.heading,
        scale: isSel ? 1.9 : 1.4,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: isSel ? 2.5 : 1.5,
      }
      const title = `${v.name} · ${Math.round(v.speed)} km/h`
      let m = markers.current.get(v.id)
      if (!m) {
        m = new gm.Marker({ map, position: ll(v.pos), icon, title, optimized: false })
        m.addListener('click', () => onSelectRef.current(v.id))
        markers.current.set(v.id, m)
      } else {
        m.setPosition(ll(v.pos))
        m.setIcon(icon)
        m.setTitle(title)
      }
      m.setZIndex(isSel ? 1000 : 1)

      const showLine = (isSel || showTrails) && v.trail.length > 1
      let l = lines.current.get(v.id)
      if (showLine) {
        const opts = {
          path: v.trail.map(ll),
          strokeColor: isSel ? '#3b82f6' : color,
          strokeOpacity: isSel ? 0.9 : 0.4,
          strokeWeight: isSel ? 4 : 2,
        }
        if (!l) {
          l = new gm.Polyline({ map, clickable: false, ...opts })
          lines.current.set(v.id, l)
        } else l.setOptions(opts)
      } else if (l) {
        l.setMap(null)
        lines.current.delete(v.id)
      }
    })
  }, [ready, vehicles, selected, showTrails])

  // Centre on a vehicle when selected
  useEffect(() => {
    if (!ready || !selected) return
    const map = mapRef.current
    map.panTo(ll(selected.pos))
    if (map.getZoom() < 14) map.setZoom(14)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, selected?.id])

  // Follow mode
  useEffect(() => {
    if (ready && selected && follow) mapRef.current.panTo(ll(selected.pos))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.pos, follow, ready])

  // "Fit all"
  useEffect(() => {
    if (!ready || !fitSignal || !vehicles.length) return
    const b = new window.google.maps.LatLngBounds()
    vehicles.forEach((v) => b.extend(ll(v.pos)))
    mapRef.current.fitBounds(b, 60)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitSignal])

  return <div ref={el} className="gmap" />
}
