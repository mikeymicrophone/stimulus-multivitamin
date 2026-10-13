/*
 * ramp_bell_controller.js — registered as "ramp-bell"
 *
 * Teaches: three pitfalls. A sibling does not hear a
 * bubble. prefix: false named "change" or "click"
 * runs the actions registered for those native names,
 * and the event is a CustomEvent. detail is one
 * object, so a listener's write is visible to the
 * next listener and to the caller.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "hornButton", "gauge", "change", "click"]

  connect() {
    this.clicks = 0
    this.readingTarget.textContent = "Bell is quiet."
  }

  sound() {
    const detail = { fathoms: 7, station: "Edmonds" }
    const event = this.dispatch("sounded", { detail })
    this.readingTarget.textContent = `Returned fathoms ${event.detail.fathoms}. Same object ${event.detail === detail}. type ${event.type}.`
  }

  countClick(event) {
    this.clicks += 1
    const kind = event instanceof MouseEvent ? "mouse" : (event instanceof CustomEvent ? "custom" : "other")
    const horn = event.detail && event.detail.horn ? event.detail.horn : "none"
    this.clickTarget.textContent = `clicks ${this.clicks}. last ${kind}. detail ${horn}.`
  }

  fakeClick() {
    this.dispatch("click", {
      prefix: false,
      target: this.hornButtonTarget,
      detail: { horn: "Edmonds" }
    })
  }

  readGauge(event) {
    const kind = event instanceof CustomEvent ? "custom" : "native"
    const feet = event.detail && event.detail.feet ? event.detail.feet : this.gaugeTarget.value
    this.gaugeReading = `${kind} ${feet}`
  }

  postChange() {
    const event = this.dispatch("change", {
      prefix: false,
      target: this.gaugeTarget,
      detail: { feet: "14.2" }
    })
    this.changeTarget.textContent = `type ${event.type}. custom ${event instanceof CustomEvent}. inputEvent ${event instanceof InputEvent}. reading ${this.gaugeReading}.`
  }

  typeTide() {
    this.gaugeTarget.value = "9.5"
    this.gaugeTarget.dispatchEvent(new Event("change", { bubbles: true }))
    this.changeTarget.textContent = `type change. custom false. reading ${this.gaugeReading}.`
  }
}
