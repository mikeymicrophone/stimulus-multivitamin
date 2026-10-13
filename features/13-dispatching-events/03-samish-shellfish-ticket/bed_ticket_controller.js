/*
 * bed_ticket_controller.js — registered as "bed-ticket"
 *
 * Teaches: detail is the object passed to dispatch, not a
 * copy. Omitting detail supplies a fresh {} each call.
 * detail: null stays null. The returned event carries
 * that same detail.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["note"]

  postSack() {
    const detail = {
      bed: "Samish",
      pounds: 42,
      grade: "A",
      tags: ["ice", "same-day"]
    }
    const event = this.dispatch("sacked", { detail })
    this.noteTarget.textContent = `Returned bed ${event.detail.bed}. Same object ${event.detail === detail}.`
  }

  postOmitted() {
    const first = this.dispatch("sacked")
    const second = this.dispatch("cleared")
    const keys = Object.keys(first.detail).length
    this.noteTarget.textContent = `Omitted keys ${keys}. Fresh ${first.detail !== second.detail}. Null ${first.detail === null}.`
  }

  postNull() {
    const event = this.dispatch("sacked", { detail: null })
    this.noteTarget.textContent = `Null detail ${event.detail}.`
  }
}
