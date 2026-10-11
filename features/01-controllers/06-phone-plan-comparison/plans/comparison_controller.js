/*
 * plans/comparison_controller.js — registered as "plans--comparison"
 *
 * Teaches: identifiers that come from folders. The file lives at
 * plans/comparison_controller.js, so its identifier is "plans--comparison":
 * the folder separator becomes "--" and underscores become "-". Every
 * attribute that refers to it carries the full identifier, double dash
 * included: data-plans--comparison-target="plan",
 * data-action="plans--comparison#recalculate".
 */
import { Controller } from "@hotwired/stimulus"

const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })

export default class extends Controller {
  static targets = ["plan", "lineCount", "monthlyTotal", "recommendation"]

  initialize() {
    this.autopayDiscountPerLine = 0
    this.recommendedPlanKey = null
  }

  connect() {
    this.recalculate()
  }

  applyAutopayDiscount(discountPerLine) {
    this.autopayDiscountPerLine = discountPerLine
    this.recalculate()
  }

  recommendFor({ premiumGigabytes, hotspotGigabytes }) {
    const plansThatFit = this.plans.filter(
      (plan) => plan.premiumGigabytes >= premiumGigabytes && plan.hotspotGigabytes >= hotspotGigabytes
    )
    const cheapestFit = plansThatFit.sort((first, second) => this.monthlyTotalFor(first) - this.monthlyTotalFor(second))[0]

    this.recommendedPlanKey = cheapestFit?.key ?? null
    this.recalculate()
    return cheapestFit ?? null
  }

  recalculate() {
    for (const plan of this.plans) {
      const totalCell = this.monthlyTotalTargets.find((cell) => cell.dataset.planKey === plan.key)
      totalCell.textContent = `${priceFormatter.format(this.monthlyTotalFor(plan))}/mo`
    }

    for (const planColumn of this.planTargets) {
      planColumn.classList.toggle("recommended", planColumn.dataset.planKey === this.recommendedPlanKey)
    }
    for (const totalCell of this.monthlyTotalTargets) {
      totalCell.classList.toggle("recommended", totalCell.dataset.planKey === this.recommendedPlanKey)
    }

    const recommendedPlan = this.plans.find((plan) => plan.key === this.recommendedPlanKey)
    this.recommendationTarget.textContent = recommendedPlan
      ? `Best fit for ${this.describeLines()}: ${recommendedPlan.name} at ${priceFormatter.format(this.monthlyTotalFor(recommendedPlan))} a month.`
      : `Totals shown for ${this.describeLines()}.`
  }

  monthlyTotalFor(plan) {
    const additionalLines = this.lineCount - 1
    const beforeDiscount = plan.firstLinePrice + additionalLines * plan.additionalLinePrice
    return beforeDiscount - this.lineCount * this.autopayDiscountPerLine
  }

  describeLines() {
    return this.lineCount === 1 ? "1 line" : `${this.lineCount} lines`
  }

  get lineCount() {
    return Number.parseInt(this.lineCountTarget.value, 10)
  }

  get plans() {
    return this.planTargets.map((planColumn) => ({
      key: planColumn.dataset.planKey,
      name: planColumn.dataset.planName,
      firstLinePrice: Number(planColumn.dataset.firstLinePrice),
      additionalLinePrice: Number(planColumn.dataset.additionalLinePrice),
      premiumGigabytes: Number(planColumn.dataset.premiumGigabytes),
      hotspotGigabytes: Number(planColumn.dataset.hotspotGigabytes),
    }))
  }
}
