import { useCallback, useEffect, useRef, useState } from 'react'

// Demo city centre – change this to move the whole simulation anywhere.
export const CENTER = [12.9716, 77.5946]
export const GEOFENCE_RADIUS_M = 9000
const SIM_SPEED_FACTOR = 10 // makes vehicles visibly glide at demo scale

const rand = (a, b) => a + Math.random() * (b - a)
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

function bearing(from, to) {
  const toRad = (d) => (d * Math.PI) / 180
  const y = Math.sin(toRad(to[1] - from[1])) * Math.cos(toRad(to[0]))
  const x =
    Math.cos(toRad(from[0])) * Math.sin(toRad(to[0])) -
    Math.sin(toRad(from[0])) * Math.cos(toRad(to[0])) * Math.cos(toRad(to[1] - from[1]))
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360
}

function distMeters(a, b) {
  const dLat = (b[0] - a[0]) * 111320
  const dLng = (b[1] - a[1]) * 111320 * Math.cos((a[0] * Math.PI) / 180)
  return Math.hypot(dLat, dLng)
}

function newTarget(pos) {
  return [pos[0] + rand(-0.02, 0.02), pos[1] + rand(-0.025, 0.025)]
}

const FLEET = [
  ['Aarav Mehta', 'truck', 'KA 01 AB 1234'],
  ['Priya Nair', 'car', 'KA 03 MN 5521'],
  ['Rohan Das', 'bike', 'KA 05 ZX 9087'],
  ['Sneha Iyer', 'car', 'KA 02 HG 4410'],
  ['Vikram Singh', 'truck', 'KA 04 TR 7782'],
  ['Meera Pillai', 'car', 'KA 01 PQ 3306'],
  ['Arjun Reddy', 'bike', 'KA 51 LK 1209'],
  ['Kavya Rao', 'truck', 'KA 09 DE 6643'],
  ['Imran Khan', 'car', 'KA 03 UV 2958'],
  ['Divya Menon', 'bike', 'KA 53 CC 8120'],
  ['Suresh Kumar', 'truck', 'KA 01 FG 5077'],
  ['Ananya Joshi', 'car', 'KA 05 BN 7364'],
]

const MAX_SPEED = { truck: 70, car: 95, bike: 60 }

function makeVehicle(i) {
  const [driver, type, plate] = FLEET[i]
  const pos = [CENTER[0] + rand(-0.06, 0.06), CENTER[1] + rand(-0.07, 0.07)]
  const target = newTarget(pos)
  const offline = i === 9
  return {
    id: `V${String(i + 1).padStart(3, '0')}`,
    name: `${type === 'truck' ? 'Truck' : type === 'bike' ? 'Bike' : 'Car'} ${i + 1}`,
    plate,
    driver,
    type,
    pos,
    target,
    heading: bearing(pos, target),
    speed: offline ? 0 : rand(20, 50),
    maxSpeed: MAX_SPEED[type],
    fuel: rand(25, 95),
    battery: rand(60, 100),
    odometer: Math.round(rand(8000, 90000)),
    tripKm: 0,
    status: offline ? 'offline' : 'moving',
    isDemo: true,
    idleUntil: 0,
    trail: [pos],
    lastUpdate: Date.now(),
    lowFuelAlerted: false,
    lastSpeedAlert: 0,
  }
}

// A truck created from an admin record (Drivers & loads tab)
function makeFromRecord(r) {
  const pos = [CENTER[0] + rand(-0.05, 0.05), CENTER[1] + rand(-0.06, 0.06)]
  const target = newTarget(pos)
  return {
    id: `T-${r.id}`,
    recordId: r.id,
    name: r.vehicleName,
    plate: `Load ${r.loadKg.toLocaleString()} kg`,
    driver: r.driverName,
    type: 'truck',
    photo: r.photo?.data,
    loadKg: r.loadKg,
    from: r.from,
    to: r.to,
    pos,
    target,
    heading: bearing(pos, target),
    speed: rand(25, 45),
    maxSpeed: MAX_SPEED.truck,
    fuel: rand(60, 100),
    battery: rand(70, 100),
    odometer: 0,
    tripKm: 0,
    status: 'moving',
    idleUntil: 0,
    trail: [pos],
    lastUpdate: Date.now(),
    lowFuelAlerted: false,
    lastSpeedAlert: 0,
  }
}

export default function useFleet(paused = false, records = []) {
  const vehiclesRef = useRef(Array.from({ length: FLEET.length }, (_, i) => makeVehicle(i)))
  const pausedRef = useRef(paused)
  const alertSeq = useRef(0)
  const [vehicles, setVehicles] = useState(vehiclesRef.current)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  const clearAlerts = useCallback(() => setAlerts([]), [])

  // Keep admin-created trucks in sync with the saved records
  useEffect(() => {
    const ids = new Set(records.map((r) => `T-${r.id}`))
    const kept = vehiclesRef.current.filter((v) => v.isDemo || ids.has(v.id))
    const have = new Set(kept.map((v) => v.id))
    const added = records.filter((r) => !have.has(`T-${r.id}`)).map(makeFromRecord)
    if (added.length || kept.length !== vehiclesRef.current.length) {
      vehiclesRef.current = [...kept, ...added]
      setVehicles(vehiclesRef.current)
    }
  }, [records])

  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return
      const now = Date.now()
      const fresh = []
      const addAlert = (level, type, v, message) =>
        fresh.push({ id: ++alertSeq.current, demo: !!v.isDemo, time: now, level, type, vehicle: v.name, plate: v.plate, message })

      vehiclesRef.current = vehiclesRef.current.map((prev) => {
        const v = { ...prev }

        if (v.status === 'offline') {
          if (Math.random() < 0.03) {
            v.status = 'idle'
            v.idleUntil = now + 3000
            v.lastUpdate = now
            addAlert('info', 'Back online', v, 'Device reconnected')
          }
          return v
        }

        if (Math.random() < 0.002) {
          v.status = 'offline'
          v.speed = 0
          addAlert('danger', 'Signal lost', v, 'No GPS signal received')
          return v
        }

        v.lastUpdate = now

        if (v.idleUntil > now) {
          v.status = 'idle'
          v.speed = 0
          return v
        }
        v.status = 'moving'

        // Speed wanders; occasional spikes produce over-speed alerts
        v.speed = clamp(v.speed + rand(-6, 7), 18, v.maxSpeed)
        if (Math.random() < 0.01) v.speed = rand(82, 98)

        // Move toward the current waypoint
        const stepKm = (v.speed / 3600) * SIM_SPEED_FACTOR
        const stepDeg = stepKm / 111
        const d = distMeters(v.pos, v.target)
        if (d < 120) {
          v.target = newTarget(v.pos)
          if (Math.random() < 0.3) {
            v.idleUntil = now + rand(5000, 12000)
            v.speed = 0
            v.status = 'idle'
          }
        }
        const hd = bearing(v.pos, v.target)
        v.heading = hd
        const rad = (hd * Math.PI) / 180
        v.pos = [
          v.pos[0] + Math.cos(rad) * stepDeg,
          v.pos[1] + (Math.sin(rad) * stepDeg) / Math.cos((v.pos[0] * Math.PI) / 180),
        ]
        v.trail = [...v.trail.slice(-60), v.pos]
        v.odometer += stepKm
        v.tripKm += stepKm
        v.fuel = Math.max(0, v.fuel - 0.015)
        v.battery = Math.max(5, v.battery - 0.002)

        if (v.speed > 80 && now - v.lastSpeedAlert > 20000) {
          v.lastSpeedAlert = now
          addAlert('danger', 'Over-speeding', v, `Travelling at ${Math.round(v.speed)} km/h`)
        }
        if (v.fuel < 15 && !v.lowFuelAlerted) {
          v.lowFuelAlerted = true
          addAlert('warning', 'Low fuel', v, `Fuel level at ${Math.round(v.fuel)}%`)
        }
        if (distMeters(v.pos, CENTER) > GEOFENCE_RADIUS_M && !v.outside) {
          v.outside = true
          addAlert('warning', 'Geofence exit', v, 'Left the city service zone')
        } else if (distMeters(v.pos, CENTER) <= GEOFENCE_RADIUS_M && v.outside) {
          v.outside = false
          addAlert('info', 'Geofence entry', v, 'Returned to the service zone')
        }
        return v
      })

      setVehicles(vehiclesRef.current)
      if (fresh.length) setAlerts((a) => [...fresh.reverse(), ...a].slice(0, 40))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return { vehicles, alerts, clearAlerts }
}
