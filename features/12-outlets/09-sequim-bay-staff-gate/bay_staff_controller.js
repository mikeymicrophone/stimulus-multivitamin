/*
 * bay_staff_controller.js — registered as "bay-staff"
 *
 * Teaches: latch and life are written in connect(). A gate
 * that force-connects this staff from its own connect()
 * bumps the scope count, so a later removal skips this
 * disconnect(). A staff that connects on its own still
 * disconnects.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { station: String }
  static targets = ["status"]

  connect() {
    this.element.dataset.latch = "set"
    this.element.dataset.life = (this.element.dataset.life || "") + "c"
    this.statusTarget.textContent = `${this.stationValue} connect. Latch set. Life ${this.element.dataset.life}.`
  }

  disconnect() {
    this.element.dataset.life += "d"
    this.statusTarget.textContent = `${this.stationValue} disconnect. Life ${this.element.dataset.life}.`
  }
}
