/*
 * lens_cabinet_controller.js — registered as "lens-cabinet"
 *
 * Teaches: a throw in an action is reported with index and
 * event on detail. The next action on the same button still
 * runs, because the default handleError swallows the throw.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["bench", "stamp"]

  connect() {
    this.benchTarget.textContent = "Prism is seated."
    this.stampTarget.textContent = "Bench is quiet."
  }

  breakPrism() {
    this.benchTarget.textContent = "Prism cracked on the bench."
    throw new Error("prism cracked")
  }

  stampBench() {
    this.stampTarget.textContent = "Bench stamped."
  }
}
