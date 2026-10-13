/*
 * retort_shell_controller.js — registered as "retort-shell"
 * only after the floor asks. It is imported and not registered
 * on load.
 *
 * Teaches: connect() writes the cook flag. The floor's outlet
 * callback runs before this method when registration connects
 * the shell.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["status"]

  connect() {
    this.element.dataset.cook = "set"
    this.statusTarget.textContent = "Shell cook set."
  }
}
