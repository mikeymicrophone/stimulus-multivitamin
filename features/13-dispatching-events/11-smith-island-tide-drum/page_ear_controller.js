/*
 * page_ear_controller.js — registered as "page-ear"
 *
 * Teaches: a listener that stays on the page hears
 * window dispatches from connect and from disconnect,
 * including after a subtree has been removed.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["armed", "leaving", "order", "goodbye"]

  connect() {
    this.armedNames = []
    this.leavings = []
    this.steps = []
  }

  armed(event) {
    this.armedNames.push(event.detail.name)
    this.armedTarget.textContent = `Page armed ${this.armedNames.join(" ")}.`
  }

  leaving(event) {
    this.leavings.push(`${event.detail.via} ${event.detail.who}`)
    this.leavingTarget.textContent = `Page leaving ${this.leavings.join(", ")}.`
  }

  step(event) {
    this.steps.push(event.detail.who)
    this.orderTarget.textContent = `Order ${this.steps.join(" ")}.`
  }

  goodbye(event) {
    this.goodbyeTarget.textContent = `Page heard goodbye from ${event.detail.who}.`
  }
}
