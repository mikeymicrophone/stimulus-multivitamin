/*
 * character_budget_controller.js — registered as "character-budget"
 *
 * Teaches: a small controller that shares its element with others. It knows
 * nothing about drafts or fair-housing rules; it only counts characters
 * against the limit the listing site enforces for this field. Because it
 * shares the field with other controllers, it writes only to its own
 * targets and its own data attribute, never to attributes another
 * controller might also set.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["field", "remaining"]
  static values = { limit: Number }

  connect() {
    this.update()
  }

  update() {
    const charactersRemaining = this.limitValue - this.fieldTarget.value.length

    if (charactersRemaining >= 0) {
      this.remainingTarget.textContent = `${charactersRemaining} of ${this.limitValue} characters left`
    } else {
      this.remainingTarget.textContent = `${-charactersRemaining} characters over the ${this.limitValue}-character limit`
    }
    this.element.dataset.characterBudgetState = charactersRemaining < 0 ? "over" : "within"
  }
}
