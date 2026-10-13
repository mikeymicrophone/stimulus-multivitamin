/*
 * fog_bell_controller.js — registered as "fog-bell"
 *
 * Teaches: getControllerForElementAndIdentifier returns
 * the controller on that element, not a parent or a child
 * that wears the same identifier.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = { station: String }

  connect() {
    this.readingTarget.textContent = `${this.stationValue} bell is connected.`
  }

  stationName() {
    return this.stationValue
  }
}
