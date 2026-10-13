/*
 * frost_watch_controller.js — registered as "frost-watch"
 *
 * Teaches: putting a lantern on the circuit sets the target attribute
 * on an element that is already in the row. lanternTargetConnected
 * runs, and the lantern stays where it was. Taking it off removes the
 * attribute and runs lanternTargetDisconnected. The row does not lose
 * the tree. connect() does not run again for either change.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lantern", "circuitList", "openings"]

  initialize() {
    this.circuit = []
    this.openings = 0
  }

  connect() {
    this.openings += 1
    this.openingsTarget.textContent = `Watch opened ${this.openings} time.`
    this.render()
  }

  lanternTargetConnected(lantern) {
    this.circuit.push(lantern.dataset.lanternName)
    this.render()
  }

  lanternTargetDisconnected(lantern) {
    this.circuit = this.circuit.filter((name) => name !== lantern.dataset.lanternName)
    this.render()
  }

  wire(event) {
    const lantern = event.currentTarget.closest("[data-lantern-name]")
    lantern.setAttribute("data-frost-watch-target", "lantern")
  }

  unwire(event) {
    const lantern = event.currentTarget.closest("[data-lantern-name]")
    lantern.removeAttribute("data-frost-watch-target")
  }

  render() {
    const names = this.circuit.length ? this.circuit.join(", ") : "none"
    this.circuitListTarget.textContent = `On the circuit: ${names}.`
  }
}
