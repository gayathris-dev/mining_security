// Loads the Google Maps JavaScript API once and reports key/billing/referrer problems.
let promise = null

export function loadGoogleMaps(apiKey) {
  if (promise) return promise
  promise = new Promise((resolve, reject) => {
    // Google calls this global when the key is rejected (invalid key, referrer blocked, billing off, API not enabled)
    window.gm_authFailure = () => window.dispatchEvent(new Event('gm-auth-failure'))
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async`
    s.async = true
    s.onerror = () => {
      promise = null
      reject(new Error('Could not reach Google Maps'))
    }
    s.onload = async () => {
      try {
        await window.google.maps.importLibrary('maps')
        await window.google.maps.importLibrary('marker')
        resolve(window.google.maps)
      } catch (e) {
        promise = null
        reject(e)
      }
    }
    document.head.appendChild(s)
  })
  return promise
}
