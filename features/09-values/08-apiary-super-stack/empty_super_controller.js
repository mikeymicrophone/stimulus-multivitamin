/*
 * empty_super_controller.js — registered as "empty-super"
 *
 * Teaches: frames as a bare Array has no shared default object. Each
 * read is a new []. Pushing a frame does not write an attribute, and
 * the next read is empty again. hasFramesValue stays false.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["hiveName", "reading"]
  static values = { frames: Array }

  connect() {
    this.render("Opened the package.")
  }

  dropPollenFrame() {
    this.framesValue.push("pollen")
    this.render("Dropped a pollen frame in memory.")
  }

  render(note) {
    const attribute = this.element.getAttribute("data-empty-super-frames-value")
    const hiveName = this.hiveNameTarget.textContent.trim()
    const frames = this.framesValue
    this.readingTarget.textContent = [
      `${hiveName} frames ${frames.length ? frames.join(", ") : "(none)"}.`,
      `hasFramesValue ${this.hasFramesValue}.`,
      `Attribute ${attribute === null ? "absent" : attribute}.`,
      note
    ].join(" ")
  }
}
