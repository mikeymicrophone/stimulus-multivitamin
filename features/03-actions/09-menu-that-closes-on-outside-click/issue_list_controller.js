/*
 * issue_list_controller.js — registered as "issue-list"
 *
 * Teaches: menu items that call two controllers. Every item lists an
 * issue-list action first and dropdown-menu#closeMenuTree second, so the
 * list has changed before the menu closes and hands focus back. Each item
 * describes itself with plain data attributes read from currentTarget.
 */
import { Controller } from "@hotwired/stimulus"

const issueOrders = {
  newest: (left, right) => right.dataset.openedOn.localeCompare(left.dataset.openedOn),
  oldest: (left, right) => left.dataset.openedOn.localeCompare(right.dataset.openedOn),
  priority: (left, right) => Number(left.dataset.priority) - Number(right.dataset.priority),
}

export default class extends Controller {
  static targets = ["list", "issue", "sortLabel", "assigneeLabel", "count", "status"]

  initialize() {
    this.sortKey = "newest"
    this.assignee = "everyone"
  }

  connect() {
    this.render()
  }

  sortIssues({ currentTarget: sortChoice }) {
    this.sortKey = sortChoice.dataset.sortKey
    this.sortLabelTarget.textContent = sortChoice.textContent
    this.render()
  }

  filterByAssignee({ currentTarget: assigneeChoice }) {
    this.assignee = assigneeChoice.dataset.assignee
    this.assigneeLabelTarget.textContent = assigneeChoice.textContent
    this.render()
  }

  copyViewLink() {
    const viewLink = new URL(window.location.href)
    viewLink.search = new URLSearchParams({ sort: this.sortKey, assignee: this.assignee }).toString()
    this.statusTarget.textContent = `Link to this view: ${viewLink.pathname}${viewLink.search}`
  }

  exportIssues({ currentTarget: formatChoice }) {
    const issueCount = this.visibleIssues.length
    this.statusTarget.textContent = `Exporting ${issueCount} ${issueCount === 1 ? "issue" : "issues"} as ${formatChoice.dataset.exportFormat}. The file will be in your downloads shortly.`
  }

  archiveClosedIssues() {
    const closedIssues = this.issueTargets.filter((issue) => issue.dataset.state === "closed")
    for (const issue of closedIssues) issue.remove()
    this.statusTarget.textContent = closedIssues.length === 0
      ? "There are no closed issues to archive."
      : `Archived ${closedIssues.length} closed ${closedIssues.length === 1 ? "issue" : "issues"}.`
    this.render()
  }

  render() {
    const orderedIssues = [...this.issueTargets].sort(issueOrders[this.sortKey])
    this.listTarget.append(...orderedIssues)
    for (const issue of orderedIssues) issue.hidden = this.assignee !== "everyone" && issue.dataset.assignee !== this.assignee
    const shownCount = this.visibleIssues.length
    this.countTarget.textContent = shownCount === 1 ? "1 issue" : `${shownCount} issues`
  }

  get visibleIssues() {
    return this.issueTargets.filter((issue) => !issue.hidden)
  }
}
