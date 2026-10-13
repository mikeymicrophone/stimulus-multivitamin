/*
 * freight_desk_controller.js — registered as "freight-desk"
 *
 * Teaches: the target option chooses the EventTarget the
 * event is dispatched on. Bubbles still walks up from
 * that target. bubbles: false stops at the target.
 * window does not bubble down to document.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["shed", "report"]

  callDesk() {
    this.quiet()
    const event = this.dispatch("called", { detail: { from: "desk" } })
    this.reportTarget.textContent = `Started on the desk. type ${event.type}. bubbles ${event.bubbles}.`
  }

  callShed() {
    this.quiet()
    const event = this.dispatch("called", {
      target: this.shedTarget,
      detail: { from: "shed" }
    })
    this.reportTarget.textContent = `Started on the shed. type ${event.type}. bubbles ${event.bubbles}.`
  }

  callShedStill() {
    this.quiet()
    const event = this.dispatch("called", {
      target: this.shedTarget,
      bubbles: false,
      detail: { from: "shed-still" }
    })
    this.reportTarget.textContent = `Started on the shed. bubbles ${event.bubbles}.`
  }

  callDocument() {
    this.quiet()
    const event = this.dispatch("called", {
      target: document,
      detail: { from: "document" }
    })
    this.reportTarget.textContent = `Started on document. bubbles ${event.bubbles}.`
  }

  callWindow() {
    this.quiet()
    const event = this.dispatch("called", {
      target: window,
      detail: { from: "window" }
    })
    this.reportTarget.textContent = `Started on window. bubbles ${event.bubbles}.`
  }

  quiet() {
    this.dispatch("cleared")
    this.shedLine()
  }

  shedLine() {
    const line = this.shedTarget.querySelector("[data-shed-bell-target='reading']")
    if (line) line.textContent = "Shed is quiet."
  }
}
