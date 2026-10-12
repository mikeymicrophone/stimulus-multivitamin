/*
 * photo_carousel_controller.js — registered as "photo-carousel"
 *
 * Teaches: one timer, many reasons to stop it, and which reasons survive a
 * reconnect. Autoplay runs only while nothing pauses it: off screen (an
 * IntersectionObserver), a hidden tab, the pointer or keyboard focus on the
 * photos, a reduced-motion preference (a MediaQueryList listener, which
 * data-action can't reach), or the visitor's own Pause. connect() rebuilds
 * the set from scratch on every connection. Only the visitor's choice and
 * the current photo are kept on the instance, because a carousel moved
 * while the pointer was over it may never receive pointerleave.
 */
import { Controller } from "@hotwired/stimulus"

const pauseReasonLabels = {
  offscreen: "off screen",
  "hidden-tab": "tab hidden",
  pointer: "pointer on photos",
  focus: "keyboard focus on photos",
  "reduced-motion": "reduced motion preferred",
  visitor: "paused by you",
}

export default class extends Controller {
  static targets = ["slide", "position", "autoplayStatus", "pauseButton"]
  static values = { intervalSeconds: { type: Number, default: 5 } }

  initialize() {
    this.currentIndex = 0
    this.pausedByVisitor = false
    this.advanceTimer = null
    this.visibilityObserver = new IntersectionObserver(
      ([entry]) => this.setPauseReason("offscreen", !entry.isIntersecting),
      { threshold: 0.5 }
    )
  }

  connect() {
    // Assume off screen until the observer's first report, which arrives
    // right after observe(), so an offscreen carousel never starts.
    this.pauseReasons = new Set(["offscreen"])
    if (this.pausedByVisitor) this.pauseReasons.add("visitor")
    if (document.visibilityState === "hidden") this.pauseReasons.add("hidden-tab")

    this.motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (this.motionPreference.matches) this.pauseReasons.add("reduced-motion")
    this.preferenceListeners = new AbortController()
    this.motionPreference.addEventListener(
      "change",
      () => this.setPauseReason("reduced-motion", this.motionPreference.matches),
      { signal: this.preferenceListeners.signal }
    )

    this.visibilityObserver.observe(this.element)
    this.showSlide(this.currentIndex)
    this.updatePlayback()
  }

  disconnect() {
    this.visibilityObserver.unobserve(this.element)
    this.preferenceListeners.abort()
    this.stopAdvancing()
  }

  next() {
    this.showSlide(this.currentIndex + 1)
    this.restartAdvancing()
  }

  previous() {
    this.showSlide(this.currentIndex - 1)
    this.restartAdvancing()
  }

  togglePause() {
    this.pausedByVisitor = !this.pausedByVisitor
    this.setPauseReason("visitor", this.pausedByVisitor)
  }

  pointerEntered() {
    this.setPauseReason("pointer", true)
  }

  pointerLeft() {
    this.setPauseReason("pointer", false)
  }

  focusEntered() {
    this.setPauseReason("focus", true)
  }

  focusLeft(event) {
    if (!this.element.contains(event.relatedTarget)) this.setPauseReason("focus", false)
  }

  tabVisibilityChanged() {
    this.setPauseReason("hidden-tab", document.visibilityState === "hidden")
  }

  setPauseReason(reason, active) {
    if (active) {
      this.pauseReasons.add(reason)
    } else {
      this.pauseReasons.delete(reason)
    }
    this.updatePlayback()
  }

  updatePlayback() {
    if (this.pauseReasons.size === 0) {
      if (this.advanceTimer === null) this.advanceTimer = setInterval(() => this.showSlide(this.currentIndex + 1), this.intervalSecondsValue * 1000)
    } else {
      this.stopAdvancing()
    }
    this.renderStatus()
  }

  restartAdvancing() {
    this.stopAdvancing()
    this.updatePlayback()
  }

  stopAdvancing() {
    clearInterval(this.advanceTimer)
    this.advanceTimer = null
  }

  showSlide(index) {
    const slideCount = this.slideTargets.length
    this.currentIndex = (index + slideCount) % slideCount
    this.slideTargets.forEach((slide, slideIndex) => {
      slide.hidden = slideIndex !== this.currentIndex
    })
    this.positionTarget.textContent = `${this.currentIndex + 1} / ${slideCount}`
  }

  renderStatus() {
    this.autoplayStatusTarget.textContent = this.pauseReasons.size === 0
      ? "Autoplay on"
      : `Paused: ${[...this.pauseReasons].map((reason) => pauseReasonLabels[reason]).join(", ")}`
    this.pauseButtonTarget.textContent = this.pausedByVisitor ? "Play" : "Pause"
    this.pauseButtonTarget.setAttribute("aria-pressed", String(this.pausedByVisitor))
  }
}
