/*
 * stay_survey_controller.js — registered as "stay-survey"
 *
 * Teaches: composing the action patterns from the earlier scenarios on one
 * form. Radios, checkboxes, a select, text fields, and the form itself all
 * use default events. Follow-up questions are revealed, not rebuilt, so
 * their actions are bound from the start and fire the moment a hidden
 * field is shown and used. "Other" reasons are cloned from a <template>
 * after the page loads, and Stimulus binds those new actions on its own.
 * A question that is hidden again keeps its answers until the guest
 * submits, so going back and changing a branch doesn't lose a comment
 * they might return to.
 */
import { Controller } from "@hotwired/stimulus"

const stepOrder = ["cabin", "overall", "follow-up", "add-ons", "review"]

export default class extends Controller {
  static targets = [
    "step", "progress", "cabin", "overall", "disappointment", "highlight",
    "recommend", "quoteConsent", "addOn", "breakfastRating", "midStay", "otherReason",
    "otherReasonList", "otherReasonTemplate", "reviewList", "status",
    "backButton", "nextButton", "sendButton",
  ]

  initialize() {
    this.currentStep = "cabin"
  }

  connect() {
    this.render()
  }

  chooseCabin() {
    this.render()
  }

  rateStay() {
    this.render()
  }

  chooseRecommend() {
    this.render()
  }

  toggleAddOn() {
    this.render()
  }

  addOtherReason() {
    const reason = this.otherReasonTemplateTarget.content.firstElementChild.cloneNode(true)
    this.otherReasonListTarget.append(reason)
    this.render()
    reason.querySelector("input").focus()
  }

  removeOtherReason({ currentTarget: removeButton }) {
    removeButton.closest('[data-stay-survey-target="otherReason"]').remove()
    this.render()
  }

  goToNextStep() {
    const problem = this.problemOn(this.currentStep)
    if (problem) {
      this.statusTarget.textContent = problem
      return
    }
    this.statusTarget.textContent = ""
    this.currentStep = stepOrder[stepOrder.indexOf(this.currentStep) + 1]
    this.render()
    this.stepTargets.find((step) => step.dataset.step === this.currentStep).querySelector("h3, legend, [tabindex], input, select, textarea, button")?.focus()
  }

  goToPreviousStep() {
    this.statusTarget.textContent = ""
    this.currentStep = stepOrder[stepOrder.indexOf(this.currentStep) - 1]
    this.render()
  }

  submitSurvey(event) {
    event.preventDefault()
    if (this.currentStep !== "review") {
      this.goToNextStep()
      return
    }
    this.statusTarget.textContent = `Thanks, ${this.selectedCabinShortLabel} guest. Your answers are with the innkeepers.`
  }

  render() {
    for (const step of this.stepTargets) step.hidden = step.dataset.step !== this.currentStep
    const stepIndex = stepOrder.indexOf(this.currentStep)
    this.progressTarget.textContent = `Step ${stepIndex + 1} of ${stepOrder.length}`
    this.backButtonTarget.hidden = stepIndex === 0
    this.nextButtonTarget.hidden = this.currentStep === "review"
    this.sendButtonTarget.hidden = this.currentStep !== "review"
    this.renderFollowUps()
    this.renderReview()
  }

  renderFollowUps() {
    const rating = this.overallRating
    const disappointed = rating !== null && rating <= 2
    const middling = rating === 3
    const pleased = rating !== null && rating >= 4
    this.disappointmentTarget.hidden = !disappointed
    this.midStayTarget.hidden = !middling
    this.highlightTarget.hidden = !pleased
    this.recommendTarget.hidden = !pleased
    this.quoteConsentTarget.hidden = !pleased || this.recommendChoice !== "yes"
    this.breakfastRatingTarget.hidden = !this.addOnTargets.find((box) => box.value === "breakfast")?.checked
    this.otherReasonListTarget.hidden = this.otherReasonTargets.length === 0
  }

  renderReview() {
    const lines = [
      ["Cabin", this.selectedCabinLabel],
      ["Overall", this.overallRating && `${this.overallRating} out of 5`],
      this.disappointmentTarget.hidden ? null : ["What disappointed you", this.checkedLabels(this.disappointmentTarget) || "—"],
      this.midStayTarget.hidden ? null : ["What we could improve", this.midStayTarget.querySelector("textarea").value.trim() || "—"],
      this.highlightTarget.hidden ? null : ["What stood out", this.checkedLabels(this.highlightTarget) || "—"],
      this.recommendTarget.hidden ? null : ["Would recommend", this.recommendChoice && (this.recommendChoice === "yes" ? "Yes" : "Not this time")],
      this.quoteConsentTarget.hidden ? null : ["May we quote you", this.quoteConsentTarget.querySelector("input").value.trim() || "Name not given"],
      ["Add-ons", this.checkedLabels(this.element.querySelector("[data-addons]")) || "None"],
      this.breakfastRatingTarget.hidden ? null : ["Breakfast", this.breakfastRatingTarget.querySelector("select").selectedOptions[0].textContent],
    ].filter((line) => line && line[1])
    this.reviewListTarget.replaceChildren(...lines.map(([label, value]) => {
      const item = document.createElement("li")
      item.innerHTML = `<strong>${label}:</strong> `
      item.append(value)
      return item
    }))
  }

  problemOn(step) {
    if (step === "cabin" && !this.cabinTarget.value) return "Choose the cabin you stayed in."
    if (step === "overall" && this.overallRating === null) return "Please rate your stay."
    if (step === "follow-up" && !this.disappointmentTarget.hidden && this.checkedLabels(this.disappointmentTarget) === "") {
      return "Tell us what disappointed you, or add your own reason."
    }
    return null
  }

  checkedLabels(section) {
    const checked = [...section.querySelectorAll("input[type='checkbox']:checked, input[type='text']")]
      .map((field) => field.type === "text" ? field.value.trim() : field.closest("label").textContent.trim())
      .filter(Boolean)
    return checked.join(", ")
  }

  get selectedCabinLabel() {
    return this.cabinTarget.selectedOptions[0]?.textContent ?? ""
  }

  get selectedCabinShortLabel() {
    return this.cabinTarget.selectedOptions[0]?.dataset.shortLabel ?? this.selectedCabinLabel
  }

  get overallRating() {
    const chosen = this.overallTargets.find((radio) => radio.checked)
    return chosen ? Number(chosen.value) : null
  }

  get recommendChoice() {
    return this.recommendTarget.querySelector("input:checked")?.value ?? null
  }
}
