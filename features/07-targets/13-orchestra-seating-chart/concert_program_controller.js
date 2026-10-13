/*
 * concert_program_controller.js — registered as "concert-program"
 *
 * Teaches: the piece title is one element with two target attributes,
 * data-seating-chart-target="pieceTitle" and
 * data-concert-program-target="pieceTitle". Revising the title writes
 * that element. The seating chart reads the same node through its own
 * target.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["pieceTitle", "movement", "programNote"]

  reviseTitle() {
    this.pieceTitleTarget.textContent = "Pines of Rome, revised bowings"
    this.programNoteTarget.textContent = `Program: ${this.pieceTitleTarget.textContent}. Movement: ${this.movementTarget.textContent.trim()}.`
  }
}
