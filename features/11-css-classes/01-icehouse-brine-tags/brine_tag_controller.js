/*
 * brine_tag_controller.js — registered as "brine-tag"
 *
 * Teaches: static classes declares the logical name coldHold.
 * The attribute is data-brine-tag-cold-hold-class, kebab-case.
 * this.coldHoldClass is that token. Hold and release pass it to
 * classList.toggle with a force flag on the controller element. The CSS class string
 * stays in the markup, so the sockeye tote and the coho tote
 * can wear different classes.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["coldHold"]
  static targets = ["toteName", "reading"]

  connect() {
    this.render()
  }

  holdTote() {
    this.#chill(true)
  }

  releaseTote() {
    this.#chill(false)
  }

  get #onTheTote() {
    return this.element.classList.contains(this.coldHoldClass)
  }

  #chill(cold) {
    this.element.classList.toggle(this.coldHoldClass, cold)
    this.render()
  }

  render() {
    report(
      this.readingTarget,
      `${textOf(this.toteNameTarget)} coldHoldClass ${this.coldHoldClass}.`,
      `On the tote ${this.#onTheTote}.`,
      `hasColdHoldClass ${this.hasColdHoldClass}.`
    )
  }
}
