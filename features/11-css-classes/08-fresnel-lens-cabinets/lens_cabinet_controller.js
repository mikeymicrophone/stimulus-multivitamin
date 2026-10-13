/*
 * lens_cabinet_controller.js — registered as "lens-cabinet"
 *
 * Teaches: lit and dark are per-cabinet stacks. litClass is only
 * the first token. litClasses is the whole stack. Putting the
 * lens on watch removes the dark stack and adds the lit stack
 * on that cabinet's element. Admiralty Head, Cattle Point, and
 * Marrowstone each name their own tokens.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["lit", "dark"]
  static targets = ["lightName", "reading"]

  connect() {
    this.render()
  }

  putOnWatch() {
    this.element.classList.remove(...this.darkClasses)
    this.element.classList.add(...this.litClasses)
    this.render()
  }

  secure() {
    this.element.classList.remove(...this.litClasses)
    this.element.classList.add(...this.darkClasses)
    this.render()
  }

  render() {
    const lightName = this.lightNameTarget.textContent.trim()
    const worn = [...this.litClasses, ...this.darkClasses].filter((token) => this.element.classList.contains(token))
    this.readingTarget.textContent = [
      `${lightName} litClass ${this.litClass}.`,
      `litClasses ${JSON.stringify(this.litClasses)}.`,
      `darkClasses ${JSON.stringify(this.darkClasses)}.`,
      `Wearing ${worn.length ? worn.join(" ") : "none"}.`
    ].join(" ")
  }
}
