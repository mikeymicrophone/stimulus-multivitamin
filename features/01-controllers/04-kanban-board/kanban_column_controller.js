/*
 * kanban_column_controller.js — registered as "kanban-column"
 *
 * Teaches: scope is decided by the DOM, live. A column's card targets are
 * whatever cards sit inside its element right now, so a card moved into
 * another column simply becomes that column's target. Scope also stops at a
 * nested element with the same identifier: the "Blocked" lane inside
 * "In progress" is its own kanban-column, so its cards, list, and count
 * are invisible to the "In progress" instance even though they share
 * target names.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list", "card", "count", "limitNotice"]
  static values = { wipLimit: Number }

  connect() {
    this.render()
  }

  cardTargetConnected() {
    this.render()
  }

  cardTargetDisconnected() {
    this.render()
  }

  acceptCard(card) {
    this.listTarget.append(card)
  }

  render() {
    const cardCount = this.cardTargets.length
    const isOverLimit = this.hasWipLimit && cardCount > this.wipLimitValue

    this.countTarget.textContent = this.hasWipLimit ? `${cardCount} / ${this.wipLimitValue}` : String(cardCount)
    this.element.classList.toggle("over-limit", isOverLimit)
    if (this.hasLimitNoticeTarget) this.limitNoticeTarget.hidden = !isOverLimit
  }

  get hasWipLimit() {
    return this.wipLimitValue > 0
  }
}
