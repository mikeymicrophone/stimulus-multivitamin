/*
 * photo_lightbox_controller.js — registered as "photo-lightbox"
 *
 * Teaches: which element is which on the event object. event.target is
 * where the event started (the thumbnail's <img> or caption, an icon
 * inside a button), event.currentTarget is the element that carries the
 * data-action, and this.element is the controller's own element, the whole
 * gallery. The thumbnail, backdrop, and arrow actions each read the one
 * they need. The keyboard and resize actions are declared with @document
 * and @window, so their currentTarget is the document or the window.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["thumbnail", "overlay", "photo", "title", "credit", "position", "scale"]

  initialize() {
    this.currentIndex = null
    this.returnFocusTo = null
  }

  disconnect() {
    if (this.isOpen) this.close()
  }

  // Clicks usually land on the <img> or the caption inside the button, so
  // event.target has no data-photo-index. The button is currentTarget.
  open({ currentTarget: thumbnailButton }) {
    this.returnFocusTo = thumbnailButton
    this.show(this.thumbnailTargets.indexOf(thumbnailButton))
    this.overlayTarget.hidden = false
    document.documentElement.style.overflow = "hidden"
    this.overlayTarget.querySelector("[data-lightbox-close]").focus()
  }

  close() {
    this.overlayTarget.hidden = true
    this.currentIndex = null
    document.documentElement.style.overflow = ""
    this.returnFocusTo?.focus()
  }

  // The overlay's action also hears clicks on the photo and buttons inside
  // it. Only a click on the backdrop itself has target === currentTarget.
  closeFromBackdrop(event) {
    if (event.target === event.currentTarget) this.close()
  }

  showPrevious() {
    this.show(this.currentIndex - 1)
  }

  showNext() {
    this.show(this.currentIndex + 1)
  }

  navigateWithKeys(event) {
    if (!this.isOpen || event.defaultPrevented) return
    const keyActions = { ArrowLeft: () => this.showPrevious(), ArrowRight: () => this.showNext(), Escape: () => this.close() }
    const keyAction = keyActions[event.key]
    if (!keyAction) return
    event.preventDefault()
    keyAction()
  }

  fitPhoto() {
    if (!this.isOpen) return
    const thumbnail = this.thumbnailTargets[this.currentIndex]
    const fullWidth = Number(thumbnail.dataset.fullWidth)
    const fullHeight = Number(thumbnail.dataset.fullHeight)
    const scale = Math.min(window.innerWidth * 0.9 / fullWidth, window.innerHeight * 0.72 / fullHeight, 1)
    this.photoTarget.style.width = `${Math.round(fullWidth * scale)}px`
    this.photoTarget.style.height = `${Math.round(fullHeight * scale)}px`
    this.scaleTarget.textContent = `Shown at ${Math.round(scale * 100)}% of ${fullWidth.toLocaleString("en-US")} × ${fullHeight.toLocaleString("en-US")}`
  }

  show(index) {
    const count = this.thumbnailTargets.length
    this.currentIndex = (index + count) % count
    const thumbnail = this.thumbnailTargets[this.currentIndex]
    this.photoTarget.src = thumbnail.querySelector("img").src
    this.photoTarget.alt = thumbnail.dataset.photoAlt
    this.titleTarget.textContent = thumbnail.dataset.photoTitle
    this.creditTarget.textContent = thumbnail.dataset.photoCredit
    this.positionTarget.textContent = `${this.currentIndex + 1} of ${count}`
    this.fitPhoto()
  }

  get isOpen() {
    return this.currentIndex !== null
  }
}
