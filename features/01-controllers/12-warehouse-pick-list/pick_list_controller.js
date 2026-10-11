/*
 * pick_list_controller.js — registered as "pick-list"
 *
 * Teaches: the hub of a composed page. It shares its element with
 * barcode-scanner, contains one pick-line instance per order line, and
 * contains the tote, which is both a pick-list target and its own "tote"
 * controller. It enforces the warehouse rules (scan the bin, then the
 * item) by asking line instances about themselves rather than reading
 * their markup.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["line", "tote", "progress", "completion"]
  static values = { orderNumber: String, packStation: String }

  connect() {
    this.render()
  }

  recordScan(barcode) {
    const lines = this.lineControllers
    const lineAtBin = lines.find((line) => line.binCode === barcode)
    if (lineAtBin) return this.confirmLocation(lineAtBin)

    const linesForItem = lines.filter((line) => line.upc === barcode)
    if (linesForItem.length === 0) {
      return { outcome: "rejected", message: `not on order ${this.orderNumberValue}. Return it to the shelf.` }
    }

    const activeLine = this.activeLine
    if (!activeLine || !linesForItem.includes(activeLine)) {
      const binToScan = linesForItem.find((line) => !line.isResolved)?.binCode
      return binToScan
        ? { outcome: "rejected", message: `scan bin ${binToScan} first to confirm the location.` }
        : { outcome: "rejected", message: "every unit on this line is already picked." }
    }

    activeLine.recordPick()
    this.tote?.addItem(activeLine.unitWeightGrams)
    const message = activeLine.isComplete
      ? `line complete (${activeLine.quantityValue} of ${activeLine.quantityValue}).`
      : `picked ${activeLine.pickedQuantity} of ${activeLine.quantityValue}.`
    if (activeLine.isComplete) activeLine.deactivate()
    this.render()
    return { outcome: "accepted", message }
  }

  confirmLocation(lineAtBin) {
    if (lineAtBin.isResolved) {
      return { outcome: "rejected", message: "nothing left to pick from this bin." }
    }
    for (const line of this.lineControllers) line.deactivate()
    lineAtBin.activate()
    return { outcome: "location", message: `location confirmed. Scan ${lineAtBin.description}.` }
  }

  lineChanged() {
    this.render()
  }

  render() {
    const lines = this.lineControllers
    const pickedUnits = lines.reduce((runningTotal, line) => runningTotal + line.pickedQuantity, 0)
    const orderedUnits = lines.reduce((runningTotal, line) => runningTotal + line.quantityValue, 0)
    const shortLineCount = lines.filter((line) => line.isShort).length

    const shortNote = shortLineCount === 0 ? "" : ` · ${shortLineCount} short`
    this.progressTarget.textContent = `${pickedUnits} of ${orderedUnits} units picked${shortNote}`

    const isFinished = lines.length > 0 && lines.every((line) => line.isResolved)
    this.completionTarget.hidden = !isFinished
    this.completionTarget.textContent = shortLineCount === 0
      ? `Pick complete. Take the tote to pack station ${this.packStationValue}.`
      : `Pick finished with ${shortLineCount} short ${shortLineCount === 1 ? "line" : "lines"}. Take the tote to pack station ${this.packStationValue} and flag the order for inventory.`
  }

  get activeLine() {
    return this.lineControllers.find((line) => line.isActive) ?? null
  }

  // Lines connect after this controller, so the first render sees none of
  // them; each line calls lineChanged() when it connects.
  get lineControllers() {
    return this.lineTargets
      .map((lineElement) => this.application.getControllerForElementAndIdentifier(lineElement, "pick-line"))
      .filter((line) => line !== null)
  }

  get tote() {
    return this.hasToteTarget ? this.application.getControllerForElementAndIdentifier(this.toteTarget, "tote") : null
  }
}
