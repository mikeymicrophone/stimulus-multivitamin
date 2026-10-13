/*
 * oven_queue_controller.js — registered as "oven-queue"
 *
 * Teaches: loafTargets follows document order. Moving a loaf with
 * insertBefore changes the next read. CSS order changes which loaf is
 * painted first and does not change loafTargets.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["loaf", "pullOrder", "visualNote"]

  connect() {
    this.render()
  }

  moveEarlier(event) {
    const loaf = event.currentTarget.closest("[data-oven-queue-target~='loaf']")
    const previous = loaf.previousElementSibling
    if (!previous) return
    loaf.parentElement.insertBefore(loaf, previous)
    this.render()
  }

  showCiabattaFirst() {
    this.element.classList.add("visual-front")
    this.render()
    const names = this.loafTargets.map((loaf) => loaf.dataset.loafName)
    this.visualNoteTarget.textContent = `The rack paints Ciabatta first. Target order: ${names.join(", ")}.`
  }

  render() {
    const names = this.loafTargets.map((loaf) => loaf.dataset.loafName)
    this.pullOrderTarget.textContent = `Pull order: ${names.join(", ")}.`
  }
}
