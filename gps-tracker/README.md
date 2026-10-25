# TrackPulse – Live GPS Tracking Dashboard

Single-page React + Bootstrap app that looks and behaves like a real fleet-tracking product.

## Website structure
- `src/landing/` – marketing site: navbar, hero, Features, How it works, Pricing, About, Contact, Footer
  (all copy, prices, stats and contact details are placeholders – edit them in `Sections.jsx`, `Hero.jsx`, `Footer.jsx`)
- `src/Login.jsx` + `src/auth.js` – admin login (demo: Admin ID `admin123`, password `admin`)
- `src/Dashboard.jsx` – tabs: Live tracking, and Drivers & loads (`components/AdminPanel.jsx`, storage in `src/records.js`). Saved trucks appear on the live map.

## Dashboard features
- Live map (Leaflet) with direction-aware vehicle markers that glide smoothly every second
- Fleet list with search, status filters (Moving / Idle / Offline) and "last seen" times
- Vehicle details: speed gauge, fuel, device battery, heading, coordinates, odometer
- Live alerts feed: over-speeding, low fuel, geofence exit/entry, signal lost / back online
- Trails, follow-mode, dark/light map, fit-all, geofence circle, pause/resume live feed
- Responsive layout (desktop 3-column, tablet 2-column, mobile stacked)

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Connecting real GPS devices
The simulator lives in `src/hooks/useFleet.js`. Replace its `setInterval` with a
WebSocket (or Socket.IO / MQTT bridge) from your backend and keep the same vehicle shape:

```js
{ id, name, plate, driver, type, pos: [lat, lng], heading, speed, fuel, battery,
  status: 'moving' | 'idle' | 'offline', trail: [[lat, lng], ...], lastUpdate }
```

Change the demo city by editing `CENTER` at the top of `useFleet.js`.
