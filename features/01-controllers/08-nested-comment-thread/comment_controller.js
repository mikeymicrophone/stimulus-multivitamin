/*
 * comment_controller.js — registered as "comment"
 *
 * Teaches: a controller nested inside itself. Every comment, at any depth,
 * is a "comment" instance, and each instance's scope ends where a nested
 * comment begins. this.bodyTarget is this comment's body, never a reply's,
 * and clicking a reply's "Reply" button runs only the innermost comment's
 * action. Comments find their parent instance through the application and
 * report reply counts up the chain.
 */
import { Controller } from "@hotwired/stimulus"

const MAX_REPLY_DEPTH = 4

export default class extends Controller {
  static targets = ["author", "replyForm", "replyText", "replies", "repliesToggle"]

  connect() {
    this.thread = this.findController(this.element.closest('[data-controller~="comment-thread"]'), "comment-thread")
    this.parentComment = this.findController(this.element.parentElement.closest('[data-controller~="comment"]'), "comment")
    this.depth = this.parentComment ? this.parentComment.depth + 1 : 1
    this.renderRepliesToggle()
    this.parentComment?.replyCountChanged()
  }

  disconnect() {
    // When a whole branch is deleted, its replies disconnect after it does.
    if (this.parentComment?.element.isConnected) this.parentComment.replyCountChanged()
    this.parentComment = null
  }

  toggleReplyForm() {
    this.replyFormTarget.hidden = !this.replyFormTarget.hidden
    if (!this.replyFormTarget.hidden) this.replyTextTarget.focus()
  }

  submitReply(event) {
    event.preventDefault()
    const replyText = this.replyTextTarget.value.trim()
    if (replyText === "" || !this.thread) {
      this.replyTextTarget.focus()
      return
    }

    // Past the depth limit, a reply joins its parent's replies and @mentions
    // the person it answers, so threads stay readable on a phone.
    if (this.depth >= MAX_REPLY_DEPTH && this.parentComment) {
      this.parentComment.appendReply(this.thread.buildComment(`@${this.authorName} ${replyText}`))
    } else {
      this.appendReply(this.thread.buildComment(replyText))
    }
    this.replyTextTarget.value = ""
    this.replyFormTarget.hidden = true
  }

  appendReply(commentElement) {
    this.repliesTarget.hidden = false
    this.repliesTarget.append(commentElement)
  }

  toggleReplies() {
    this.repliesTarget.hidden = !this.repliesTarget.hidden
    this.renderRepliesToggle()
  }

  deleteComment() {
    this.element.remove()
  }

  replyCountChanged() {
    this.renderRepliesToggle()
    this.parentComment?.replyCountChanged()
  }

  renderRepliesToggle() {
    const replyTotal = this.replyTotal
    const replyWord = replyTotal === 1 ? "reply" : "replies"
    this.repliesToggleTarget.hidden = replyTotal === 0
    this.repliesToggleTarget.textContent = this.repliesTarget.hidden
      ? `Show ${replyTotal} ${replyWord}`
      : `Hide ${replyTotal} ${replyWord}`
  }

  get replyTotal() {
    return this.directReplies.reduce((runningTotal, reply) => runningTotal + 1 + reply.replyTotal, 0)
  }

  get directReplies() {
    return [...this.repliesTarget.children]
      .map((replyElement) => this.findController(replyElement, "comment"))
      .filter((reply) => reply !== null)
  }

  get authorName() {
    return this.authorTarget.textContent.trim()
  }

  findController(element, identifier) {
    return element ? this.application.getControllerForElementAndIdentifier(element, identifier) : null
  }
}
