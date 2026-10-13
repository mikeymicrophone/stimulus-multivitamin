/*
 * pull_list_controller.js — registered as "pull-list"
 *
 * Teaches: pieceTargets is the whole rack, including a piece with the
 * hidden attribute. Filtering that array keeps document order. The
 * singular pieceTarget stays the first piece in the document after a
 * filter hides it. Pulling checked pieces iterates the same list, not
 * the rows that happen to be visible.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["piece", "status"]

  connect() {
    this.describe("all")
  }

  showDepartment(event) {
    const department = event.currentTarget.dataset.department
    this.pieceTargets.forEach((piece) => {
      const matches = department === "all" || piece.dataset.department === department
      piece.hidden = !matches
    })
    this.describe(department)
  }

  pullChecked() {
    const names = this.pieceTargets
      .filter((piece) => piece.querySelector("input").checked)
      .map((piece) => piece.dataset.pieceName)
    this.statusTarget.textContent = names.length ? `Pulling ${names.join(", ")}.` : "Nothing checked."
  }

  describe(department) {
    const pieces = this.pieceTargets.filter((piece) => department === "all" || piece.dataset.department === department)
    const names = pieces.map((piece) => piece.dataset.pieceName)
    const label = department === "all" ? "All pieces, including covered ones" : "Showing"
    this.statusTarget.textContent = `${label}: ${names.join(", ")}. First piece on the page: ${this.pieceTarget.dataset.pieceName}. Pieces in the list: ${this.pieceTargets.length}.`
  }
}
