/*
 * mending_card_controller.js — registered as "mending-card"
 *
 * Teaches: on the way in, present values run in attribute order, then
 * absent values run in static values order. The mesh target is already
 * readable inside the value callback, before meshTargetConnected, and
 * that is before connect(). Assigning inside connect() does not run
 * the callback until after connect() has returned.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["mesh", "log"]
  static values = { twine: String, meshSize: Number, needleCount: Number }

  initialize() {
    this.record("initialize.")
  }

  needleCountValueChanged(needleCount, previousCount) {
    const meshText = this.hasMeshTarget ? this.meshTarget.textContent.trim() : "no mesh target"
    this.record(`Needles ${needleCount}, previous ${shown(previousCount)}. Mesh target says "${meshText}".`)
  }

  meshSizeValueChanged(meshSize, previousSize) {
    this.record(`Mesh ${meshSize}, previous ${shown(previousSize)}.`)
  }

  twineValueChanged(twine, previousTwine) {
    this.record(`Twine ${shown(twine)}, previous ${shown(previousTwine)}.`)
  }

  meshTargetConnected(mesh) {
    this.record(`meshTargetConnected, text "${mesh.textContent.trim()}".`)
  }

  connect() {
    this.record("connect assigned the next needle.")
    this.needleCountValue = this.needleCountValue + 1
    this.record("connect returned.")
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
