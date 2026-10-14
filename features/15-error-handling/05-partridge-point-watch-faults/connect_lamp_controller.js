/*
 * connect_lamp_controller.js — registered as "connect-lamp"
 *
 * Teaches: a throw in connect() does not unbind actions.
 * The binding observer has already started.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Connect lamp entered connect."
    throw new Error("connect wick failed")
  }

  trim() {
    this.readingTarget.textContent = "Connect lamp trimmed."
  }
}
