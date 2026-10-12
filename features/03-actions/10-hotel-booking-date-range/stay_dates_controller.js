/*
 * stay_dates_controller.js — registered as "stay-dates"
 *
 * Teaches: actions on elements the controller creates. Every month change
 * rebuilds the calendar, and each new day button carries its own
 * data-action. Stimulus binds the new buttons and drops the old ones on
 * its own, but not instantly: it notices them from a MutationObserver
 * after the rendering code returns, so code that renders and then
 * clicks a new button in the same breath clicks a button with no actions.
 */
import { Controller } from "@hotwired/stimulus"

const monthHeading = new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
const shortDate = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" })
const longDate = new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" })
const dollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
const weekdayLetters = ["S", "M", "T", "W", "T", "F", "S"]

const toDate = (isoDate) => new Date(`${isoDate}T00:00:00Z`)
const toIsoDate = (date) => date.toISOString().slice(0, 10)
const addDays = (isoDate, days) => toIsoDate(new Date(toDate(isoDate).getTime() + days * 86_400_000))
const firstOfMonth = (isoDate) => `${isoDate.slice(0, 7)}-01`
const addMonths = (isoDate, months) => {
  const date = toDate(firstOfMonth(isoDate))
  date.setUTCMonth(date.getUTCMonth() + months)
  return toIsoDate(date)
}
const nightsBetween = (checkIn, checkOut) => Math.round((toDate(checkOut) - toDate(checkIn)) / 86_400_000)

export default class extends Controller {
  static targets = ["calendar", "previousMonthButton", "nextMonthButton", "checkInField", "checkOutField", "summary", "reserveButton", "status"]
  static values = {
    firstBookableDate: String,
    lastBookableDate: String,
    soldOutDates: Array,
    weeknightRateCents: Number,
    weekendRateCents: Number,
    minimumNights: Number,
    offer: Object,
  }

  initialize() {
    this.checkIn = null
    this.checkOut = null
    this.previewCheckOutDate = null
    this.firstVisibleMonth = firstOfMonth(this.firstBookableDateValue)
  }

  connect() {
    this.checkInFieldTarget.min = this.firstBookableDateValue
    this.checkOutFieldTarget.max = this.lastBookableDateValue
    this.renderCalendar()
    this.renderSelection()
  }

  showPreviousMonth() {
    this.firstVisibleMonth = addMonths(this.firstVisibleMonth, -1)
    this.renderCalendar()
  }

  showNextMonth() {
    this.firstVisibleMonth = addMonths(this.firstVisibleMonth, 1)
    this.renderCalendar()
  }

  chooseDay({ currentTarget: dayButton }) {
    this.chooseDate(dayButton.dataset.date)
  }

  previewCheckOut({ currentTarget: dayButton }) {
    if (!this.checkIn || this.checkOut) return
    this.previewCheckOutDate = dayButton.dataset.date > this.checkIn ? dayButton.dataset.date : null
    this.renderHighlights()
  }

  endPreview() {
    this.previewCheckOutDate = null
    this.renderHighlights()
  }

  // A new check-in keeps the old check-out only if the stay still works.
  typeDates({ currentTarget: changedField }) {
    const typedCheckIn = this.checkInFieldTarget.value || null
    let typedCheckOut = this.checkOutFieldTarget.value || null
    if (changedField === this.checkInFieldTarget && typedCheckOut && !this.isValidStay(typedCheckIn, typedCheckOut)) typedCheckOut = null
    this.checkIn = null
    this.checkOut = null
    if (typedCheckIn) this.chooseDate(typedCheckIn)
    if (typedCheckIn && typedCheckOut) this.chooseDate(typedCheckOut)
    if (this.checkIn) this.firstVisibleMonth = firstOfMonth(this.checkIn)
    this.renderCalendar()
  }

  // The buttons for the offer's month exist once renderCalendar() returns,
  // but their actions don't yet, so calling .click() on them would do
  // nothing. Choose the dates directly.
  applyOffer() {
    const { checkIn, checkOut } = this.offerValue
    this.firstVisibleMonth = firstOfMonth(checkIn)
    this.checkIn = null
    this.checkOut = null
    this.renderCalendar()
    this.chooseDate(checkIn)
    this.chooseDate(checkOut)
  }

  clearDates() {
    this.checkIn = null
    this.checkOut = null
    this.statusTarget.textContent = ""
    this.renderSelection()
  }

  reserve(event) {
    event.preventDefault()
    if (!this.checkIn || !this.checkOut) return
    this.statusTarget.textContent = `Held for 15 minutes: ${longDate.format(toDate(this.checkIn))} to ${longDate.format(toDate(this.checkOut))}. Add guest details to confirm.`
  }

  chooseDate(isoDate) {
    this.statusTarget.textContent = ""
    if (!this.isBookableNight(isoDate) && !(this.checkIn && !this.checkOut && isoDate > this.checkIn)) {
      this.statusTarget.textContent = `${shortDate.format(toDate(isoDate))} isn't available.`
    } else if (!this.checkIn || this.checkOut || isoDate <= this.checkIn) {
      this.checkIn = isoDate
      this.checkOut = null
    } else if (this.soldOutNightBetween(this.checkIn, isoDate)) {
      this.statusTarget.textContent = `${shortDate.format(toDate(this.soldOutNightBetween(this.checkIn, isoDate)))} is sold out, so that stay isn't possible. Starting over from ${shortDate.format(toDate(isoDate))}.`
      this.checkIn = this.isBookableNight(isoDate) ? isoDate : null
    } else if (nightsBetween(this.checkIn, isoDate) < this.minimumNightsValue) {
      this.statusTarget.textContent = `Stays are at least ${this.minimumNightsValue} nights.`
    } else {
      this.checkOut = isoDate
    }
    this.previewCheckOutDate = null
    this.renderSelection()
  }

  renderCalendar() {
    const firstMonth = this.firstVisibleMonth
    this.calendarTarget.replaceChildren(this.buildMonth(firstMonth), this.buildMonth(addMonths(firstMonth, 1)))
    this.previousMonthButtonTarget.disabled = firstMonth <= firstOfMonth(this.firstBookableDateValue)
    this.nextMonthButtonTarget.disabled = addMonths(firstMonth, 1) >= firstOfMonth(this.lastBookableDateValue)
    this.renderHighlights()
  }

  renderSelection() {
    this.checkInFieldTarget.value = this.checkIn ?? ""
    this.checkOutFieldTarget.value = this.checkOut ?? ""
    this.checkOutFieldTarget.min = this.checkIn ? addDays(this.checkIn, this.minimumNightsValue) : this.firstBookableDateValue
    this.renderHighlights()
    this.renderSummary()
  }

  renderHighlights() {
    const rangeEnd = this.checkOut ?? this.previewCheckOutDate
    for (const dayButton of this.calendarTarget.querySelectorAll("[data-date]")) {
      const date = dayButton.dataset.date
      dayButton.classList.toggle("check-in", date === this.checkIn)
      dayButton.classList.toggle("check-out", date === this.checkOut)
      dayButton.classList.toggle("in-range", Boolean(this.checkIn && rangeEnd && date > this.checkIn && date < rangeEnd))
      dayButton.classList.toggle("previewed", !this.checkOut && date === this.previewCheckOutDate)
      dayButton.setAttribute("aria-pressed", String(date === this.checkIn || date === this.checkOut))
    }
  }

  renderSummary() {
    if (!this.checkIn || !this.checkOut) {
      this.summaryTarget.textContent = this.checkIn ? "Now choose your check-out date." : "Choose a check-in date."
      this.reserveButtonTarget.disabled = true
      return
    }
    const nights = Array.from({ length: nightsBetween(this.checkIn, this.checkOut) }, (_, offset) => addDays(this.checkIn, offset))
    const weekendNights = nights.filter((night) => [5, 6].includes(toDate(night).getUTCDay())).length
    const weeknights = nights.length - weekendNights
    const totalCents = weeknights * this.weeknightRateCentsValue + weekendNights * this.weekendRateCentsValue
    const breakdown = [
      weeknights && `${weeknights} × ${dollars.format(this.weeknightRateCentsValue / 100)} weeknight`,
      weekendNights && `${weekendNights} × ${dollars.format(this.weekendRateCentsValue / 100)} Friday or Saturday`,
    ].filter(Boolean).join(" + ")
    this.summaryTarget.textContent = `${nights.length} nights: ${breakdown} = ${dollars.format(totalCents / 100)} before tax`
    this.reserveButtonTarget.disabled = false
  }

  buildMonth(monthStart) {
    const month = document.createElement("section")
    month.className = "calendar-month"
    const heading = document.createElement("h3")
    heading.textContent = monthHeading.format(toDate(monthStart))
    const grid = document.createElement("div")
    grid.className = "calendar-grid"
    for (const letter of weekdayLetters) {
      const weekday = document.createElement("span")
      weekday.className = "weekday"
      weekday.textContent = letter
      grid.append(weekday)
    }
    for (let blank = 0; blank < toDate(monthStart).getUTCDay(); blank++) grid.append(document.createElement("span"))
    for (let date = monthStart; date < addMonths(monthStart, 1); date = addDays(date, 1)) {
      const dayButton = document.createElement("button")
      dayButton.type = "button"
      dayButton.className = "calendar-day"
      dayButton.dataset.date = date
      dayButton.dataset.action = "stay-dates#chooseDay pointerenter->stay-dates#previewCheckOut focus->stay-dates#previewCheckOut"
      dayButton.textContent = String(toDate(date).getUTCDate())
      dayButton.setAttribute("aria-label", longDate.format(toDate(date)))
      const outOfSeason = date < this.firstBookableDateValue || date > this.lastBookableDateValue
      dayButton.disabled = outOfSeason
      dayButton.classList.toggle("sold-out", this.soldOutDatesValue.includes(date))
      grid.append(dayButton)
    }
    month.append(heading, grid)
    return month
  }

  isBookableNight(isoDate) {
    return isoDate >= this.firstBookableDateValue && isoDate < this.lastBookableDateValue && !this.soldOutDatesValue.includes(isoDate)
  }

  isValidStay(checkIn, checkOut) {
    return Boolean(checkIn) && checkOut > checkIn && this.isBookableNight(checkIn)
      && !this.soldOutNightBetween(checkIn, checkOut) && nightsBetween(checkIn, checkOut) >= this.minimumNightsValue
  }

  soldOutNightBetween(checkIn, checkOut) {
    return this.soldOutDatesValue.find((soldOut) => soldOut >= checkIn && soldOut < checkOut)
  }
}
