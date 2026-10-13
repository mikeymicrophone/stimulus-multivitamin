/*
 * bell_book_controller.js — registered as "bell-book"
 *
 * Teaches: lookups go through this application's router.
 * An element outside the root is null. A missing
 * identifier is null. The returned controller is the one
 * you can call.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  readBook() {
    const outer = document.getElementById("outer-bell")
    const inner = document.getElementById("inner-bell")
    const shore = document.getElementById("shore-bell")
    const outerBell = this.application.getControllerForElementAndIdentifier(outer, "fog-bell")
    const innerBell = this.application.getControllerForElementAndIdentifier(inner, "fog-bell")
    const watch = this.application.getControllerForElementAndIdentifier(outer, "watch-flag")
    const missing = this.application.getControllerForElementAndIdentifier(outer, "shore-bell")
    const shoreBell = this.application.getControllerForElementAndIdentifier(shore, "fog-bell")
    const crossed = this.application.getControllerForElementAndIdentifier(inner, "watch-flag")

    this.readingTarget.textContent = [
      `Outer ${outerBell.stationName()}.`,
      `Inner ${innerBell.stationName()}.`,
      `Same outer ${outerBell === innerBell}.`,
      `Watch ${watch.watchName()}.`,
      `Missing ${missing === null ? "null" : "present"}.`,
      `Shore ${shoreBell === null ? "null" : "present"}.`,
      `Crossed ${crossed === null ? "null" : "present"}.`
    ].join(" ")
  }
}
