/*
 * night_gate_controller.js — registered as "night-gate"
 *
 * Teaches: shouldLoad is read once, at register time. A
 * getter can see the shift flag. False skips the module
 * and skips afterLoad. Registering again after the flag
 * changes loads it.
 */
import { Controller } from "@hotwired/stimulus"
import { writeKettle } from "./kettle_log.js"

export default class extends Controller {
  static get shouldLoad() {
    return document.body.dataset.retortShift === "day"
  }

  connect() {
    this.element.querySelector("[data-reading]").textContent = "Night gate connected."
    writeKettle("night-gate connect.")
  }

  static afterLoad(identifier) {
    writeKettle(`${identifier} afterLoad.`)
  }
}
