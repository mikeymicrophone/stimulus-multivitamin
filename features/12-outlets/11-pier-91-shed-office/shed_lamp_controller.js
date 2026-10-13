/*
 * shed_lamp_controller.js — registered as "shed-lamp"
 *
 * Teaches: the pier's outlet name shed-lamp and the shed's
 * outlet name lamp share one attribute string. This
 * controller is the shed-lamp token on the lamp element.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = `Shed lamp ${this.element.id} connected.`
  }
}
