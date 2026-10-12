/*
 * assignment_board_controller.js — registered as "assignment-board"
 *
 * Teaches: modifier combinations. keydown.alt+left / alt+right move a
 * story between Pitch, Reporting, Copy desk, and Published.
 * keydown.alt+up / alt+down reorder inside the column. Those four do not
 * match Alt+Shift+Left — every modifier flag has to be listed — so
 * keydown.shift+alt+left jumps to Pitch and shift+alt+right to Published.
 * keydown.ctrl+enter opens the story. Alt+ArrowLeft is Back in some
 * browsers; the actions preventDefault().
 */
import { Controller } from "@hotwired/stimulus"

const columnOrder = ["pitch", "reporting", "copy-desk", "published"]
const columnLabels = {
  pitch: "Pitch",
  reporting: "Reporting",
  "copy-desk": "Copy desk",
  published: "Published",
}

export default class extends Controller {
  static targets = ["columnList", "story", "status", "drawer", "drawerTitle", "drawerBody"]

  initialize() {
    this.focusedStoryId = "harbor-crane"
    this.openStoryId = null
  }

  connect() {
    this.renderFocus()
  }

  focusStory({ currentTarget: storyCard }) {
    this.focusedStoryId = storyCard.dataset.storyId
    this.renderFocus()
  }

  moveAcross(event) {
    event.preventDefault()
    const storyCard = this.focusedStory
    if (!storyCard) return
    const delta = event.key === "ArrowRight" ? 1 : -1
    const nextColumn = columnOrder[this.columnIndex(storyCard.dataset.column) + delta]
    if (!nextColumn) return
    this.placeStory(storyCard, nextColumn, "end")
    this.statusTarget.textContent = `${storyCard.dataset.headline} → ${columnLabels[nextColumn]}.`
  }

  moveAlong(event) {
    event.preventDefault()
    const storyCard = this.focusedStory
    if (!storyCard) return
    const siblings = this.storiesIn(storyCard.dataset.column)
    const currentIndex = siblings.indexOf(storyCard)
    const swapWith = event.key === "ArrowUp" ? currentIndex - 1 : currentIndex + 1
    if (swapWith < 0 || swapWith >= siblings.length) return
    const neighbor = siblings[swapWith]
    const row = storyCard.closest("li") ?? storyCard
    const neighborRow = neighbor.closest("li") ?? neighbor
    if (event.key === "ArrowUp") neighborRow.before(row)
    else neighborRow.after(row)
    this.renderFocus()
    this.statusTarget.textContent = `${storyCard.dataset.headline} moved ${event.key === "ArrowUp" ? "up" : "down"} in ${columnLabels[storyCard.dataset.column]}.`
  }

  jumpToEdge(event) {
    event.preventDefault()
    const storyCard = this.focusedStory
    if (!storyCard) return
    const nextColumn = event.key === "ArrowLeft" ? "pitch" : "published"
    this.placeStory(storyCard, nextColumn, "end")
    this.statusTarget.textContent = `${storyCard.dataset.headline} jumped to ${columnLabels[nextColumn]}.`
  }

  openStory(event) {
    event.preventDefault()
    const storyCard = this.focusedStory
    if (!storyCard) return
    this.openStoryId = storyCard.dataset.storyId
    this.drawerTitleTarget.textContent = storyCard.dataset.headline
    this.drawerBodyTarget.textContent = storyCard.dataset.lede
    this.drawerTarget.hidden = false
    this.statusTarget.textContent = `Opened ${storyCard.dataset.headline}.`
  }

  closeDrawer(event) {
    if (this.drawerTarget.hidden) return
    event.preventDefault()
    this.drawerTarget.hidden = true
    this.openStoryId = null
    this.focusedStory?.focus()
    this.statusTarget.textContent = "Closed the story drawer."
  }

  placeStory(storyCard, columnName, position) {
    const list = this.columnListTargets.find((listElement) => listElement.dataset.column === columnName)
    const row = storyCard.closest("li") ?? storyCard
    storyCard.dataset.column = columnName
    if (position === "end") list.append(row)
    else list.prepend(row)
    this.renderFocus()
  }

  renderFocus() {
    for (const storyCard of this.storyTargets) {
      const focused = storyCard.dataset.storyId === this.focusedStoryId
      storyCard.tabIndex = focused ? 0 : -1
      storyCard.setAttribute("aria-current", focused ? "true" : "false")
    }
    this.focusedStory?.focus()
  }

  storiesIn(columnName) {
    return this.storyTargets.filter((storyCard) => storyCard.dataset.column === columnName)
  }

  columnIndex(columnName) {
    return columnOrder.indexOf(columnName)
  }

  get focusedStory() {
    return this.storyTargets.find((storyCard) => storyCard.dataset.storyId === this.focusedStoryId)
  }
}
