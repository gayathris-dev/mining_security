// Driver / load records – stored in this browser's localStorage (demo only).
// Replace load/save/remove with API calls (and upload files to real storage)
// when you connect a backend.

const KEY = 'trackpulse.drivers'
const MAX_PDF_BYTES = 600 * 1024
const MAX_INPUT_BYTES = 10 * 1024 * 1024

export const PROOF_TYPES = ['Driving licence', 'Aadhaar card', 'PAN card', 'Vehicle RC', 'Insurance', 'Other']

export function loadRecords() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

/** Returns true on success, false if the browser storage is full or blocked. */
export function saveRecords(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
    return true
  } catch {
    return false
  }
}

export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

/**
 * Reads an image or PDF into a small data-URL so it fits in localStorage.
 * Images are shrunk to max 900px JPEG; PDFs must be under 600 KB.
 */
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const isPdf = file.type === 'application/pdf'
    if (!isPdf && !file.type.startsWith('image/')) return reject(new Error('Please choose an image (JPG/PNG) or a PDF.'))
    if (file.size > MAX_INPUT_BYTES) return reject(new Error('File is too large (max 10 MB).'))
    if (isPdf && file.size > MAX_PDF_BYTES) return reject(new Error('PDF must be under 600 KB.'))

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.onload = () => {
      if (isPdf) return resolve({ name: file.name, type: file.type, data: reader.result })
      const img = new Image()
      img.onerror = () => reject(new Error('That image could not be opened.'))
      img.onload = () => {
        const scale = Math.min(1, 900 / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve({ name: file.name, type: 'image/jpeg', data: canvas.toDataURL('image/jpeg', 0.8) })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
