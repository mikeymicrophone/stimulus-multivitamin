/*
 * job_docket_controller.js — registered as "job-docket"
 *
 * Teaches: stamping a serial into a docket is a DOM write that does
 * not add or remove a target, so the callback can do it safely.
 * Inserting another docket from inside the callback does not run that
 * docket's callback, which is why the press does not loop, and why
 * the ghost form stays unnumbered. A docket inserted from a
 * microtask queued by the callback does get a serial. Doing that from
 * every callback would never stop.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["docket", "tray", "trayNote"]

  initialize() {
    this.nextSerial = 1
    this.chaseNext = false
    this.deferNext = false
  }

  docketTargetConnected(docket) {
    if (docket.dataset.jobName === "Chapel cards" && this.chaseNext) {
      this.chaseNext = false
      this.appendDocket("Ghost form")
      this.trayNoteTarget.textContent = "Ghost form is in the tray without a serial. The callback that inserted it was paused, so the press never called back."
    }
    if (docket.dataset.jobName === "Run-on posters" && this.deferNext) {
      this.deferNext = false
      queueMicrotask(() => this.appendDocket("Overrun"))
    }
    this.stamp(docket)
  }

  addBroadside() {
    this.appendDocket("Poetry broadside")
  }

  chaseForm() {
    this.chaseNext = true
    this.appendDocket("Chapel cards")
  }

  deferOverrun() {
    this.deferNext = true
    this.appendDocket("Run-on posters")
  }

  appendDocket(jobName) {
    const docket = document.createElement("article")
    docket.className = "docket"
    docket.dataset.jobName = jobName
    docket.setAttribute("data-job-docket-target", "docket")
    const title = document.createElement("h3")
    title.textContent = jobName
    const serial = document.createElement("p")
    serial.setAttribute("data-serial", "")
    serial.textContent = "Unnumbered"
    docket.append(title, serial)
    this.trayTarget.append(docket)
  }

  stamp(docket) {
    const serial = docket.querySelector("[data-serial]")
    serial.textContent = `Serial ${this.nextSerial}`
    this.nextSerial += 1
  }
}
