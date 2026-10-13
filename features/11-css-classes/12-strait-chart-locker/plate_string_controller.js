/*
 * plate_string_controller.js — registered as "plate-string"
 *
 * Teaches: static classes set to a string is ignored, the same
 * as an object. staleClass is undefined and does not throw.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = "stale"
  static targets = ["plateName", "reading"]

  connect() {
    const plateName = this.plateNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${plateName} staleClass in ${"staleClass" in this}.`,
      `hasStaleClass ${this.hasStaleClass}.`,
      `staleClass ${this.staleClass}.`,
      `Attribute ${this.element.getAttribute("data-plate-string-stale-class")}.`
    ].join(" ")
  }
}
