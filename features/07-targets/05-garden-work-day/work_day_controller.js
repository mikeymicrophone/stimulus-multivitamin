/*
 * work_day_controller.js — registered as "work-day"
 *
 * Teaches: plotTargets queries the document when it is read. A plot
 * appended in this turn is already in the list; a plot removed in this
 * turn is already gone. The array saved in connect() is a snapshot and
 * goes stale. Each read is a new array. plotTargetConnected runs from
 * the mutation observer after addPlot has written its status, so the
 * status can truthfully say the callback had not run yet. Feature 08
 * is the place for callback-driven behavior; this roster only records
 * the order.
 */
import { Controller } from "@hotwired/stimulus"
import { report } from "../../../assets/readout.js"

export default class extends Controller {
  static targets = ["plot", "roster", "status", "callbackLog", "plotName"]

  // Class fields exist before Stimulus calls any callback, so
  // plotTargetConnected can push before connect() has run.
  #snapshotAtConnect = []
  #callbackNames = []

  connect() {
    this.#snapshotAtConnect = this.livePlotNames
    this.#writeStatus()
  }

  get livePlotNames() {
    return this.plotTargets.map(({ dataset }) => dataset.plotName)
  }

  plotTargetConnected({ dataset: { plotName } }) {
    this.#callbackNames.push(plotName)
    this.callbackLogTarget.textContent = `Callbacks so far: ${this.#callbackNames.join(", ")}.`
  }

  addPlot() {
    const plotName = this.plotNameTarget.value.trim()
    if (!plotName) return
    const plot = Object.assign(document.createElement("li"), { textContent: plotName })
    plot.dataset.plotName = plotName
    plot.dataset.workDayTarget = "plot"
    this.rosterTarget.append(plot)
    const callbackAlready = this.#callbackNames.includes(plotName) ? "yes" : "no"
    this.#writeStatus(`Callback had run for ${plotName}: ${callbackAlready}.`)
  }

  sendHome({ currentTarget: { dataset: { plotName } } }) {
    this.plotTargets.find((plot) => plot.dataset.plotName === plotName)?.remove()
    this.#writeStatus()
  }

  #writeStatus(...notes) {
    report(
      this.statusTarget,
      `Live plots: ${this.livePlotNames.join(", ")}.`,
      `Snapshot from connect: ${this.#snapshotAtConnect.join(", ")}.`,
      notes
    )
  }
}
