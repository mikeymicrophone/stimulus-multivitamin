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
import { report, rawAttribute } from "../../../assets/readout.js"

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
    report(this.readingTarget, [...this.lines()])
  }

  *lines() {
    yield* this.#field("Hoops", "hoopCount", this.hoopCountValue)
    yield* this.#field("Wood", "woodName", JSON.stringify(this.woodNameValue))
    yield* this.#field("Flagged", "flagged", this.flaggedValue)
  }

  *#field(label, name, shown) {
    const hasName = `has${name[0].toUpperCase()}${name.slice(1)}Value`
    yield `${label} ${shown}.`
    yield `${hasName} ${this[hasName]}.`
    yield `${label} attribute ${rawAttribute(this, name, "value", { quoted: true })}.`
  }
}
