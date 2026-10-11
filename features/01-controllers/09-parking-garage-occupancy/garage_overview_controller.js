/*
 * garage_overview_controller.js — registered as "garage-overview"
 *
 * Teaches: reaching controllers that are not nested inside you. The entrance
 * sign is a sibling of the levels, not their parent, so it can't use
 * targets or closest(). It asks the application instead:
 * this.application.controllers lists every connected controller instance on
 * the page, and filtering by identifier gives the parking levels.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["totalOpen", "fullNotice", "accessibleOpen", "evChargerOpen", "levelList"]

  connect() {
    this.refresh()
  }

  refresh() {
    const levels = this.parkingLevels
    const totalOpen = levels.reduce((runningTotal, level) => runningTotal + level.openSpaceCount, 0)
    const accessibleOpen = levels.reduce((runningTotal, level) => runningTotal + level.accessibleOpenCount, 0)
    const evChargerOpen = levels.reduce((runningTotal, level) => runningTotal + level.evChargerOpenCount, 0)

    this.totalOpenTarget.textContent = String(totalOpen)
    this.accessibleOpenTarget.textContent = String(accessibleOpen)
    this.evChargerOpenTarget.textContent = String(evChargerOpen)
    this.fullNoticeTarget.hidden = levels.length === 0 || totalOpen > 0
    this.element.dataset.garageFull = String(levels.length > 0 && totalOpen === 0)

    this.levelListTarget.replaceChildren(
      ...levels.map((level) => {
        const levelRow = document.createElement("li")
        levelRow.textContent = level.isClosed ? `${level.levelName}: closed` : `${level.levelName}: ${level.openSpaceCount} open`
        return levelRow
      })
    )
  }

  // application.controllers is in connection order; the sign lists levels
  // in page order, top of the ramp first.
  get parkingLevels() {
    return this.application.controllers
      .filter((controller) => controller.identifier === "parking-level")
      .sort((first, second) =>
        first.element.compareDocumentPosition(second.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
  }
}
