/*
 * tracking_timeline_controller.js — registered as "tracking-timeline"
 *
 * Teaches: a controller written to be extended. It works on its own (the
 * certified letter on this page uses it directly) and exports its class so
 * other controllers can subclass it. Subclasses inherit its static targets
 * and values, add their own, and override the small hook methods below:
 * describeScan(), renderDetails(), and canAdvance().
 */
import { Controller } from "@hotwired/stimulus"

const scanTimeFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export default class TrackingTimelineController extends Controller {
  static targets = ["timeline", "status", "nextScanButton"]
  static values = { scans: Array, upcomingScans: Array }

  connect() {
    this.render()
  }

  receiveNextScan() {
    if (!this.canAdvance()) return
    const [nextScan, ...laterScans] = this.upcomingScansValue
    this.scansValue = [...this.scansValue, nextScan]
    this.upcomingScansValue = laterScans
    this.render()
  }

  render() {
    const newestFirst = [...this.scansValue].reverse()
    this.timelineTarget.replaceChildren(...newestFirst.map((scan) => this.buildScanEntry(scan)))
    this.statusTarget.textContent = this.latestScan?.description ?? "Waiting for the first scan"
    this.element.dataset.shipmentStatus = this.latestScan?.code ?? "pending"
    this.nextScanButtonTarget.disabled = !this.canAdvance()
    this.renderDetails(this.latestScan)
  }

  buildScanEntry(scan) {
    const entry = document.createElement("li")
    const scannedAt = document.createElement("time")
    scannedAt.dateTime = scan.at
    scannedAt.textContent = scanTimeFormatter.format(new Date(scan.at))
    const summary = document.createElement("span")
    summary.textContent = `${this.describeScan(scan)} · ${scan.location}`
    entry.append(scannedAt, " ", summary)
    return entry
  }

  describeScan(scan) {
    return scan.description
  }

  // Subclasses fill in their own detail targets; a plain timeline has none.
  renderDetails() {}

  canAdvance() {
    return this.upcomingScansValue.length > 0
  }

  get latestScan() {
    return this.scansValue.at(-1)
  }
}
