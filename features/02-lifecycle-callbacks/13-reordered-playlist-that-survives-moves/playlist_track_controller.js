/*
 * playlist_track_controller.js — registered as "playlist-track"
 *
 * Teaches: surviving moves. Dragging a track reorders the list live, so
 * the dragged element is moved, and disconnected and reconnected, several
 * times in one drag. A moved element is already back in the document when
 * disconnect() runs, so disconnect() checks this.element.isConnected and
 * only tears down (the drag session's document listeners and the on-air
 * clock) when the track has really left. connect() and onAirValueChanged()
 * must then be safe to run again without starting anything twice.
 */
import { Controller } from "@hotwired/stimulus"

const formatDuration = (totalSeconds) => `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`

export default class extends Controller {
  static targets = ["time", "title"]
  static values = { trackId: String, durationSeconds: Number, onAir: Boolean }

  initialize() {
    this.clockTimer = null
    this.dragSession = null
    this.reconnectsDuringDrag = 0
    this.cachedRunningOrder = null
  }

  // Stimulus calls this before connect(), and again on every reconnect,
  // including each move during a drag. Starting and stopping the clock are
  // both no-ops when they have nothing to do.
  onAirValueChanged(onAir) {
    if (onAir) {
      this.startClock()
    } else {
      this.stopClock()
    }
  }

  connect() {
    if (this.dragSession) this.reconnectsDuringDrag += 1
    this.renderTime()
  }

  disconnect() {
    if (this.element.isConnected) return
    this.stopClock()
    this.endDrag()
  }

  startDrag(event) {
    if (this.dragSession || !this.element.closest('[data-running-order-target="upNextList"]')) return
    event.preventDefault()
    this.dragSession = new AbortController()
    this.reconnectsDuringDrag = 0
    const { signal } = this.dragSession
    document.addEventListener("pointermove", (moveEvent) => this.dragTo(moveEvent.clientY), { signal })
    document.addEventListener("pointerup", () => this.finishDrag(), { signal })
    document.addEventListener("pointercancel", () => this.finishDrag(), { signal })
    this.element.classList.add("dragging")
  }

  dragTo(pointerY) {
    const list = this.element.parentElement
    const followingTrack = [...list.children]
      .filter((track) => track !== this.element)
      .find((track) => {
        const box = track.getBoundingClientRect()
        return pointerY < box.top + box.height / 2
      }) ?? null
    if (followingTrack === this.element.nextElementSibling) return
    list.insertBefore(this.element, followingTrack)
  }

  finishDrag() {
    const reconnects = this.reconnectsDuringDrag
    this.endDrag()
    this.dispatch("reordered", { detail: { trackTitle: this.titleTarget.textContent, reconnects } })
  }

  endDrag() {
    this.dragSession?.abort()
    this.dragSession = null
    this.element.classList.remove("dragging")
  }

  startClock() {
    if (this.clockTimer !== null) return
    this.clockTimer = setInterval(() => this.tick(), 1000)
    this.renderTime()
  }

  stopClock() {
    if (this.clockTimer === null) return
    clearInterval(this.clockTimer)
    this.clockTimer = null
    this.renderTime()
  }

  tick() {
    this.renderTime()
    if (this.elapsedSeconds >= this.durationSecondsValue) {
      this.stopClock()
      this.dispatch("finished")
    }
  }

  renderTime() {
    this.timeTarget.textContent = this.onAirValue
      ? `${formatDuration(Math.min(this.elapsedSeconds, this.durationSecondsValue))} / ${formatDuration(this.durationSecondsValue)}`
      : formatDuration(this.durationSecondsValue)
  }

  get elapsedSeconds() {
    const startedAt = this.runningOrder?.startedAtFor(this.trackIdValue) ?? Date.now()
    return Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
  }

  // onAirValueChanged() runs before connect(), so the running order is
  // looked up on first use instead of in connect(), then kept.
  get runningOrder() {
    if (this.cachedRunningOrder === null) {
      const runningOrderElement = this.element.closest('[data-controller~="running-order"]')
      this.cachedRunningOrder = runningOrderElement
        ? this.application.getControllerForElementAndIdentifier(runningOrderElement, "running-order")
        : null
    }
    return this.cachedRunningOrder
  }
}
