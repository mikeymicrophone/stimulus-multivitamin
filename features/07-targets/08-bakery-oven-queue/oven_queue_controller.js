/*
 * oven_queue_controller.js — registered as "oven-queue"
 *
 * Teaches: loafTargets follows document order. Moving a loaf with
 * Element.before changes the next read. CSS order changes which loaf is
 * painted first and does not change loafTargets.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["loaf", "pullOrder", "visualNote"]

  connect() {
    this.render()
  }

  moveEarlier({ currentTarget }) {
    const loaf = currentTarget.closest("[data-oven-queue-target~='loaf']")
    loaf.previousElementSibling?.before(loaf)
    this.render()
  }

  showCiabattaFirst() {
    this.element.classList.add("visual-front")
    this.render()
    this.visualNoteTarget.textContent = `The rack paints Ciabatta first. Target order: ${[...this].join(", ")}.`
  }

  render() {
    this.pullOrderTarget.textContent = `Pull order: ${[...this].join(", ")}.`
  }

  // Walks loafTargets on every spread, so [...this] is always the
  // current pull order.
  *[Symbol.iterator]() {
    for (const { dataset } of this.loafTargets) yield dataset.loafName
  }
}
