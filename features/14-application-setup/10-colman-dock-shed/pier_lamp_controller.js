/*
 * pier_lamp_controller.js — registered as "pier-lamp"
 *
 * Teaches: two applications that both watch an element
 * and both register this identifier each connect their
 * own instance. A click runs the action once per instance.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "flashes"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = count === 1 ? "1 connection." : `${count} connections.`
  }

  flash() {
    const count = Number(this.element.dataset.flashes || "0") + 1
    this.element.dataset.flashes = String(count)
    this.flashesTarget.textContent = `Flashes ${count}.`
  }
}
