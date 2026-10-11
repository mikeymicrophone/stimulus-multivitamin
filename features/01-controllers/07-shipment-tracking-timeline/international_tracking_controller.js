/*
 * international_tracking_controller.js — registered as "international-tracking"
 *
 * Teaches: inheritance more than one level deep. This class extends
 * ParcelTrackingController, which extends TrackingTimelineController, so it
 * has the targets and values of both plus its own customs details. It
 * overrides canAdvance() to hold the package at customs until the duties
 * are paid, and calls super so the parcel delivery window still renders.
 */
import ParcelTrackingController from "./parcel_tracking_controller.js"

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends ParcelTrackingController {
  static targets = ["customsStatus", "payDutiesButton"]
  static values = { dutiesOwed: Number }

  payDuties() {
    this.dutiesOwedValue = 0
    this.render()
  }

  canAdvance() {
    return super.canAdvance() && !this.isHeldForDuties
  }

  describeScan(scan) {
    const description = super.describeScan(scan)
    return scan.code === "customs_hold" ? `${description} (import duties assessed)` : description
  }

  renderDetails(latestScan) {
    super.renderDetails(latestScan)

    this.payDutiesButtonTarget.hidden = !this.isHeldForDuties
    if (this.isHeldForDuties) {
      this.customsStatusTarget.textContent = `${priceFormatter.format(this.dutiesOwedValue)} in import duties due before release`
    } else if (this.dutiesOwedValue === 0 && this.hasReachedCustoms) {
      this.customsStatusTarget.textContent = "Duties paid. Released by customs."
    } else {
      this.customsStatusTarget.textContent = "Not yet at customs"
    }
  }

  get isHeldForDuties() {
    return this.latestScan?.code === "customs_hold" && this.dutiesOwedValue > 0
  }

  get hasReachedCustoms() {
    return this.scansValue.some((scan) => scan.code === "customs_hold")
  }
}
