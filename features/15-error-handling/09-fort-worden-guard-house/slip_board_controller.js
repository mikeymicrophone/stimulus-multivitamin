/*
 * slip_board_controller.js — registered as "slip-board"
 *
 * Teaches: has[Name]Target, has[Name]Class, has[Name]Outlet,
 * and has[Name]Value before the singular getters. A caught
 * throw sets faultValue and the fault class. handleError
 * does not see it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["advisory", "status", "after"]
  static classes = ["alarm", "fault"]
  static outlets = ["bell"]
  static values = { tideFeet: Number, fault: String }

  connect() {
    this.paintGuards()
  }

  paintGuards() {
    const advisory = this.hasAdvisoryTarget ? this.advisoryTarget.textContent : "No advisory posted."
    const tide = this.hasTideFeetValue ? `${this.tideFeetValue} ft` : "Tide not posted."
    const alarm = this.hasAlarmClass ? this.alarmClass : "No alarm class."
    const outlet = this.hasBellOutlet ? this.bellOutlet.element.id : "No bell outlet."
    this.statusTarget.textContent = `${advisory} ${tide} ${alarm} ${outlet}`
  }

  readAdvisory() {
    const text = this.advisoryTarget.textContent
    this.afterTarget.textContent = `After the read: ${text}`
  }

  readAlarm() {
    this.statusTarget.textContent = this.alarmClass
  }

  readOutlet() {
    this.statusTarget.textContent = this.bellOutlet.element.id
  }

  postDrift() {
    try {
      throw new Error("drift past the piles")
    } catch (error) {
      this.faultValue = "held"
      this.statusTarget.textContent = "Drift held. Board still open."
    }
  }

  faultValueChanged(fault) {
    if (!fault || !this.hasFaultClass) return
    this.element.classList.add(this.faultClass)
    const note = document.getElementById("class-note")
    if (note) note.textContent = "Fault class on."
  }
}
