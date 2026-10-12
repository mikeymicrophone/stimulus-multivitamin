/*
 * score_poller_controller.js — registered as "score-poller"
 *
 * Teaches: polling that belongs to one element. connect() starts polling
 * and disconnect() stops it: it clears the pending timer and aborts the
 * request in flight, so a reply that arrives after the tile is gone never
 * writes into it. Each poll schedules the next one only after it finishes,
 * so slow replies never overlap. The cursor (where to ask next) is set in
 * initialize(), so pinning a game, which moves its tile, picks up where it
 * left off instead of starting over.
 */
import { Controller } from "@hotwired/stimulus"

const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })

export default class extends Controller {
  static targets = ["period", "awayScore", "homeScore", "lastPlay", "freshness"]
  static values = { feedUrl: String, pollSeconds: { type: Number, default: 10 } }

  initialize() {
    this.nextFeedUrl = new URL(this.feedUrlValue, document.baseURI).href
    this.isFinal = false
    this.pollTimer = null
    this.inFlightRequest = null
  }

  connect() {
    if (this.isFinal) return
    if (document.hidden) {
      this.freshnessTarget.textContent = "Paused while this tab is hidden."
    } else {
      this.poll()
    }
  }

  disconnect() {
    this.stopPolling()
  }

  visibilityChanged() {
    if (this.isFinal) return
    if (document.hidden) {
      this.stopPolling()
      this.freshnessTarget.textContent = "Paused while this tab is hidden."
    } else {
      this.poll()
    }
  }

  async poll() {
    this.stopPolling()
    const request = new AbortController()
    this.inFlightRequest = request

    try {
      const response = await fetch(this.nextFeedUrl, { signal: request.signal, cache: "no-store" })
      if (!response.ok) throw new Error(`The league feed answered ${response.status}`)
      const gameUpdate = await response.json()
      this.render(gameUpdate)
      if (gameUpdate.next) this.nextFeedUrl = new URL(gameUpdate.next, response.url).href
      this.isFinal = gameUpdate.final
    } catch (error) {
      if (error.name === "AbortError") return
      this.freshnessTarget.textContent = `${error.message}. Trying again shortly.`
    } finally {
      if (this.inFlightRequest === request) this.inFlightRequest = null
    }

    if (!this.isFinal) this.pollTimer = setTimeout(() => this.poll(), this.pollSecondsValue * 1000)
  }

  stopPolling() {
    clearTimeout(this.pollTimer)
    this.pollTimer = null
    this.inFlightRequest?.abort()
    this.inFlightRequest = null
  }

  render({ period, awayScore, homeScore, lastPlay, final }) {
    this.periodTarget.textContent = period
    this.awayScoreTarget.textContent = awayScore
    this.homeScoreTarget.textContent = homeScore
    this.lastPlayTarget.textContent = lastPlay
    this.element.classList.toggle("final", final)
    this.freshnessTarget.textContent = final
      ? "Final. No more updates."
      : `Updated ${timeFormatter.format(new Date())}`
  }
}
