/*
 * foghorn_key_controller.js — registered as "foghorn-key"
 *
 * Teaches: classList.toggle(...soundingClasses) is a real toggle
 * when the list has one token. With two tokens the second is the
 * DOM force flag, so the first class is forced on and the second
 * is never toggled. Looping each token toggles the whole stack.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf, listOr } from "../../../assets/readout.js"

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
    const worn = this.soundingClasses.filter((token) => this.hornTarget.classList.contains(token))
    report(
      this.readingTarget,
      `${textOf(this.hornNameTarget)} ${how}.`,
      `soundingClass ${this.soundingClass}.`,
      `soundingClasses ${JSON.stringify(this.soundingClasses)}.`,
      `Horn class ${listOr(worn, "(none)", " ")}.`
    )
  }
}
