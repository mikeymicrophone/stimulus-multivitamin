/*
 * ediz_bell_controller.js — registered as "ediz-bell"
 *
 * Teaches: registering the same identifier again unloads
 * the module first. This instance disconnects. The new
 * one initializes again.
 */
import { Controller } from "@hotwired/stimulus"

export default class EdizBellController extends Controller {
  static claims = 0
  static targets = ["reading"]

  initialize() {
    EdizBellController.claims += 1
    this.claim = EdizBellController.claims
  }

  connect() {
    this.readingTarget.textContent = `Ediz Hook bell instance ${this.claim}.`
  }

  disconnect() {
    const tape = document.getElementById("bell-tape")
    tape.textContent = "Bell disconnected."
  }
}
