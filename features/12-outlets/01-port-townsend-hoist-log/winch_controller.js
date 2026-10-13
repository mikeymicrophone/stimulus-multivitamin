/*
 * winch_controller.js — registered as "winch"
 *
 * Teaches: the outlet host calls ease() and reads strainValue
 * and labelTarget on this controller. The winch does not know
 * which hoist log is holding it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { strain: Number }
  static targets = ["label"]

  ease() {
    this.strainValue = Math.max(this.strainValue - 1, 0)
    return this.strainValue
  }
}
