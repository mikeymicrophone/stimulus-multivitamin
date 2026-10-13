/*
 * ramp_lamp_controller.js — registered as "ramp-lamp"
 *
 * Teaches: stateValueChanged is the only place that paints the
 * lamp. open, moving, and closed are logical classes. The CSS
 * tokens stay in the markup, so Mukilteo and Clinton can name
 * different lamps for the same three states. The action writes
 * the value and does not touch classList.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["open", "moving", "closed"]
  static targets = ["rampName", "lamp", "reading"]
  static values = { state: String }

  stateValueChanged(state) {
    this.lampTarget.classList.remove(this.openClass, this.movingClass, this.closedClass)
    const token = this.tokenFor(state)
    if (token) this.lampTarget.classList.add(token)
    this.render(state)
  }

  chooseState(event) {
    this.stateValue = event.currentTarget.value
  }

  tokenFor(state) {
    if (state === "open" && this.hasOpenClass) return this.openClass
    if (state === "moving" && this.hasMovingClass) return this.movingClass
    if (state === "closed" && this.hasClosedClass) return this.closedClass
    return ""
  }

  render(state) {
    const rampName = this.rampNameTarget.textContent.trim()
    const lampTokens = [this.openClass, this.movingClass, this.closedClass].filter((token) => {
      return this.lampTarget.classList.contains(token)
    })
    this.readingTarget.textContent = [
      `${rampName} state ${state}.`,
      `Lamp class ${lampTokens.join(" ") || "(none)"}.`,
      `openClass ${this.openClass}.`,
      `movingClass ${this.movingClass}.`,
      `closedClass ${this.closedClass}.`
    ].join(" ")
  }
}
