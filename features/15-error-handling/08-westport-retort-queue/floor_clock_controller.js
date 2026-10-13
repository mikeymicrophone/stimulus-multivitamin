/*
 * floor_clock_controller.js — registered as "floor-clock"
 *
 * Teaches: a later controller still connects when the
 * previous connect() is async and rejects.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Floor clock connected."
  }
}
