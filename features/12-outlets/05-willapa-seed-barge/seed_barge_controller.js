/*
 * seed_barge_controller.js — registered as "seed-barge"
 *
 * Teaches: the singular outlet throws when the selector matches
 * nothing. An absent attribute reports selector "null". An
 * empty attribute reports selector "". A selector that matches
 * a float with the wrong controller is the same missing-element
 * error, not a missing-controller-attribute error. hasSeedPumpOutlet
 * is false for all three. Reading the outlet from connect()
 * is "Error connecting controller" and does not stop the next
 * controller on the page.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["seed-pump"]
  static targets = ["reading", "fault"]
  static values = { readsOnConnect: Boolean }

  connect() {
    if (this.readsOnConnectValue) {
      this.readingTarget.textContent = `${this.seedPumpOutlet.stationValue} strain ${this.seedPumpOutlet.strainValue}.`
      return
    }
    if (this.hasSeedPumpOutlet) {
      const pump = this.seedPumpOutlet
      this.readingTarget.textContent = [
        `${pump.stationValue} strain ${pump.strainValue}.`,
        `hasSeedPumpOutlet true.`,
        `Outlet ${this.seedPumpOutletElement.id}.`
      ].join(" ")
      return
    }
    this.readingTarget.textContent = `hasSeedPumpOutlet false. Selector ${this.selectorText()}.`
  }

  readPump() {
    try {
      const pump = this.seedPumpOutlet
      this.faultTarget.textContent = `${pump.stationValue} strain ${pump.strainValue}.`
    } catch (error) {
      this.faultTarget.textContent = `${error.name}: ${error.message}`
    }
  }

  selectorText() {
    const attribute = this.element.getAttribute("data-seed-barge-seed-pump-outlet")
    return attribute === null ? "null" : JSON.stringify(attribute)
  }
}
