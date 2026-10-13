/*
 * late_self_controller.js — registered as "late-self"
 *
 * Teaches: prepareActionEvent stamps event.params
 * before the :self filter runs. This method does
 * not run for a cook that started on the retort,
 * and the returned event still carries these params
 * when this binding is the last one.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Late self has not run."
  }

  take(event) {
    this.readingTarget.textContent = `Late self ran for belt ${event.params.belt}.`
  }
}
