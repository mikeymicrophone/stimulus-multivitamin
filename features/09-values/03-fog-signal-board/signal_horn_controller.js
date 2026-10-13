/*
 * signal_horn_controller.js — registered as "signal-horn"
 *
 * Teaches: sounding and manned are Booleans. "false", "FALSE", and
 * "0" read as false. An empty attribute, "00", "no", and "false "
 * read as true. A missing attribute is the default false, and
 * hasSoundingValue is false only in that case. Assigning false writes
 * the attribute "false".
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["hornName", "reading"]
  static values = {
    sounding: Boolean,
    manned: Boolean
  }

  connect() {
    this.render()
  }

  soundHorn() {
    this.soundingValue = true
    this.render()
  }

  silenceHorn() {
    this.soundingValue = false
    this.render()
  }

  render() {
    const soundingAttribute = this.element.getAttribute("data-signal-horn-sounding-value")
    const mannedAttribute = this.element.getAttribute("data-signal-horn-manned-value")
    const hornName = this.hornNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${hornName} sounding ${this.soundingValue}.`,
      `Sounding attribute ${soundingAttribute === null ? "absent" : JSON.stringify(soundingAttribute)}.`,
      `hasSoundingValue ${this.hasSoundingValue}.`,
      `Manned ${this.mannedValue}.`,
      `Manned attribute ${mannedAttribute === null ? "absent" : JSON.stringify(mannedAttribute)}.`,
      `hasMannedValue ${this.hasMannedValue}.`
    ].join(" ")
  }
}
