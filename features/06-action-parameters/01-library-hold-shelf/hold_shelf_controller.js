/*
 * hold_shelf_controller.js — registered as "hold-shelf"
 *
 * Teaches: data-hold-shelf-[name]-param. The name is kebab-case in the
 * attribute and camelCase on event.params, because Stimulus camelizes on
 * "-" and "_". patron-name becomes patronName. HTML lowercases attribute
 * names before that runs, so patronName in the attribute is stored as
 * patronname and never becomes patronName.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["slip", "summary"]

  pullHold(event) {
    const { patronName, callNumber, pickupBy, title } = event.params
    const keys = Object.keys(event.params).sort().join(", ")
    const patron = patronName === undefined ? "patronName is missing" : patronName
    this.summaryTarget.textContent = `Pulled ${title} for ${patron}, call number ${callNumber}, pickup by ${pickupBy}. Params: ${this.describeParams(event.params)}. Keys: ${keys}.`
    this.slipTarget.hidden = false
  }

  describeParams(params) {
    return Object.keys(params).sort().map((key) => `${key} (${kindOf(params[key])}) ${show(params[key])}`).join("; ")
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
