/*
 * appointment_calendar_controller.js — registered as "appointment-calendar"
 *
 * Teaches: the remaining built-in keys on a date grid. keydown.up / down /
 * left / right move by week or day. keydown.page_up and keydown.page_down
 * change the month — the filter names use an underscore (page_up), not
 * page-up or PageUp. keydown.alt+page_up / keydown.alt+page_down change
 * the year; Alt+PageDown does not match page_down alone, because
 * modifiers must match exactly. keydown.home / end jump to the first and
 * last day of the visible month. keydown.enter books the focused day;
 * keydown.esc clears the booking.
 */
import { Controller } from "@hotwired/stimulus"

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" })
const longDateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })
const closedWeekdays = new Set([0])
const bookedIsoDates = new Set(["2026-10-14", "2026-10-15", "2026-10-22"])

export default class extends Controller {
  static targets = ["monthLabel", "grid", "status", "booking"]

  initialize() {
    this.visibleYear = 2026
    this.visibleMonth = 9
    this.focusedDay = 12
    this.bookedFor = null
  }

  connect() {
    this.renderMonth()
  }

  moveByDay(event) {
    event.preventDefault()
    const delta = { left: -1, right: 1, up: -7, down: 7 }[this.filterName(event)]
    this.shiftFocusedDay(delta)
  }

  moveByMonth(event) {
    event.preventDefault()
    this.shiftMonth(event.key === "PageDown" ? 1 : -1)
  }

  moveByYear(event) {
    event.preventDefault()
    this.shiftMonth(event.key === "PageDown" ? 12 : -12)
  }

  moveToMonthStart(event) {
    event.preventDefault()
    this.focusedDay = 1
    this.renderMonth()
  }

  moveToMonthEnd(event) {
    event.preventDefault()
    this.focusedDay = this.daysInVisibleMonth
    this.renderMonth()
  }

  bookFocusedDay(event) {
    event.preventDefault()
    const isoDate = this.isoDateFor(this.focusedDay)
    if (this.dayState(isoDate) !== "open") {
      this.statusTarget.textContent = `${longDateFormatter.format(this.dateFor(this.focusedDay))} is not open for surgery.`
      return
    }
    this.bookedFor = isoDate
    this.bookingTarget.textContent = `Mochi · spay · ${longDateFormatter.format(this.dateFor(this.focusedDay))} at 9:30`
    this.statusTarget.textContent = `Held ${longDateFormatter.format(this.dateFor(this.focusedDay))} for Mochi.`
    this.renderMonth()
  }

  clearBooking(event) {
    event.preventDefault()
    if (!this.bookedFor) return
    this.bookedFor = null
    this.bookingTarget.textContent = "No surgery date held."
    this.statusTarget.textContent = "Cleared the held date."
    this.renderMonth()
  }

  focusDay({ currentTarget: dayButton }) {
    this.focusedDay = Number(dayButton.dataset.day)
    this.renderMonth()
  }

  shiftFocusedDay(delta) {
    const cursor = this.dateFor(this.focusedDay)
    cursor.setDate(cursor.getDate() + delta)
    this.visibleYear = cursor.getFullYear()
    this.visibleMonth = cursor.getMonth()
    this.focusedDay = cursor.getDate()
    this.renderMonth()
  }

  shiftMonth(monthDelta) {
    const cursor = new Date(this.visibleYear, this.visibleMonth + monthDelta, 1)
    this.visibleYear = cursor.getFullYear()
    this.visibleMonth = cursor.getMonth()
    this.focusedDay = Math.min(this.focusedDay, this.daysInVisibleMonth)
    this.renderMonth()
  }

  renderMonth() {
    this.monthLabelTarget.textContent = monthFormatter.format(new Date(this.visibleYear, this.visibleMonth, 1))
    this.gridTarget.replaceChildren()
    const firstWeekday = new Date(this.visibleYear, this.visibleMonth, 1).getDay()
    for (let filler = 0; filler < firstWeekday; filler += 1) {
      this.gridTarget.append(document.createElement("span"))
    }
    for (let day = 1; day <= this.daysInVisibleMonth; day += 1) {
      this.gridTarget.append(this.buildDayButton(day))
    }
    this.gridTarget.querySelector("[tabindex='0']")?.focus()
  }

  buildDayButton(day) {
    const isoDate = this.isoDateFor(day)
    const state = this.dayState(isoDate)
    const dayButton = document.createElement("button")
    dayButton.type = "button"
    dayButton.textContent = String(day)
    dayButton.dataset.day = String(day)
    dayButton.dataset.state = state
    dayButton.setAttribute("data-action", "appointment-calendar#focusDay")
    dayButton.setAttribute("aria-pressed", String(this.bookedFor === isoDate))
    dayButton.tabIndex = day === this.focusedDay ? 0 : -1
    dayButton.setAttribute("aria-label", `${longDateFormatter.format(this.dateFor(day))}, ${state}`)
    return dayButton
  }

  dayState(isoDate) {
    const weekday = new Date(`${isoDate}T12:00:00`).getDay()
    if (closedWeekdays.has(weekday)) return "closed"
    if (bookedIsoDates.has(isoDate)) return "booked"
    return "open"
  }

  isoDateFor(day) {
    const month = String(this.visibleMonth + 1).padStart(2, "0")
    return `${this.visibleYear}-${month}-${String(day).padStart(2, "0")}`
  }

  dateFor(day) {
    return new Date(this.visibleYear, this.visibleMonth, day)
  }

  filterName(event) {
    if (event.key === "ArrowLeft") return "left"
    if (event.key === "ArrowRight") return "right"
    if (event.key === "ArrowUp") return "up"
    return "down"
  }

  get daysInVisibleMonth() {
    return new Date(this.visibleYear, this.visibleMonth + 1, 0).getDate()
  }
}
