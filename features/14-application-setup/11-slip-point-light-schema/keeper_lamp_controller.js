/*
 * keeper_lamp_controller.js — registered as "keeper-lamp"
 *
 * Teaches: target getters use schema.targetAttributeForScope.
 * Target connected callbacks do not. They watch
 * data-${identifier}-target no matter what the schema says.
 * keyMappings additions are matched against event.key.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  connect() {
    this.readingTarget.textContent = "Lamp is burning."
  }

  readingTargetConnected() {
    this.note("reading callback.")
  }

  wickTargetConnected() {
    this.note("wick callback.")
  }

  sound() {
    this.readingTarget.textContent = "Horn sounded."
  }

  soundHorn(event) {
    this.readingTarget.textContent = `Horn ${event.key}.`
  }

  fileEnter() {
    this.readingTarget.textContent = "Enter filed."
  }

  note(line) {
    const tape = document.getElementById("callback-tape")
    const prior = tape.dataset.started === "yes" ? tape.textContent : ""
    tape.dataset.started = "yes"
    tape.textContent = prior ? `${prior} ${line}` : line
  }
}
