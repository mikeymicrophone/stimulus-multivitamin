/*
 * restart_lamp_controller.js — registered as "restart-lamp"
 *
 * Teaches: calling start() on an application that is
 * already started does not connect this lamp again.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = `Restart lamp connections ${count}.`
  }
}
