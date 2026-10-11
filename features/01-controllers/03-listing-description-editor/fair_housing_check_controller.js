/*
 * fair_housing_check_controller.js — registered as "fair-housing-check"
 *
 * Teaches: a second, unrelated controller on the same element. It reads the
 * same field target (the field carries data-fair-housing-check-target as well
 * as the other controllers' target attributes) and responds to the same
 * input event through its own entry in the field's data-action list.
 * Neither controller calls the other.
 */
import { Controller } from "@hotwired/stimulus"

// Phrases the brokerage's compliance team flags under the Fair Housing Act,
// with the wording they recommend instead.
const FLAGGED_PHRASES = [
  { phrase: "family-friendly", suggestion: "describe the features instead: fenced yard, 0.4 miles to Lincoln Elementary" },
  { phrase: "perfect for singles", suggestion: "describe the space: low-maintenance one-bedroom" },
  { phrase: "no children", suggestion: "remove it; familial status is a protected class" },
  { phrase: "walking distance", suggestion: "give the distance: 0.3 miles to the Line 2 station" },
  { phrase: "master bedroom", suggestion: "primary bedroom" },
  { phrase: "exclusive neighborhood", suggestion: "name the amenities: gated entry, community pool" },
  { phrase: "ideal for young professionals", suggestion: "describe the commute: 15 minutes to downtown" },
]

export default class extends Controller {
  static targets = ["field", "findings"]

  connect() {
    this.scan()
  }

  scan() {
    const lowercaseCopy = this.fieldTarget.value.toLowerCase()
    const matches = FLAGGED_PHRASES.filter(({ phrase }) => lowercaseCopy.includes(phrase))

    this.findingsTarget.replaceChildren(
      ...matches.map(({ phrase, suggestion }) => {
        const finding = document.createElement("li")
        finding.textContent = `“${phrase}” — ${suggestion}`
        return finding
      })
    )
    this.findingsTarget.hidden = matches.length === 0
    this.element.dataset.fairHousingCheckState = matches.length === 0 ? "clear" : "flagged"
  }
}
