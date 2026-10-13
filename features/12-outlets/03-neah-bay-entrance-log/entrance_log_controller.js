/*
 * entrance_log_controller.js — registered as "entrance-log"
 *
 * Teaches: tideStaffOutletConnected and tideStaffOutletDisconnected
 * receive the outlet controller and its element. The callback
 * runs before this staff's connect() when the staff is added
 * after the log. Closing the log runs disconnect() before the
 * outlet callbacks, and the staffs stay connected.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["tide-staff"]
  static targets = ["log", "slip"]

  connect() {
    this.write("Log connected.")
  }

  disconnect() {
    const ids = this.tideStaffOutletElements.map((element) => element.id).join(" ")
    this.write(`Log disconnect, outlets still ${ids}.`)
  }

  tideStaffOutletConnected(outlet, element) {
    const watch = element.dataset.watch || "missing"
    this.write(`${outlet.stationValue} connected. Height ${outlet.heightValue}. Watch ${watch}.`)
  }

  tideStaffOutletDisconnected(outlet, element) {
    this.write(`${outlet.stationValue} outlet disconnected. Life ${element.dataset.life || "none"}. Watch ${element.dataset.watch || "missing"}.`)
  }

  pullEdiz() {
    this.slipTarget.remove()
  }

  hangSlipPoint() {
    const staff = document.createElement("article")
    staff.id = "slip-point"
    staff.className = "entrance-staff staff"
    staff.setAttribute("data-controller", "tide-staff")
    staff.setAttribute("data-tide-staff-station-value", "Slip Point")
    staff.setAttribute("data-tide-staff-height-value", "8")
    staff.innerHTML = `<h2>Slip Point</h2><p class="status" data-tide-staff-target="status"></p>`
    this.element.append(staff)
  }

  closeLog() {
    this.element.removeAttribute("data-controller")
  }

  write(line) {
    this.logTarget.textContent = `${this.logTarget.textContent}${line}\n`
  }
}
