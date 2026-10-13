/*
 * rehearsal_dinner_controller.js — registered as "rehearsal-dinner"
 *
 * Teaches: a guest card inside the template is not a guest target.
 * querySelectorAll, which Stimulus uses, does not enter a template's
 * document fragment. The template element itself is the cardBlueprint
 * target. Cloning its content and appending the clone puts a real
 * guest target on the chart. Excusing a guest removes that target on
 * the next read.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["cardBlueprint", "guest", "tableList", "status", "guestName", "tableNumber"]

  connect() {
    this.render()
  }

  seatGuest() {
    const guestName = this.guestNameTarget.value.trim()
    const tableNumber = this.tableNumberTarget.value.trim()
    if (!guestName || !tableNumber) return
    const fragment = this.cardBlueprintTarget.content.cloneNode(true)
    const card = fragment.querySelector("[data-rehearsal-dinner-target~='guest']")
    card.dataset.guestName = guestName
    card.dataset.tableNumber = tableNumber
    card.querySelector("[data-guest-label]").textContent = `${guestName} at table ${tableNumber}`
    const excuse = card.querySelector("button")
    excuse.textContent = `Excuse ${guestName}`
    this.tableListTarget.append(card)
    this.render()
  }

  excuseGuest(event) {
    event.currentTarget.closest("[data-rehearsal-dinner-target~='guest']").remove()
    this.render()
  }

  render() {
    const seated = this.guestTargets.map((guest) => `${guest.dataset.guestName} at table ${guest.dataset.tableNumber}`)
    const blueprintGuests = this.cardBlueprintTarget.content.querySelectorAll("[data-rehearsal-dinner-target~='guest']").length
    const seatedText = seated.length ? seated.join(", ") : "no one"
    this.statusTarget.textContent = `Seated: ${seatedText}. Guests inside the blueprint: ${blueprintGuests}, and guestTargets does not include them.`
  }
}
