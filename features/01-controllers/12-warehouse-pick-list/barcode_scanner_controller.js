/*
 * barcode_scanner_controller.js — registered as "barcode-scanner"
 *
 * Teaches: a controller that works for the controller beside it. It shares
 * its element with "pick-list" (data-controller="pick-list barcode-scanner")
 * and reaches it with
 * application.getControllerForElementAndIdentifier(this.element, "pick-list").
 * It knows how scans arrive (a handheld scanner types the code and presses
 * Enter); pick-list knows what a scan means. Either could be reused
 * without the other.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["scanInput", "feedback"]

  submitScan(event) {
    event.preventDefault()
    const barcode = this.scanInputTarget.value.trim()
    this.scanInputTarget.value = ""
    this.deliverScan(barcode)
  }

  // Simulator buttons keep codes in value="" because action params would
  // typecast an all-digit UPC into a number and drop its leading zero.
  simulateScan({ currentTarget }) {
    this.deliverScan(currentTarget.value)
    this.scanInputTarget.focus()
  }

  deliverScan(barcode) {
    if (barcode === "") return
    const pickList = this.application.getControllerForElementAndIdentifier(this.element, "pick-list")
    if (!pickList) {
      this.showFeedback("rejected", "The pick list isn't ready yet. Scan again in a moment.")
      return
    }
    const { outcome, message } = pickList.recordScan(barcode)
    this.showFeedback(outcome, `${barcode}: ${message}`)
  }

  showFeedback(outcome, message) {
    this.feedbackTarget.dataset.scanOutcome = outcome
    this.feedbackTarget.textContent = message
  }
}
