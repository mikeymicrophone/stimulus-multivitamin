/*
 * kanban_board_controller.js — registered as "kanban-board"
 *
 * Teaches: an outer controller whose scope contains every nested column.
 * Cards are targets of both controllers at once: the board sees all of them,
 * while each column sees only its own. The board moves a card by handing it
 * to the destination column's controller instance and lets DOM position do
 * the rest; it never tells the old column that a card left.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["column", "blockedLane", "card", "backButton", "forwardButton", "blockButton", "summary"]

  connect() {
    this.refresh()
  }

  moveCard({ currentTarget, params: { offset } }) {
    const card = this.cardContaining(currentTarget)
    const columnIndex = this.columnTargets.indexOf(this.columnContaining(card))
    const destinationColumn = this.columnTargets[columnIndex + offset]
    if (!destinationColumn) return

    this.columnControllerFor(destinationColumn).acceptCard(card)
    this.refresh()
  }

  toggleBlocked({ currentTarget }) {
    const card = this.cardContaining(currentTarget)
    const column = this.columnContaining(card)
    const blockedLane = this.blockedLaneIn(column)
    if (!blockedLane) return

    const destination = blockedLane.contains(card) ? column : blockedLane
    this.columnControllerFor(destination).acceptCard(card)
    this.refresh()
  }

  refresh() {
    const lastColumnIndex = this.columnTargets.length - 1

    for (const card of this.cardTargets) {
      const column = this.columnContaining(card)
      const columnIndex = this.columnTargets.indexOf(column)
      const blockedLane = this.blockedLaneIn(column)

      this.buttonIn(card, this.backButtonTargets).disabled = columnIndex === 0
      this.buttonIn(card, this.forwardButtonTargets).disabled = columnIndex === lastColumnIndex

      const blockButton = this.buttonIn(card, this.blockButtonTargets)
      blockButton.hidden = !blockedLane
      blockButton.textContent = blockedLane?.contains(card) ? "Unblock" : "Block"
    }

    // The board connects before the columns inside it, so this runs on
    // connect without asking any column instance for its count.
    const blockedCardCount = this.cardTargets.filter((card) =>
      this.blockedLaneTargets.some((lane) => lane.contains(card))
    ).length
    const cardWord = this.cardTargets.length === 1 ? "card" : "cards"
    this.summaryTarget.textContent = `${this.cardTargets.length} ${cardWord} on the board · ${blockedCardCount} blocked`
  }

  cardContaining(element) {
    return this.cardTargets.find((card) => card.contains(element))
  }

  columnContaining(card) {
    return this.columnTargets.find((column) => column.contains(card))
  }

  blockedLaneIn(column) {
    return this.blockedLaneTargets.find((lane) => column.contains(lane))
  }

  buttonIn(card, buttons) {
    return buttons.find((button) => card.contains(button))
  }

  columnControllerFor(element) {
    return this.application.getControllerForElementAndIdentifier(element, "kanban-column")
  }
}
