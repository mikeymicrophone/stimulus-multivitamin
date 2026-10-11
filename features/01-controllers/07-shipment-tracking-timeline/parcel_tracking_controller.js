/*
 * parcel_tracking_controller.js — registered as "parcel-tracking"
 *
 * Teaches: extending a controller class. This class inherits the timeline,
 * status, and next-scan targets plus the scans values from
 * TrackingTimelineController, and adds a deliveryWindow target and value.
 * Stimulus merges static targets and values up the class chain, but the
 * attributes always use this subclass's identifier:
 * data-parcel-tracking-target="timeline", data-parcel-tracking-scans-value.
 */
import TrackingTimelineController from "./tracking_timeline_controller.js"

export default class ParcelTrackingController extends TrackingTimelineController {
  static targets = ["deliveryWindow"]
  static values = { deliveryWindow: String }

  renderDetails(latestScan) {
    super.renderDetails(latestScan)

    if (latestScan?.code === "delivered") {
      this.deliveryWindowTarget.textContent = `Delivered: ${latestScan.handoff ?? "left at the front door"}`
    } else if (latestScan?.code === "out_for_delivery") {
      this.deliveryWindowTarget.textContent = `Arriving today between ${this.deliveryWindowValue}`
    } else {
      this.deliveryWindowTarget.textContent = `Delivery window on arrival day: ${this.deliveryWindowValue}`
    }
  }
}
