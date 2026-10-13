/*
 * bad_fax_controller.js — registered as "bad-fax"
 *
 * The menu value is not JSON. The value callback throws
 * before connect(). The action was already bound.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { menu: Object }
  static targets = ["reading"]

  menuValueChanged() {
    this.readingTarget.textContent = "Fax menu parsed."
  }

  connect() {
    this.readingTarget.textContent = "Fax connected."
  }

  ring() {
    this.readingTarget.textContent = "Fax button rang."
  }
}
