/*
 * tote_controller.js — registered as "tote"
 *
 * Teaches: an element that is a target of one controller and the host of
 * another. The tote is data-pick-list-target="tote" (so the pick list can
 * find it) and data-controller="tote" (so it can manage its own weight and
 * contents). The pick list never edits the tote's markup; it calls
 * addItem().
 */
import { Controller } from "@hotwired/stimulus"

const weightFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 })

export default class extends Controller {
  static targets = ["weight", "itemCount", "warning"]
  static values = { capacityGrams: Number }

  initialize() {
    this.contentWeightGrams = 0
    this.itemCount = 0
  }

  connect() {
    this.render()
  }

  addItem(weightGrams) {
    this.contentWeightGrams += weightGrams
    this.itemCount += 1
    this.render()
  }

  render() {
    const isOverCapacity = this.contentWeightGrams > this.capacityGramsValue
    this.weightTarget.textContent = `${weightFormatter.format(this.contentWeightGrams / 1000)} of ${weightFormatter.format(this.capacityGramsValue / 1000)} kg`
    this.itemCountTarget.textContent = this.itemCount === 1 ? "1 item" : `${this.itemCount} items`
    this.warningTarget.hidden = !isOverCapacity
    this.element.dataset.toteLoad = isOverCapacity ? "over" : "within"
  }
}
