/*
 * water_heater_controller.js — registered as "water-heater"
 *
 * Teaches: a different identifier nested inside meter-bank does not
 * create a meter-bank boundary. This controller only reads its own
 * model target. The laundry meter beside that model stays a building
 * meter.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["model", "note"]

  connect() {
    this.noteTarget.textContent = `${this.modelTarget.textContent.trim()} serves the laundry room.`
  }
}
