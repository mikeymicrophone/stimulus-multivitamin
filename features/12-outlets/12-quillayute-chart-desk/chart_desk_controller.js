/*
 * chart_desk_controller.js — not registered. tide-desk extends it.
 *
 * Teaches: static outlets = ["horn"] is inherited. The attribute
 * is still data-tide-desk-horn-outlet, the subclass identifier,
 * not data-chart-desk-horn-outlet.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["horn"]
}
