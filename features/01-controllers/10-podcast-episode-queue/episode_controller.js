/*
 * episode_controller.js — registered as "episode"
 *
 * Teaches: a controller instance as an object other code holds on to. The
 * queue and the player keep references to episode instances, not to
 * elements or ids, and read them only through the public getters below.
 * setPlaybackState() is the one method they call back on it.
 */
import { Controller } from "@hotwired/stimulus"

const PLAY_BUTTON_LABELS = { idle: "Play", playing: "Playing", paused: "Resume", played: "Play again" }

export default class extends Controller {
  static targets = ["title", "playButton", "status"]
  static values = { show: String, durationSeconds: Number }

  connect() {
    this.setPlaybackState(this.element.dataset.playbackState ?? "idle")
  }

  playNow() {
    this.#nowPlaying?.play(this)
  }

  addToQueue() {
    this.#episodeQueue?.enqueue(this)
  }

  setPlaybackState(playbackState) {
    if (this.element.dataset.playbackState === "played" && playbackState === "idle") return
    this.element.dataset.playbackState = playbackState
    this.playButtonTarget.textContent = PLAY_BUTTON_LABELS[playbackState]
    this.statusTarget.textContent = playbackState === "played" ? "Played" : ""
  }

  get title() {
    return this.titleTarget.textContent.trim()
  }

  get show() {
    return this.showValue
  }

  get durationSeconds() {
    return this.durationSecondsValue
  }

  get #nowPlaying() {
    return this.#controllerById("now-playing", "now-playing")
  }

  get #episodeQueue() {
    return this.#controllerById("episode-queue", "episode-queue")
  }

  #controllerById(elementId, identifier) {
    const element = document.getElementById(elementId)
    return element ? this.application.getControllerForElementAndIdentifier(element, identifier) : null
  }
}
