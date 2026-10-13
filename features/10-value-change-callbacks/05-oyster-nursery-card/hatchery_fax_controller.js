/*
 * hatchery_fax_controller.js — registered as "hatchery-fax"
 *
 * Teaches: menuValueChanged makes the observer parse the attribute
 * before the method runs. "chowder, pilot bread" is not JSON, so the
 * method never runs and connect() never runs. The error is a
 * SyntaxError with the JSON.parse text, not a Stimulus prefix, and
 * handleError does not see it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]
  static values = { menu: Array }

  menuValueChanged() {
    this.statusTarget.textContent = "The fax was read."
  }

  connect() {
    this.statusTarget.textContent = "The fax connected."
  }
}
