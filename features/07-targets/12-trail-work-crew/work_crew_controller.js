/*
 * work_crew_controller.js — registered as "work-crew"
 *
 * Teaches: scope is decided when volunteerTargets is read. Owen starts
 * on the trail day. Appending his element into the nested saw crew, which
 * is also a work-crew, drops him from the trail day's list on the next
 * read. The trail-day controller does not reconnect. Move earlier
 * changes document order inside the crew that contains the button.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["volunteer", "roll", "status"]

  connect() {
    this.readRoll()
  }

  readRoll() {
    const names = this.volunteerTargets.map((volunteer) => volunteer.dataset.volunteerName)
    this.statusTarget.textContent = `${this.element.dataset.crewName}: ${names.join(", ")}.`
  }

  moveEarlier(event) {
    const volunteer = event.currentTarget.closest("[data-work-crew-target~='volunteer']")
    const previous = volunteer.previousElementSibling
    if (!previous) return
    volunteer.parentElement.insertBefore(volunteer, previous)
    this.readRoll()
  }

  sendOwenToSawCrew() {
    const owen = this.volunteerTargets.find((volunteer) => volunteer.dataset.volunteerName === "Owen")
    const sawRoll = this.element.querySelector('[data-crew-name="Saw crew"] [data-work-crew-target~="roll"]')
    sawRoll.append(owen)
    this.readRoll()
  }
}
