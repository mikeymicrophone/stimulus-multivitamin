/*
 * gillnet_tally_controller.js — registered as "gillnet-tally"
 *
 * Teaches: overLimit is the base logical class. Subclasses inherit
 * the getter. The attribute they read uses their own identifier.
 * soakedClass exists only on a subclass that declares it. This
 * controller is also registered on its own, for the gillnet boat.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["overLimit"]
  static targets = ["boatName", "reading"]

  connect() {
    this.render()
  }

  markOverLimit() {
    this.element.classList.add(this.overLimitClass)
    this.render()
  }

  render() {
    const boatName = this.boatNameTarget.textContent.trim()
    const worn = this.element.classList.contains(this.overLimitClass)
    this.readingTarget.textContent = [
      `${boatName} overLimitClass ${this.overLimitClass}.`,
      `hasOverLimitClass ${this.hasOverLimitClass}.`,
      `soakedClass in ${"soakedClass" in this}.`,
      `soakedClass ${this.soakedClass}.`,
      `Over the limit ${worn}.`
    ].join(" ")
  }
}
