/*
 * horn_controller.js — registered as "horn"
 *
 * The tide desk outlets to this identifier through its own
 * attribute. A second horn is only named by the unused
 * parent attribute.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.statusTarget.textContent = `${this.element.id} horn connected.`
  }
}
