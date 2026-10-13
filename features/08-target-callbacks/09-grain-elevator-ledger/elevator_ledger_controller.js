/*
 * elevator_ledger_controller.js — registered as "elevator-ledger"
 *
 * Teaches: the chalk tally adds and subtracts the bushels on the load
 * it was given. The board, which is loadTargets, already shows every
 * load in the current mutation while those callbacks are still walking
 * one load at a time. Copying the board inside the first callback of a
 * reprint would count the new grains and then add them again.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["load", "pit", "tape", "tally"]

  initialize() {
    this.chalk = 0
    this.lines = []
  }

  connect() {
    this.note("Window open")
  }

  loadTargetConnected(load) {
    this.chalk += Number(load.dataset.bushels)
    this.note(`+ ${load.dataset.grainName} ${load.dataset.bushels} · chalk ${this.chalk} · board ${this.boardBushels()}`)
  }

  loadTargetDisconnected(load) {
    this.chalk -= Number(load.dataset.bushels)
    this.note(`- ${load.dataset.grainName} ${load.dataset.bushels} · chalk ${this.chalk} · board ${this.boardBushels()}`)
  }

  checkInSoftWhite() {
    const load = document.createElement("p")
    load.dataset.grainName = "Soft white"
    load.dataset.bushels = "300"
    load.setAttribute("data-elevator-ledger-target", "load")
    load.textContent = "Soft white · 300 bu"
    this.pitTarget.append(load)
  }

  reprintTicket() {
    this.pitTarget.innerHTML = [
      `<p data-elevator-ledger-target="load" data-grain-name="Rye" data-bushels="500">Rye · 500 bu</p>`,
      `<p data-elevator-ledger-target="load" data-grain-name="Malting barley" data-bushels="220">Malting barley · 220 bu</p>`
    ].join("")
  }

  boardBushels() {
    return this.loadTargets.reduce((sum, load) => sum + Number(load.dataset.bushels), 0)
  }

  note(line) {
    this.lines.push(line)
    if (this.hasTapeTarget) this.tapeTarget.textContent = this.lines.join("\n")
    if (this.hasTallyTarget) this.tallyTarget.textContent = `Chalk tally ${this.chalk} bu.`
  }
}
