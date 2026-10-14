/*
 * clerk_controller.js — registered as "tile-clerk"
 *
 * Hears bay-tile:caught from a tile that handled its own
 * failure. Stimulus handleError writes the other line.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["caught"]

  record(event) {
    this.caughtTarget.textContent = `Caught in the action. ${event.detail.kind}. ${event.detail.reason}`
  }
}
