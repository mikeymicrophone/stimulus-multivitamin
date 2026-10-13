/*
 * paint_booth_controller.js — registered as "paint-booth"
 *
 * Teaches: opening the spray booth sets the same identifier on a bay
 * that already holds Ellen. The booth's hullTargetConnected runs for
 * her. The yard's hullTargetDisconnected does not, so the yard chalk
 * still counts her gallons. Rolling June in does run the yard's
 * disconnected callback and the booth's connected callback. Recount
 * copies the getter, which was already right.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["hull", "chalkLine", "slipLine"]

  initialize() {
    this.chalk = []
    this.gallons = 0
  }

  connect() {
    this.render()
  }

  hullTargetConnected(hull) {
    this.chalk.push(hull.dataset.hullName)
    this.gallons += Number(hull.dataset.gallons)
    this.render()
  }

  hullTargetDisconnected(hull) {
    this.chalk = this.chalk.filter((name) => name !== hull.dataset.hullName)
    this.gallons -= Number(hull.dataset.gallons)
    this.render()
  }

  openBooth() {
    this.element.querySelector("[data-paint-bay]").setAttribute("data-controller", "paint-booth")
  }

  rollJune() {
    const bay = this.element.querySelector("[data-paint-bay]")
    if (!bay.matches("[data-controller~='paint-booth']")) return
    const june = this.hullTargets.find((hull) => hull.dataset.hullName === "June")
    if (!june) return
    bay.querySelector("[data-hull-list]").append(june)
  }

  readSlip() {
    const names = this.hullTargets.map((hull) => hull.dataset.hullName)
    const gallons = this.hullTargets.reduce((sum, hull) => sum + Number(hull.dataset.gallons), 0)
    const listed = names.length ? names.join(", ") : "none"
    this.slipLineTarget.textContent = `${this.element.dataset.boothName} slip: ${gallons} gal (${listed}).`
  }

  recount() {
    this.chalk = this.hullTargets.map((hull) => hull.dataset.hullName)
    this.gallons = this.hullTargets.reduce((sum, hull) => sum + Number(hull.dataset.gallons), 0)
    this.render()
  }

  render() {
    const names = this.chalk.length ? this.chalk.join(", ") : "none"
    this.chalkLineTarget.textContent = `${this.element.dataset.boothName} chalk: ${this.gallons} gal (${names}).`
  }
}
