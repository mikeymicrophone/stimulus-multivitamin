/*
 * newsletter_signup_controller.js — registered as "newsletter-signup"
 *
 * Teaches: several actions on one element, and the order they run in. The
 * email field lists "normalizeEmail" before "validateEmail" for the same
 * input event, so validation always sees the cleaned-up address. The form
 * lists "validateSignup" before "subscribe" for submit, and validateSignup
 * calls event.stopImmediatePropagation() to keep subscribe from running.
 * The same field also listens for blur, a second event with its own method.
 */
import { Controller } from "@hotwired/stimulus"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const likelyDomainTypos = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "yaho.com": "yahoo.com",
  "outlok.com": "outlook.com",
  "iclod.com": "icloud.com",
}

export default class extends Controller {
  static targets = ["email", "emailError", "suggestion", "suggestedEmail", "topics", "topicsError", "submitButton", "status"]

  initialize() {
    this.emailTouched = false
  }

  normalizeEmail() {
    const cleaned = this.emailTarget.value.replace(/\s+/g, "")
    const [localPart, domain] = cleaned.split("@")
    const normalized = domain === undefined ? cleaned : `${localPart}@${domain.toLowerCase()}`
    if (normalized !== this.emailTarget.value) this.emailTarget.value = normalized
  }

  validateEmail() {
    this.renderSuggestion()
    if (this.emailTouched) this.renderEmailError()
  }

  revealEmailError() {
    if (this.emailTarget.value === "") return
    this.emailTouched = true
    this.renderEmailError()
  }

  // Assigning .value fires no input event, so the field's own actions would
  // not run. Dispatching one runs them in their declared order.
  acceptSuggestion() {
    this.emailTarget.value = this.suggestedEmailTarget.textContent
    this.emailTarget.dispatchEvent(new Event("input", { bubbles: true }))
    this.emailTarget.focus()
  }

  validateTopics() {
    this.topicsErrorTarget.textContent = this.chosenTopicCount === 0 ? "Pick at least one newsletter." : ""
  }

  validateSignup(event) {
    this.emailTouched = true
    this.renderEmailError()
    this.validateTopics()
    if (this.emailProblem || this.chosenTopicCount === 0) {
      event.preventDefault()
      event.stopImmediatePropagation()
      this.statusTarget.textContent = "Fix the highlighted fields to subscribe."
      const firstProblemField = this.emailProblem ? this.emailTarget : this.topicsTarget.querySelector("input")
      firstProblemField.focus()
    }
  }

  async subscribe(event) {
    event.preventDefault()
    this.submitButtonTarget.disabled = true
    this.statusTarget.textContent = "Subscribing…"
    await new Promise((resolve) => setTimeout(resolve, 400))
    const topicCount = this.chosenTopicCount
    this.statusTarget.textContent = `Check ${this.emailTarget.value} for a confirmation link to start your ${topicCount === 1 ? "newsletter" : `${topicCount} newsletters`}.`
    this.submitButtonTarget.disabled = false
  }

  renderEmailError() {
    const problem = this.emailProblem
    this.emailErrorTarget.textContent = problem ?? ""
    this.emailTarget.setAttribute("aria-invalid", String(problem !== null))
  }

  renderSuggestion() {
    const domain = this.emailTarget.value.split("@")[1]
    const correction = likelyDomainTypos[domain]
    this.suggestionTarget.hidden = !correction
    if (correction) this.suggestedEmailTarget.textContent = this.emailTarget.value.replace(/@.*$/, `@${correction}`)
  }

  get emailProblem() {
    const email = this.emailTarget.value
    if (email === "") return "Enter your email address."
    if (!emailPattern.test(email)) return "That doesn't look like an email address."
    return null
  }

  get chosenTopicCount() {
    return this.topicsTarget.querySelectorAll("input:checked").length
  }
}
