/*
 * fog_horn_controller.js — registered as "fog-horn"
 *
 * The stuck horn throws the same error on every click.
 * A different action throws a different error so the
 * desk can file a second report.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Horn is quiet."
  }

  stick() {
    this.readingTarget.textContent = "Horn stuck."
    throw new Error("horn solenoid stuck")
  }

  crack() {
    this.readingTarget.textContent = "Lens cracked."
    throw new Error("lens cracked")
  }
}
