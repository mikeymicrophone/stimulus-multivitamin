/*
 * tide_drum_controller.js — registered as "tide-drum"
 *
 * Teaches: connect() runs before the child connects, so
 * a set dispatched here is missed by the striker.
 * The child's armed event arrives during the child's
 * connect, and this drum hears it. Removing the drum
 * disconnects this controller before the striker.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading", "well", "template", "west", "sync", "after", "leaving"]

  connect() {
    this.setNote = "Set went out before the striker was listening."
    this.armedNames = []
    this.leavingNote = "none"
    this.dispatch("set", { detail: { feet: "6.1" } })
    this.render()
  }

  disconnect() {
    this.dispatch("step", { target: window, detail: { who: "drum" } })
    this.dispatch("goodbye", { target: window, detail: { who: "drum" } })
  }

  armed(event) {
    this.armedNames.push(event.detail.name)
    this.render()
  }

  leavingFromChild(event) {
    this.leavingNote = `heard via ${event.detail.via} for ${event.detail.who}`
    this.leavingTarget.textContent = `Drum leaving ${this.leavingNote}.`
  }

  addEast() {
    const striker = this.templateTarget.content.firstElementChild.cloneNode(true)
    this.wellTarget.appendChild(striker)
  }

  pullWest() {
    const el = this.westTarget
    el.remove()
    const still = this.application.getControllerForElementAndIdentifier(el, "tide-striker")
    this.syncTarget.textContent = `Just removed. isConnected ${el.isConnected}. controller ${still ? "yes" : "no"}.`
    queueMicrotask(() => {
      this.afterTarget.textContent = `Settled. ${this.leavingNote}.`
    })
  }

  pullDrum() {
    this.element.remove()
  }

  render() {
    const heard = this.armedNames.length ? this.armedNames.join(" ") : "none"
    this.readingTarget.textContent = `${this.setNote} Drum heard armed ${heard}.`
  }
}
