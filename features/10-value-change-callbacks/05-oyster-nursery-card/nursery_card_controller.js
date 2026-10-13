/*
 * nursery_card_controller.js — registered as "nursery-card"
 *
 * Teaches: a changed callback runs for String, Number, Boolean, Array,
 * and Object. The array and the object handed to the callback are new
 * parses. Pushing cultch on the returned trays, or scribbling the bay
 * on the returned reading, does not run the callback. Assigning a new
 * array or a new object does. Filing the same JSON does not. Rewriting
 * lot 08 runs the callback with (8, 8). Filing a list into the
 * reading throws before the method. The next bay throws again, because
 * that previous text is still the list. The bay after that paints.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["summary", "log"]
  static values = {
    variety: String,
    salinity: Number,
    circulating: Boolean,
    trays: Array,
    reading: Object,
    lot: Number
  }

  varietyValueChanged(variety, previous) {
    this.record(`Variety ${shown(variety)}, previous ${shown(previous)}.`)
    this.paint()
  }

  salinityValueChanged(salinity, previous) {
    this.record(`Salinity ${shown(salinity)}, previous ${shown(previous)}.`)
    this.paint()
  }

  circulatingValueChanged(circulating, previous) {
    this.record(`Circulating ${shown(circulating)}, previous ${shown(previous)}.`)
    this.paint()
  }

  traysValueChanged(trays, previous) {
    const sameList = trays === previous
    this.record(`Trays ${JSON.stringify(trays)}, previous ${JSON.stringify(previous)}. Same list ${sameList}.`)
    this.paint()
  }

  readingValueChanged(reading, previous) {
    const sameNote = reading === previous
    this.record(`Reading ${JSON.stringify(reading)}, previous ${JSON.stringify(previous)}. Same note ${sameNote}.`)
    this.paint()
  }

  lotValueChanged(lot, previous) {
    this.record(`Lot ${shown(lot)}, previous ${shown(previous)}.`)
    this.paint()
  }

  dropCultch() {
    const trays = this.traysValue
    trays.push("cultch")
    this.record(`Pushed cultch. Returned list ${trays.join(", ")}. Card reads ${this.traysValue.join(", ")}.`)
  }

  writeTrays() {
    this.traysValue = this.traysValue.concat(["cultch"])
  }

  scribbleBay() {
    const reading = this.readingValue
    reading.bay = "B"
    this.record(`Scribbled bay ${reading.bay}. Card still reads ${this.readingValue.bay}.`)
  }

  fileSameReading() {
    const reading = this.readingValue
    this.readingValue = { depth_cm: reading.depth_cm, bay: reading.bay }
    this.record("Filed the same reading.")
  }

  fileBay() {
    this.readingValue = { depth_cm: 12, bay: "B" }
    this.record("Filed bay B.")
  }

  fileDeepBay() {
    this.readingValue = { depth_cm: 14, bay: "C" }
    this.record("Filed bay C.")
  }

  fileListAsReading() {
    this.element.setAttribute("data-nursery-card-reading-value", '["bay"]')
    this.record("Filed a list into the reading.")
  }

  rewriteLot() {
    this.lotValue = this.lotValue
    this.record("Rewrote the lot.")
  }

  paint() {
    const reading = this.readingValue
    this.summaryTarget.textContent = [
      this.varietyValue,
      `salinity ${this.salinityValue}`,
      `circulating ${this.circulatingValue}`,
      `trays ${this.traysValue.join(", ")}`,
      `bay ${reading.bay}`,
      `lot ${this.lotValue}`
    ].join(", ") + "."
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function shown(value) {
  if (value === undefined) return "undefined"
  return JSON.stringify(value)
}
