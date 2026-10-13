/*
 * fuel_dock_controller.js — registered as "fuel-dock"
 *
 * Teaches: one selector, .fuel-pump, matches every pump.
 * fuelPumpOutlet is the first match in document order.
 * fuelPumpOutlets is all of them. The housing matches the
 * class and is left out because its controller token is
 * pump-housing, not fuel-pump.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["fuel-pump"]
  static targets = ["housing", "reading"]

  connect() {
    this.render("connected.")
  }

  closeEveryHose() {
    const grades = this.fuelPumpOutlets.map((pump) => pump.closeHose())
    this.render(`closed ${grades.join(" ")}.`)
  }

  render(reason) {
    const elementIds = this.fuelPumpOutletElements.map((element) => element.id)
    const outletIds = this.fuelPumpOutlets.map((pump) => pump.element.id)
    const housingId = this.housingTarget.id
    const housingPlace = elementIds.includes(housingId) ? "included" : "excluded"
    const openGrades = this.fuelPumpOutlets.map((pump) => `${pump.gradeValue} open ${pump.openValue}`)
    this.readingTarget.textContent = [
      `Singular ${this.fuelPumpOutletElement.id}.`,
      `Outlets ${outletIds.join(" ")}.`,
      `Elements ${elementIds.join(" ")}.`,
      `hasFuelPumpOutlet ${this.hasFuelPumpOutlet}.`,
      `Housing ${housingId} ${housingPlace}.`,
      openGrades.join(". ") + ".",
      reason
    ].join(" ")
  }
}
