/*
 * cook_floor_controller.js — registered as "cook-floor"
 *
 * Teaches: event.detail is the retort's payload.
 * event.params is this element's action params,
 * typecast the same way as any other action.
 * A leading-zero lot stays a string. "true" becomes
 * a boolean. "3" becomes a number.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Floor has no ticket."
  }

  record(event) {
    const belt = event.params.belt
    const hold = event.params.hold
    const lot = event.params.lotCode
    this.readingTarget.textContent = `Floor batch ${event.detail.batch} psi ${event.detail.psi}. belt ${belt} ${typeof belt}. hold ${String(hold)} ${typeof hold}. lot ${lot} ${typeof lot}.`
  }
}
