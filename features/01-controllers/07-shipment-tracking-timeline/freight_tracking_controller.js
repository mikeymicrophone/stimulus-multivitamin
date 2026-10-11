/*
 * freight_tracking_controller.js — registered as "freight-tracking"
 *
 * Teaches: a sibling subclass that takes the base class somewhere else. Freight
 * shares the timeline behavior with parcels but none of the parcel details:
 * it extends TrackingTimelineController directly, adds pallet and dock
 * appointment targets, and overrides describeScan() to report pallet
 * counts.
 */
import TrackingTimelineController from "./tracking_timeline_controller.js"

export default class extends TrackingTimelineController {
  static targets = ["dockAppointment", "appointmentChoice"]
  static values = { palletCount: Number }

  rescheduleDockAppointment() {
    this.render()
  }

  describeScan(scan) {
    const description = super.describeScan(scan)
    if (scan.palletsScanned === undefined) return description
    return `${description}: ${scan.palletsScanned} of ${this.palletCountValue} pallets`
  }

  renderDetails(latestScan) {
    super.renderDetails(latestScan)

    const appointment = this.appointmentChoiceTarget.selectedOptions[0].textContent
    if (latestScan?.code === "delivered") {
      this.dockAppointmentTarget.textContent = "Unloaded at the receiving dock"
      this.appointmentChoiceTarget.disabled = true
    } else {
      this.dockAppointmentTarget.textContent = `Receiving dock appointment: ${appointment}`
    }

    const shortPallets = latestScan?.palletsScanned !== undefined && latestScan.palletsScanned < this.palletCountValue
    this.element.classList.toggle("short-shipment", shortPallets)
  }
}
