/*
 * end_labeler_controller.js — registered as "end-labeler"
 *
 * Teaches: an empty attribute and a whitespace-only attribute are
 * present. hasJammedClass is true. jammedClasses is []. jammedClass
 * is undefined and does not throw. classList.add(undefined) writes
 * the token undefined. Spreading the empty list writes nothing.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["jammed"]
  static targets = ["lineName", "label", "reading"]

  connect() {
    this.render("connect")
  }

  stampClass() {
    this.labelTarget.classList.add(this.jammedClass)
    this.render("class")
  }

  stampList() {
    this.labelTarget.classList.add(...this.jammedClasses)
    this.render("list")
  }

  render(how) {
    const lineName = this.lineNameTarget.textContent.trim()
    const token = this.hasJammedClass ? String(this.jammedClass) : "(missing)"
    this.readingTarget.textContent = [
      `${lineName} ${how}.`,
      `hasJammedClass ${this.hasJammedClass}.`,
      `jammedClass ${token}.`,
      `jammedClasses ${JSON.stringify(this.jammedClasses)}.`,
      `Label class ${JSON.stringify(this.labelTarget.className)}.`
    ].join(" ")
  }
}
