/*
 * greenhouse_bed_controller.js — registered as "greenhouse-bed"
 *
 * Teaches: the same characters mean different things on the three channels.
 * A String value is not parsed, so bed code "08" stays "08". A Number value
 * uses Number(), so flow "08" becomes 8. A Boolean value treats "FALSE"
 * as false. A param uses JSON.parse, so liters "1.5" is a number, bed code
 * "08" stays a string, and "FALSE" stays a string. dataset keeps the raw
 * string under a key that includes the identifier and the Param suffix.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["report"]
  static values = {
    bedName: String,
    bedCode: String,
    flowLiters: Number,
    shaded: Boolean,
  }

  pour(event) {
    const button = event.currentTarget
    const lines = [
      `bedName value ${show(this.bedNameValue)} (${kindOf(this.bedNameValue)})`,
      `bedCode value ${show(this.bedCodeValue)} (${kindOf(this.bedCodeValue)})`,
      `flowLiters value ${show(this.flowLitersValue)} (${kindOf(this.flowLitersValue)})`,
      `shaded value ${show(this.shadedValue)} (${kindOf(this.shadedValue)})`,
      `liters param ${show(event.params.liters)} (${kindOf(event.params.liters)})`,
      `shaded param ${show(event.params.shaded)} (${kindOf(event.params.shaded)})`,
      `bedCode param ${show(event.params.bedCode)} (${kindOf(event.params.bedCode)})`,
      `dataset moisture ${this.element.dataset.moisture} (string)`,
      `dataset greenhouseBedLitersParam ${button.dataset.greenhouseBedLitersParam} (string)`,
    ]
    this.reportTarget.hidden = false
    this.reportTarget.textContent = lines.join(". ") + "."
  }
}

function kindOf(value) {
  if (value === null) return "null"
  if (value === undefined) return "missing"
  return typeof value
}

function show(value) {
  if (typeof value === "string") return value
  return String(value)
}
