/*
 * ice_hold_controller.js — registered as "ice-hold"
 *
 * Teaches: a definition whose shouldLoad is false is
 * skipped. The rest of the array still loads.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static get shouldLoad() {
    return false
  }

  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Ice hold connected."
  }
}
