/*
 * fog_desk_controller.js — registered as "fog-desk"
 *
 * Teaches: with application.debug on, initialize, connect,
 * and actions are written through the logger after the
 * method returns. debug false skips the logger. The horn
 * still runs.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Fog desk connected."
  }

  sound() {
    this.readingTarget.textContent = "Horn sounded."
  }

  breakHorn() {
    this.readingTarget.textContent = "Horn broke the tape."
  }
}
