/*
 * tide_board_controller.js — registered as "tide-board"
 *
 * Teaches: static targets, and the three properties Stimulus builds for
 * each name. stationNameTarget is the one heading. readingTargets is
 * every reading, and may be read when there are several. hasAdvisoryTarget
 * is false on a board with no advisory element, so the singular
 * advisoryTarget is only read when the element is there. slipTarget
 * throws when it is read, because no slip was declared; slipTargets
 * stays empty and hasSlipTarget stays false. Connect still succeeds.
 */
import { Controller } from "@hotwired/stimulus"
import { textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static targets = ["stationName", "reading", "advisory", "slip", "report"]

  connect() {
    this.render()
  }

  dismissAdvisory() {
    if (this.hasAdvisoryTarget) this.advisoryTarget.remove()
    this.render()
  }

  readMissingSlip() {
    const count = this.slipTargets.length
    this.reportTarget.textContent = `hasSlipTarget ${this.hasSlipTarget}. slipTargets ${count}. ${this.slipLine}`
  }

  get slipLine() {
    try {
      return textOf(this.slipTarget)
    } catch ({ message }) {
      return message
    }
  }

  render() {
    const readings = Array.from(this.readingTargets, textOf).join(", ")
    const advisory = this.hasAdvisoryTarget ? textOf(this.advisoryTarget) : "No advisory posted"
    this.reportTarget.textContent = `${textOf(this.stationNameTarget)}: ${readings}. Advisory: ${advisory}.`
  }
}
