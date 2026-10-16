/*
 * paint_rack_controller.js — registered as "paint-rack"
 *
 * Teaches: low and fresh are declared on the rack, and applied to
 * can targets. A low class attribute sitting on a can is not the
 * rack's lowClass. The rack element itself does not wear the
 * paint classes.
 */
import { Controller } from "@hotwired/stimulus"
import { report, listOr } from "../../../assets/readout.js"

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
    const { lowClass, freshClass } = this
    const painted = this.canTargets.map(({ dataset: { buoyName }, classList }) => {
      const tokens = [lowClass, freshClass].filter((token) => classList.contains(token))
      return `${buoyName} ${listOr(tokens, "bare", " ")}`
    })
    report(
      this.readingTarget,
      `Rack ${how}.`,
      `lowClass ${lowClass}.`,
      `freshClass ${freshClass}.`,
      `hasLowClass ${this.hasLowClass}.`,
      `Stray on the nun ${this.nunTarget.getAttribute("data-paint-rack-low-class") ?? "absent"}.`,
      `Cans ${painted.join(", ")}.`
    )
  }
}
