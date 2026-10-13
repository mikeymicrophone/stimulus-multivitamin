/*
 * mark_list_controller.js — registered as "mark-list"
 *
 * Teaches: marks is an Array. A JSON list reads back. A comma-separated
 * note is not JSON and throws SyntaxError when the getter runs. A JSON
 * object throws TypeError because it is not an array. Nothing reads
 * the list until Transcribe, so a bad slip does not fail connect().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slipName", "reading"]
  static values = { marks: Array }

  transcribe() {
    const slipName = this.slipNameTarget.textContent.trim()
    try {
      const marks = this.marksValue
      const attribute = this.element.getAttribute("data-mark-list-marks-value")
      this.readingTarget.textContent = `${slipName} marks ${marks.join(", ")}. Attribute ${attribute}.`
    } catch (error) {
      this.readingTarget.textContent = `${slipName} ${error.name}: ${error.message}`
    }
  }
}
