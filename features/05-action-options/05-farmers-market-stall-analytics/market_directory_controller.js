/*
 * market_directory_controller.js — registered as "market-directory"
 *
 * Teaches: the directory records clicks in the capture phase with
 * click->market-directory#recordVisit:capture, so the log still sees a
 * click that a child later :stop's. A second action on the same element
 * without :capture runs in the bubble phase and misses that stopped
 * click. "Text the stall" uses :stop so the stall does not also open.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["captureLog", "bubbleLog", "composer", "composerHeading", "detail", "detailHeading", "detailCopy", "status"]
  static values = {
    stalls: Object,
  }

  connect() {
    this.clearLogs()
    this.statusTarget.textContent = "Click a stall to open it, or Text the stall to write without opening it."
  }

  recordVisit({ target }) {
    const stall = this.stallFor(target)
    this.append(this.captureLogTarget, `capture: ${stall ? stall.name : "the directory"}`)
  }

  recordBubble({ target }) {
    const stall = this.stallFor(target)
    this.append(this.bubbleLogTarget, `bubble: ${stall ? stall.name : "the directory"}`)
  }

  openStall({ currentTarget: card }) {
    const stall = this.stallsValue[card.dataset.stallSlug]
    this.detailHeadingTarget.textContent = stall.name
    this.detailCopyTarget.textContent = stall.goods
    this.detailTarget.hidden = false
    this.statusTarget.textContent = `Opened ${stall.name}. The click reached the card in the bubble phase.`
  }

  openComposer({ currentTarget: textButton }) {
    const stall = this.stallsValue[textButton.dataset.stallSlug]
    this.composerHeadingTarget.textContent = `Text ${stall.vendor} at ${stall.name}`
    this.composerTarget.hidden = false
    this.statusTarget.textContent = `Composer open for ${stall.name}. :stop hid the click from the card and from the directory's bubble log; the :capture log still has it.`
  }

  stallFor(node) {
    const card = node.closest("[data-stall-slug]")
    return card ? this.stallsValue[card.dataset.stallSlug] : null
  }

  append(list, line) {
    const entry = document.createElement("li")
    entry.textContent = line
    list.append(entry)
  }

  clearLogs() {
    this.captureLogTarget.replaceChildren()
    this.bubbleLogTarget.replaceChildren()
  }
}
