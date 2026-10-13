/*
 * listening_post_controller.js — registered as "listening-post"
 *
 * Teaches: one frequency can be a station and a beacon. The callbacks
 * run in token order, and each name has its own list. Adding or
 * removing the trailing beacon token notifies only the beacon
 * callbacks. Rewriting the chalk so the first token differs notifies
 * every token from that index, including a station name that is still
 * on the card.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["station", "beacon", "tape", "counts"]

  initialize() {
    this.stationNames = []
    this.beaconNames = []
    this.lines = []
  }

  connect() {
    this.note("post open")
    this.render()
  }

  stationTargetConnected(frequency) {
    this.stationNames.push(frequency.dataset.frequencyName)
    this.note(`station connected: ${frequency.dataset.frequencyName}`)
    this.render()
  }

  stationTargetDisconnected(frequency) {
    this.stationNames = this.stationNames.filter((name) => name !== frequency.dataset.frequencyName)
    this.note(`station disconnected: ${frequency.dataset.frequencyName}`)
    this.render()
  }

  beaconTargetConnected(frequency) {
    this.beaconNames.push(frequency.dataset.frequencyName)
    this.note(`beacon connected: ${frequency.dataset.frequencyName}`)
    this.render()
  }

  beaconTargetDisconnected(frequency) {
    this.beaconNames = this.beaconNames.filter((name) => name !== frequency.dataset.frequencyName)
    this.note(`beacon disconnected: ${frequency.dataset.frequencyName}`)
    this.render()
  }

  markBeacon(event) {
    const frequency = event.currentTarget.closest("[data-frequency-name]")
    const tokens = frequency.getAttribute("data-listening-post-target").split(/\s+/)
    if (tokens.includes("beacon")) return
    frequency.setAttribute("data-listening-post-target", `${tokens.join(" ")} beacon`)
  }

  clearTrailingBeacon(event) {
    const frequency = event.currentTarget.closest("[data-frequency-name]")
    const tokens = frequency.getAttribute("data-listening-post-target").split(/\s+/)
    if (tokens.at(-1) !== "beacon") return
    frequency.setAttribute("data-listening-post-target", tokens.slice(0, -1).join(" "))
  }

  swapChalk(event) {
    const frequency = event.currentTarget.closest("[data-frequency-name]")
    const tokens = frequency.getAttribute("data-listening-post-target").split(/\s+/)
    frequency.setAttribute("data-listening-post-target", tokens.reverse().join(" "))
  }

  render() {
    const stations = this.stationNames.join(", ") || "none"
    const beacons = this.beaconNames.join(", ") || "none"
    this.countsTarget.textContent = `Stations: ${stations}. Beacons: ${beacons}.`
  }

  note(line) {
    this.lines.push(line)
    if (this.hasTapeTarget) this.tapeTarget.textContent = this.lines.join("\n")
  }
}
