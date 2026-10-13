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
    let message = "the slip is on the board"
    try {
      message = this.slipTarget.textContent.trim()
    } catch (error) {
      message = error.message
    }
    this.reportTarget.textContent = `hasSlipTarget ${this.hasSlipTarget}. slipTargets ${count}. ${message}`
  }

  render() {
    const station = this.stationNameTarget.textContent.trim()
    const readings = this.readingTargets.map((reading) => reading.textContent.trim()).join(", ")
    const advisory = this.hasAdvisoryTarget ? this.advisoryTarget.textContent.trim() : "No advisory posted"
    this.reportTarget.textContent = `${station}: ${readings}. Advisory: ${advisory}.`
  }
}
