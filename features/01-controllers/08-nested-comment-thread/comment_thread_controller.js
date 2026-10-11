/*
 * comment_thread_controller.js — registered as "comment-thread"
 *
 * Teaches: the same elements look different from different scopes. Every
 * comment element is also a "comment" target of the thread, and because the
 * thread is not nested inside itself, its commentTargets include every
 * comment at every depth. Each comment controller, by contrast, sees only
 * its own targets. The thread also owns the template that new comments are
 * cloned from; Stimulus connects a fresh comment instance for each clone.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["comment", "commentList", "commentTemplate", "commentCount", "newCommentText"]
  static values = { viewerName: String }

  commentTargetConnected() {
    this.renderCommentCount()
  }

  commentTargetDisconnected() {
    this.renderCommentCount()
  }

  postComment(event) {
    event.preventDefault()
    const commentText = this.newCommentTextTarget.value.trim()
    if (commentText === "") {
      this.newCommentTextTarget.focus()
      return
    }
    this.commentListTarget.append(this.buildComment(commentText))
    this.newCommentTextTarget.value = ""
  }

  buildComment(commentText) {
    const commentElement = this.commentTemplateTarget.content.firstElementChild.cloneNode(true)
    commentElement.querySelector('[data-comment-target~="author"]').textContent = this.viewerNameValue
    commentElement.querySelector(".comment-body").textContent = commentText
    return commentElement
  }

  renderCommentCount() {
    const commentCount = this.commentTargets.length
    this.commentCountTarget.textContent = commentCount === 1 ? "1 comment" : `${commentCount} comments`
  }
}
