/*
 * scoreboard_controller.js — registered as "scoreboard"
 *
 * Teaches: page-level actions that move and remove polling elements. Pinning
 * a game moves its tile to the top, so Stimulus disconnects and reconnects
 * the same score-poller instance: the poll in flight is aborted and a new
 * one starts from the saved cursor. Unfollowing removes the tile, and its
 * score-poller stops for good.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["gameList", "game", "followingSummary"]

  connect() {
    this.renderFollowingSummary()
  }

  pinGame(event) {
    const gameTile = event.target.closest('[data-scoreboard-target="game"]')
    for (const tile of this.gameTargets) tile.classList.toggle("pinned", tile === gameTile)
    this.gameListTarget.prepend(gameTile)
  }

  unfollowGame(event) {
    event.target.closest('[data-scoreboard-target="game"]').remove()
    this.renderFollowingSummary()
  }

  renderFollowingSummary() {
    const gameCount = this.gameTargets.length
    this.followingSummaryTarget.textContent = gameCount === 0
      ? "You're not following any games."
      : `Following ${gameCount} ${gameCount === 1 ? "game" : "games"}`
  }
}
