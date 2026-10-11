/*
 * plans/usage_estimator_controller.js — registered as "plans--usage-estimator"
 *
 * Teaches: a folder plus a multi-word file name. "plans/" becomes "plans--"
 * and "usage_estimator" becomes "usage-estimator". The selector that finds
 * the surrounding comparison must spell the namespaced identifier exactly,
 * because "~=" matches whole tokens only.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["premiumGigabytes", "hotspotGigabytes", "result"]

  connect() {
    const comparisonElement = this.element.closest('[data-controller~="plans--comparison"]')
    this.comparison = comparisonElement
      ? this.application.getControllerForElementAndIdentifier(comparisonElement, "plans--comparison")
      : null
    this.estimate()
  }

  disconnect() {
    this.comparison = null
  }

  estimate() {
    const premiumGigabytes = this.readGigabytes(this.premiumGigabytesTarget)
    const hotspotGigabytes = this.readGigabytes(this.hotspotGigabytesTarget)

    if (premiumGigabytes === null || hotspotGigabytes === null) {
      this.resultTarget.textContent = "Enter your monthly usage as a whole number of gigabytes, 0 or more."
      return
    }

    const recommendedPlan = this.comparison?.recommendFor({ premiumGigabytes, hotspotGigabytes })
    this.resultTarget.textContent = recommendedPlan
      ? `${recommendedPlan.name} covers ${premiumGigabytes} GB of data and ${hotspotGigabytes} GB of hotspot.`
      : `No plan includes ${hotspotGigabytes} GB of hotspot data with ${premiumGigabytes} GB of premium data. Talk to a store associate about a business plan.`
  }

  readGigabytes(input) {
    if (input.value.trim() === "") return null
    const gigabytes = Number(input.value)
    return Number.isInteger(gigabytes) && gigabytes >= 0 ? gigabytes : null
  }
}
