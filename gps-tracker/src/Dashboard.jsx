import { useState } from 'react'
import TopBar from './components/TopBar'
import StatsRow from './components/StatsRow'
import VehicleList from './components/VehicleList'
import MapView from './components/MapView'
import DetailsPanel from './components/DetailsPanel'
import AlertsFeed from './components/AlertsFeed'
import AdminPanel from './components/AdminPanel'
import useFleet from './hooks/useFleet'
import { loadRecords } from './records'

export default function Dashboard({ onHome, onLogout, user }) {
  const [paused, setPaused] = useState(false)
  const [records, setRecords] = useState(loadRecords)
  const [showDemo, setShowDemo] = useState(false)
  const fleet = useFleet(paused, records)
  const { clearAlerts } = fleet
  const vehicles = fleet.vehicles.filter((v) => showDemo || !v.isDemo)
  const alerts = fleet.alerts.filter((a) => showDemo || !a.demo)

  // Admin clicks "Track" on a saved truck -> open live map focused on it
  const trackRecord = (recordId) => {
    setTab('live')
    setSelectedId(`T-${recordId}`)
    setFollow(true)
  }

  const [selectedId, setSelectedId] = useState(null)
  const [follow, setFollow] = useState(true)
  const [showTrails, setShowTrails] = useState(false)
  const [dark, setDark] = useState(true)
  const [fitSignal, setFitSignal] = useState(0)
  const [tab, setTab] = useState('live')

  const selected = vehicles.find((v) => v.id === selectedId) || null

  const selectByName = (name) => {
    const v = vehicles.find((x) => x.name === name)
    if (v) setSelectedId(v.id)
  }

  return (
    <div className="app-shell" data-bs-theme="dark">
      <TopBar
        paused={paused}
        onTogglePause={() => setPaused((p) => !p)}
        alertCount={alerts.length}
        onHome={onHome}
        onLogout={onLogout}
        user={user}
        tab={tab}
        onTab={setTab}
      />

      {tab === 'drivers' && (
        <div className="admin-scroll">
          <AdminPanel records={records} setRecords={setRecords} onTrack={trackRecord} />
        </div>
      )}

      {tab === 'live' && <StatsRow vehicles={vehicles} alertCount={alerts.length} />}

      {tab === 'live' && (
      <main className="app-main">
        <VehicleList vehicles={vehicles} selectedId={selectedId} onSelect={setSelectedId} showDemo={showDemo} onToggleDemo={setShowDemo} onAddTruck={() => setTab('drivers')} />

        <MapView
          vehicles={vehicles}
          selected={selected}
          onSelect={setSelectedId}
          follow={follow}
          setFollow={setFollow}
          showTrails={showTrails}
          setShowTrails={setShowTrails}
          dark={dark}
          setDark={setDark}
          fitSignal={fitSignal}
          onFitAll={() => {
            setSelectedId(null)
            setFitSignal((n) => n + 1)
          }}
        />

        <div className="right-col">
          <DetailsPanel vehicle={selected} onClose={() => setSelectedId(null)} follow={follow} setFollow={setFollow} />
          <AlertsFeed alerts={alerts} onClear={clearAlerts} onSelectByName={selectByName} />
        </div>
      </main>
      )}
    </div>
  )
}
