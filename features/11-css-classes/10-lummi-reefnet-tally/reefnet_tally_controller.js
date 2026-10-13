/*
 * reefnet_tally_controller.js — registered as "reefnet-tally"
 *
 * Teaches: overLimit is inherited. soaked is this class's own
 * logical name. Both attributes use the reefnet-tally identifier.
 * data-gillnet-tally-over-limit-class is on the element and is
 * not the class this controller reads.
 */
import GillnetTallyController from "./gillnet_tally_controller.js"

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
    const boatName = this.boatNameTarget.textContent.trim()
    const own = this.element.getAttribute("data-reefnet-tally-over-limit-class")
    const stray = this.element.getAttribute("data-gillnet-tally-over-limit-class")
    const worn = ["overLimit", "soaked"].flatMap((name) => {
      const token = this[`${name}Class`]
      return this.element.classList.contains(token) ? [token] : []
    })
    this.readingTarget.textContent = [
      `${boatName} overLimitClass ${this.overLimitClass}.`,
      `soakedClass ${this.soakedClass}.`,
      `Own attribute ${own}.`,
      `Stray attribute ${stray}.`,
      `Wearing ${worn.length ? worn.join(" ") : "none"}.`
    ].join(" ")
  }
}
