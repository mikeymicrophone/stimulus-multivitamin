/*
 * product_feed_controller.js — registered as "product-feed"
 *
 * Teaches: an IntersectionObserver whose targets come and go. Each page of
 * results is server HTML that ends with a new sentinel element.
 * sentinelTargetConnected() observes it and sentinelTargetDisconnected()
 * stops observing it, so the observer always watches exactly the sentinels
 * on the page. Stimulus calls target callbacks before connect(), so the
 * observer is created in initialize(). disconnect() only aborts the page
 * request in flight; the sentinel's own disconnected callback, which
 * Stimulus runs right after, unobserves it.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["viewport", "grid", "sentinel", "productCard", "status", "categoryTab"]

  initialize() {
    this.sentinelObserver = new IntersectionObserver((entries) => this.sentinelsChanged(entries), {
      root: this.viewportTarget,
      rootMargin: "0px 0px 80px 0px",
    })
    this.pageRequest = null
  }

  connect() {
    this.renderStatus()
  }

  disconnect() {
    this.pageRequest?.abort()
    this.pageRequest = null
  }

  sentinelTargetConnected(sentinel) {
    this.sentinelObserver.observe(sentinel)
  }

  sentinelTargetDisconnected(sentinel) {
    this.sentinelObserver.unobserve(sentinel)
  }

  sentinelsChanged(entries) {
    for (const entry of entries) {
      if (entry.isIntersecting && this.sentinelTargets.includes(entry.target)) this.loadNextPage(entry.target)
    }
  }

  async loadNextPage(sentinel) {
    if (this.pageRequest) return
    sentinel.textContent = "Loading more…"
    const resultsPage = await this.fetchResultsPage(sentinel.dataset.nextPageUrl)
    if (resultsPage === null) return
    if (resultsPage instanceof Error) {
      sentinel.textContent = `${resultsPage.message}. Scroll to try again.`
      return
    }
    sentinel.replaceWith(resultsPage)
    this.renderStatus()
  }

  async switchCategory({ params: { firstPageUrl, categoryName }, currentTarget: chosenTab }) {
    this.pageRequest?.abort()
    this.pageRequest = null
    for (const tab of this.categoryTabTargets) tab.setAttribute("aria-selected", String(tab === chosenTab))
    this.statusTarget.textContent = "Loading…"

    const resultsPage = await this.fetchResultsPage(firstPageUrl)
    if (resultsPage === null) return
    if (resultsPage instanceof Error) {
      this.statusTarget.textContent = `${resultsPage.message}.`
      return
    }
    this.gridTarget.replaceChildren(resultsPage)
    this.gridTarget.dataset.categoryName = categoryName
    this.viewportTarget.scrollTop = 0
    this.renderStatus()
  }

  // Resolves to a DocumentFragment, an Error, or null when a newer request
  // (or disconnect) aborted this one.
  async fetchResultsPage(pageUrl) {
    const request = new AbortController()
    this.pageRequest = request
    try {
      const response = await fetch(pageUrl, { signal: request.signal })
      if (!response.ok) throw new Error(`The catalog answered ${response.status}`)
      const pageMarkup = document.createElement("template")
      pageMarkup.innerHTML = await response.text()
      return pageMarkup.content
    } catch (error) {
      return error.name === "AbortError" ? null : error
    } finally {
      if (this.pageRequest === request) this.pageRequest = null
    }
  }

  renderStatus() {
    const productCount = this.productCardTargets.length
    const categoryName = this.gridTarget.dataset.categoryName ?? "products"
    this.statusTarget.textContent = this.hasSentinelTarget
      ? `Showing ${productCount} ${categoryName}`
      : `All ${productCount} ${categoryName} shown`
  }
}
