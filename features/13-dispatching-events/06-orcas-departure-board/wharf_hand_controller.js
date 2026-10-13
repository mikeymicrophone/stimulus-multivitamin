/*
 * wharf_hand_controller.js — registered as "wharf-hand"
 *
 * Teaches: a later listener still runs after
 * preventDefault. It sees defaultPrevented already
 * set. It also runs when an earlier listener throws,
 * because Stimulus catches that error.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Wharf is clear."
  }

  note(event) {
    this.readingTarget.textContent = `Wharf saw defaultPrevented ${event.defaultPrevented}. vessel ${event.detail.vessel}.`
  }
}
