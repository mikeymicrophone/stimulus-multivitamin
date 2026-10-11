/*
 * visit_request_controller.js — registered as "visit-request"
 *
 * Teaches: lifecycle callbacks run after the DOM change, not during it.
 * Adding, removing, or moving a pet changes the DOM synchronously, but
 * Stimulus calls connect() and disconnect() from a MutationObserver
 * callback, which runs after this action returns. So the count of pop-up
 * calendars is taken on the next animation frame, once every date picker
 * has built or destroyed its widget.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["petList", "petVisit", "petVisitTemplate", "calendarCount", "confirmation"]

  connect() {
    this.renumberPets()
    this.renderCalendarCountSoon()
  }

  addPet() {
    const petVisit = this.petVisitTemplateTarget.content.firstElementChild.cloneNode(true)
    this.petListTarget.append(petVisit)
    this.renumberPets()
    petVisit.querySelector("input").focus()
    this.renderCalendarCountSoon()
  }

  removePet(event) {
    this.petVisitFor(event).remove()
    this.renumberPets()
    this.renderCalendarCountSoon()
  }

  movePetUp(event) {
    const petVisit = this.petVisitFor(event)
    const previousPetVisit = petVisit.previousElementSibling
    if (!previousPetVisit) return
    this.petListTarget.insertBefore(petVisit, previousPetVisit)
    this.renumberPets()
    event.currentTarget.focus()
    this.renderCalendarCountSoon()
  }

  requestVisits(event) {
    event.preventDefault()
    const requests = this.petVisitTargets.map((petVisit) => {
      const petName = petVisit.querySelector('input[name="pet_name"]').value.trim() || "Unnamed pet"
      const datePicker = this.application.getControllerForElementAndIdentifier(
        petVisit.querySelector('[data-controller~="visit-date-picker"]'),
        "visit-date-picker"
      )
      return { petName, chosenDate: datePicker?.chosenDate ?? null }
    })
    const undated = requests.filter((request) => request.chosenDate === null)
    this.confirmationTarget.textContent = undated.length > 0
      ? `Choose a date for ${undated.map((request) => request.petName).join(" and ")}.`
      : `Request sent for ${requests.map((request) => request.petName).join(", ")}. The front desk will call you.`
  }

  renumberPets() {
    this.petVisitTargets.forEach((petVisit, index) => {
      petVisit.querySelector("legend").textContent = `Pet ${index + 1}`
      petVisit.querySelector('[data-action~="visit-request#movePetUp"]').disabled = index === 0
    })
  }

  renderCalendarCountSoon() {
    requestAnimationFrame(() => {
      const calendarCount = document.querySelectorAll(".flatpickr-calendar").length
      this.calendarCountTarget.textContent = `${calendarCount} pop-up ${calendarCount === 1 ? "calendar" : "calendars"} attached to <body> for ${this.petVisitTargets.length} ${this.petVisitTargets.length === 1 ? "pet" : "pets"}`
    })
  }

  petVisitFor(event) {
    return event.target.closest('[data-visit-request-target="petVisit"]')
  }
}
