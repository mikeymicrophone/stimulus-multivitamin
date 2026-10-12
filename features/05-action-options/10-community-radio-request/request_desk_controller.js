/*
 * request_desk_controller.js — registered as "request-desk"
 *
 * Teaches: one click hits Stimulus actions in native phase order, which
 * for this page is click@window:capture, then the element, then
 * click@document, then click@window. :stop on the request form hides the
 * event from the document and window bubble listeners but not from
 * window capture, which already ran. closeIfOutside on @document therefore
 * does not see a click that started inside the form.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay", "opener", "song", "artist", "queue", "phaseLog", "status", "lastInteraction"]

  connect() {
    this.queueItems = ["Neko Case — Hold On, Hold On (on now)"]
    this.renderQueue()
    this.statusTarget.textContent = "WPOV 91.7 is live. Open the request sheet, then click inside it or on the studio clock."
  }

  recordWindowCapture() {
    this.appendPhase("window capture")
  }

  recordWindowBubble() {
    this.appendPhase("window bubble")
    const stamp = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })
    this.lastInteractionTarget.textContent = `Last studio interaction ${stamp}`
  }

  closeIfOutside({ target }) {
    this.appendPhase("document bubble")
    if (this.overlayTarget.hidden) return
    if (this.overlayTarget.contains(target) || this.openerTarget.contains(target)) return
    this.overlayTarget.hidden = true
    this.statusTarget.textContent = "Closed the request sheet from click@document. The click was outside the form."
  }

  keepSheetOpen() {
    this.appendPhase("form bubble (:stop)")
    this.statusTarget.textContent = "Click stayed inside the sheet. :stop hid it from document and window bubble; window capture already ran."
  }

  openSheet() {
    this.overlayTarget.hidden = false
    this.songTarget.focus()
    this.statusTarget.textContent = "Request sheet open. Click a field, then click the studio clock outside it."
  }

  queueRequest() {
    const song = this.songTarget.value.trim()
    const artist = this.artistTarget.value.trim()
    if (!song || !artist) {
      this.statusTarget.textContent = "Need both a song and an artist to queue a request."
      return
    }
    this.queueItems.push(`${artist} — ${song}`)
    this.renderQueue()
    this.songTarget.value = ""
    this.artistTarget.value = ""
    this.statusTarget.textContent = `Queued ${song} by ${artist}.`
  }

  appendPhase(label) {
    const line = document.createElement("li")
    line.textContent = label
    this.phaseLogTarget.append(line)
  }

  renderQueue() {
    this.queueTarget.replaceChildren(...this.queueItems.map((entry) => {
      const item = document.createElement("li")
      item.textContent = entry
      return item
    }))
  }
}
