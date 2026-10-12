/*
 * ferry_radio_controller.js — registered as "ferry-radio"
 *
 * Teaches: the same key through three events. keydown.space starts
 * talkback, keyup.space ends it, keypress.space only records that
 * keypress fired. keypress.esc is declared too: it never runs, because
 * browsers do not fire keypress for Escape. keydown.esc cancels. Space
 * maps to event.key " " (a space character), not "Space". keydown repeats
 * while the key is held; startTalkback() is a no-op when already live.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["indicator", "log", "status", "channel"]

  initialize() {
    this.transmitting = false
    this.eventLog = []
  }

  startTalkback(event) {
    if (this.startedInEditableField(event)) return
    event.preventDefault()
    this.record("keydown", "space")
    if (this.transmitting) return
    this.transmitting = true
    this.render()
    this.statusTarget.textContent = `Talkback live on ${this.channelTarget.textContent}. Hold Space.`
  }

  endTalkback(event) {
    if (this.startedInEditableField(event)) return
    this.record("keyup", "space")
    if (!this.transmitting) return
    this.transmitting = false
    this.render()
    this.statusTarget.textContent = "Channel clear. Press Space to talk."
  }

  recordSpaceKeypress(event) {
    if (this.startedInEditableField(event)) return
    this.record("keypress", "space")
  }

  recordEscKeypress(event) {
    if (this.startedInEditableField(event)) return
    this.record("keypress", "esc")
  }

  cancelTalkback(event) {
    if (this.startedInEditableField(event)) return
    this.record("keydown", "esc")
    if (!this.transmitting) return
    this.transmitting = false
    this.render()
    this.statusTarget.textContent = "Talkback cancelled with Escape."
  }

  record(eventName, filterName) {
    this.eventLog.unshift(`${eventName}.${filterName}`)
    this.eventLog = this.eventLog.slice(0, 8)
    this.logTarget.textContent = this.eventLog.join(" · ")
  }

  render() {
    this.indicatorTarget.dataset.state = this.transmitting ? "live" : "clear"
    this.indicatorTarget.textContent = this.transmitting ? "TX" : "RX"
  }

  startedInEditableField({ target }) {
    if (!(target instanceof Element)) return false
    return target.closest("input, textarea, select, [contenteditable='true']") !== null
  }
}
