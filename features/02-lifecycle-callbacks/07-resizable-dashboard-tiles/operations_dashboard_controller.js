/*
 * operations_dashboard_controller.js — registered as "operations-dashboard"
 *
 * Teaches: three ways a tile's size changes, and which ones reconnect it.
 * Moving a tile between the main area and the sidebar moves its element,
 * so its dashboard-tile instance disconnects and reconnects. Toggling "Span
 * two columns" only changes a class, so nothing reconnects, but the tile's
 * ResizeObserver still reports the new width. Hiding a tile detaches it and
 * keeps the element; showing it again reconnects the same instance, with
 * its selected series intact.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mainColumn", "sidebarColumn", "tile", "hiddenTray", "hiddenTileTemplate"]

  initialize() {
    this.hiddenTiles = new Map()
  }

  connect() {
    for (const tile of this.tileTargets) this.renderTileControls(tile)
  }

  moveTile(event) {
    const tile = this.tileFor(event)
    const destination = this.sidebarColumnTarget.contains(tile) ? this.mainColumnTarget : this.sidebarColumnTarget
    tile.classList.remove("spans-two-columns")
    destination.append(tile)
    this.renderTileControls(tile)
  }

  toggleSpan(event) {
    const tile = this.tileFor(event)
    tile.classList.toggle("spans-two-columns")
    this.renderTileControls(tile)
  }

  hideTile(event) {
    const tile = this.tileFor(event)
    const hiddenEntry = this.hiddenTileTemplateTarget.content.firstElementChild.cloneNode(true)
    hiddenEntry.querySelector("button").textContent = `Show ${tile.querySelector("h3").textContent}`
    hiddenEntry.querySelector("button").dataset.operationsDashboardTileIdParam = tile.id
    this.hiddenTiles.set(tile.id, { tile, column: tile.parentElement })
    this.hiddenTrayTarget.append(hiddenEntry)
    tile.remove()
  }

  showTile({ params: { tileId }, currentTarget: showButton }) {
    const { tile, column } = this.hiddenTiles.get(tileId)
    this.hiddenTiles.delete(tileId)
    column.append(tile)
    showButton.closest("li").remove()
  }

  renderTileControls(tile) {
    const inSidebar = this.sidebarColumnTarget.contains(tile)
    tile.querySelector('[data-action~="operations-dashboard#moveTile"]').textContent = inSidebar ? "Move to main area" : "Move to sidebar"
    const spanButton = tile.querySelector('[data-action~="operations-dashboard#toggleSpan"]')
    spanButton.hidden = inSidebar
    spanButton.setAttribute("aria-pressed", String(tile.classList.contains("spans-two-columns")))
  }

  tileFor(event) {
    return event.target.closest('[data-operations-dashboard-target="tile"]')
  }
}
