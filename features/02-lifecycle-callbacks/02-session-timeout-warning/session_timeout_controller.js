/*
 * session_timeout_controller.js — registered as "session-timeout"
 *
 * Teaches: cleaning up global listeners and timers. Activity listeners go on
 * document, outside this controller's element, so Stimulus knows nothing
 * about them. They are added with an AbortController's signal, and one
 * abort() removes them all. They come off while the warning is showing (only
 * "Stay signed in" may extend the session) and go back on afterward, so
 * each round needs a new AbortController. disconnect() aborts the listeners
 * and clears every timer, so a signed-out page has no session left running.
 */
import { Controller } from "@hotwired/stimulus"

const activityEvents = ["pointerdown", "keydown", "wheel", "touchstart"]

export default class extends Controller {
  static targets = ["warning", "countdown", "idleStatus"]
  static values = {
    timeoutSeconds: { type: Number, default: 600 },
    warningSeconds: { type: Number, default: 120 },
  }

  initialize() {
    this.activityListeners = null
    this.warningTimer = null
    this.countdownTimer = null
  }

  connect() {
    this.lastActivityAt = Date.now()
    this.warningTarget.hidden = true
    this.listenForActivity()
    this.scheduleCheck()
  }

  disconnect() {
    this.stopListeningForActivity()
    clearTimeout(this.warningTimer)
    clearInterval(this.countdownTimer)
    this.warningTimer = null
    this.countdownTimer = null
  }

  recordActivity = () => {
    this.lastActivityAt = Date.now()
  }

  staySignedIn() {
    clearInterval(this.countdownTimer)
    this.countdownTimer = null
    this.warningTarget.hidden = true
    this.lastActivityAt = Date.now()
    this.listenForActivity()
    this.scheduleCheck()
    this.idleStatusTarget.textContent = "Session extended."
  }

  // Timers can fire late or not at all while a laptop sleeps, so this also
  // runs when the tab regains focus or becomes visible again.
  checkDeadline() {
    if (!this.element.isConnected) return
    const idleMilliseconds = Date.now() - this.lastActivityAt
    if (idleMilliseconds >= this.timeoutSecondsValue * 1000) {
      this.expire()
    } else if (idleMilliseconds >= this.warningStartsAfterMilliseconds) {
      this.showWarning()
    } else {
      this.scheduleCheck()
    }
  }

  // Activity only moves lastActivityAt. The timer checks it when it fires,
  // so a burst of keystrokes doesn't reset a timeout on every key.
  scheduleCheck() {
    clearTimeout(this.warningTimer)
    const warningStartsAt = this.lastActivityAt + this.warningStartsAfterMilliseconds
    this.warningTimer = setTimeout(() => this.checkDeadline(), Math.max(0, warningStartsAt - Date.now()))
  }

  showWarning() {
    if (this.countdownTimer !== null) return
    this.stopListeningForActivity()
    this.warningTarget.hidden = false
    this.renderCountdown()
    this.countdownTimer = setInterval(() => {
      this.renderCountdown()
      if (this.secondsUntilSignOut === 0) this.expire()
    }, 1000)
  }

  expire() {
    clearInterval(this.countdownTimer)
    clearTimeout(this.warningTimer)
    this.countdownTimer = null
    this.warningTimer = null
    this.dispatch("expired")
  }

  listenForActivity() {
    // An AbortController aborts only once, and addEventListener() with an
    // already-aborted signal silently adds nothing. Make a new one each time.
    this.activityListeners = new AbortController()
    const { signal } = this.activityListeners
    for (const eventName of activityEvents) {
      document.addEventListener(eventName, this.recordActivity, { signal, capture: true, passive: true })
    }
  }

  stopListeningForActivity() {
    this.activityListeners?.abort()
    this.activityListeners = null
  }

  renderCountdown() {
    const secondsLeft = this.secondsUntilSignOut
    this.countdownTarget.textContent = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
  }

  get secondsUntilSignOut() {
    const signOutAt = this.lastActivityAt + this.timeoutSecondsValue * 1000
    return Math.max(0, Math.ceil((signOutAt - Date.now()) / 1000))
  }

  get warningStartsAfterMilliseconds() {
    return (this.timeoutSecondsValue - this.warningSecondsValue) * 1000
  }
}
