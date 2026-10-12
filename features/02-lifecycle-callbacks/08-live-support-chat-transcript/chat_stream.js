/*
 * chat_stream.js — not a controller
 *
 * Stands in for a server push channel, such as Turbo Streams over a
 * WebSocket. It appends rendered messages to the element with the given id,
 * looking the id up each time the way a stream action does, and knows
 * nothing about Stimulus. It stops once that element is gone.
 */
const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" })

export function startChatStream({ messageListId, agentName, scriptedReplies, secondsBetweenReplies, acknowledgement }) {
  let nextMessageNumber = document.querySelectorAll(`#${messageListId} .chat-message`).length + 1
  const pendingReplies = [...scriptedReplies]

  const appendMessage = (sender, text) => {
    const messageList = document.getElementById(messageListId)
    if (!messageList) {
      stop()
      return
    }
    const message = document.createElement("li")
    message.className = `chat-message from-${sender}`
    message.dataset.sender = sender
    message.dataset.messageNumber = String(nextMessageNumber++)
    const byline = document.createElement("span")
    byline.className = "chat-byline"
    byline.textContent = `${sender === "agent" ? agentName : "You"} · ${timeFormatter.format(new Date())}`
    const body = document.createElement("p")
    body.textContent = text
    message.append(byline, body)
    messageList.append(message)
  }

  const replyTimer = setInterval(() => {
    if (pendingReplies.length > 0) appendMessage("agent", pendingReplies.shift())
  }, secondsBetweenReplies * 1000)

  const customerMessageSent = ({ detail: { text } }) => {
    appendMessage("customer", text)
    setTimeout(() => appendMessage("agent", acknowledgement), 2500)
  }
  document.addEventListener("support-chat:customer-message", customerMessageSent)

  function stop() {
    clearInterval(replyTimer)
    document.removeEventListener("support-chat:customer-message", customerMessageSent)
  }
}
