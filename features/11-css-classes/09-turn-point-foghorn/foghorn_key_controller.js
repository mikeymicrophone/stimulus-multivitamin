/*
 * foghorn_key_controller.js — registered as "foghorn-key"
 *
 * Teaches: classList.toggle(...soundingClasses) is a real toggle
 * when the list has one token. With two tokens the second is the
 * DOM force flag, so the first class is forced on and the second
 * is never toggled. Looping each token toggles the whole stack.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static classes = ["sounding"]
  static targets = ["hornName", "horn", "reading"]

  connect() {
    this.render("connect")
  }

  spreadToggle() {
    this.hornTarget.classList.toggle(...this.soundingClasses)
    this.render("spread")
  }

  loopToggle() {
    for (const token of this.soundingClasses) {
      this.hornTarget.classList.toggle(token)
    }
    this.render("loop")
  }

  render(how) {
    const hornName = this.hornNameTarget.textContent.trim()
    const worn = this.soundingClasses.filter((token) => this.hornTarget.classList.contains(token))
    const shown = worn.length ? worn.join(" ") : "(none)"
    this.readingTarget.textContent = [
      `${hornName} ${how}.`,
      `soundingClass ${this.soundingClass}.`,
      `soundingClasses ${JSON.stringify(this.soundingClasses)}.`,
      `Horn class ${shown}.`
    ].join(" ")
  }
}
