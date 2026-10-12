/*
 * dashboard_tile_controller.js — registered as "dashboard-tile"
 *
 * Teaches: a ResizeObserver tied to the lifecycle. The observer is created
 * once in initialize(), connect() observes this tile, and disconnect() stops
 * observing. observe() always reports the current size right away, so
 * connect() doesn't measure anything itself, and a tile moved to another
 * column gets its new size on reconnect. The tile picks a compact, standard,
 * or wide layout from its own width, whatever changed it: a move, a span
 * toggle, or a drag of the resize handle.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["headline", "sparkline", "seriesPicker", "layoutNote"]
  static values = {
    series: Object,
    unit: String,
    compactBelow: { type: Number, default: 300 },
    wideFrom: { type: Number, default: 520 },
    daysByLayout: { type: Object, default: { compact: 0, standard: 7, wide: 30 } },
  }

  initialize() {
    this.tileObserver = new ResizeObserver(([entry]) => this.tileResized(entry.contentBoxSize[0].inlineSize))
    this.selectedSeriesName = Object.keys(this.seriesValue)[0]
    this.layout = null
    this.buildSeriesPicker()
  }

  connect() {
    this.tileObserver.observe(this.element)
  }

  disconnect() {
    this.tileObserver.disconnect()
  }

  tileResized(tileWidth) {
    const layout = tileWidth < this.compactBelowValue ? "compact" : tileWidth < this.wideFromValue ? "standard" : "wide"
    this.layoutNoteTarget.textContent = `${layout[0].toUpperCase()}${layout.slice(1)} layout · ${Math.round(tileWidth)} px`
    if (layout === this.layout) return
    this.layout = layout
    this.element.dataset.tileLayout = layout
    this.render()
  }

  selectSeries({ params: { seriesName } }) {
    this.selectedSeriesName = seriesName
    this.render()
  }

  render() {
    const readings = this.seriesValue[this.selectedSeriesName]
    this.headlineTarget.textContent = `${readings.at(-1).toLocaleString("en-US")} ${this.unitValue}`
    for (const button of this.seriesPickerTarget.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.dashboardTileSeriesNameParam === this.selectedSeriesName))
    }
    const daysShown = this.daysByLayoutValue[this.layout]
    this.drawSparkline(daysShown > 0 ? readings.slice(-daysShown) : [])
  }

  drawSparkline(readings) {
    this.sparklineTarget.hidden = readings.length < 2
    if (readings.length < 2) return
    const lowest = Math.min(...readings)
    const highest = Math.max(...readings)
    const span = highest - lowest || 1
    const points = readings.map((reading, day) => `${day},${(100 - ((reading - lowest) / span) * 100).toFixed(1)}`).join(" ")
    const chart = this.sparklineTarget.querySelector("svg")
    chart.setAttribute("viewBox", `0 -4 ${readings.length - 1} 108`)
    chart.querySelector("polyline").setAttribute("points", points)
    chart.querySelector("title").textContent =
      `Last ${readings.length} days: low ${lowest.toLocaleString("en-US")}, high ${highest.toLocaleString("en-US")} ${this.unitValue}`
  }

  buildSeriesPicker() {
    const seriesNames = Object.keys(this.seriesValue)
    this.seriesPickerTarget.hidden = seriesNames.length < 2
    this.seriesPickerTarget.replaceChildren(...seriesNames.map((seriesName) => {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "quiet"
      button.textContent = seriesName
      button.dataset.action = "dashboard-tile#selectSeries"
      button.dataset.dashboardTileSeriesNameParam = seriesName
      return button
    }))
  }
}
