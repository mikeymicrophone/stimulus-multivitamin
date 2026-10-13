/*
 * lane_bell_controller.js — registered as "lane-bell"
 *
 * Connected before the lane slip. The slip's callback throws
 * while this bell is already up, so this connect() has run
 * and the slip's connect() does not.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Lane bell connected."
  }
}
