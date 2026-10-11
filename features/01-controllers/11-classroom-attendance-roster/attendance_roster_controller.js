/*
 * attendance_roster_controller.js — registered as "attendance-roster"
 *
 * Teaches: a long-lived controller that outlives the controllers inside it.
 * Switching class periods replaces the roster rows with a fetched HTML
 * fragment, which disconnects every student-attendance instance and
 * connects a new one per new row. Anything that has to survive the swap,
 * like marks you made in another period, is kept here, on the instance
 * whose element stays on the page.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["periodChoice", "rosterRows", "student", "tally", "loadStatus", "submitStatus"]

  initialize() {
    this.marksByPeriod = new Map()
    this.submittedPeriods = new Set()
    this.displayedPeriod = null
  }

  connect() {
    this.loadPeriod()
  }

  async loadPeriod() {
    const requestedPeriod = this.periodChoiceTarget.value
    this.loadStatusTarget.textContent = "Loading roster…"

    try {
      const response = await fetch(requestedPeriod)
      if (!response.ok) throw new Error(`The roster server answered ${response.status}`)
      const rosterRows = await response.text()

      // A teacher flipping quickly through periods can outrun the network.
      if (this.periodChoiceTarget.value !== requestedPeriod) return
      this.displayedPeriod = requestedPeriod
      this.rosterRowsTarget.innerHTML = rosterRows
      this.loadStatusTarget.textContent = ""
    } catch (error) {
      this.displayedPeriod = requestedPeriod
      this.rosterRowsTarget.replaceChildren()
      this.loadStatusTarget.textContent = `Could not load this roster. ${error.message}`
    }
    this.renderTally()
    this.renderSubmitStatus()
  }

  markFor(studentId) {
    return this.marksForCurrentPeriod.get(studentId) ?? null
  }

  recordMark(studentId, attendanceMark) {
    this.marksForCurrentPeriod.set(studentId, attendanceMark)
    this.renderTally()
  }

  markRemainingPresent() {
    if (this.isCurrentPeriodSubmitted) return
    for (const student of this.studentControllers) {
      if (student.attendanceMark === null) student.markAs("present")
    }
  }

  submitAttendance() {
    const unmarkedCount = this.studentControllers.filter((student) => student.attendanceMark === null).length
    if (unmarkedCount > 0) {
      this.submitStatusTarget.textContent = `${unmarkedCount} ${unmarkedCount === 1 ? "student is" : "students are"} still unmarked.`
      return
    }
    this.submittedPeriods.add(this.currentPeriod)
    for (const student of this.studentControllers) student.lock()
    this.renderSubmitStatus()
  }

  renderTally() {
    const tally = { present: 0, tardy: 0, absent: 0, unmarked: 0 }
    for (const student of this.studentControllers) tally[student.attendanceMark ?? "unmarked"] += 1
    this.tallyTarget.textContent = `Present ${tally.present} · Tardy ${tally.tardy} · Absent ${tally.absent} · Unmarked ${tally.unmarked}`
  }

  renderSubmitStatus() {
    this.submitStatusTarget.textContent = this.isCurrentPeriodSubmitted
      ? `${this.periodChoiceTarget.selectedOptions[0].textContent} attendance sent to the front office.`
      : ""
  }

  get isCurrentPeriodSubmitted() {
    return this.submittedPeriods.has(this.currentPeriod)
  }

  // The period whose rows are on screen, which lags the select while a
  // fetch is in flight.
  get currentPeriod() {
    return this.displayedPeriod
  }

  get marksForCurrentPeriod() {
    if (!this.marksByPeriod.has(this.currentPeriod)) this.marksByPeriod.set(this.currentPeriod, new Map())
    return this.marksByPeriod.get(this.currentPeriod)
  }

  // Rows can be in the DOM a moment before their controllers connect.
  get studentControllers() {
    return this.studentTargets
      .map((row) => this.application.getControllerForElementAndIdentifier(row, "student-attendance"))
      .filter((student) => student !== null)
  }
}
