/*
 * meter_bank_controller.js — registered as "meter-bank"
 *
 * Teaches: a nested meter-bank is a scope boundary. The building does
 * not see Unit 2's meters, and it does not see the unit element even
 * though that element carries data-meter-bank-target="meter". A nested
 * water-heater is a different identifier, so the laundry meter inside
 * it still belongs to the building. The check is closest() against
 * this controller's element, and it runs when the meters are read.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["meter", "total"]

  connect() {
    this.readMeters()
  }

  readMeters() {
    const names = this.meterTargets.map((meter) => meter.dataset.meterName)
    const kilowattHours = this.meterTargets.reduce((total, meter) => total + Number(meter.dataset.kilowattHours), 0)
    this.totalTarget.textContent = `${this.element.dataset.bankName}: ${names.join(", ")} = ${kilowattHours} kWh.`
  }
}
