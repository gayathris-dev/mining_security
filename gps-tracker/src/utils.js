// Shared helpers for the tracking UI

export const STATUS = {
  moving: { label: 'Moving', color: '#22c55e', badge: 'success' },
  idle: { label: 'Idle', color: '#f59e0b', badge: 'warning' },
  offline: { label: 'Offline', color: '#6b7280', badge: 'secondary' },
}

export const TYPE_ICON = {
  truck: 'bi-truck',
  car: 'bi-car-front-fill',
  bike: 'bi-bicycle',
}

export function timeAgo(ts, now = Date.now()) {
  const s = Math.max(0, Math.round((now - ts) / 1000))
  if (s < 5) return 'just now'
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  return `${Math.floor(m / 60)}h ago`
}

export function compass(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round((((deg % 360) + 360) % 360) / 45) % 8]
}

export function formatClock(d) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
