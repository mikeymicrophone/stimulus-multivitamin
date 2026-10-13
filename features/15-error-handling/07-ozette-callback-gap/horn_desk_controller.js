/*
 * horn_desk_controller.js — registered as "horn-desk"
 *
 * Teaches: bellOutletConnected is not wrapped by
 * handleError. The host stays connected.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["pass-bell"]
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Horn desk connected."
  }

  passBellOutletConnected() {
    this.readingTarget.textContent = "Bell tied."
    throw new Error("bell cord parted")
  }

  tie() {
    const bell = document.createElement("p")
    bell.id = "pass-bell"
    bell.dataset.controller = "pass-bell"
    bell.textContent = "Pass bell waiting."
    this.element.append(bell)
    queueMicrotask(() => {
      this.element.dataset.hornDeskPassBellOutlet = "#pass-bell"
    })
  }
}
