/*
 * now_playing_controller.js — registered as "now-playing"
 *
 * Teaches: designing a controller's public surface. Other controllers may
 * call play(), isPlaying, and currentEpisode. The playback timer, the
 * elapsed time, and the helpers that drive them are JavaScript private
 * members (#), so nothing outside this class can reach them, including a
 * data-action, which only resolves public methods. Tuning knobs are plain
 * static class fields; Stimulus only reads its own statics (targets,
 * values, classes, outlets) and leaves the rest alone, so the code reads
 * them through this.constructor.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["title", "show", "elapsed", "remaining", "progress", "playPauseButton", "rateButton", "seekButton"]

  static skipBackSeconds = 15
  static skipForwardSeconds = 30
  static playbackRates = [1, 1.5, 2]
  // There is no audio file. Each real second of "playback" covers one
  // minute of the episode so a whole episode plays in under an hour.
  static simulatedSecondsPerTick = 60

  #episode = null
  #elapsedSeconds = 0
  #rateIndex = 0
  #playbackTimer = null

  connect() {
    this.#render()
  }

  disconnect() {
    this.#stopTimer()
  }

  play(episode) {
    if (episode !== this.#episode) {
      this.#episode?.setPlaybackState("idle")
      this.#episode = episode
      this.#elapsedSeconds = 0
    }
    this.#startTimer()
    this.#render()
  }

  get isPlaying() {
    return this.#playbackTimer !== null
  }

  get currentEpisode() {
    return this.#episode
  }

  togglePlayback() {
    if (!this.#episode) {
      this.#playNextInQueue()
      return
    }
    if (this.isPlaying) {
      this.#stopTimer()
    } else {
      this.#startTimer()
    }
    this.#render()
  }

  skipBack() {
    this.#seekBy(-this.constructor.skipBackSeconds)
  }

  skipForward() {
    this.#seekBy(this.constructor.skipForwardSeconds)
  }

  cyclePlaybackRate() {
    this.#rateIndex = (this.#rateIndex + 1) % this.constructor.playbackRates.length
    this.#render()
  }

  #seekBy(seconds) {
    if (!this.#episode) return
    this.#elapsedSeconds = Math.max(0, this.#elapsedSeconds + seconds)
    this.#afterTimeChange()
  }

  #tick() {
    this.#elapsedSeconds += this.constructor.simulatedSecondsPerTick * this.#playbackRate
    this.#afterTimeChange()
  }

  #afterTimeChange() {
    if (this.#elapsedSeconds >= this.#episode.durationSeconds) {
      this.#finishEpisode()
    } else {
      this.#render()
    }
  }

  #finishEpisode() {
    this.#episode.setPlaybackState("played")
    this.#episode = null
    this.#elapsedSeconds = 0
    this.#stopTimer()
    this.#playNextInQueue()
  }

  #playNextInQueue() {
    const nextEpisode = this.#episodeQueue?.takeNext()
    if (nextEpisode) {
      this.play(nextEpisode)
    } else {
      this.#render()
    }
  }

  #startTimer() {
    if (this.#playbackTimer !== null) return
    this.#playbackTimer = window.setInterval(() => this.#tick(), 1000)
  }

  #stopTimer() {
    window.clearInterval(this.#playbackTimer)
    this.#playbackTimer = null
  }

  #render() {
    const episode = this.#episode
    this.rateButtonTarget.textContent = `${this.#playbackRate}×`
    for (const seekButton of this.seekButtonTargets) seekButton.disabled = !episode

    if (!episode) {
      this.titleTarget.textContent = "Nothing playing"
      this.showTarget.textContent = "Pick an episode, or press play to start your queue."
      this.elapsedTarget.textContent = formatClock(0)
      this.remainingTarget.textContent = ""
      this.progressTarget.value = 0
      this.playPauseButtonTarget.textContent = "Play queue"
      return
    }

    episode.setPlaybackState(this.isPlaying ? "playing" : "paused")
    this.titleTarget.textContent = episode.title
    this.showTarget.textContent = episode.show
    this.elapsedTarget.textContent = formatClock(this.#elapsedSeconds)
    this.remainingTarget.textContent = `-${formatClock(episode.durationSeconds - this.#elapsedSeconds)}`
    this.progressTarget.max = episode.durationSeconds
    this.progressTarget.value = this.#elapsedSeconds
    this.playPauseButtonTarget.textContent = this.isPlaying ? "Pause" : "Play"
  }

  get #playbackRate() {
    return this.constructor.playbackRates[this.#rateIndex]
  }

  get #episodeQueue() {
    const queueElement = document.getElementById("episode-queue")
    return queueElement ? this.application.getControllerForElementAndIdentifier(queueElement, "episode-queue") : null
  }
}

function formatClock(totalSeconds) {
  const wholeSeconds = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(wholeSeconds / 3600)
  const minutes = Math.floor((wholeSeconds % 3600) / 60)
  const seconds = String(wholeSeconds % 60).padStart(2, "0")
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${seconds}` : `${minutes}:${seconds}`
}
