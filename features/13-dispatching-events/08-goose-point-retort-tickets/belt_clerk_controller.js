/*
 * belt_clerk_controller.js — registered as "belt-clerk"
 *
 * Teaches: a second listener has its own params.
 * Stimulus assigns event.params again before this
 * method runs, so the clerk does not see the floor's
 * belt.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Clerk has no ticket."
  }

  record(event) {
    const belt = event.params.belt
    const hold = event.params.hold
    const lot = event.params.lotCode
    this.readingTarget.textContent = `Clerk batch ${event.detail.batch} psi ${event.detail.psi}. belt ${belt} ${typeof belt}. hold ${String(hold)} ${typeof hold}. lot ${lot} ${typeof lot}.`
  }
}
