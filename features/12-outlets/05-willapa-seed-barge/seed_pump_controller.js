/*
 * seed_pump_controller.js — registered as "seed-pump"
 *
 * Teaches: the barge reads stationValue through the outlet.
 * A float with a different identifier is not this controller.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { station: String, strain: Number }
}
