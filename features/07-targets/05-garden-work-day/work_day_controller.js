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

export default class extends Controller {
  static targets = ["plot", "roster", "status", "callbackLog", "plotName"]

  initialize() {
    this.plotsSeenAtConnect = []
    this.callbackNotes = []
  }

  connect() {
    this.plotsSeenAtConnect = this.plotTargets.map((plot) => plot.dataset.plotName)
    const names = this.plotsSeenAtConnect.join(", ")
    this.statusTarget.textContent = `Live plots: ${names}. Snapshot from connect: ${names}.`
  }

  plotTargetConnected(plot) {
    this.callbackNotes.push(plot.dataset.plotName)
    this.callbackLogTarget.textContent = `Callbacks so far: ${this.callbackNotes.join(", ")}.`
  }

  addPlot() {
    const plotName = this.plotNameTarget.value.trim()
    if (!plotName) return
    const plot = document.createElement("li")
    plot.dataset.plotName = plotName
    plot.textContent = plotName
    plot.setAttribute("data-work-day-target", "plot")
    this.rosterTarget.append(plot)
    const live = this.plotTargets.map((listed) => listed.dataset.plotName)
    const callbackAlready = this.callbackNotes.includes(plotName) ? "yes" : "no"
    this.statusTarget.textContent = `Live plots: ${live.join(", ")}. Snapshot from connect: ${this.plotsSeenAtConnect.join(", ")}. Callback had run for ${plotName}: ${callbackAlready}.`
  }

  sendHome(event) {
    const plotName = event.currentTarget.dataset.plotName
    const plot = this.plotTargets.find((listed) => listed.dataset.plotName === plotName)
    if (plot) plot.remove()
    const live = this.plotTargets.map((listed) => listed.dataset.plotName)
    this.statusTarget.textContent = `Live plots: ${live.join(", ")}. Snapshot from connect: ${this.plotsSeenAtConnect.join(", ")}.`
  }
}
