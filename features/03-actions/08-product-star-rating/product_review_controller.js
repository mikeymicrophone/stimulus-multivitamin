/*
 * product_review_controller.js — registered as "product-review"
 *
 * Teaches: the bubbling twins of non-bubbling events. The review form
 * highlights whichever aspect has focus. focus and blur never reach the
 * form, so it listens for focusin and focusout, which fire for the same
 * moments and bubble. It also hears each rating's star-rating:rated event.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["aspect", "ratingField", "summary", "reviewText", "submitButton", "status"]

  connect() {
    this.updateSummary()
  }

  highlightAspect({ target }) {
    for (const aspect of this.aspectTargets) aspect.classList.toggle("active", aspect.contains(target))
  }

  // focusout's relatedTarget is where focus is going; leaving one aspect
  // for another is handled by the focusin that follows.
  clearHighlight({ relatedTarget }) {
    if (relatedTarget && this.element.contains(relatedTarget)) return
    for (const aspect of this.aspectTargets) aspect.classList.remove("active")
  }

  updateSummary() {
    const rated = this.ratingFieldTargets.filter((field) => Number(field.value) > 0)
    this.summaryTarget.textContent = rated.length === 0
      ? "Nothing rated yet."
      : rated.map((field) => `${field.dataset.aspectLabel} ${field.value}`).join(" · ")
    this.submitButtonTarget.disabled = Number(this.overallField.value) === 0
  }

  submitReview(event) {
    event.preventDefault()
    const wordCount = this.reviewTextTarget.value.trim().split(/\s+/).filter(Boolean).length
    this.statusTarget.textContent = `Thanks! Your ${this.overallField.value}-star review${wordCount ? ` (${wordCount} words)` : ""} will appear after a quick check.`
  }

  get overallField() {
    return this.ratingFieldTargets.find((field) => field.name === "rating_overall")
  }
}
