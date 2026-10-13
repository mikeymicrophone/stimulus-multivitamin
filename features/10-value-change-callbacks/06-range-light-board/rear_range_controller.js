/*
 * rear_range_controller.js — registered as "rear-range"
 *
 * Teaches: removeAttribute on the color value runs the same callback
 * as assigning undefined. The ask line is recorded in the action.
 * The callback follows it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]
  static values = { color: String }

  colorValueChanged(color, previous) {
    const attribute = this.element.getAttribute("data-rear-range-color-value")
    this.record(`Color ${shown(color)}, previous ${shown(previous)}. Attribute ${attribute === null ? "absent" : shown(attribute)}. hasColorValue ${this.hasColorValue}.`)
  }

  scrapeColor() {
    this.element.removeAttribute("data-rear-range-color-value")
    this.record("Scraped the color attribute.")
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
