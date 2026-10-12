/*
 * essay_progress_controller.js — registered as "essay-progress"
 *
 * Teaches: the article listens with scroll->essay-progress#updateProgress:passive.
 * :passive is { passive: true } on the native listener. The method only
 * reads scrollTop, so it never needs preventDefault, and the browser can
 * scroll without waiting on JavaScript.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["article", "progressFill", "percent", "position", "status"]

  connect() {
    this.updateProgress()
  }

  updateProgress() {
    const article = this.articleTarget
    const maxScroll = article.scrollHeight - article.clientHeight
    const ratio = maxScroll <= 0 ? 1 : Math.min(Math.max(article.scrollTop / maxScroll, 0), 1)
    const percent = Math.round(ratio * 100)
    this.progressFillTarget.style.width = `${percent}%`
    this.progressFillTarget.setAttribute("aria-valuenow", String(percent))
    this.percentTarget.textContent = `${percent}%`
    this.positionTarget.textContent = this.passageFor(percent)
    this.statusTarget.textContent = `Scrolled ${percent}% with a :passive listener (cancelable=${this.lastCancelableLabel()}).`
  }

  lastCancelableLabel() {
    return "the handler never calls preventDefault"
  }

  passageFor(percent) {
    if (percent < 15) return "Opening · the weir at dawn"
    if (percent < 45) return "The night watch · glass eels in the buckets"
    if (percent < 75) return "Upriver · Damariscotta mills"
    return "Coda · the run is over by Thursday"
  }
}
