/*
 * horn_log_controller.js — registered as "horn-log"
 *
 * Teaches: a controller registered in the same turn as
 * Application.start() is a different moment from a
 * registration that happens after a click. The log is the
 * early one. It is connected before the keeper brings the
 * horn online.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Horn log is open."
  }
}
