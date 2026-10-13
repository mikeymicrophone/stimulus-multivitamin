/*
 * hoop_log_controller.js — registered as "hoop-log"
 *
 * Teaches: assigning a value writes the attribute in that statement.
 * Zero writes "0" and does not remove the attribute. false writes
 * "false". null on a String writes the characters null. undefined is
 * the assignment that deletes the attribute. After a delete,
 * has[Name]Value is false and the getter returns the type default.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]
  static values = {
    hoopCount: Number,
    woodName: String,
    flagged: Boolean
  }

  connect() {
    this.render()
  }

  setHoopsToZero() {
    this.hoopCountValue = 0
    this.render()
  }

  clearHoopCount() {
    this.hoopCountValue = undefined
    this.render()
  }

  clearWoodName() {
    this.woodNameValue = undefined
    this.render()
  }

  writeNullWood() {
    this.woodNameValue = null
    this.render()
  }

  lowerFlag() {
    this.flaggedValue = false
    this.render()
  }

  render() {
    this.readingTarget.textContent = [
      fieldLine("Hoops", "hasHoopCountValue", this.hoopCountValue, this.hasHoopCountValue, this.element.getAttribute("data-hoop-log-hoop-count-value")),
      fieldLine("Wood", "hasWoodNameValue", JSON.stringify(this.woodNameValue), this.hasWoodNameValue, this.element.getAttribute("data-hoop-log-wood-name-value")),
      fieldLine("Flagged", "hasFlaggedValue", this.flaggedValue, this.hasFlaggedValue, this.element.getAttribute("data-hoop-log-flagged-value"))
    ].join(" ")
  }
}

function fieldLine(label, hasName, value, present, attribute) {
  return `${label} ${value}. ${hasName} ${present}. ${label} attribute ${attribute === null ? "absent" : JSON.stringify(attribute)}.`
}
