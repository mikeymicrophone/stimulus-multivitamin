/*
 * kettle_watch_controller.js — registered as "kettle-watch"
 *
 * Teaches: async connect() writes, then rejects outside
 * handleError. The action bound before that rejection
 * still runs.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  async connect() {
    this.readingTarget.textContent = "Kettle watch wrote the slate."
    throw new Error("kettle slate tore")
  }

  mark() {
    this.readingTarget.textContent = "Kettle marked."
  }
}
