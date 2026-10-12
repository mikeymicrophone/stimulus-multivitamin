/*
 * upload_queue.js — not a controller
 *
 * Owns every upload for as long as the page is open, independent of any
 * element. Rows come and go as the list re-renders; uploads don't. Each
 * upload is found by id, can be watched with an AbortSignal to stop
 * watching, and is cancelled only on request. The transfer is simulated
 * with timers so the page needs no server: each file goes up in twelve
 * chunks, a quarter-second apart.
 */
const uploads = new Map()
const queueEvents = new EventTarget()
let nextUploadNumber = 1

export function startUpload(file, { room = "Unassigned" } = {}) {
  const uploadId = `upload-${nextUploadNumber++}`
  const transfer = new AbortController()
  const upload = { uploadId, file, room, bytesSent: 0, status: "uploading", transfer }
  uploads.set(uploadId, upload)

  const chunkSize = Math.max(1, Math.ceil(file.size / 12))
  const chunkTimer = setInterval(() => {
    upload.bytesSent = Math.min(file.size, upload.bytesSent + chunkSize)
    if (upload.bytesSent >= file.size) {
      upload.status = "uploaded"
      clearInterval(chunkTimer)
    }
    announce(upload)
  }, 250)
  transfer.signal.addEventListener("abort", () => {
    clearInterval(chunkTimer)
    upload.status = "cancelled"
    announce(upload)
  })

  announce(upload)
  return uploadId
}

export function cancelUpload(uploadId) {
  const upload = uploads.get(uploadId)
  if (upload?.status === "uploading") upload.transfer.abort()
}

export function forgetUpload(uploadId) {
  cancelUpload(uploadId)
  uploads.delete(uploadId)
  queueEvents.dispatchEvent(new Event("change"))
}

export function assignRoom(uploadId, room) {
  const upload = uploads.get(uploadId)
  if (!upload) return
  upload.room = room
  announce(upload)
}

export function getUpload(uploadId) {
  return uploads.get(uploadId) ?? null
}

export function listUploads() {
  return [...uploads.values()]
}

export function watchUpload(uploadId, listener, { signal }) {
  queueEvents.addEventListener(`progress:${uploadId}`, (event) => listener(event.detail), { signal })
}

export function watchQueue(listener, { signal }) {
  queueEvents.addEventListener("change", listener, { signal })
}

function announce(upload) {
  queueEvents.dispatchEvent(new CustomEvent(`progress:${upload.uploadId}`, { detail: upload }))
  queueEvents.dispatchEvent(new Event("change"))
}
