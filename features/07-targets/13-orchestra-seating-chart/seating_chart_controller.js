/*
 * seating_chart_controller.js — registered as "seating-chart"
 *
 * Teaches, together: chairs are a plural target, and a principal is the
 * same element with a second token. The singular principal is the first
 * one in the document. A nested seating-chart (the brass quintet) keeps
 * its chairs out of the orchestra's list. Filtering the array keeps
 * document order and does not change which element principalTarget is.
 * The bench blueprint is a template; its chair is not seated until it
 * is cloned. hasIntermissionTarget guards an optional note. soloTarget
 * throws because no solo part is marked. Move earlier follows document
 * order on the next read.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["pieceTitle", "chair", "principal", "benchBlueprint", "roster", "status", "intermission", "solo", "substituteName", "substituteSection"]

  connect() {
    this.readChart()
  }

  readChart() {
    const players = this.chairTargets.map((chair) => chair.dataset.playerName)
    const principals = this.principalTargets.map((chair) => chair.dataset.playerName)
    const firstPrincipal = this.hasPrincipalTarget ? this.principalTarget.dataset.playerName : "none"
    const intermission = this.hasIntermissionTarget ? this.intermissionTarget.textContent.trim() : "No intermission"
    const piece = this.hasPieceTitleTarget ? this.pieceTitleTarget.textContent.trim() : "No piece title on this chart"
    const blueprintChairs = this.hasBenchBlueprintTarget
      ? this.benchBlueprintTarget.content.querySelectorAll("[data-seating-chart-target~='chair']").length
      : 0
    this.statusTarget.textContent = `${this.element.dataset.chartName}: ${piece}. Players: ${players.join(", ")}. Principals: ${principals.join(", ")}. First principal: ${firstPrincipal}. ${intermission}. Blueprint chairs not seated: ${blueprintChairs}.`
  }

  showSection(event) {
    const section = event.currentTarget.dataset.section
    this.chairTargets.forEach((chair) => {
      chair.hidden = chair.dataset.section !== section
    })
    const names = this.chairTargets
      .filter((chair) => chair.dataset.section === section)
      .map((chair) => chair.dataset.playerName)
    this.statusTarget.textContent = `${this.element.dataset.chartName} ${section}: ${names.join(", ")}.`
  }

  moveEarlier(event) {
    const chair = event.currentTarget.closest("[data-seating-chart-target~='chair']")
    const previous = chair.previousElementSibling
    if (!previous) return
    chair.parentElement.insertBefore(chair, previous)
    this.readChart()
  }

  addSubstitute() {
    const playerName = this.substituteNameTarget.value.trim()
    const section = this.substituteSectionTarget.value.trim()
    if (!playerName || !section) return
    const fragment = this.benchBlueprintTarget.content.cloneNode(true)
    const chair = fragment.querySelector("[data-seating-chart-target~='chair']")
    chair.dataset.playerName = playerName
    chair.dataset.section = section
    chair.querySelector("[data-player-label]").textContent = `${playerName} · ${section}`
    chair.querySelector("button").textContent = `Move ${playerName} earlier`
    this.rosterTarget.append(chair)
    this.readChart()
  }

  readSolo() {
    let message = "Solo part is on the stand."
    try {
      message = `${this.soloTarget.dataset.soloPart} is on the stand.`
    } catch (error) {
      message = error.message
    }
    this.statusTarget.textContent = message
  }
}
