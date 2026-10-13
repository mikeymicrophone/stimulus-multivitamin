/*
 * lock_queue_controller.js — registered as "lock-queue"
 *
 * Teaches: reordering a boat inside the lock runs
 * boatTargetDisconnected and then boatTargetConnected. The lock's own
 * connect() does not run again. The boat is already in its new place,
 * still inside this lock, while the disconnected callback runs.
 * Sending the grain barge to the lay-by runs only the disconnected
 * callback. Moving the lock element itself runs disconnect(), then
 * each boat's disconnected callback, then each boat's connected
 * callback, then connect() on the same instance.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["boat"]

  initialize() {
    this.lines = []
    this.lockConnections = 0
    this.note("initialize")
  }

  connect() {
    this.lockConnections += 1
    this.note(`connect ${this.lockConnections}`)
  }

  disconnect() {
    this.note(`disconnect boats=${this.boatTargets.length}`)
  }

  boatTargetConnected(boat) {
    const passages = Number(boat.dataset.passages || "0") + 1
    boat.dataset.passages = String(passages)
    boat.querySelector("[data-passage-count]").textContent = `Passages through a callback: ${passages}`
    this.note(`boat connected: ${boat.dataset.boatName}`)
  }

  boatTargetDisconnected(boat) {
    const stillInLock = boat.closest("[data-controller~='lock-queue']") === this.element
    const place = stillInLock ? "still in this lock" : "left this lock"
    this.note(`boat disconnected: ${boat.dataset.boatName}, ${place}`)
  }

  moveEarlier(event) {
    const boat = event.currentTarget.closest("[data-boat-name]")
    const previous = boat.previousElementSibling
    if (!previous || !previous.hasAttribute("data-boat-name")) return
    boat.parentElement.insertBefore(boat, previous)
  }

  layByGrain() {
    const grain = this.boatTargets.find((boat) => boat.dataset.boatName === "Grain barge")
    if (!grain) return
    this.element.closest("[data-canal]").querySelector("[data-lay-by]").append(grain)
  }

  shiftLock() {
    this.element.closest("[data-canal]").querySelector("[data-lower-pier]").append(this.element)
  }

  note(line) {
    this.lines.push(line)
    const log = this.element.querySelector("[data-lock-log]")
    if (log) log.textContent = this.lines.join("\n")
  }
}
