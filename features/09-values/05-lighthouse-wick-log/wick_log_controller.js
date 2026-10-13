/*
 * wick_log_controller.js — registered as "wick-log"
 *
 * Teaches: lamp is an Object. Keys stay as they were written in JSON;
 * wick_height is not camelized to wickHeight. Assigning lampValue
 * writes compact JSON. A missing lamp is {}. spareLamp holds a JSON
 * array, and reading it throws a TypeError because an array is not an
 * object. That read waits for the button, so the page still connects.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["stationName", "reading", "spareReading"]
  static values = {
    lamp: Object,
    spareLamp: Object
  }

  connect() {
    this.render()
  }

  trimWick() {
    const lamp = this.lampValue
    this.lampValue = { wick_height: "8mm", oil: lamp.oil || "colza" }
    this.render()
  }

  readSpare() {
    try {
      const spare = this.spareLampValue
      const attribute = this.element.getAttribute("data-wick-log-spare-lamp-value")
      this.spareReadingTarget.textContent = `Spare ${JSON.stringify(spare)}. Attribute ${attribute === null ? "absent" : attribute}.`
    } catch (error) {
      this.spareReadingTarget.textContent = `${error.name}: ${error.message}`
    }
  }

  render() {
    const lamp = this.lampValue
    const attribute = this.element.getAttribute("data-wick-log-lamp-value")
    const stationName = this.stationNameTarget.textContent.trim()
    const height = Object.prototype.hasOwnProperty.call(lamp, "wick_height") ? lamp.wick_height : "(no wick)"
    const oil = Object.prototype.hasOwnProperty.call(lamp, "oil") ? lamp.oil : "(no oil)"
    const camelKey = Object.prototype.hasOwnProperty.call(lamp, "wickHeight") ? lamp.wickHeight : "absent"
    this.readingTarget.textContent = [
      `${stationName} wick ${height}.`,
      `Oil ${oil}.`,
      `wickHeight ${camelKey}.`,
      `hasLampValue ${this.hasLampValue}.`,
      `Attribute ${attribute === null ? "absent" : attribute}.`
    ].join(" ")
  }
}
