/*
 * fare_window_controller.js — registered as "fare-window"
 *
 * Teaches: the action can throw after refusing the charge.
 * The banner the traveler sees is written by handleError,
 * not by this method.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "tally"]

  connect() {
    this.boardingCount = 18
    this.readingTarget.textContent = "Window is ready."
    this.paint()
  }

  chargeVoid() {
    this.readingTarget.textContent = "Void card was not charged."
    throw new Error("Card reader returned void.")
  }

  paint() {
    this.tallyTarget.textContent = `Boarded ${this.boardingCount}.`
  }
}
