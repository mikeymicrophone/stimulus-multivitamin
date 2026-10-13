/*
 * buyer_board_controller.js — registered as "buyer-board"
 *
 * Teaches: the listener reads event.detail. An omitted
 * detail arrives as {}. A null detail is null, so the
 * board must not assume an object.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Board is clear."
  }

  fileSack(event) {
    const detail = event.detail
    if (detail === null) {
      this.readingTarget.textContent = "Board saw null detail."
      return
    }
    const tags = Array.isArray(detail.tags) ? detail.tags.join(", ") : "none"
    const bed = detail.bed || "none"
    const pounds = detail.pounds === undefined ? "none" : detail.pounds
    const grade = detail.grade || "none"
    this.readingTarget.textContent = `Board ${event.type} bed ${bed}. pounds ${pounds}. grade ${grade}. tags ${tags}.`
  }

  fileClear(event) {
    const keys = event.detail ? Object.keys(event.detail).length : "null"
    this.readingTarget.textContent = `Board ${event.type} keys ${keys}.`
  }
}
