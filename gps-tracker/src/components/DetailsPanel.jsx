import { Badge, Button, ProgressBar } from 'react-bootstrap'
import { STATUS, TYPE_ICON, compass, timeAgo } from '../utils'

export default function DetailsPanel({ vehicle, onClose, follow, setFollow }) {
  if (!vehicle) {
    return (
      <div className="panel">
        <div className="panel-head">
          <h6 className="panel-title">
            <i className="bi bi-info-circle me-2" />
            Vehicle details
          </h6>
        </div>
        <div className="empty-state">
          <i className="bi bi-cursor" />
          Select a vehicle from the list or the map to see live telemetry.
        </div>
      </div>
    )
  }

  const s = STATUS[vehicle.status]
  const pct = Math.min(100, (vehicle.speed / 120) * 100)
  const fuelVariant = vehicle.fuel < 20 ? 'danger' : vehicle.fuel < 40 ? 'warning' : 'success'

  return (
    <div className="panel">
      <div className="panel-head">
        <div className="d-flex align-items-center gap-2">
          <div className="veh-ico" style={{ background: `${s.color}22`, color: s.color }}>
            <i className={`bi ${TYPE_ICON[vehicle.type]}`} />
          </div>
          <div>
            <div className="veh-name">{vehicle.name}</div>
            <div className="veh-sub">{vehicle.plate}</div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg={s.badge}>{s.label}</Badge>
          <button className="icon-btn" style={{ width: 28, height: 28 }} onClick={onClose} title="Close">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      <div className="panel-scroll p-3">
        {vehicle.photo && (
          <div className="text-center mb-3">
            <img src={vehicle.photo} alt={vehicle.driver} className="detail-photo" />
          </div>
        )}
        <div className="gauge" style={{ background: `conic-gradient(${s.color} ${pct}%, #252e42 0)` }}>
          <div className="gauge-inner">
            <span className="gauge-value">{Math.round(vehicle.speed)}</span>
            <small className="text-secondary">km/h</small>
          </div>
        </div>

        <div className="mt-3">
          <div className="d-flex justify-content-between small mb-1">
            <span className="text-secondary">
              <i className="bi bi-fuel-pump me-1" />
              Fuel
            </span>
            <span>{Math.round(vehicle.fuel)}%</span>
          </div>
          <ProgressBar now={vehicle.fuel} variant={fuelVariant} />
          <div className="d-flex justify-content-between small mb-1 mt-2">
            <span className="text-secondary">
              <i className="bi bi-battery-half me-1" />
              Device battery
            </span>
            <span>{Math.round(vehicle.battery)}%</span>
          </div>
          <ProgressBar now={vehicle.battery} variant="info" />
        </div>

        <div className="mt-3">
          {vehicle.loadKg && (
            <>
              <div className="kv">
                <span>Load</span>
                <span>{vehicle.loadKg.toLocaleString()} kg</span>
              </div>
              <div className="kv">
                <span>Route</span>
                <span>
                  {vehicle.from}
                  {vehicle.to ? ` → ${vehicle.to}` : ''}
                </span>
              </div>
            </>
          )}
          <div className="kv">
            <span>Driver</span>
            <span>{vehicle.driver}</span>
          </div>
          <div className="kv">
            <span>Heading</span>
            <span>
              {Math.round(vehicle.heading)}° {compass(vehicle.heading)}
            </span>
          </div>
          <div className="kv">
            <span>Position</span>
            <span>
              {vehicle.pos[0].toFixed(5)}, {vehicle.pos[1].toFixed(5)}
            </span>
          </div>
          <div className="kv">
            <span>Trip distance</span>
            <span>{vehicle.tripKm.toFixed(1)} km</span>
          </div>
          <div className="kv">
            <span>Odometer</span>
            <span>{Math.round(vehicle.odometer).toLocaleString()} km</span>
          </div>
          <div className="kv">
            <span>Last update</span>
            <span>{timeAgo(vehicle.lastUpdate)}</span>
          </div>
        </div>

        <div className="d-grid gap-2 mt-3">
          <Button size="sm" variant={follow ? 'primary' : 'outline-primary'} onClick={() => setFollow(!follow)}>
            <i className="bi bi-crosshair me-2" />
            {follow ? 'Following on map' : 'Follow on map'}
          </Button>
          <Button size="sm" variant="outline-secondary">
            <i className="bi bi-clock-history me-2" />
            View trip history
          </Button>
        </div>
      </div>
    </div>
  )
}
