/*
 * listing_page_controller.js — registered as "listing-page"
 *
 * Teaches: moving and removing elements that run their own timers. Saving a
 * similar home moves its card, carousel and all, into the favorites strip,
 * so its photo-carousel disconnects and reconnects with the same photo
 * showing. Hiding a home removes its card, and the carousel's disconnect()
 * stops its timer, observer, and listener.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["favoritesStrip", "favoritesEmpty", "similarHomes", "homeCard"]

  saveHome(event) {
    const homeCard = this.homeCardFor(event)
    const saving = !this.favoritesStripTarget.contains(homeCard)
    const destination = saving ? this.favoritesStripTarget : this.similarHomesTarget
    destination.append(homeCard)
    event.currentTarget.textContent = saving ? "♥ Saved" : "♡ Save"
    event.currentTarget.setAttribute("aria-pressed", String(saving))
    this.renderFavorites()
  }

  hideHome(event) {
    this.homeCardFor(event).remove()
    this.renderFavorites()
  }

  renderFavorites() {
    this.favoritesEmptyTarget.hidden = this.favoritesStripTarget.querySelector('[data-listing-page-target="homeCard"]') !== null
  }

  homeCardFor(event) {
    return event.target.closest('[data-listing-page-target="homeCard"]')
  }
}
