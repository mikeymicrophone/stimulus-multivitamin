/*
 * connection_banner_controller.js — registered as "connection-banner"
 *
 * Teaches: listening to the window for events only the window receives.
 * online and offline fire on window and nowhere else, so the descriptors
 * say @window; online@document would never run. They report changes only,
 * so connect() reads navigator.onLine for the state the page loaded in.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["message"]
  static values = { reconnectedNoticeSeconds: Number }

  initialize() {
    this.hideTimer = null
  }

  connect() {
    if (!navigator.onLine) this.showOffline()
  }

  disconnect() {
    clearTimeout(this.hideTimer)
  }

  showOffline() {
    clearTimeout(this.hideTimer)
    this.element.dataset.connection = "offline"
    this.messageTarget.textContent = "You're offline. New notes stay on this tablet and go out when the connection comes back."
    this.element.hidden = false
  }

  showOnline() {
    this.element.dataset.connection = "online"
    this.messageTarget.textContent = "Back online. Sending anything that was waiting."
    this.element.hidden = false
    clearTimeout(this.hideTimer)
    this.hideTimer = setTimeout(() => {
      this.element.hidden = true
    }, this.reconnectedNoticeSecondsValue * 1000)
  }
}
