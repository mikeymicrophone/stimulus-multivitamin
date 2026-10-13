/*
 * lamp_bank_controller.js — registered as "lamp-bank"
 *
 * Teaches: lockLampOutletConnected pauses the selector
 * observer. Hanging the spare removes the small lamp inside
 * that callback. The small lamp's disconnect() runs. The
 * bank's lockLampOutletDisconnected does not, until recount
 * writes the selector again and the observer refreshes.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static outlets = ["lock-lamp"]
  static targets = ["log", "rack"]

  initialize() {
    this.disconnectedNames = []
  }

  connect() {
    const ids = this.lockLampOutletElements.map((element) => element.id).join(" ")
    this.write(`Bank outlets ${ids}.`)
  }

  lockLampOutletConnected(_outlet, element) {
    const life = element.dataset.life || "none"
    this.write(`Connected ${element.id}. Life ${life}.`)
    if (element.id === "lamp-spare") {
      const small = document.getElementById("lamp-small")
      if (small) {
        this.pulledLamp = small
        small.remove()
      }
    }
  }

  lockLampOutletDisconnected(_outlet, element) {
    this.disconnectedNames.push(element.id)
    this.write(`Disconnected ${element.id}. Life ${element.dataset.life || "none"}. In document ${element.isConnected}.`)
  }

  hangSpare() {
    const spare = document.createElement("article")
    spare.id = "lamp-spare"
    spare.className = "lock-lamp lamp"
    spare.setAttribute("data-controller", "lock-lamp")
    spare.innerHTML = `<h2>Spare</h2><p class="status" data-lock-lamp-target="status"></p>`
    this.rackTarget.append(spare)
    queueMicrotask(() => {
      const life = this.pulledLamp ? this.pulledLamp.dataset.life : "none"
      const present = this.pulledLamp ? this.pulledLamp.isConnected : false
      const outlets = this.lockLampOutlets.map((lamp) => lamp.element.id).join(" ")
      this.write(`After the hang, small life ${life}. In document ${present}. Disconnected callbacks ${this.disconnectedNames.length}. Outlets ${outlets}.`)
    })
  }

  recount() {
    this.element.setAttribute("data-lamp-bank-lock-lamp-outlet", ".lock-lamp, .lock-lamp")
    queueMicrotask(() => {
      this.write(`After the recount, disconnected callbacks ${this.disconnectedNames.join(" ")}.`)
    })
  }

  write(line) {
    this.logTarget.textContent = `${this.logTarget.textContent}${line}\n`
  }
}
