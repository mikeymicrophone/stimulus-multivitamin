/*
 * pick_line_controller.js — registered as "pick-line"
 *
 * Teaches: many child instances behind a small interface. Each order line
 * is its own instance with its own picked count. The pick list only uses
 * the getters and the activate(), deactivate(), and recordPick() methods
 * below. The one thing a line does on its own, marking itself short, it
 * reports back with lineChanged().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["description", "pickedCount", "status", "shortButton"]
  static values = { binCode: String, upc: String, quantity: Number, unitWeightGrams: Number }

  initialize() {
    this.pickedQuantity = 0
    this.isShort = false
  }

  connect() {
    const pickListElement = this.element.closest('[data-controller~="pick-list"]')
    this.pickList = pickListElement
      ? this.application.getControllerForElementAndIdentifier(pickListElement, "pick-list")
      : null
    this.render()
    this.pickList?.lineChanged()
  }

  disconnect() {
    this.pickList = null
  }

  activate() {
    this.element.dataset.lineState = "active"
    this.render()
  }

  deactivate() {
    if (this.isActive) delete this.element.dataset.lineState
    this.render()
  }

  recordPick() {
    this.pickedQuantity = Math.min(this.quantityValue, this.pickedQuantity + 1)
    this.render()
  }

  markShort() {
    if (this.isResolved) return
    this.isShort = true
    this.deactivate()
    this.pickList?.lineChanged()
  }

  render() {
    this.pickedCountTarget.textContent = `${this.pickedQuantity} / ${this.quantityValue}`
    this.shortButtonTarget.disabled = this.isResolved

    if (this.isComplete) {
      this.statusTarget.textContent = "Picked"
    } else if (this.isShort) {
      this.statusTarget.textContent = `Short ${this.quantityValue - this.pickedQuantity}`
    } else if (this.isActive) {
      this.statusTarget.textContent = "At this bin"
    } else {
      this.statusTarget.textContent = ""
    }
    this.element.dataset.lineResult = this.isComplete ? "picked" : this.isShort ? "short" : "open"
  }

  get isActive() {
    return this.element.dataset.lineState === "active"
  }

  get isComplete() {
    return this.pickedQuantity >= this.quantityValue
  }

  get isResolved() {
    return this.isComplete || this.isShort
  }

  get binCode() {
    return this.binCodeValue
  }

  get upc() {
    return this.upcValue
  }

  get unitWeightGrams() {
    return this.unitWeightGramsValue
  }

  get description() {
    return this.descriptionTarget.textContent.trim()
  }
}
