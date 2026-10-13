/*
 * night_watch_controller.js — registered as "night-watch"
 *
 * Teaches: vessels already alongside connect before connect(), and a
 * later fragment of traffic does not open the watch again. Marking a
 * vessel overdue adds a second target name and clips on a blinker
 * without reconnecting the vessel name. Moving Cormorant into the
 * nested anchorage subtracts her souls here and adds them there.
 * Taking the identifier off runs disconnect() while the vessel getter
 * is empty, then vesselTargetDisconnected still names each fairway
 * vessel and the blinker comes off.
 */
import { Controller } from "@hotwired/stimulus"
import { Blinker } from "./blinker_widget.js"

export default class extends Controller {
  static targets = ["transcript", "notice", "tally", "vessel"]
  static values = { watchName: String }

  initialize() {
    this.openLines = []
    this.opened = false
    this.souls = 0
    this.blinkerCount = 0
    this.blinkers = new WeakMap()
    this.transcript = null
    this.tally = null
    this.recordOpen("initialize")
  }

  watchNameValueChanged(watchName) {
    this.recordOpen(`watchName ${watchName}`)
  }

  transcriptTargetConnected(transcript) {
    this.transcript = transcript
    this.renderOpen()
  }

  tallyTargetConnected(tally) {
    this.tally = tally
    this.renderTally()
  }

  vesselTargetConnected(vessel) {
    this.souls += Number(vessel.dataset.souls)
    this.addTick()
    this.renderTally()
    if (!this.opened) this.recordOpen(`vessel connected: ${vessel.dataset.vesselName}`)
  }

  vesselTargetDisconnected(vessel) {
    this.souls -= Number(vessel.dataset.souls)
    this.renderTally()
    if (!this.element.matches("[data-controller~='night-watch']")) {
      this.recordOpen(`vessel disconnected: ${vessel.dataset.vesselName}`)
    }
  }

  overdueTargetConnected(vessel) {
    this.blinkers.set(vessel, new Blinker(vessel))
    this.blinkerCount += 1
    this.renderTally()
  }

  overdueTargetDisconnected(vessel) {
    const blinker = this.blinkers.get(vessel)
    if (!blinker) return
    blinker.destroy()
    this.blinkers.delete(vessel)
    this.blinkerCount -= 1
    this.renderTally()
  }

  connect() {
    this.recordOpen("connect")
    this.opened = true
    this.renderTally()
  }

  disconnect() {
    this.recordOpen(`disconnect vessels=${this.vesselTargets.length} soulsStill=${this.souls}`)
  }

  logTraffic() {
    const sheet = this.element.querySelector("[data-traffic-sheet]")
    this.element.querySelector("[data-fairway-list]").append(sheet.content.cloneNode(true))
    this.noticeTarget.textContent = `Action line: getter already lists ${this.vesselNames()}. Callback stamps had not run yet for the traffic.`
  }

  markMaryJane() {
    const mary = this.vesselTargets.find((vessel) => vessel.dataset.vesselName === "Mary Jane")
    if (!mary) return
    mary.setAttribute("data-night-watch-target", "vessel overdue")
  }

  anchorCormorant() {
    const cormorant = this.vesselTargets.find((vessel) => vessel.dataset.vesselName === "Cormorant")
    if (!cormorant) return
    this.element.querySelector("[data-anchorage-list]").append(cormorant)
  }

  takeDown() {
    this.element.removeAttribute("data-controller")
  }

  addTick() {
    const ticks = Array.from(this.element.querySelectorAll("[data-watch-ticks]")).find((node) => {
      return node.closest("[data-controller~='night-watch']") === this.element
    })
    if (!ticks) return
    ticks.textContent = `${ticks.textContent}●`
  }

  vesselNames() {
    return this.vesselTargets.map((vessel) => vessel.dataset.vesselName).join(", ")
  }

  renderTally() {
    const tally = this.hasTallyTarget ? this.tallyTarget : this.tally
    if (!tally) return
    tally.textContent = `${this.element.dataset.watchPlace} souls: ${this.souls}. Blinkers: ${this.blinkerCount}.`
  }

  renderOpen() {
    if (!this.transcript) return
    this.transcript.textContent = this.openLines.join("\n")
  }

  recordOpen(line) {
    this.openLines.push(line)
    this.renderOpen()
  }
}
