/*
 * traffic_board_controller.js — registered as "traffic-board"
 *
 * Teaches: crowdedValueChanged paints the board from quietClasses
 * or crowdedClasses, and paints every vessel from priorityClasses.
 * callingClass is toggled on one vessel. The class strings stay
 * in the markup, so Seattle Traffic and the Strait sector can
 * name different tokens for the same logical classes. The actions
 * write the value or toggle a class. They do not name the CSS.
 */
import { Controller } from "@hotwired/stimulus"
import { report, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static classes = ["quiet", "crowded", "priority", "calling"]
  static targets = ["sectorName", "board", "vessel", "status", "watchName", "log"]
  static values = {
    crowded: Boolean,
    watch: String
  }

  crowdedValueChanged(crowded) {
    const [wear, shed] = crowded ? [this.crowdedClasses, this.quietClasses] : [this.quietClasses, this.crowdedClasses]
    this.boardTarget.classList.remove(...shed)
    this.boardTarget.classList.add(...wear)
    for (const { classList } of this.vesselTargets) {
      // toggle takes one token, so the stack is forced token by token.
      this.priorityClasses.forEach((token) => classList.toggle(token, crowded))
    }
    this.paint()
  }

  watchValueChanged(watch) {
    this.watchNameTarget.textContent = watch
  }

  markCrowded() {
    this.crowdedValue = true
  }

  markQuiet() {
    this.crowdedValue = false
  }

  toggleCalling({ target }) {
    const vessel = target.closest("[data-traffic-board-target~='vessel']")
    const calling = vessel.classList.toggle(this.callingClass)
    this.logTarget.textContent = `${vessel.dataset.vesselName} calling ${calling}.`
  }

  paint() {
    const sectorName = textOf(this.sectorNameTarget)
    const boardTokens = [...this.quietClasses, ...this.crowdedClasses].filter((token) => {
      return this.boardTarget.classList.contains(token)
    })
    const vessels = this.vesselTargets.map(({ dataset, classList }) => {
      const priority = this.priorityClasses.every((token) => classList.contains(token))
      return `${dataset.vesselName} ${priority ? "priority" : "plain"}`
    })
    report(
      this.statusTarget,
      `${sectorName} crowded ${this.crowdedValue}.`,
      `Board ${boardTokens.join(" ") || "none"}.`,
      `quietClasses ${JSON.stringify(this.quietClasses)}.`,
      `crowdedClasses ${JSON.stringify(this.crowdedClasses)}.`,
      `priorityClasses ${JSON.stringify(this.priorityClasses)}.`,
      `hasCallingClass ${this.hasCallingClass}.`,
      `callingClass ${this.callingClass}.`,
      `Watch ${this.watchValue}.`,
      `Vessels ${vessels.join(", ")}.`
    )
  }
}
