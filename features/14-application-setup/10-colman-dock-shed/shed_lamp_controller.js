/*
 * shed_lamp_controller.js — registered as "shed-lamp"
 *
 * Teaches: a schema that only changes controllerAttribute
 * keeps actionAttribute. The shed is inside the dock and
 * the document, and neither of those applications sees
 * data-shed-controller.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "flashes"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = count === 1 ? "Shed lamp connected once." : `Shed lamp connected ${count} times.`
  }

  flash() {
    const count = Number(this.element.dataset.flashes || "0") + 1
    this.element.dataset.flashes = String(count)
    this.flashesTarget.textContent = `Shed flashes ${count}.`
  }
}
