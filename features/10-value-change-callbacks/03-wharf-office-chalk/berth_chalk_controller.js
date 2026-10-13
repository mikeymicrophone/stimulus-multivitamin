/*
 * berth_chalk_controller.js — registered as "berth-chalk"
 *
 * Teaches: berthNameValueChanged and draftFeetValueChanged run for a
 * write from this controller and for a write from office_chalk.js.
 * The callback arguments do not say which one happened. Writing the
 * same strings again does not run the callbacks.
 */
import { Controller } from "@hotwired/stimulus"
import { chalkBerth } from "./office_chalk.js"

export default class extends Controller {
  static targets = ["reading", "log"]
  static values = { berthName: String, draftFeet: Number }

  berthNameValueChanged(berthName, previousName) {
    this.paint()
    this.record(`Berth ${shown(berthName)}, previous ${shown(previousName)}.`)
  }

  draftFeetValueChanged(draftFeet, previousDraft) {
    this.paint()
    this.record(`Draft ${shown(draftFeet)}, previous ${shown(previousDraft)}.`)
  }

  chalkFromBoard() {
    this.berthNameValue = "Union"
    this.draftFeetValue = 16
    this.record("The board chalked Union at 16 ft.")
  }

  chalkFromOffice() {
    chalkBerth(this.element, "South", 22)
    this.record("The office script was asked for South at 22 ft.")
  }

  chalkSameWords() {
    chalkBerth(this.element, this.berthNameValue, this.draftFeetValue)
    this.record("The office script was asked to chalk the same words.")
  }

  paint() {
    this.readingTarget.textContent = `${this.berthNameValue}, ${this.draftFeetValue} ft of draft.`
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
