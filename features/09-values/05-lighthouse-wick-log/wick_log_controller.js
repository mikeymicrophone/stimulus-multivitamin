/*
 * wick_log_controller.js — registered as "wick-log"
 *
 * Teaches: lamp is an Object. Keys stay as they were written in JSON;
 * wick_height is not camelized to wickHeight, so destructuring has to
 * rename it. Assigning lampValue writes compact JSON. A missing lamp
 * is {}, so destructuring it never throws. spareLamp holds a JSON
 * array, and reading it throws a TypeError because an array is not an
 * object. That read waits for the button, so the page still connects.
 */
import { Controller } from "@hotwired/stimulus"
import { report, rawAttribute, textOf } from "../../../assets/readout.js"

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
    const { oil } = this.lampValue
    this.lampValue = { wick_height: "8mm", oil: oil ?? "colza" }
    this.render()
  }

  readSpare() {
    try {
      const spare = this.spareLampValue
      report(this.spareReadingTarget, `Spare ${JSON.stringify(spare)}.`, `Attribute ${rawAttribute(this, "spareLamp")}.`)
    } catch ({ name, message }) {
      this.spareReadingTarget.textContent = `${name}: ${message}`
    }
  }

  render() {
    const { wick_height: wick = "(no wick)", oil = "(no oil)", wickHeight = "absent" } = this.lampValue
    report(
      this.readingTarget,
      `${textOf(this.stationNameTarget)} wick ${wick}.`,
      `Oil ${oil}.`,
      `wickHeight ${wickHeight}.`,
      `hasLampValue ${this.hasLampValue}.`,
      `Attribute ${rawAttribute(this, "lamp")}.`
    )
  }
}
