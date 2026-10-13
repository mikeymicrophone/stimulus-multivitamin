/*
 * range_board_controller.js — registered as "range-board"
 *
 * Teaches: Application.start(element) watches that element,
 * and the element contains itself, so a controller on the
 * root connects. this.application.element is that root.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = `Range board connected. Root id is ${this.application.element.id}.`
  }
}
