/*
 * photo_upload_controller.js — registered as "photo-upload"
 *
 * Teaches: a view that is disposable while the work it shows is not. Each
 * row finds its upload by id in connect(), makes a thumbnail object URL,
 * and starts watching progress. disconnect() stops watching and revokes the
 * URL, but never cancels the upload: the report re-renders its whole list
 * when photos are added or regrouped, and every upload has to keep going
 * through that. Only the Cancel button cancels.
 */
import { Controller } from "@hotwired/stimulus"
import { assignRoom, cancelUpload, getUpload, watchUpload } from "./upload_queue.js"

export default class extends Controller {
  static targets = ["thumbnail", "fileName", "room", "progress", "status", "cancelButton"]
  static values = { uploadId: String }

  connect() {
    const upload = getUpload(this.uploadIdValue)
    if (!upload) return

    // An object URL keeps the file's bytes alive until it is revoked. Every
    // re-render builds new rows, so a URL that isn't revoked here leaks a
    // full-size photo each time.
    this.thumbnailUrl = URL.createObjectURL(upload.file)
    this.thumbnailTarget.src = this.thumbnailUrl

    this.progressListeners = new AbortController()
    watchUpload(this.uploadIdValue, (latest) => this.render(latest), { signal: this.progressListeners.signal })
    this.render(upload)
  }

  disconnect() {
    this.progressListeners?.abort()
    this.progressListeners = null
    if (this.thumbnailUrl) URL.revokeObjectURL(this.thumbnailUrl)
    this.thumbnailUrl = null
  }

  assignRoom() {
    assignRoom(this.uploadIdValue, this.roomTarget.value)
  }

  cancel() {
    cancelUpload(this.uploadIdValue)
  }

  render({ file, room, bytesSent, status }) {
    const percentSent = file.size === 0 ? 100 : Math.round((bytesSent / file.size) * 100)
    this.element.dataset.uploadStatus = status
    this.fileNameTarget.textContent = file.name
    this.roomTarget.value = room
    this.progressTarget.value = percentSent
    this.statusTarget.textContent = { uploading: `Uploading… ${percentSent}%`, uploaded: "Uploaded", cancelled: "Cancelled" }[status]
    this.cancelButtonTarget.hidden = status !== "uploading"
  }
}
