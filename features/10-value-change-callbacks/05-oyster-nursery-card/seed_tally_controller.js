/*
 * seed_tally_controller.js — registered as "seed-tally"
 *
 * Teaches: this card sits after the hatchery fax in the document.
 * The fax throws while the page is connecting, so this connect()
 * never runs.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = "The tally opened."
  }
}
