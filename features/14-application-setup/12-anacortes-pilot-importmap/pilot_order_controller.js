/*
 * pilot_order_controller.js — registered as "pilot-order"
 *
 * Same lazy scan as the station log. The identifier comes
 * from the import-map specifier, not from a handwritten
 * register() call in the page.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Pilot order connected."
  }
}
