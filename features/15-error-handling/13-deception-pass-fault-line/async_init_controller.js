/*
 * async_init_controller.js — registered as "async-init"
 *
 * async initialize() rejects and connect() still runs.
 * async disconnect() rejects after the observers stop.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["reading"]

  async initialize() {
    throw new Error("async init tore")
  }

  connect() {
    this.readingTarget.textContent = "Async init connected."
  }

  trim() {
    this.readingTarget.textContent = "Async init trimmed."
  }

  pull() {
    this.element.removeAttribute("data-controller")
  }

  async disconnect() {
    throw new Error("async disconnect tore")
  }
}
