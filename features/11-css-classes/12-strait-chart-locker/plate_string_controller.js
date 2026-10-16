/*
 * plate_string_controller.js — registered as "plate-string"
 *
 * Teaches: static classes set to a string is ignored, the same
 * as an object. staleClass is undefined and does not throw.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = "stale"
  static targets = ["plateName", "reading"]

  connect() {
    const plateName = textOf(this.plateNameTarget)
    report(
      this.readingTarget,
      `${plateName} staleClass in ${"staleClass" in this}.`,
      `hasStaleClass ${this.hasStaleClass}.`,
      `staleClass ${this.staleClass}.`,
      `Attribute ${this.element.getAttribute("data-plate-string-stale-class")}.`
    )
  }
}
