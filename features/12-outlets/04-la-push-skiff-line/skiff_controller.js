/*
 * skiff_controller.js — registered as "skiff"
 *
 * Teaches: paint is written in connect(), after the line's
 * outlet callback when this skiff gains its controller token
 * later. A skiff that already has a controller has paint set
 * before a selector change selects it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { boat: String }
  static targets = ["status"]

  connect() {
    this.element.dataset.paint = "set"
    this.statusTarget.textContent = `${this.boatValue} paint set.`
  }

  disconnect() {
    this.element.dataset.paint = "struck"
    this.statusTarget.textContent = `${this.boatValue} paint struck.`
  }
}
