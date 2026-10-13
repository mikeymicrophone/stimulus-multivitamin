/*
 * quote_slip_controller.js — registered as slip"hook
 *
 * Teaches: Stimulus does not validate identifiers. A
 * double quote makes data-${identifier}-target an illegal
 * selector. initialize runs. connect does not finish.
 * The error is an unhandled rejection, not handleError.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  initialize() {
    document.getElementById("quote-init").textContent = "Quote initialize ran."
  }

  connect() {
    document.getElementById("quote-connect").textContent = "Quote connected."
  }
}
