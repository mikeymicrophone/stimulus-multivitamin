/*
 * pilot_station_controller.js — registered as "pilot-station"
 *
 * Teaches: the ancestor runs after the actions on the
 * boat and before @document and @window.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["line"]

  connect() {
    this.lineTarget.textContent = "Station is quiet."
  }

  hear(event) {
    event.detail.tape.push("station")
    this.lineTarget.textContent = `Station heard ${event.detail.vessel}.`
  }

  clear() {
    this.lineTarget.textContent = "Station is quiet."
  }
}
