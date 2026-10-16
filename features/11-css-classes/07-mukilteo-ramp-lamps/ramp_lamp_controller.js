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
import { report, textOf } from "../../../assets/readout.js"

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

  chooseState({ currentTarget: { value } }) {
    this.stateValue = value
  }

  tokenFor(state) {
    switch (state) {
      case "open":
        return this.hasOpenClass ? this.openClass : ""
      case "moving":
        return this.hasMovingClass ? this.movingClass : ""
      case "closed":
        return this.hasClosedClass ? this.closedClass : ""
      default:
        return ""
    }
  }

  render(state) {
    const lampTokens = [this.openClass, this.movingClass, this.closedClass]
      .filter((token) => this.lampTarget.classList.contains(token))
    report(
      this.readingTarget,
      `${textOf(this.rampNameTarget)} state ${state}.`,
      `Lamp class ${lampTokens.join(" ") || "(none)"}.`,
      `openClass ${this.openClass}.`,
      `movingClass ${this.movingClass}.`,
      `closedClass ${this.closedClass}.`
    )
  }
}
