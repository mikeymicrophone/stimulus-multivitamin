/*
 * inlet_board_controller.js — registered as "inlet-board"
 *
 * Teaches: one board derives its stream, horn, watch list, sounding
 * note, pilot call, query string, and mute flag from value callbacks.
 * initialize() restores the station from the query and the mute flag
 * from localStorage before those callbacks run. The stream is written
 * only when it would change. Pushing a watch on the returned array
 * does not run watchesValueChanged. Assigning a new array does.
 * Removing the height falls back to 0 and the stream follows.
 */
import { Controller } from "@hotwired/stimulus"
import { correctHeight } from "./noaa_correction.js"

const stationNames = {
  "bush-point": "Bush Point",
  "marrowstone": "Marrowstone",
  "nodule-point": "Nodule Point"
}
const storageKey = "admiralty-inlet-muted"
const turnFeet = 6
const pilotDelayMs = 200

export default class extends Controller {
  static targets = ["station", "stationSelect", "staff", "stream", "horn", "watches", "note", "pilotCall", "heightLog", "scribble"]
  static values = {
    station: String,
    height: Number,
    sounding: Boolean,
    watches: Array,
    reading: Object,
    stream: String,
    muted: Boolean
  }

  initialize() {
    this.pilotTimer = null
    this.pilotCalls = 0
    const params = new URLSearchParams(location.search)
    const station = params.get("station")
    if (station) this.stationValue = station
    const muted = localStorage.getItem(storageKey)
    if (muted === "true" || muted === "false") this.mutedValue = muted === "true"
  }

  disconnect() {
    clearTimeout(this.pilotTimer)
  }

  stationValueChanged(station) {
    this.stationTarget.textContent = stationNames[station] || station
    if (this.hasStationSelectTarget) this.stationSelectTarget.value = station
    this.writeStation()
  }

  heightValueChanged(height, previous) {
    this.staffTarget.textContent = `${height} ft`
    this.staffTarget.style.height = `${Math.min(96, height * 8)}px`
    this.record(`Height ${height}, previous ${shown(previous)}.`)
    const stream = height >= turnFeet ? "flood" : "ebb"
    if (this.streamValue !== stream) this.streamValue = stream
    this.schedulePilot(height)
  }

  streamValueChanged(stream) {
    this.streamTarget.textContent = stream === "flood" ? "Stream flood." : stream === "ebb" ? "Stream ebb." : "Stream unset."
  }

  soundingValueChanged(sounding) {
    this.hornTarget.textContent = sounding ? "Horn sounding." : "Horn quiet."
  }

  watchesValueChanged(watches) {
    this.watchesTarget.textContent = watches.length ? watches.join(", ") : "No watch chalked."
  }

  readingValueChanged(reading) {
    const depth = Object.prototype.hasOwnProperty.call(reading, "depth_ft") ? reading.depth_ft : "absent"
    const bottom = Object.prototype.hasOwnProperty.call(reading, "bottom") ? reading.bottom : "absent"
    this.noteTarget.textContent = `depth_ft ${depth}, bottom ${bottom}.`
  }

  mutedValueChanged(muted) {
    localStorage.setItem(storageKey, String(muted))
    this.element.classList.toggle("calls-held", muted)
  }

  chooseStation(event) {
    this.stationValue = event.target.value
  }

  raiseStaff() {
    this.heightValue = this.heightValue + 1
  }

  applyNoaa() {
    correctHeight(this.element, 9)
  }

  clearHeight() {
    this.heightValue = undefined
  }

  toggleHorn() {
    this.soundingValue = !this.soundingValue
  }

  pushMiddle() {
    const watches = this.watchesValue
    watches.push("middle")
    this.scribbleTarget.textContent = `Pushed middle. Returned ${watches.join(", ")}. Board reads ${this.watchesValue.join(", ")}.`
  }

  writeMiddle() {
    this.watchesValue = this.watchesValue.concat(["middle"])
  }

  toggleMute() {
    this.mutedValue = !this.mutedValue
  }

  schedulePilot(height) {
    clearTimeout(this.pilotTimer)
    this.pilotTimer = setTimeout(() => {
      this.pilotCalls += 1
      const held = this.mutedValue ? "held" : "placed"
      this.pilotCallTarget.textContent = `Call ${this.pilotCalls} ${held} at ${height} ft.`
    }, pilotDelayMs)
  }

  writeStation() {
    const params = new URLSearchParams(location.search)
    if (params.get("station") === this.stationValue) return
    params.set("station", this.stationValue)
    history.replaceState(history.state, "", `${location.pathname}?${params}${location.hash}`)
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.heightLogTarget.append(item)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
