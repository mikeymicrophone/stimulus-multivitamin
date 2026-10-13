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

export default class extends Controller {
  static classes = ["quiet", "crowded", "priority", "calling"]
  static targets = ["sectorName", "board", "vessel", "status", "watchName", "log"]
  static values = {
    crowded: Boolean,
    watch: String
  }

  crowdedValueChanged(crowded) {
    this.boardTarget.classList.remove(...this.quietClasses, ...this.crowdedClasses)
    if (crowded) {
      this.boardTarget.classList.add(...this.crowdedClasses)
      for (const vessel of this.vesselTargets) {
        vessel.classList.add(...this.priorityClasses)
      }
    } else {
      this.boardTarget.classList.add(...this.quietClasses)
      for (const vessel of this.vesselTargets) {
        vessel.classList.remove(...this.priorityClasses)
      }
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

  toggleCalling(event) {
    const vessel = event.target.closest("[data-traffic-board-target~='vessel']")
    vessel.classList.toggle(this.callingClass)
    const name = vessel.getAttribute("data-vessel-name")
    const calling = vessel.classList.contains(this.callingClass)
    this.logTarget.textContent = `${name} calling ${calling}.`
  }

  paint() {
    const sectorName = this.sectorNameTarget.textContent.trim()
    const boardTokens = [...this.quietClasses, ...this.crowdedClasses].filter((token) => {
      return this.boardTarget.classList.contains(token)
    })
    const vessels = this.vesselTargets.map((vessel) => {
      const name = vessel.getAttribute("data-vessel-name")
      const priority = this.priorityClasses.every((token) => vessel.classList.contains(token))
      return `${name} ${priority ? "priority" : "plain"}`
    })
    this.statusTarget.textContent = [
      `${sectorName} crowded ${this.crowdedValue}.`,
      `Board ${boardTokens.join(" ") || "none"}.`,
      `quietClasses ${JSON.stringify(this.quietClasses)}.`,
      `crowdedClasses ${JSON.stringify(this.crowdedClasses)}.`,
      `priorityClasses ${JSON.stringify(this.priorityClasses)}.`,
      `hasCallingClass ${this.hasCallingClass}.`,
      `callingClass ${this.callingClass}.`,
      `Watch ${this.watchValue}.`,
      `Vessels ${vessels.join(", ")}.`
    ].join(" ")
  }
}
