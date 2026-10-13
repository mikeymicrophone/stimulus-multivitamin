/*
 * hydrophone_controller.js — registered as "hydrophone"
 *
 * Teaches: bearingValueChanged updates the bearing readout immediately
 * and debounces the band plot. Three assignments in one swing still
 * produce one plot, after the quiet gap. disconnect() clears the timer.
 */
import { Controller } from "@hotwired/stimulus"

const plotDelayMs = 250

export default class extends Controller {
  static targets = ["bearing", "plot"]
  static values = { bearing: Number }

  initialize() {
    this.plotTimer = null
    this.plotCount = 0
  }

  bearingValueChanged(bearing) {
    this.bearingTarget.textContent = `${bearing}°`
    clearTimeout(this.plotTimer)
    this.plotTimer = setTimeout(() => this.plotBands(bearing), plotDelayMs)
  }

  swing() {
    this.bearingValue = this.bearingValue + 15
    this.bearingValue = this.bearingValue + 15
    this.bearingValue = this.bearingValue + 15
  }

  disconnect() {
    clearTimeout(this.plotTimer)
  }

  plotBands(bearing) {
    this.plotCount += 1
    const bands = [0, 1, 2, 3].map((band) => {
      const degrees = (bearing + band * 40) * Math.PI / 180
      return Math.round(Math.abs(Math.sin(degrees)) * 100)
    })
    this.plotTarget.textContent = `Plot ${this.plotCount}: ${bands.join(", ")}`
  }
}
