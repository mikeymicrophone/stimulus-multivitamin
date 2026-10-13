/*
 * compost_scale_controller.js — registered as "compost-scale"
 *
 * Teaches: each truck target adds its tons and a reweigh listener in
 * truckTargetConnected, and subtracts the tons and removes the listener
 * in truckTargetDisconnected. Replacing the day's slip disconnects
 * every old truck before it connects the new one, so the tonnage and
 * the listener count both end on the school kitchens truck alone.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["truck", "scale", "tally", "tape", "lastReweigh"]

  initialize() {
    this.gearByTruck = new WeakMap()
    this.tons = 0
    this.listeners = 0
    this.ghostReweighs = 0
    this.lines = []
  }

  connect() {
    this.render()
  }

  truckTargetConnected(truck) {
    const button = truck.querySelector("[data-reweigh]")
    const gear = { button, dead: false, reweigh: null }
    gear.reweigh = () => {
      if (gear.dead) {
        this.ghostReweighs += 1
      } else {
        const reweighs = Number(truck.dataset.reweighs || "0") + 1
        truck.dataset.reweighs = String(reweighs)
        this.lastReweighTarget.textContent = `Last reweigh: ${truck.dataset.crewName}, reweigh ${reweighs}.`
      }
      this.render()
    }
    button.addEventListener("click", gear.reweigh)
    this.gearByTruck.set(truck, gear)
    this.listeners += 1
    this.tons += Number(truck.dataset.tons)
    this.note(`+ ${truck.dataset.crewName} ${truck.dataset.tons} t`)
  }

  truckTargetDisconnected(truck) {
    const gear = this.gearByTruck.get(truck)
    if (gear) {
      gear.dead = true
      gear.button.removeEventListener("click", gear.reweigh)
      this.gearByTruck.delete(truck)
      this.listeners -= 1
    }
    this.tons -= Number(truck.dataset.tons)
    this.note(`- ${truck.dataset.crewName} ${truck.dataset.tons} t`)
  }

  voidParks() {
    const parks = this.truckTargets.find((truck) => truck.dataset.crewName === "Parks crew")
    if (parks) parks.remove()
  }

  replaceSlip() {
    this.scaleTarget.innerHTML = `<article class="truck" data-compost-scale-target="truck" data-crew-name="School kitchens" data-tons="3">
      <h3>School kitchens</h3>
      <p>3 tons of cafeteria scraps.</p>
      <button type="button" data-reweigh>Reweigh School kitchens</button>
    </article>`
  }

  render() {
    this.tallyTarget.textContent = `Tons on the chalk: ${this.tons}. Listeners: ${this.listeners}. Ghost reweighs: ${this.ghostReweighs}.`
  }

  note(line) {
    this.lines.push(line)
    if (this.hasTapeTarget) this.tapeTarget.textContent = this.lines.join("\n")
    this.render()
  }
}
