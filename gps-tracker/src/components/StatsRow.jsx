import { STATUS } from '../utils'

function Stat({ icon, color, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}22`, color }}>
        <i className={`bi ${icon}`} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

export default function StatsRow({ vehicles, alertCount }) {
  const moving = vehicles.filter((v) => v.status === 'moving')
  const idle = vehicles.filter((v) => v.status === 'idle').length
  const offline = vehicles.filter((v) => v.status === 'offline').length
  const avg = moving.length ? Math.round(moving.reduce((s, v) => s + v.speed, 0) / moving.length) : 0

  return (
    <section className="stats-row">
      <Stat icon="bi-broadcast" color="#3b82f6" value={vehicles.length} label="Total vehicles" />
      <Stat icon="bi-speedometer2" color={STATUS.moving.color} value={moving.length} label={`Moving · avg ${avg} km/h`} />
      <Stat icon="bi-pause-circle" color={STATUS.idle.color} value={idle} label="Idle" />
      <Stat icon="bi-wifi-off" color={STATUS.offline.color} value={offline} label="Offline" />
      <Stat icon="bi-exclamation-triangle" color="#ef4444" value={alertCount} label="Active alerts" />
    </section>
  )
}
