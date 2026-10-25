import { useEffect } from 'react'
import { Circle, MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import { CENTER, GEOFENCE_RADIUS_M } from '../hooks/useFleet'
import { STATUS } from '../utils'

// Map tiles: OpenStreetMap's public tile server needs NO API key.
// The "dark map" is the same tiles with a CSS filter (see .tiles-dark in styles.css).
// To use a paid/keyed provider (MapTiler, Mapbox, Google...) change `url` and add your key.
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

function makeIcon(v, selected) {
  const color = STATUS[v.status].color
  const html = `
    <div class="veh-marker ${selected ? 'sel' : ''}" style="--c:${color}">
      <svg viewBox="0 0 24 24" style="transform:rotate(${Math.round(v.heading)}deg);transition:transform .9s linear">
        <path d="M12 2 L20 21 L12 17 L4 21 Z"/>
      </svg>
      ${selected ? `<span class="veh-label">${v.name}</span>` : ''}
    </div>`
  return L.divIcon({ html, className: 'veh-wrap', iconSize: [34, 34], iconAnchor: [17, 17] })
}

function CameraController({ selected, follow, fitSignal, vehicles }) {
  const map = useMap()

  // Fly to a vehicle when it gets selected
  useEffect(() => {
    if (selected) map.flyTo(selected.pos, Math.max(map.getZoom(), 14), { duration: 0.8 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id])

  // Keep the selected vehicle centred while "follow" is on
  useEffect(() => {
    if (selected && follow) map.panTo(selected.pos, { animate: true, duration: 1, easeLinearity: 1 })
  }, [selected?.pos, follow, map])

  // "Fit all" button
  useEffect(() => {
    if (!fitSignal) return
    const pts = vehicles.map((v) => v.pos)
    if (pts.length) map.fitBounds(L.latLngBounds(pts), { padding: [60, 60] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitSignal])

  return null
}

export default function LeafletMap({ vehicles, selected, onSelect, follow, showTrails, dark, fitSignal }) {
  return (
      <MapContainer center={CENTER} zoom={12} zoomControl={false} preferCanvas>
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19} className={dark ? 'tiles-dark' : ''} />
        <Circle
          center={CENTER}
          radius={GEOFENCE_RADIUS_M}
          pathOptions={{ color: '#3b82f6', weight: 1.5, dashArray: '6 8', fillOpacity: 0.04 }}
        />
        {vehicles.map((v) => {
          const isSel = selected?.id === v.id
          const color = STATUS[v.status].color
          return (
            <span key={v.id}>
              {(isSel || showTrails) && v.trail.length > 1 && (
                <Polyline
                  positions={v.trail}
                  pathOptions={{ color: isSel ? '#3b82f6' : color, weight: isSel ? 4 : 2, opacity: isSel ? 0.9 : 0.35 }}
                />
              )}
              <Marker
                position={v.pos}
                icon={makeIcon(v, isSel)}
                zIndexOffset={isSel ? 1000 : 0}
                eventHandlers={{ click: () => onSelect(v.id) }}
              >
                <Tooltip direction="top" offset={[0, -18]}>
                  {v.name} · {Math.round(v.speed)} km/h
                </Tooltip>
              </Marker>
            </span>
          )
        })}
        <CameraController selected={selected} follow={follow} fitSignal={fitSignal} vehicles={vehicles} />
      </MapContainer>
  )
}
