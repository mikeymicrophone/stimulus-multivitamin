/*
 * rental_search_controller.js — registered as "rental-search"
 *
 * Teaches: each listing card listens for click->rental-search#openListing.
 * Save and Share sit inside the card with :stop, so they call
 * stopPropagation() before their methods and the card never opens.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["detail", "detailHeading", "detailCopy", "status", "savedList"]
  static values = {
    listings: Object,
  }

  connect() {
    this.savedSlugs = []
    this.renderSaved()
  }

  openListing({ currentTarget: card }) {
    const listing = this.listingsValue[card.dataset.listingSlug]
    this.detailHeadingTarget.textContent = listing.name
    this.detailCopyTarget.textContent = listing.summary
    this.detailTarget.hidden = false
    this.statusTarget.textContent = `Opened ${listing.name}. The click reached the card because nothing called stopPropagation().`
  }

  saveListing({ currentTarget: saveButton }) {
    const listing = this.listingsValue[saveButton.dataset.listingSlug]
    if (!this.savedSlugs.includes(listing.slug)) this.savedSlugs.push(listing.slug)
    this.renderSaved()
    this.statusTarget.textContent = `Saved ${listing.name} to your trip. :stop kept the card from opening.`
  }

  copyListingLink({ currentTarget: shareButton }) {
    const listing = this.listingsValue[shareButton.dataset.listingSlug]
    this.statusTarget.textContent = `Copied the ${listing.name} link. :stop kept the card from opening.`
  }

  renderSaved() {
    if (this.savedSlugs.length === 0) {
      this.savedListTarget.textContent = "Nothing saved yet."
      return
    }
    const names = this.savedSlugs.map((slug) => this.listingsValue[slug].name)
    this.savedListTarget.textContent = `Trip list: ${names.join(", ")}.`
  }
}
