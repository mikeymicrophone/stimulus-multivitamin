/*
 * double_lamp_controller.js — registered as "double-lamp"
 *
 * Teaches: Application.start() a second time builds a
 * second application. Both connect this lamp. One hail
 * runs once on each.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "hails"]

  connect() {
    const count = Number(this.element.dataset.connections || "0") + 1
    this.element.dataset.connections = String(count)
    this.readingTarget.textContent = count === 1 ? "1 connection." : `${count} connections.`
  }

  hail() {
    const count = Number(this.element.dataset.hails || "0") + 1
    this.element.dataset.hails = String(count)
    this.hailsTarget.textContent = `Hails ${count}.`
  }
}
