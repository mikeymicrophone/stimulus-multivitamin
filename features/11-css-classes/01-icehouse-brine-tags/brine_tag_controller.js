/*
 * brine_tag_controller.js — registered as "brine-tag"
 *
 * Teaches: static classes declares the logical name coldHold.
 * The attribute is data-brine-tag-cold-hold-class, kebab-case.
 * this.coldHoldClass is that token. Hold and release add and
 * remove it on the controller element. The CSS class string
 * stays in the markup, so the sockeye tote and the coho tote
 * can wear different classes.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["coldHold"]
  static targets = ["toteName", "reading"]

  connect() {
    this.render()
  }

  holdTote() {
    this.element.classList.add(this.coldHoldClass)
    this.render()
  }

  releaseTote() {
    this.element.classList.remove(this.coldHoldClass)
    this.render()
  }

  render() {
    const toteName = this.toteNameTarget.textContent.trim()
    const onTheTote = this.element.classList.contains(this.coldHoldClass)
    this.readingTarget.textContent = [
      `${toteName} coldHoldClass ${this.coldHoldClass}.`,
      `On the tote ${onTheTote}.`,
      `hasColdHoldClass ${this.hasColdHoldClass}.`
    ].join(" ")
  }
}
