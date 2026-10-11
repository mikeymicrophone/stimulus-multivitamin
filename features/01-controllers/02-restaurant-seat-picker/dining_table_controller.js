/*
 * dining_table_controller.js — registered as "dining-table"
 *
 * Teaches: one class, many independent instances. Every table on the floor
 * plan carries data-controller="dining-table", so Stimulus builds one
 * instance per table. Each instance keeps its held seats in its own field,
 * created in initialize(), and only ever touches its own element and targets.
 */
import { Controller } from "@hotwired/stimulus"

// Shared, read-only configuration is fine at module level. Mutable state is
// not: a `const heldSeats = new Set()` out here would be shared by every table.
const ONLINE_HOLD_LIMIT = 4

export default class extends Controller {
  static targets = ["tableName", "seat", "summary", "bookButton", "releaseButton"]

  initialize() {
    this.heldSeatLabels = new Set()
  }

  connect() {
    this.render()
  }

  toggleSeat(event) {
    const seat = event.currentTarget
    if (seat.disabled) return

    if (this.heldSeatLabels.has(seat.value)) {
      this.heldSeatLabels.delete(seat.value)
    } else if (this.heldSeatLabels.size < ONLINE_HOLD_LIMIT) {
      this.heldSeatLabels.add(seat.value)
    } else {
      this.render(`Online holds stop at ${ONLINE_HOLD_LIMIT} seats per table. Call the host stand for larger parties.`)
      return
    }
    this.render()
  }

  bookHeldSeats() {
    if (this.heldSeatLabels.size === 0) return

    const bookedLabels = [...this.heldSeatLabels]
    for (const seat of this.heldSeats) {
      seat.disabled = true
      seat.classList.add("booked")
      seat.setAttribute("aria-label", `Seat ${seat.value}, booked`)
    }
    this.heldSeatLabels.clear()
    this.render(`Booked ${this.describeSeatList(bookedLabels)} at ${this.tableName}.`)
  }

  releaseHeldSeats() {
    this.heldSeatLabels.clear()
    this.render()
  }

  render(notice = null) {
    for (const seat of this.seatTargets) {
      seat.setAttribute("aria-pressed", String(this.heldSeatLabels.has(seat.value)))
    }

    const openSeatCount = this.seatTargets.filter((seat) => !seat.disabled).length
    this.bookButtonTarget.disabled = this.heldSeatLabels.size === 0
    this.releaseButtonTarget.disabled = this.heldSeatLabels.size === 0

    if (notice) {
      this.summaryTarget.textContent = notice
    } else if (openSeatCount === 0) {
      this.summaryTarget.textContent = "Fully booked"
    } else if (this.heldSeatLabels.size === 0) {
      this.summaryTarget.textContent = `${openSeatCount} of ${this.seatTargets.length} seats open`
    } else {
      this.summaryTarget.textContent = `Holding ${this.describeSeatList([...this.heldSeatLabels])}`
    }
  }

  get heldSeats() {
    return this.seatTargets.filter((seat) => this.heldSeatLabels.has(seat.value))
  }

  get tableName() {
    return this.tableNameTarget.textContent.trim()
  }

  describeSeatList(seatLabels) {
    const sortedLabels = [...seatLabels].sort()
    return sortedLabels.length === 1 ? `seat ${sortedLabels[0]}` : `seats ${sortedLabels.join(", ")}`
  }
}
