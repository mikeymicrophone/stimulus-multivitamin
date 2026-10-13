/*
 * kite_log_controller.js — registered as "kite-log"
 *
 * Teaches: stationName and launched are the base values. No element
 * on this page uses the kite-log identifier. A subclass still has
 * these getters. The attribute Stimulus reads is built from the
 * instance's identifier, not from "kite-log".
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    stationName: String,
    launched: Boolean
  }
}
