/*
 * bare_lamp_controller.js — registered as "bare-lamp"
 *
 * Teaches: a keyMappings object that replaces the defaults
 * does not know "enter". The unknown filter throws from
 * the keydown listener. It is not reported through
 * handleError. A filter that is in the map still runs
 * when its action comes first.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Bare lamp is burning."
  }

  sound() {
    this.readingTarget.textContent = "Bare horn sounded."
  }

  soundHorn(event) {
    this.readingTarget.textContent = `Bare horn ${event.key}.`
  }

  fileEnter() {
    this.readingTarget.textContent = "Bare enter filed."
  }
}
