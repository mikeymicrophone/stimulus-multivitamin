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
import { report, rawAttribute, textOf } from "../../../assets/readout.js"

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
    this.sounding = true
  }

  silenceHorn() {
    this.sounding = false
  }

  get sounding() {
    return this.soundingValue
  }

  set sounding(on) {
    this.soundingValue = on
    this.render()
  }

  render() {
    // Quoted, because "", "00", and "false " are the whole lesson.
    const quoted = { quoted: true }
    report(
      this.readingTarget,
      `${textOf(this.hornNameTarget)} sounding ${this.soundingValue}.`,
      `Sounding attribute ${rawAttribute(this, "sounding", "value", quoted)}.`,
      `hasSoundingValue ${this.hasSoundingValue}.`,
      `Manned ${this.mannedValue}.`,
      `Manned attribute ${rawAttribute(this, "manned", "value", quoted)}.`,
      `hasMannedValue ${this.hasMannedValue}.`
    )
  }
}
