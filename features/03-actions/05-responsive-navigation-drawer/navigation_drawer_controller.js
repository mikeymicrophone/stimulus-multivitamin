/*
 * navigation_drawer_controller.js — registered as "navigation-drawer"
 *
 * Teaches: where an action can live. The controller sits on the page shell
 * so the header's menu button, the drawer, the scrim, and the footer's
 * "All departments" button are all inside its element and can call it. The
 * promo strip above the shell is outside, so a data-action there would
 * silently do nothing; it links to #departments instead, and
 * hashchange@window brings the request in. resize@window stands in for a
 * media-query change listener, because @window and @document are the only
 * global targets a descriptor can name.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["drawer", "menuButton", "scrim"]
  static values = { wideLayoutQuery: String }

  initialize() {
    this.isOpen = false
  }

  connect() {
    this.wideLayout = this.wideLayoutMatches
    this.render()
    this.openForHash()
  }

  toggle() {
    if (this.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    if (!this.wideLayout) {
      this.isOpen = true
      this.render()
    }
    this.drawerTarget.querySelector("a").focus()
  }

  close() {
    if (!this.isOpen) return
    this.dismiss()
    if (!this.wideLayout) this.menuButtonTarget.focus()
  }

  closeOnEscape(event) {
    if (event.key === "Escape") this.close()
  }

  // The link still navigates; only the drawer gets out of the way.
  chooseDepartment() {
    if (this.isOpen) this.dismiss()
  }

  openForHash() {
    if (location.hash === "#departments") this.open()
  }

  adaptToWidth() {
    const wideLayout = this.wideLayoutMatches
    if (wideLayout === this.wideLayout) return
    this.wideLayout = wideLayout
    if (wideLayout) this.isOpen = false
    this.render()
  }

  dismiss() {
    this.isOpen = false
    // A second click on the same #departments link fires no hashchange, so
    // drop the hash once the drawer has answered it.
    if (location.hash === "#departments") history.replaceState(history.state, "", location.pathname + location.search)
    this.render()
  }

  render() {
    const drawerShowing = this.wideLayout || this.isOpen
    this.drawerTarget.classList.toggle("open", this.isOpen)
    this.drawerTarget.inert = !drawerShowing
    this.scrimTarget.hidden = this.wideLayout || !this.isOpen
    this.menuButtonTarget.setAttribute("aria-expanded", String(this.isOpen))
  }

  get wideLayoutMatches() {
    return window.matchMedia(this.wideLayoutQueryValue).matches
  }
}
