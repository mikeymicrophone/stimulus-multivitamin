/*
 * contact_sheet_controller.js — registered as "contact-sheet"
 *
 * Teaches: keydown.left and keydown.right are the built-in names for
 * ArrowLeft and ArrowRight. The actions sit on the filmstrip, which is
 * tabindex="0", so they run only while the strip (or a frame inside it)
 * has focus. They are not @window listeners. Each method preventDefault()
 * so the arrow keys do not scroll the page.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["frame", "viewer", "frameNumber", "caption", "status"]

  initialize() {
    this.selectedIndex = 0
  }

  connect() {
    this.show(this.selectedIndex)
  }

  selectFrame({ currentTarget: frameButton }) {
    this.show(this.frameTargets.indexOf(frameButton))
  }

  showPrevious(event) {
    event.preventDefault()
    this.show(this.selectedIndex - 1)
  }

  showNext(event) {
    event.preventDefault()
    this.show(this.selectedIndex + 1)
  }

  show(index) {
    const count = this.frameTargets.length
    this.selectedIndex = (index + count) % count
    const frameButton = this.frameTargets[this.selectedIndex]
    this.viewerTarget.src = frameButton.querySelector("img").src
    this.viewerTarget.alt = frameButton.dataset.frameAlt
    this.frameNumberTarget.textContent = `Frame ${frameButton.dataset.frameNumber}`
    this.captionTarget.textContent = frameButton.dataset.frameCaption
    this.statusTarget.textContent = `${frameButton.dataset.frameCaption} · ${frameButton.dataset.frameExposure}`
    for (const button of this.frameTargets) {
      const selected = button === frameButton
      button.setAttribute("aria-selected", String(selected))
      button.tabIndex = selected ? 0 : -1
    }
    frameButton.focus()
  }
}
