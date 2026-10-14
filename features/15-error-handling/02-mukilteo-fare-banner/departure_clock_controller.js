/*
 * departure_clock_controller.js — registered as "departure-clock"
 *
 * Teaches: a second controller keeps its own actions after
 * handleError has shown a banner for someone else.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Clock reads 14:10."
  }

  advance() {
    this.readingTarget.textContent = "Clock reads 14:40."
  }
}
