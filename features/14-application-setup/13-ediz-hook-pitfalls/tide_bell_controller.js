/*
 * tide_bell_controller.js — registered as "tide-bell"
 *
 * Teaches: a repeated token in data-controller connects
 * once. Dropping one copy of the token leaves that
 * instance connected. Clearing the attribute disconnects it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = `Tide bell connections ${count}.`
  }

  disconnect() {
    document.getElementById("tide-note").textContent = "Tide bell disconnected."
  }
}
