/*
 * visit_date_picker_controller.js — registered as "visit-date-picker"
 *
 * Teaches: wrapping a third-party widget. connect() builds a flatpickr
 * calendar and disconnect() destroys it. flatpickr appends its pop-up to
 * <body>, outside this controller's element, so removing the element doesn't
 * remove the calendar. Only destroy() does, and skipping it leaves one
 * orphaned calendar (and its document listeners) behind for every pet
 * removed. The chosen date lives in the <input>, not in the widget, so a
 * fresh widget built on reconnect still shows it.
 */
import { Controller } from "@hotwired/stimulus"
import flatpickr from "flatpickr"

const dayInMilliseconds = 24 * 60 * 60 * 1000
const visitDateFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" })

export default class extends Controller {
  static targets = ["dateInput", "summary"]
  static values = {
    closedWeekdays: { type: Array, default: [0] },
    firstBookableInDays: { type: Number, default: 1 },
    bookingWindowDays: { type: Number, default: 30 },
  }

  connect() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    this.picker = flatpickr(this.dateInputTarget, {
      dateFormat: "Y-m-d",
      altInput: true,
      altFormat: "D, M j",
      altInputClass: "visit-date-display",
      minDate: new Date(today.getTime() + this.firstBookableInDaysValue * dayInMilliseconds),
      maxDate: new Date(today.getTime() + this.bookingWindowDaysValue * dayInMilliseconds),
      disable: [(date) => this.closedWeekdaysValue.includes(date.getDay())],
      onChange: (selectedDates) => this.renderSummary(selectedDates[0]),
    })
    this.renderSummary(this.picker.selectedDates[0])
  }

  disconnect() {
    this.picker.destroy()
    this.picker = null
  }

  renderSummary(visitDate) {
    this.summaryTarget.textContent = visitDate
      ? `Requested for ${visitDateFormatter.format(visitDate)}. We'll call to confirm a time.`
      : "Closed Sundays. Book up to 30 days ahead."
  }

  get chosenDate() {
    return this.picker?.selectedDates[0] ?? null
  }
}
