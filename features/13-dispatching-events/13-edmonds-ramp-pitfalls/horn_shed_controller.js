/*
 * horn_shed_controller.js — registered as "horn-shed"
 *
 * Teaches: the shed is a sibling of the deck's bell.
 * ramp-bell:sounded does not bubble to it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Horn shed is quiet."
  }

  hear() {
    this.readingTarget.textContent = "Horn shed heard the bell."
  }
}
