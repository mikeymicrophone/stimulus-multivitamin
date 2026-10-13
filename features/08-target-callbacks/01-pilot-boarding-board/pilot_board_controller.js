/*
 * pilot_board_controller.js — registered as "pilot-board"
 *
 * Teaches: target callbacks sit in a fixed place around connect() and
 * disconnect(). On the way in, each ship already on the board runs
 * shipTargetConnected before connect(). On the way out, disconnect()
 * runs first. Removing the identifier makes shipTargets empty inside
 * disconnect(), and shipTargetDisconnected still receives each ship
 * afterward. The transcript element is kept from its own callback so
 * that line can be written after the getters have gone empty.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["transcript", "ship"]
  static values = { watchName: String }

  initialize() {
    this.lines = []
    this.transcript = null
    this.record("initialize")
  }

  watchNameValueChanged(watchName) {
    this.record(`watchName ${watchName}`)
  }

  transcriptTargetConnected(transcript) {
    this.transcript = transcript
    this.record("transcript connected")
  }

  transcriptTargetDisconnected() {
    this.record("transcript disconnected")
  }

  shipTargetConnected(ship) {
    this.record(`ship connected: ${ship.dataset.vesselName}`)
  }

  shipTargetDisconnected(ship) {
    this.record(`ship disconnected: ${ship.dataset.vesselName}`)
  }

  connect() {
    this.record("connect")
  }

  disconnect() {
    this.record(`disconnect ships=${this.shipTargets.length}`)
  }

  takeDown() {
    this.element.removeAttribute("data-controller")
  }

  record(line) {
    this.lines.push(line)
    const transcript = this.transcript || (this.hasTranscriptTarget ? this.transcriptTarget : null)
    if (transcript) transcript.textContent = this.lines.join("\n")
  }
}
