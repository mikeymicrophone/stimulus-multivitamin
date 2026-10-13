/*
 * paint_rack_controller.js — registered as "paint-rack"
 *
 * Teaches: low and fresh are declared on the rack, and applied to
 * can targets. A low class attribute sitting on a can is not the
 * rack's lowClass. The rack element itself does not wear the
 * paint classes.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["low", "fresh"]
  static targets = ["can", "nun", "reading"]

  connect() {
    this.render("connect")
  }

  markNunLow() {
    this.nunTarget.classList.remove(this.freshClass)
    this.nunTarget.classList.add(this.lowClass)
    this.render("nun")
  }

  markAllFresh() {
    for (const can of this.canTargets) {
      can.classList.remove(this.lowClass)
      can.classList.add(this.freshClass)
    }
    this.render("fresh")
  }

  render(how) {
    const stray = this.nunTarget.getAttribute("data-paint-rack-low-class")
    const painted = this.canTargets.map((can) => {
      const name = can.getAttribute("data-buoy-name")
      const tokens = [this.lowClass, this.freshClass].filter((token) => can.classList.contains(token))
      return `${name} ${tokens.length ? tokens.join(" ") : "bare"}`
    })
    this.readingTarget.textContent = [
      `Rack ${how}.`,
      `lowClass ${this.lowClass}.`,
      `freshClass ${this.freshClass}.`,
      `hasLowClass ${this.hasLowClass}.`,
      `Stray on the nun ${stray === null ? "absent" : stray}.`,
      `Cans ${painted.join(", ")}.`
    ].join(" ")
  }
}
