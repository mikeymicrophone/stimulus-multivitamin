/*
 * hoist_log_controller.js — registered as "hoist-log"
 *
 * Teaches: static outlets declares the identifier "winch".
 * The attribute is data-hoist-log-winch-outlet, and its value
 * is a CSS selector. this.winchOutlet is that controller.
 * this.winchOutletElement is the element. hasWinchOutlet is
 * true when the selector matches an element whose
 * data-controller token is winch. ease() and strainValue and
 * labelTarget are read on the outlet, not on this log.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["winch"]
  static targets = ["reading"]

  connect() {
    this.render("connected.")
  }

  easeWinch() {
    const strain = this.winchOutlet.ease()
    this.render(`eased to ${strain}.`)
  }

  render(reason) {
    const winch = this.winchOutlet
    const label = winch.labelTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${label} strain ${winch.strainValue}.`,
      `hasWinchOutlet ${this.hasWinchOutlet}.`,
      `Outlet ${this.winchOutletElement.id}.`,
      `Outlets ${this.winchOutlets.length}.`,
      `Elements ${this.winchOutletElements.length}.`,
      reason
    ].join(" ")
  }
}
