/*
 * after_slip_controller.js — registered as "after-slip"
 *
 * Teaches: the selector throw aborts the rest of that
 * scan. This slip is registered and still not connected.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    document.getElementById("after-reading").textContent = "After slip connected."
  }
}
