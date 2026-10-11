/*
 * student_attendance_controller.js — registered as "student-attendance"
 *
 * Teaches: controllers are disposable. Each roster row's instance lives
 * only as long as its row; switching periods throws it away, and switching
 * back builds a brand-new instance for a brand-new row. So this controller
 * keeps no state of its own. It reports every mark to the roster as it
 * happens and asks the roster for its mark when it connects.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["markOption"]
  static values = { studentId: String }

  connect() {
    const rosterElement = this.element.closest('[data-controller~="attendance-roster"]')
    this.roster = rosterElement
      ? this.application.getControllerForElementAndIdentifier(rosterElement, "attendance-roster")
      : null

    const savedMark = this.roster?.markFor(this.studentIdValue) ?? null
    for (const option of this.markOptionTargets) option.checked = option.value === savedMark
    if (this.roster?.isCurrentPeriodSubmitted) this.lock()

    this.render()
    this.roster?.renderTally()
  }

  disconnect() {
    this.roster = null
  }

  recordMark() {
    this.roster?.recordMark(this.studentIdValue, this.attendanceMark)
    this.render()
  }

  markAs(attendanceMark) {
    const option = this.markOptionTargets.find((candidate) => candidate.value === attendanceMark)
    if (!option || option.disabled) return
    option.checked = true
    this.recordMark()
  }

  lock() {
    for (const option of this.markOptionTargets) option.disabled = true
  }

  render() {
    this.element.dataset.attendanceMark = this.attendanceMark ?? "unmarked"
  }

  get attendanceMark() {
    return this.markOptionTargets.find((option) => option.checked)?.value ?? null
  }
}
