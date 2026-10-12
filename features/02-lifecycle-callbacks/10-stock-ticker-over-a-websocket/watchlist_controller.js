/*
 * watchlist_controller.js — registered as "watchlist"
 *
 * Teaches: three kinds of churn for the rows' subscriptions. Sorting moves
 * rows, so each quote-row disconnects and reconnects. Switching watchlists
 * replaces every row with server HTML, so old instances unsubscribe and new
 * ones subscribe, several to the same symbols. Removing the last row leaves
 * nothing subscribed, and the shared socket closes after its grace period.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["rows", "row", "rowTemplate", "symbolChoice", "listTab", "loadStatus"]

  async switchList({ params: { listUrl }, currentTarget: chosenTab }) {
    for (const tab of this.listTabTargets) tab.setAttribute("aria-selected", String(tab === chosenTab))
    try {
      const response = await fetch(listUrl)
      if (!response.ok) throw new Error(`The brokerage answered ${response.status}`)
      this.rowsTarget.innerHTML = await response.text()
      this.loadStatusTarget.textContent = ""
    } catch (error) {
      this.loadStatusTarget.textContent = error.message
    }
  }

  addSymbol(event) {
    event.preventDefault()
    const choice = this.symbolChoiceTarget.selectedOptions[0]
    if (!choice?.value) return
    if (this.rowTargets.some((row) => row.dataset.quoteRowSymbolValue === choice.value)) {
      this.loadStatusTarget.textContent = `${choice.value} is already on this list.`
      return
    }
    const row = this.rowTemplateTarget.content.firstElementChild.cloneNode(true)
    row.dataset.quoteRowSymbolValue = choice.value
    row.querySelector("[data-symbol]").textContent = choice.value
    row.querySelector("[data-company]").textContent = choice.dataset.company
    this.rowsTarget.append(row)
    this.loadStatusTarget.textContent = ""
  }

  removeRow(event) {
    event.target.closest('[data-watchlist-target="row"]').remove()
  }

  sortByChange() {
    const rankedRows = this.rowTargets
      .map((row) => ({ row, changePercent: this.quoteRowFor(row)?.changePercent ?? -Infinity }))
      .sort((first, second) => second.changePercent - first.changePercent)
    for (const { row } of rankedRows) this.rowsTarget.append(row)
  }

  quoteRowFor(row) {
    return this.application.getControllerForElementAndIdentifier(row, "quote-row")
  }
}
