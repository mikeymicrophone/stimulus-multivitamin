/*
 * blank_slip_controller.js — registered as "blank-slip"
 *
 * Teaches: an empty lit attribute is true, so the first callback is
 * (true, false). Removing that empty attribute, or an empty name,
 * does not run the callback. The board keeps the lit sentence.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["lamp", "log"]
  static values = { name: String, lit: Boolean }

  nameValueChanged(name, previous) {
    const attribute = this.element.getAttribute("data-blank-slip-name-value")
    this.record(`Name ${shown(name)}, previous ${shown(previous)}. Attribute ${attribute === null ? "absent" : shown(attribute)}.`)
  }

  litValueChanged(lit, previous) {
    this.lampTarget.textContent = lit ? "The lamp is lit." : "The lamp is dark."
    const attribute = this.element.getAttribute("data-blank-slip-lit-value")
    this.record(`Lit ${shown(lit)}, previous ${shown(previous)}. Attribute ${attribute === null ? "absent" : shown(attribute)}.`)
  }

  eraseName() {
    this.nameValue = undefined
    this.record("Erased the name.")
  }

  eraseLit() {
    this.litValue = undefined
    this.record("Erased the lit cell.")
  }

  readLamp() {
    const lines = [...this.logTarget.querySelectorAll("li")]
    const nameCount = lines.filter((item) => item.textContent.startsWith("Name ")).length
    const litCount = lines.filter((item) => item.textContent.startsWith("Lit ")).length
    this.record(`Name getter ${shown(this.nameValue)}. Lit getter ${shown(this.litValue)}. Board says "${this.lampTarget.textContent}" Name lines ${nameCount}. Lit lines ${litCount}.`)
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
