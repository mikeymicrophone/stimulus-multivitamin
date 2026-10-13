/*
 * cook_floor_controller.js — registered as "cook-floor"
 *
 * Teaches: a subclass that does not define shouldLoad
 * inherits the parent's getter. The cook floor stays cold
 * while the night gate's getter returns false.
 */
import NightGateController from "./night_gate_controller.js"
import { writeKettle } from "./kettle_log.js"

export default class extends NightGateController {
  connect() {
    this.element.querySelector("[data-reading]").textContent = "Cook floor connected."
    writeKettle("cook-floor connect.")
  }
}
