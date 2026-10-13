/*
 * tide_staff_controller.js — registered as "tide-staff"
 *
 * Teaches: heightValue is already set when the log's outlet
 * callback runs. The watch flag is written here in connect(),
 * which is after that callback when this staff is later in
 * the document than the log. disconnect() appends to life
 * and does not clear the watch.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { height: Number, station: String }
  static targets = ["status"]

  connect() {
    this.element.dataset.watch = "set"
    this.element.dataset.life = (this.element.dataset.life || "") + "c"
    this.statusTarget.textContent = `${this.stationValue} watch set. Life ${this.element.dataset.life}.`
  }

  disconnect() {
    this.element.dataset.life += "d"
    this.statusTarget.textContent = `${this.stationValue} staff disconnect. Life ${this.element.dataset.life}.`
  }
}
