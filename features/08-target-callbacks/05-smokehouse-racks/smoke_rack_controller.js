/*
 * smoke_rack_controller.js — registered as "smoke-rack"
 *
 * Teaches: the floor and the cold smoke cabinet are the same identifier,
 * so the cabinet's sides are not floor targets. Moving the salmon into
 * the cabinet runs sideTargetDisconnected on the floor and
 * sideTargetConnected on the cabinet. Pounds follow those callbacks.
 * The floor controller does not disconnect.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["side", "tally"]

  initialize() {
    this.chalk = []
    this.pounds = 0
  }

  connect() {
    this.render()
  }

  sideTargetConnected(side) {
    this.chalk.push(side.dataset.sideName)
    this.pounds += Number(side.dataset.pounds)
    this.render()
  }

  sideTargetDisconnected(side) {
    this.chalk = this.chalk.filter((name) => name !== side.dataset.sideName)
    this.pounds -= Number(side.dataset.pounds)
    this.render()
  }

  moveSalmon() {
    const salmon = this.sideTargets.find((side) => side.dataset.sideName === "Salmon")
    if (!salmon) return
    this.element.querySelector("[data-cabinet-list]").append(salmon)
  }

  render() {
    const names = this.chalk.length ? this.chalk.join(", ") : "none"
    const slip = this.sideTargets.map((side) => side.dataset.sideName).join(", ") || "none"
    this.tallyTarget.textContent = `${this.element.dataset.rackName} chalk: ${this.pounds} lb (${names}). Slip: ${slip}.`
  }
}
