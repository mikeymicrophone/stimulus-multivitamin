/*
 * running_order_controller.js — registered as "running-order"
 *
 * Teaches: a long-lived parent that owns what must outlive its children.
 * The on-air start time lives here, keyed by track id, so it survives the
 * on-air track moving between sections and being replaced outright when
 * the producer's running order is reloaded from the studio. This
 * controller moves tracks (buttons, auto-advance) and replaces them
 * (reload); every track handles both.
 */
import { Controller } from "@hotwired/stimulus"

const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = String(totalSeconds % 60).padStart(2, "0")
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`
}

export default class extends Controller {
  static targets = ["onAirSlot", "upNextList", "playedList", "track", "upNextSummary", "status"]
  static values = { onAirElapsedSeconds: Number }

  initialize() {
    this.onAirTrackId = this.onAirTrack?.dataset.playlistTrackTrackIdValue ?? null
    this.onAirStartedAt = Date.now() - this.onAirElapsedSecondsValue * 1000
  }

  connect() {
    this.renderUpNext()
  }

  startedAtFor(trackId) {
    if (trackId !== this.onAirTrackId) {
      this.onAirTrackId = trackId
      this.onAirStartedAt = Date.now()
    }
    return this.onAirStartedAt
  }

  takeNext() {
    const finishedTrack = this.onAirTrack
    const nextTrack = this.upNextListTarget.firstElementChild
    if (finishedTrack) {
      finishedTrack.dataset.playlistTrackOnAirValue = "false"
      this.playedListTarget.prepend(finishedTrack)
    }
    if (nextTrack) {
      this.onAirSlotTarget.append(nextTrack)
      nextTrack.dataset.playlistTrackOnAirValue = "true"
    }
    this.statusTarget.textContent = nextTrack
      ? `Now playing: ${nextTrack.querySelector("[data-playlist-track-target=title]").textContent}`
      : "The running order is empty."
    this.renderUpNext()
  }

  moveTrack({ params: { offset }, currentTarget: moveButton }) {
    const track = moveButton.closest('[data-running-order-target="track"]')
    if (offset < 0 && track.previousElementSibling) {
      this.upNextListTarget.insertBefore(track, track.previousElementSibling)
    } else if (offset > 0 && track.nextElementSibling) {
      this.upNextListTarget.insertBefore(track, track.nextElementSibling.nextElementSibling)
    }
    this.renderUpNext()
    moveButton.focus()
  }

  dropTrack(event) {
    event.target.closest('[data-running-order-target="track"]').remove()
    this.renderUpNext()
  }

  trackReordered({ detail: { trackTitle, reconnects } }) {
    this.statusTarget.textContent =
      `Moved “${trackTitle}”. It reconnected ${reconnects} ${reconnects === 1 ? "time" : "times"} during the drag, with one drag session throughout.`
    this.renderUpNext()
  }

  async reloadFromStudio() {
    try {
      const response = await fetch("studio/running-order.html")
      if (!response.ok) throw new Error(`The studio answered ${response.status}`)
      const studioMarkup = document.createElement("template")
      studioMarkup.innerHTML = await response.text()
      const section = (name) => studioMarkup.content.querySelector(`[data-studio-section="${name}"]`).children
      this.onAirSlotTarget.replaceChildren(...section("on-air"))
      this.upNextListTarget.replaceChildren(...section("up-next"))
      this.playedListTarget.replaceChildren(...section("played"))
      this.statusTarget.textContent = "Loaded the producer's latest running order."
    } catch (error) {
      this.statusTarget.textContent = error.message
    }
    this.renderUpNext()
  }

  renderUpNext() {
    const upNextTracks = [...this.upNextListTarget.children]
    const totalSeconds = upNextTracks.reduce((total, track) => total + Number(track.dataset.playlistTrackDurationSecondsValue), 0)
    this.upNextSummaryTarget.textContent = `${upNextTracks.length} ${upNextTracks.length === 1 ? "track" : "tracks"} · ${formatDuration(totalSeconds)}`
    upNextTracks.forEach((track, index) => {
      track.querySelector('[data-running-order-offset-param="-1"]').disabled = index === 0
      track.querySelector('[data-running-order-offset-param="1"]').disabled = index === upNextTracks.length - 1
    })
  }

  get onAirTrack() {
    return this.onAirSlotTarget.querySelector('[data-controller~="playlist-track"]')
  }
}
