/*
 * mid_lamp_controller.js — registered as "mid-lamp"
 *
 * A connect() throw is handleError. It does not stop
 * the point clock later in the document.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Mid lamp entered connect."
    throw new Error("mid lamp cracked")
  }

  trim() {
    this.readingTarget.textContent = "Mid lamp trimmed."
  }
}
