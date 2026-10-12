/*
 * permit_upload_controller.js — registered as "permit-upload"
 *
 * Teaches: built-in and custom options stack. dragover and drop use
 * :prevent:stop so the browser does not navigate to the file. drop and
 * the file picker also use :online:accepted; those custom filters return
 * false when navigator.onLine is false or the file is not a JPEG or PNG,
 * and queuePhoto() never runs. Submit uses :prevent:once so the packet
 * stays on this page and a second send is ignored.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dropzone", "fileField", "queue", "status", "optionLog", "confirmation"]
  static values = {
    permitNumber: { type: String, default: "BP-2026-1842" },
    acceptedTypes: { type: Array, default: ["image/jpeg", "image/png"] },
  }

  connect() {
    this.queuedFiles = []
    this.submitCount = 0
    this.renderQueue()
    this.statusTarget.textContent = "Drop a JPEG or PNG of the site plan, or pick one. Submitting stays on this page."
  }

  recordOption(payload) {
    const line = document.createElement("li")
    line.textContent = `option ${payload.name} value=${payload.value} event=${payload.eventType} returned=${payload.returned}${payload.detail ? ` ${payload.detail}` : ""}`
    this.optionLogTarget.append(line)
    if (payload.returned === "false") {
      this.statusTarget.textContent = payload.blockedMessage
    }
  }

  get acceptedTypes() {
    return this.acceptedTypesValue
  }

  markDropzone() {
    this.dropzoneTarget.dataset.over = "true"
  }

  clearDropzone() {
    delete this.dropzoneTarget.dataset.over
  }

  queueDroppedPhoto(event) {
    this.clearDropzone()
    const photo = event.dataTransfer.files[0]
    this.queuePhotoFile(photo, "drop")
  }

  queuePickedPhoto({ currentTarget: fileField }) {
    const photo = fileField.files[0]
    this.queuePhotoFile(photo, "file picker")
    fileField.value = ""
  }

  queuePhotoFile(photo, source) {
    if (!photo) return
    this.queuedFiles.push({ name: photo.name, type: photo.type, size: photo.size })
    this.renderQueue()
    this.statusTarget.textContent = `Queued ${photo.name} from the ${source} (${photo.type}).`
  }

  sendPacket(event) {
    this.submitCount += 1
    if (this.queuedFiles.length === 0) {
      this.statusTarget.textContent = `Nothing to send (defaultPrevented=${event.defaultPrevented}). Add a site-plan photo first.`
      return
    }
    const names = this.queuedFiles.map((photo) => photo.name).join(", ")
    this.confirmationTarget.hidden = false
    this.confirmationTarget.textContent = `Permit ${this.permitNumberValue} packet sent with ${names}. Submits this visit: ${this.submitCount}.`
    this.statusTarget.textContent = `Sent (defaultPrevented=${event.defaultPrevented}). :once already dropped the submit listener.`
  }

  renderQueue() {
    if (this.queuedFiles.length === 0) {
      this.queueTarget.textContent = "No photos queued."
      return
    }
    this.queueTarget.replaceChildren(...this.queuedFiles.map((photo) => {
      const item = document.createElement("li")
      item.textContent = `${photo.name} · ${photo.type}`
      return item
    }))
  }
}
