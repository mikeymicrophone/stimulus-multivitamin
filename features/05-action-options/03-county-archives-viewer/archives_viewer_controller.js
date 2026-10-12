/*
 * archives_viewer_controller.js — registered as "archives-viewer"
 *
 * Teaches: the overlay declares click->archives-viewer#dismiss:self, so
 * dismiss() runs only when event.target is the overlay itself. Clicks on
 * the scan, caption, or Close button are children and fail the :self
 * check. Close names dismiss without :self, so it still works.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["overlay", "status"]

  connect() {
    this.statusTarget.textContent = "Ordinance 1974-12 is open. Click the dimmed overlay to close it, or the scan to keep it open."
  }

  openViewer() {
    this.overlayTarget.hidden = false
    this.statusTarget.textContent = "Opened Ordinance 1974-12, Harbor Street paving."
  }

  dismiss({ target, currentTarget }) {
    this.overlayTarget.hidden = true
    this.statusTarget.textContent = target === currentTarget
      ? "Closed from the overlay itself. :self saw event.target === the overlay."
      : "Closed from Close. That control omits :self, so a child click is allowed."
  }

  noteChildClick({ currentTarget: child }) {
    this.statusTarget.textContent = `Clicked ${child.dataset.childLabel} (a child of the overlay). :self skipped dismiss(), so the viewer stayed open.`
  }
}
