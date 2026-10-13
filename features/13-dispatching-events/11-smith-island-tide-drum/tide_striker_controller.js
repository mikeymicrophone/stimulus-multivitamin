/*
 * tide_striker_controller.js — registered as "tide-striker"
 *
 * Teaches: listeners are bound before connect(), so this
 * striker hears its own armed event and any later one.
 * It does not hear a dispatch that already happened.
 * disconnect() runs after the element is detached, so
 * a bubble from this element does not reach the drum.
 * A dispatch aimed at the saved drum element does.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = { name: String }

  connect() {
    this.drumElement = this.element.closest("[data-controller~='tide-drum']")
    this.heardSet = false
    this.armedHeard = []
    this.dispatch("armed", { detail: { name: this.nameValue } })
    this.render()
  }

  disconnect() {
    this.dispatch("step", { target: window, detail: { who: `striker ${this.nameValue}` } })
    this.dispatch("leaving", { detail: { who: this.nameValue, via: "detached" } })
    if (this.drumElement) {
      this.dispatch("leaving", {
        target: this.drumElement,
        bubbles: false,
        detail: { who: this.nameValue, via: "drum" }
      })
    }
    this.dispatch("leaving", {
      target: window,
      detail: { who: this.nameValue, via: "window" }
    })
  }

  hearSet() {
    this.heardSet = true
  }

  hearArmed(event) {
    this.armedHeard.push(event.detail.name)
    if (this.hasReadingTarget) this.render()
  }

  hearGoodbye() {
    const witness = document.getElementById("goodbye-witness")
    witness.textContent = `${this.nameValue} heard the drum goodbye.`
  }

  render() {
    const armed = this.armedHeard.length ? this.armedHeard.join(" ") : "none"
    this.readingTarget.textContent = `Striker ${this.nameValue} armed. Heard the set: ${this.heardSet ? "yes" : "no"}. Heard armed: ${armed}.`
  }
}
