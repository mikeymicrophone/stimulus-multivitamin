/*
 * oyster_hold_controller.js — registered as "oyster-hold"
 *
 * Teaches: unload disconnects this instance. register
 * again builds a new one, so initialize runs again.
 * stop() does not call disconnect. A removal while
 * stopped disconnects on the next start().
 */
import { Controller } from "@hotwired/stimulus"

export default class OysterHoldController extends Controller {
  static claims = 0
  static targets = ["reading"]

  initialize() {
    OysterHoldController.claims += 1
    this.claim = OysterHoldController.claims
  }

  connect() {
    this.readingTarget.textContent = `Hold connected. Claims ${this.claim}.`
  }

  disconnect() {
    const tape = document.getElementById("hold-tape")
    const prior = tape.dataset.started === "yes" ? tape.textContent : ""
    tape.dataset.started = "yes"
    const line = "Hold disconnected."
    tape.textContent = prior ? `${prior} ${line}` : line
  }
}
