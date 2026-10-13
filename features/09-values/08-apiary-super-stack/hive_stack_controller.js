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
    this.framesValue = this.framesValue.slice()
    this.render("Wrote the stack onto the hive.")
  }

  readStack() {
    this.render("Read the stack again.")
  }

  render(note) {
    const attribute = this.element.getAttribute("data-hive-stack-frames-value")
    const hiveName = this.hiveNameTarget.textContent.trim()
    this.readingTarget.textContent = [
      `${hiveName} frames ${this.framesValue.join(", ")}.`,
      `hasFramesValue ${this.hasFramesValue}.`,
      `Attribute ${attribute === null ? "absent" : attribute}.`,
      note
    ].join(" ")
  }
}
