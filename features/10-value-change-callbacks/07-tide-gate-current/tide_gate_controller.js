/*
 * tide_gate_controller.js — registered as "tide-gate"
 *
 * Teaches: stageValueChanged writes currentValue when the stage calls
 * for a different current. The getter is already the new current
 * before the stage callback returns. currentValueChanged runs after
 * that return. On the gate whose current attribute comes later in the
 * tag, the stage callback overwrites that current before its first
 * callback, and the chalked current never appears.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["log"]
  static values = { place: String, stage: String, current: String }

  stageValueChanged(stage, previous) {
    if (stage === "ebb" && this.currentValue !== "south") this.currentValue = "south"
    if (stage === "flood" && this.currentValue !== "north") this.currentValue = "north"
    this.record(`${this.placeValue} stage ${shown(stage)}, previous ${shown(previous)}. Current getter ${shown(this.currentValue)}.`)
    this.record(`${this.placeValue} stage callback returned.`)
  }

  currentValueChanged(current, previous) {
    this.record(`${this.placeValue} current ${shown(current)}, previous ${shown(previous)}.`)
  }

  startEbb() {
    this.stageValue = "ebb"
  }

  record(line) {
    const item = document.createElement("li")
    item.textContent = line
    this.logTarget.append(item)
  }
}

function shown(value) {
  return value === undefined ? "undefined" : JSON.stringify(value)
}
