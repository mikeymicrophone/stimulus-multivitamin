/*
 * plate_object_controller.js — registered as "plate-object"
 *
 * Teaches: static classes set to an object is ignored. No
 * staleClass getter is defined, so the read is undefined and
 * does not throw. The attribute on the element is never read.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = { stale: "chart-stale" }
  static targets = ["plateName", "reading"]

  connect() {
    const plateName = textOf(this.plateNameTarget)
    report(
      this.readingTarget,
      `${plateName} staleClass in ${"staleClass" in this}.`,
      `hasStaleClass ${this.hasStaleClass}.`,
      `staleClass ${this.staleClass}.`,
      `Attribute ${this.element.getAttribute("data-plate-object-stale-class")}.`
    )
  }
}
