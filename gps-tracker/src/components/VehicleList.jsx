import { useMemo, useState } from 'react'
import { Badge, Form, InputGroup } from 'react-bootstrap'
import { STATUS, TYPE_ICON, timeAgo } from '../utils'

const FILTERS = [
  ['all', 'All'],
  ['moving', 'Moving'],
  ['idle', 'Idle'],
  ['offline', 'Offline'],
]

export default function VehicleList({ vehicles, selectedId, onSelect, showDemo, onToggleDemo, onAddTruck }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const counts = useMemo(() => {
    const c = { all: vehicles.length, moving: 0, idle: 0, offline: 0 }
    vehicles.forEach((v) => c[v.status]++)
    return c
  }, [vehicles])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return vehicles.filter(
      (v) =>
        (filter === 'all' || v.status === filter) &&
        (!q || [v.name, v.plate, v.driver, v.id].some((s) => s.toLowerCase().includes(q)))
    )
  }, [vehicles, query, filter])

  return (
    <aside className="panel">
      <div className="panel-head">
        <h6 className="panel-title">
          <i className="bi bi-truck-front me-2" />
          Fleet
        </h6>
        <Badge bg="secondary">{list.length}</Badge>
      </div>

      <div className="p-3 pb-2">
        <InputGroup size="sm">
          <InputGroup.Text className="dark-input">
            <i className="bi bi-search" />
          </InputGroup.Text>
          <Form.Control
            className="dark-input"
            placeholder="Search name, plate, driver…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      <div className="px-3 pb-2">
        <Form.Check
          type="switch"
          id="demo-switch"
          className="small"
          label="Show demo vehicles"
          checked={showDemo}
          onChange={(e) => onToggleDemo(e.target.checked)}
        />
      </div>

      <div className="filter-tabs">
        {FILTERS.map(([key, label]) => (
          <button key={key} className={`filter-tab ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
            {label} {counts[key]}
          </button>
        ))}
      </div>

      <div className="panel-scroll">
        {list.length === 0 && (
          <div className="empty-state">
            <i className={`bi ${vehicles.length ? 'bi-search' : 'bi-truck'}`} />
            {vehicles.length ? (
              'No vehicles match your search.'
            ) : (
              <>
                No trucks to track yet.
                <div className="mt-3">
                  <button className="btn btn-primary btn-sm" onClick={onAddTruck}>
                    <i className="bi bi-person-plus me-1" /> Add driver &amp; truck
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        {list.map((v) => {
          const s = STATUS[v.status]
          return (
            <div
              key={v.id}
              className={`veh-item ${selectedId === v.id ? 'selected' : ''}`}
              onClick={() => onSelect(v.id)}
            >
              {v.photo ? (
                <img src={v.photo} alt="" className="veh-ico" style={{ objectFit: 'cover', border: `2px solid ${s.color}` }} />
              ) : (
                <div className="veh-ico" style={{ background: `${s.color}22`, color: s.color }}>
                  <i className={`bi ${TYPE_ICON[v.type]}`} />
                </div>
              )}
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="veh-name">{v.name}</span>
                  <span className="speed-chip" style={{ color: s.color }}>
                    {Math.round(v.speed)} <small className="text-secondary fw-normal">km/h</small>
                  </span>
                </div>
                <div className="d-flex justify-content-between veh-sub">
                  <span>
                    {v.plate} · {v.driver}
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center veh-sub mt-1">
                  <Badge bg={s.badge} className="fw-normal">
                    {s.label}
                  </Badge>
                  <span>{timeAgo(v.lastUpdate)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
