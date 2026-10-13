/*
 * retort_chart_controller.js — registered as "retort-chart"
 *
 * Teaches: the figure, the meter, the hidden record, and the status
 * sentence are written only from temperatureValueChanged. connect()
 * does not paint. A missing temperature still runs the callback with
 * 0. The office script's setAttribute uses that same callback.
 */
import { Controller } from "@hotwired/stimulus"
import { setRetortTemperature } from "./retort_office.js"

export default class extends Controller {
  static targets = ["figure", "column", "record", "status"]
  static values = { retortName: String, temperature: Number }

  temperatureValueChanged(temperature) {
    this.figureTarget.textContent = `${temperature}°F`
    this.columnTarget.style.width = `${Math.min(100, Math.round(temperature / 3))}%`
    this.columnTarget.setAttribute("aria-valuenow", String(temperature))
    this.columnTarget.setAttribute("aria-valuemin", "0")
    this.columnTarget.setAttribute("aria-valuemax", "300")
    this.recordTarget.value = String(temperature)
    this.statusTarget.textContent = `Retort ${this.retortNameValue} is at ${temperature}°F.`
  }

  officeSets255() {
    setRetortTemperature(this.element, 255)
  }
}
