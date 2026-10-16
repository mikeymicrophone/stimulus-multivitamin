/*
 * reefnet_tally_controller.js — registered as "reefnet-tally"
 *
 * Teaches: overLimit is inherited. soaked is this class's own
 * logical name. Both attributes use the reefnet-tally identifier.
 * data-gillnet-tally-over-limit-class is on the element and is
 * not the class this controller reads.
 */
import GillnetTallyController from "./gillnet_tally_controller.js"
import { report, rawAttribute, textOf, listOr } from "../../../assets/readout.js"

export default class extends GillnetTallyController {
  static classes = ["soaked"]

  connect() {
    this.render()
  }

  markSoaked() {
    this.element.classList.add(this.soakedClass)
    this.render()
  }

  render() {
    const worn = ["overLimit", "soaked"].flatMap((name) => {
      const token = this[`${name}Class`]
      return this.element.classList.contains(token) ? [token] : []
    })
    report(
      this.readingTarget,
      `${textOf(this.boatNameTarget)} overLimitClass ${this.overLimitClass}.`,
      `soakedClass ${this.soakedClass}.`,
      // rawAttribute spells this.identifier, so it reads reefnet-tally's
      // attribute. The parent's name is written out to show it is skipped.
      `Own attribute ${rawAttribute(this, "overLimit", "class")}.`,
      `Stray attribute ${this.element.getAttribute("data-gillnet-tally-over-limit-class")}.`,
      `Wearing ${listOr(worn, "none", " ")}.`
    )
  }
}
