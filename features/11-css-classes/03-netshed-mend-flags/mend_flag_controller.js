/*
 * mend_flag_controller.js — registered as "mend-flag"
 *
 * Teaches: urgentClass is only the first token. urgentClasses is
 * every token, with extra spaces dropped. Flagging with the
 * singular property leaves the rest of the stack off the net.
 * Spreading urgentClasses paints the whole stack. The tokens
 * stay in the markup.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf, listOr } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["urgent"]
  static targets = ["netName", "flag", "reading"]

  connect() {
    this.render()
  }

  flagFirst() {
    this.flagTarget.classList.add(this.urgentClass)
    this.render()
  }

  flagStack() {
    this.flagTarget.classList.add(...this.urgentClasses)
    this.render()
  }

  clearStack() {
    this.flagTarget.classList.remove(...this.urgentClasses)
    this.render()
  }

  render() {
    const { classList } = this.flagTarget
    const onTheFlag = this.urgentClasses.filter((token) => classList.contains(token))
    report(
      this.readingTarget,
      `${textOf(this.netNameTarget)} urgentClass ${this.urgentClass}.`,
      `urgentClasses ${JSON.stringify(this.urgentClasses)}.`,
      `On the flag ${listOr(onTheFlag, "none", " ")}.`
    )
  }
}
