/*
 * blinker_widget.js
 *
 * A small lamp the night watch clips to an overdue vessel. The
 * controller creates one from overdueTargetConnected and destroys it
 * from overdueTargetDisconnected. Nothing here knows about Stimulus.
 */
export class Blinker {
  constructor(vessel) {
    this.vessel = vessel
    this.line = vessel.querySelector("[data-blinker]")
    this.line.textContent = "Blinker on"
    this.tock = () => {
      const tocks = Number(vessel.dataset.blinkerTocks || "0") + 1
      vessel.dataset.blinkerTocks = String(tocks)
      this.line.textContent = `Blinker on, tock ${tocks}`
    }
    this.line.addEventListener("click", this.tock)
  }

  destroy() {
    this.line.removeEventListener("click", this.tock)
    this.line.textContent = "Blinker off"
  }
}
