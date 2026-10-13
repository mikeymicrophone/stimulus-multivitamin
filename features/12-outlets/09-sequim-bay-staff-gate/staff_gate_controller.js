/*
 * staff_gate_controller.js — registered as "staff-gate"
 *
 * Teaches: readsOutlets true reads bayStaffOutlets inside
 * connect(), before that staff has connected. The callback
 * sees no latch. The scope count sticks, so pulling the
 * staff fires outletDisconnected and does not run the
 * staff's disconnect(). Putting it back fires the callback
 * again and does not run connect(). The other gate reads
 * only hasBayStaffOutlet and bayStaffOutletElements, and
 * pulling that staff does disconnect it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["bay-staff"]
  static values = { readsOutlets: Boolean }
  static targets = ["log"]

  bayStaffOutletConnected(outlet, element) {
    const latch = element.dataset.latch || "missing"
    const life = element.dataset.life || "none"
    this.write(`${outlet.stationValue} callback. Latch ${latch}. Life ${life}.`)
  }

  bayStaffOutletDisconnected(outlet, element) {
    this.write(`${outlet.stationValue} disconnected. Life ${element.dataset.life || "none"}.`)
  }

  connect() {
    if (this.readsOutletsValue) {
      this.write("Early connect start.")
      const summary = this.bayStaffOutlets.map((staff) => `${staff.element.id} latch ${staff.element.dataset.latch || "missing"}`).join(", ")
      this.write(`Early connect outlets ${summary}.`)
      return
    }
    const summary = this.bayStaffOutletElements.map((element) => `${element.id} latch ${element.dataset.latch || "missing"}`).join(", ")
    this.write(`Late connect has ${this.hasBayStaffOutlet}. Elements ${summary}.`)
  }

  pullStaff() {
    this.heldStaff = this.bayStaffOutletElement
    this.heldStaff.remove()
  }

  putStaffBack() {
    if (!this.heldStaff) return
    this.element.after(this.heldStaff)
  }

  write(line) {
    this.logTarget.textContent = `${this.logTarget.textContent}${line}\n`
  }
}
