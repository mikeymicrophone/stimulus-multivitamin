/*
 * hive_stack_controller.js — registered as "hive-stack"
 *
 * Teaches: frames uses { type: Array, default: ["brood", "honey"] }.
 * Every hive that has not written the attribute shares that one array.
 * Pushing pollen onto the Langstroth changes the Warre's next read,
 * and neither attribute appears. Assigning a copy writes JSON onto
 * this hive only. The other hive keeps the mutated default.
 */
import { Controller } from "@hotwired/stimulus"
import { report, rawAttribute, textOf } from "../../../assets/readout.js"

export default class extends Controller {
  static targets = ["hiveName", "reading"]
  static values = {
    frames: { type: Array, default: ["brood", "honey"] }
  }

  connect() {
    this.render("Opened the hive.")
  }

  dropPollenFrame() {
    this.framesValue.push("pollen")
    this.render("Dropped a pollen frame in memory.")
  }

  writeStack() {
    this.framesValue = [...this.framesValue]
    this.render("Wrote the stack onto the hive.")
  }

  readStack() {
    this.render("Read the stack again.")
  }

  render(note) {
    report(
      this.readingTarget,
      `${textOf(this.hiveNameTarget)} frames ${this.framesValue.join(", ")}.`,
      `hasFramesValue ${this.hasFramesValue}.`,
      `Attribute ${rawAttribute(this, "frames")}.`,
      note
    )
  }
}
