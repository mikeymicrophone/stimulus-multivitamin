/*
 * horn_wire_controller.js — registered as "horn-wire"
 *
 * Teaches: a synchronous throw is reported through
 * handleError. An async throw, including one before
 * the first await, is not.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Horn wire is quiet."
  }

  sound() {
    this.readingTarget.textContent = "Horn started."
    throw new Error("horn cable parted")
  }

  async fetchTide() {
    this.readingTarget.textContent = "Tide fetch started."
    await Promise.resolve()
    throw new Error("range lost")
  }
}
