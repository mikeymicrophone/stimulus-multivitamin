/*
 * buoy_chart_controller.js — registered as "buoy-chart"
 *
 * Teaches: buoyTargetConnected attaches a spark widget, a
 * ResizeObserver, and a hail listener. buoyTargetDisconnected destroys
 * the widget, disconnects the observer, and removes the listener.
 * Moving a buoy down the chart runs both callbacks, so the spark is
 * rebuilt and the hail count stored on the buoy is kept. Removing a
 * buoy runs only the disconnected callback.
 */
import { Controller } from "@hotwired/stimulus"
import { SparkWidget } from "./spark_widget.js"

export default class extends Controller {
  static targets = ["buoy", "gearCount"]

  initialize() {
    this.gearByBuoy = new WeakMap()
    this.listening = 0
    this.destroyed = 0
  }

  connect() {
    this.render()
  }

  buoyTargetConnected(buoy) {
    const widget = new SparkWidget(buoy)
    const observer = new ResizeObserver(() => {
      if (buoy.dataset.buoyObserved === "yes") return
      buoy.dataset.buoyObserved = "yes"
    })
    observer.observe(buoy)
    const hailButton = buoy.querySelector("[data-buoy-hail]")
    const hail = () => {
      const hailCount = Number(buoy.dataset.hailCount || "0") + 1
      buoy.dataset.hailCount = String(hailCount)
      buoy.querySelector("[data-hail-line]").textContent = `Hailed ${hailCount}`
    }
    hailButton.addEventListener("click", hail)
    this.gearByBuoy.set(buoy, { widget, observer, hailButton, hail })
    this.listening += 1
    this.render()
  }

  buoyTargetDisconnected(buoy) {
    const gear = this.gearByBuoy.get(buoy)
    if (!gear) return
    gear.hailButton.removeEventListener("click", gear.hail)
    gear.observer.disconnect()
    gear.widget.destroy()
    this.gearByBuoy.delete(buoy)
    this.listening -= 1
    this.destroyed += 1
    this.render()
  }

  moveDown(event) {
    const buoy = event.currentTarget.closest("[data-buoy-name]")
    const next = buoy.nextElementSibling
    if (!next || !next.hasAttribute("data-buoy-name")) return
    next.after(buoy)
  }

  removeGong() {
    const gong = this.buoyTargets.find((buoy) => buoy.dataset.buoyName === "Gong 4")
    if (gong) gong.remove()
  }

  render() {
    this.gearCountTarget.textContent = `Widgets listening: ${this.listening}. Destroyed: ${this.destroyed}.`
  }
}
