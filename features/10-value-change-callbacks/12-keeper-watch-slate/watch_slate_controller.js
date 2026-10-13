/*
 * watch_slate_controller.js — registered as "watch-slate"
 *
 * Teaches: initialize() reads localStorage and writes the values before
 * the observer starts. The callbacks store the slate. Forgetting clears
 * the key and drops the attributes, and the callbacks do not write the
 * defaults back over the empty key.
 */
import { Controller } from "@hotwired/stimulus"

const storageKey = "point-no-point-slate"

export default class extends Controller {
  static targets = ["summary", "log"]
  static values = { station: String, soundOn: Boolean, bearing: Number }

  initialize() {
    this.persist = true
    const stored = readStore()
    if (!stored) return
    if (typeof stored.station === "string") this.stationValue = stored.station
    if (typeof stored.soundOn === "boolean") this.soundOnValue = stored.soundOn
    if (typeof stored.bearing === "number") this.bearingValue = stored.bearing
  }

  stationValueChanged() {
    this.paint()
    this.store()
  }

  soundOnValueChanged() {
    this.paint()
    this.store()
  }

  bearingValueChanged(bearing, previous) {
    this.record(`Bearing ${bearing}, previous ${shown(previous)}.`)
    this.paint()
    this.store()
  }

  aimSouth() {
    this.bearingValue = 180
  }

  soundBell() {
    this.soundOnValue = true
  }

  forgetWatch() {
    this.persist = false
    localStorage.removeItem(storageKey)
    this.stationValue = undefined
    this.soundOnValue = undefined
    this.bearingValue = undefined
    this.record("Forgot the watch.")
  }

  paint() {
    const station = this.stationValue || "blank"
    const sound = this.soundOnValue ? "on" : "off"
    this.summaryTarget.textContent = `${station}, sound ${sound}, bearing ${this.bearingValue}.`
  }

  store() {
    if (!this.persist) return
    localStorage.setItem(storageKey, JSON.stringify({
      station: this.stationValue,
      soundOn: this.soundOnValue,
      bearing: this.bearingValue
    }))
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function readStore() {
  const text = localStorage.getItem(storageKey)
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
