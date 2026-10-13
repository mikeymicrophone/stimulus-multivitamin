/*
 * fog_desk_controller.js — registered as "fog-desk"
 *
 * Teaches: calling foghornOutlet.blast() returns the pattern
 * and throws if the outlet is gone. this.dispatch("sound")
 * bubbles from the desk. The Marrowstone horn is a sibling,
 * so its local action does not run. Kilisut's window action
 * does. The throw happens before the dispatch when the outlet
 * is missing, so Kilisut stays quiet too.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["foghorn"]
  static targets = ["reading", "fault"]

  connect() {
    this.render("not called", "no", "connected.")
  }

  callHorn() {
    let returned = "not called"
    let dispatched = "no"
    try {
      returned = this.foghornOutlet.blast()
      this.dispatch("sound", { detail: { from: "desk" } })
      dispatched = "yes"
    } catch (error) {
      this.faultTarget.textContent = `${error.name}: ${error.message}`
    }
    this.render(returned, dispatched, "called.")
  }

  dropOutlet() {
    this.element.removeAttribute("data-fog-desk-foghorn-outlet")
    this.faultTarget.textContent = "Outlet attribute removed."
    this.render("not called", "no", "dropped.")
  }

  render(returned, dispatched, reason) {
    const local = this.hasFoghornOutlet ? this.foghornOutlet.localHeard : "no outlet"
    this.readingTarget.textContent = [
      `Returned ${returned}.`,
      `Dispatched ${dispatched}.`,
      `Marrowstone local ${local}.`,
      `hasFoghornOutlet ${this.hasFoghornOutlet}.`,
      reason
    ].join(" ")
  }
}
