/*
 * episode_queue_controller.js — registered as "episode-queue"
 *
 * Teaches: holding other controllers' instances. The queue stores episode
 * controller instances in a private array and hands them to now-playing
 * through takeNext(); both sides talk only through public getters
 * (title, durationSeconds). Reordering buttons are rendered by this
 * controller and wired with data-action plus action params, which is why
 * moveUp(), moveDown(), and remove() are public while #render() is not.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "summary", "notice"]

  #queuedEpisodes = []

  connect() {
    this.#render()
  }

  enqueue(episode) {
    if (this.#queuedEpisodes.includes(episode)) {
      this.noticeTarget.textContent = `“${episode.title}” is already in your queue.`
      return false
    }
    this.#queuedEpisodes.push(episode)
    this.noticeTarget.textContent = `Added “${episode.title}”.`
    this.#render()
    return true
  }

  takeNext() {
    const nextEpisode = this.#queuedEpisodes.shift() ?? null
    this.noticeTarget.textContent = nextEpisode ? "" : "Your queue is empty."
    this.#render()
    return nextEpisode
  }

  moveUp({ params: { position } }) {
    this.#swap(position, position - 1)
  }

  moveDown({ params: { position } }) {
    this.#swap(position, position + 1)
  }

  remove({ params: { position } }) {
    this.#queuedEpisodes.splice(position, 1)
    this.#render()
  }

  #swap(fromPosition, toPosition) {
    if (toPosition < 0 || toPosition >= this.#queuedEpisodes.length) return
    const reordered = [...this.#queuedEpisodes]
    ;[reordered[fromPosition], reordered[toPosition]] = [reordered[toPosition], reordered[fromPosition]]
    this.#queuedEpisodes = reordered
    this.#render()
  }

  #render() {
    this.listTarget.replaceChildren(
      ...this.#queuedEpisodes.map((episode, position) => this.#buildQueueEntry(episode, position))
    )

    const queuedCount = this.#queuedEpisodes.length
    const totalMinutes = Math.round(
      this.#queuedEpisodes.reduce((runningTotal, episode) => runningTotal + episode.durationSeconds, 0) / 60
    )
    this.summaryTarget.textContent =
      queuedCount === 0
        ? "Nothing queued"
        : `${queuedCount} ${queuedCount === 1 ? "episode" : "episodes"} · ${formatMinutes(totalMinutes)}`
  }

  #buildQueueEntry(episode, position) {
    const entry = document.createElement("li")
    const label = document.createElement("span")
    label.textContent = `${episode.title} · ${formatMinutes(Math.round(episode.durationSeconds / 60))}`
    entry.append(
      label,
      this.#buildQueueButton("Up", `Move “${episode.title}” up`, "moveUp", position, position === 0),
      this.#buildQueueButton("Down", `Move “${episode.title}” down`, "moveDown", position, position === this.#queuedEpisodes.length - 1),
      this.#buildQueueButton("Remove", `Remove “${episode.title}” from the queue`, "remove", position, false)
    )
    return entry
  }

  #buildQueueButton(text, accessibleName, methodName, position, isDisabled) {
    const button = document.createElement("button")
    button.type = "button"
    button.className = "quiet"
    button.textContent = text
    button.disabled = isDisabled
    button.setAttribute("aria-label", accessibleName)
    button.dataset.action = `${this.identifier}#${methodName}`
    button.setAttribute(`data-${this.identifier}-position-param`, String(position))
    return button
  }
}

function formatMinutes(totalMinutes) {
  if (totalMinutes < 60) return `${totalMinutes} min`
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`
}
