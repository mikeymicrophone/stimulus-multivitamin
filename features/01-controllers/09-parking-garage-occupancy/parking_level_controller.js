/*
 * parking_level_controller.js — registered as "parking-level"
 *
 * Teaches: a controller with a public API meant to be called from outside.
 * recordSensorReading() is called by sensor_feed.js, plain JavaScript that
 * is not a controller, after it looks this instance up through the
 * application. The getters (openSpaceCount, levelName, ...) are read by the
 * garage-overview controller. Occupancy lives in data attributes on each
 * space, so the DOM, not the instance, is the record of truth.
 */
import { Controller } from "@hotwired/stimulus"

const readingTimeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit" })

export default class extends Controller {
  static targets = ["levelName", "space", "openCount", "lastReading", "closeButton"]

  connect() {
    this.render()
  }

  recordSensorReading(spaceNumber, isOccupied) {
    const space = this.spaceTargets.find((candidate) => candidate.dataset.spaceNumber === String(spaceNumber))
    if (!space || space.dataset.occupancy === "held") return false

    space.dataset.occupancy = isOccupied ? "occupied" : "open"
    this.lastReadingTarget.textContent = `Sensor ${spaceNumber}: ${isOccupied ? "car arrived" : "car left"} at ${readingTimeFormatter.format(new Date())}`
    this.render()
    return true
  }

  toggleHold({ currentTarget: space }) {
    if (space.dataset.occupancy === "occupied") {
      this.lastReadingTarget.textContent = `Space ${space.dataset.spaceNumber} is occupied and can't be held.`
      return
    }
    space.dataset.occupancy = space.dataset.occupancy === "held" ? "open" : "held"
    this.render()
  }

  toggleClosed() {
    this.element.dataset.levelClosed = String(!this.isClosed)
    this.render()
  }

  render() {
    for (const space of this.spaceTargets) {
      const kindLabel = space.dataset.spaceKind === "standard" ? "" : ` (${space.dataset.spaceKind})`
      space.setAttribute("aria-label", `Space ${space.dataset.spaceNumber}${kindLabel}, ${space.dataset.occupancy}`)
    }
    this.openCountTarget.textContent = this.isClosed
      ? "Closed"
      : `${this.openSpaceCount} of ${this.spaceTargets.length} open`
    this.closeButtonTarget.textContent = this.isClosed ? "Reopen level" : "Close level"
    this.garageOverview?.refresh()
  }

  get garageOverview() {
    return this.application.controllers.find((controller) => controller.identifier === "garage-overview")
  }

  get levelName() {
    return this.levelNameTarget.textContent.trim()
  }

  get isClosed() {
    return this.element.dataset.levelClosed === "true"
  }

  get sensorSpaceNumbers() {
    return this.spaceTargets.map((space) => space.dataset.spaceNumber)
  }

  get openSpaceCount() {
    return this.countOpenSpaces(() => true)
  }

  get accessibleOpenCount() {
    return this.countOpenSpaces((space) => space.dataset.spaceKind === "accessible")
  }

  get evChargerOpenCount() {
    return this.countOpenSpaces((space) => space.dataset.spaceKind === "EV charger")
  }

  countOpenSpaces(matchesKind) {
    if (this.isClosed) return 0
    return this.spaceTargets.filter((space) => space.dataset.occupancy === "open" && matchesKind(space)).length
  }
}
