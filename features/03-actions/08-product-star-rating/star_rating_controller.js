/*
 * star_rating_controller.js — registered as "star-rating"
 *
 * Teaches: one set of actions on the star row instead of one per star, and
 * which events can do that. pointermove and click bubble, so the row hears
 * them for every star, and event.target.closest() finds the star under the
 * pointer (event.target is usually an SVG <path>). pointerleave, focus,
 * and blur don't bubble; they work here because the row itself is the
 * element that the pointer leaves and that takes focus.
 */
import { Controller } from "@hotwired/stimulus"

const starPath = "M10 1.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L10 15l-5.3 2.8 1.1-5.9L1.4 7.8l6-.8z"

export default class extends Controller {
  static targets = ["stars", "valueField", "readout", "keyboardHint"]
  static values = { rating: Number, aspect: String }

  initialize() {
    this.previewRating = null
  }

  connect() {
    if (this.starsTarget.childElementCount === 0) this.buildStars()
    this.render()
  }

  showPreview(event) {
    const hoveredRating = this.ratingAtPointer(event)
    if (hoveredRating === null || hoveredRating === this.previewRating) return
    this.previewRating = hoveredRating
    this.render()
  }

  endPreview() {
    this.previewRating = null
    this.render()
  }

  // Choosing the rating that is already set clears it.
  chooseRating(event) {
    const chosenRating = this.ratingAtPointer(event)
    if (chosenRating === null) return
    this.rate(chosenRating === this.ratingValue ? 0 : chosenRating)
  }

  adjustWithKeys(event) {
    const adjustments = {
      ArrowRight: this.ratingValue + 0.5,
      ArrowUp: this.ratingValue + 0.5,
      ArrowLeft: this.ratingValue - 0.5,
      ArrowDown: this.ratingValue - 0.5,
      Home: 0,
      End: 5,
    }
    if (!(event.key in adjustments)) return
    event.preventDefault()
    this.rate(Math.min(5, Math.max(0, adjustments[event.key])))
  }

  showKeyboardHint() {
    this.keyboardHintTarget.hidden = false
  }

  hideKeyboardHint() {
    this.keyboardHintTarget.hidden = true
  }

  rate(rating) {
    this.ratingValue = rating
  }

  // Stimulus calls this after the method that set the value has returned,
  // so the event goes out from here, once the hidden field is up to date.
  ratingValueChanged() {
    this.valueFieldTarget.value = this.ratingValue
    this.starsTarget.setAttribute("aria-valuenow", String(this.ratingValue))
    this.starsTarget.setAttribute("aria-valuetext", this.describe(this.ratingValue))
    this.render()
    this.dispatch("rated", { detail: { aspect: this.aspectValue, rating: this.ratingValue } })
  }

  // The left half of a star is a half-star rating. The star's own box is
  // the one to measure: event.target is a <path> inside it, and
  // event.currentTarget is the whole row.
  ratingAtPointer(event) {
    const star = event.target.closest("[data-star-position]")
    if (!star) return null
    const box = star.getBoundingClientRect()
    const onLeftHalf = event.clientX - box.left < box.width / 2
    return Number(star.dataset.starPosition) - (onLeftHalf ? 0.5 : 0)
  }

  render() {
    const shownRating = this.previewRating ?? this.ratingValue
    for (const star of this.starsTarget.children) {
      const fill = Math.min(1, Math.max(0, shownRating - Number(star.dataset.starPosition) + 1))
      star.querySelector("[data-star-fill]").style.width = `${fill * 100}%`
    }
    this.element.classList.toggle("previewing", this.previewRating !== null)
    this.readoutTarget.textContent = this.describe(shownRating)
  }

  buildStars() {
    for (let position = 1; position <= 5; position++) {
      const star = document.createElement("span")
      star.className = "star"
      star.dataset.starPosition = position
      star.innerHTML = `<svg viewBox="0 0 20 20" aria-hidden="true"><path d="${starPath}"/></svg>`
        + `<span class="star-fill" data-star-fill><svg viewBox="0 0 20 20" aria-hidden="true"><path d="${starPath}"/></svg></span>`
      this.starsTarget.append(star)
    }
  }

  describe(rating) {
    return rating === 0 ? "Not rated" : `${rating} out of 5`
  }
}
