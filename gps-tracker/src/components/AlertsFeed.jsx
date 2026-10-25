import { Badge } from 'react-bootstrap'
import { formatClock } from '../utils'

const LEVEL = {
  danger: { color: '#ef4444', icon: 'bi-exclamation-octagon-fill' },
  warning: { color: '#f59e0b', icon: 'bi-exclamation-triangle-fill' },
  info: { color: '#3b82f6', icon: 'bi-info-circle-fill' },
}

export default function AlertsFeed({ alerts, onClear, onSelectByName }) {
  return (
    <div className="panel">
      <div className="panel-head">
        <h6 className="panel-title">
          <i className="bi bi-bell me-2" />
          Live alerts <Badge bg="danger" className="ms-1">{alerts.length}</Badge>
        </h6>
        <button className="map-btn" onClick={onClear} disabled={!alerts.length}>
          Clear
        </button>
      </div>
      <div className="panel-scroll">
        {alerts.length === 0 && (
          <div className="empty-state">
            <i className="bi bi-shield-check" />
            All clear. Alerts will appear here in real time.
          </div>
        )}
        {alerts.map((a) => {
          const l = LEVEL[a.level]
          return (
            <div key={a.id} className="alert-item" role="button" onClick={() => onSelectByName(a.vehicle)}>
              <div className="alert-ico" style={{ background: `${l.color}22`, color: l.color }}>
                <i className={`bi ${l.icon}`} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <strong className="small">{a.type}</strong>
                  <span className="veh-sub">{formatClock(new Date(a.time))}</span>
                </div>
                <div className="veh-sub">
                  {a.vehicle} · {a.plate}
                </div>
                <div className="small">{a.message}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
