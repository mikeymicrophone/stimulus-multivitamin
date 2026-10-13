/*
 * late_slate_controller.js — registered as "late-slate"
 *
 * Teaches: the callbacks store this card's markup before connect().
 * connect() then reads that key and reports the markup, not the watch
 * that was stored before the page opened.
 */
import { Controller } from "@hotwired/stimulus"

const storageKey = "point-no-point-late-slate"

export default class extends Controller {
  static targets = ["summary", "log"]
  static values = { station: String, soundOn: Boolean, bearing: Number }

  stationValueChanged() {
    this.storeMarkup()
  }

  soundOnValueChanged() {
    this.storeMarkup()
  }

  bearingValueChanged() {
    this.storeMarkup()
  }

  connect() {
    const stored = readStore()
    if (!stored) {
      this.summaryTarget.textContent = "Restored in connect: nothing stored."
      return
    }
    const sound = stored.soundOn ? "on" : "off"
    this.summaryTarget.textContent = `Restored in connect: ${stored.station}, sound ${sound}, bearing ${stored.bearing}.`
  }

  storeMarkup() {
    const payload = {
      station: this.stationValue,
      soundOn: this.soundOnValue,
      bearing: this.bearingValue
    }
    const text = JSON.stringify(payload)
    if (this.lastStored === text) return
    this.lastStored = text
    localStorage.setItem(storageKey, text)
    const sound = payload.soundOn ? "on" : "off"
    this.record(`Stored ${payload.station}, sound ${sound}, bearing ${payload.bearing}.`)
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
