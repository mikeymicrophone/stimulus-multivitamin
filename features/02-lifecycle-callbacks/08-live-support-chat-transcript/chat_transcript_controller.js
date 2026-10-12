/*
 * chat_transcript_controller.js — registered as "chat-transcript"
 *
 * Teaches: a MutationObserver over content this controller doesn't own. The
 * chat stream appends messages without telling anyone, so connect() starts
 * observing the message list and disconnect() stops. While the reader is
 * following along, new messages scroll into view; otherwise they are
 * counted as unread, in a pill and in the tab title. The title belongs to
 * the whole page, so connect() remembers it and disconnect() puts it back.
 * A moved element loses its scroll position before disconnect() runs, so
 * the position is recorded as the reader scrolls and restored in connect().
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["messageList", "newMessagesButton", "body", "minimizedSummary", "minimizeButton"]

  initialize() {
    this.messageObserver = new MutationObserver((records) => this.messagesChanged(records))
    this.unreadCount = 0
    this.followingLatest = true
    this.readingPosition = 0
  }

  connect() {
    this.pageTitle = document.title
    this.messageObserver.observe(this.messageListTarget, { childList: true })
    if (this.followingLatest) {
      this.scrollToLatest()
    } else {
      this.messageListTarget.scrollTop = this.readingPosition
    }
    this.renderUnread()
  }

  disconnect() {
    this.messageObserver.disconnect()
    document.title = this.pageTitle
  }

  messagesChanged(records) {
    const newMessages = records
      .flatMap((record) => [...record.addedNodes])
      .filter((node) => node.nodeType === Node.ELEMENT_NODE && node.matches(".chat-message"))
    if (newMessages.length === 0) return

    const customerSent = newMessages.some((message) => message.dataset.sender === "customer")
    if (customerSent || this.isReading) {
      this.scrollToLatest()
    } else {
      this.unreadCount += newMessages.length
      this.renderUnread()
    }
  }

  trackScroll() {
    const list = this.messageListTarget
    this.readingPosition = list.scrollTop
    this.followingLatest = list.scrollTop + list.clientHeight >= list.scrollHeight - 24
    if (this.followingLatest && this.isReading) this.markAllRead()
  }

  jumpToLatest() {
    this.scrollToLatest()
  }

  toggleMinimized() {
    this.bodyTarget.hidden = !this.bodyTarget.hidden
    this.minimizeButtonTarget.textContent = this.bodyTarget.hidden ? "Expand" : "Minimize"
    if (!this.bodyTarget.hidden && this.followingLatest) this.scrollToLatest()
    this.renderUnread()
  }

  visibilityChanged() {
    if (this.isReading && this.followingLatest) this.markAllRead()
  }

  scrollToLatest() {
    this.messageListTarget.scrollTop = this.messageListTarget.scrollHeight
    this.followingLatest = true
    this.markAllRead()
  }

  markAllRead() {
    this.unreadCount = 0
    this.renderUnread()
  }

  renderUnread() {
    const unreadLabel = this.unreadCount === 1 ? "1 new message" : `${this.unreadCount} new messages`
    this.newMessagesButtonTarget.hidden = this.unreadCount === 0 || this.bodyTarget.hidden
    this.newMessagesButtonTarget.textContent = `${unreadLabel} ↓`
    this.minimizedSummaryTarget.textContent = this.bodyTarget.hidden && this.unreadCount > 0 ? unreadLabel : ""
    document.title = this.unreadCount > 0 ? `(${this.unreadCount}) ${this.pageTitle}` : this.pageTitle
  }

  get isReading() {
    return this.followingLatest && !this.bodyTarget.hidden && document.visibilityState === "visible"
  }
}
