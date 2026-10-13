/*
 * field_retort_controller.js — registered as "field-retort"
 *
 * Teaches: a static field set to false is the property
 * load() checks. This retort is skipped, and afterLoad
 * does not run.
 */
import { Controller } from "@hotwired/stimulus"
import { writeKettle } from "./kettle_log.js"

export default class extends Controller {
  static shouldLoad = false

  connect() {
    this.element.querySelector("[data-reading]").textContent = "Field retort connected."
    writeKettle("field-retort connect.")
  }

  static afterLoad(identifier) {
    writeKettle(`${identifier} afterLoad.`)
  }
}
