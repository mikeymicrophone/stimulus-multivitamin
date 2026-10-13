/*
 * relay_log_controller.js — registered as "relay-log"
 *
 * Teaches: a listener may dispatch before the rest of
 * the outer listener list runs. The nested event's
 * listeners finish first. The hop limit stops the
 * echo from answering forever. defaultPrevented on
 * the reply is not defaultPrevented on the strike.
 * prefix has to be "bell-relay" here. This controller's
 * own identifier would name the events relay-log:reply
 * and relay-log:strike, and those actions would not run.
 */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  answer(event) {
    event.detail.tape.push("answer")
    if (!event.detail.echo) return
    const reply = this.dispatch("reply", {
      prefix: "bell-relay",
      detail: {
        hops: event.detail.hops,
        tape: event.detail.tape,
        veto: event.detail.vetoReply
      }
    })
    event.detail.tape.push(reply.defaultPrevented ? "reply-vetoed" : "reply-open")
    if (event.detail.hops < event.detail.limit) {
      this.dispatch("strike", {
        prefix: "bell-relay",
        detail: {
          echo: true,
          hops: event.detail.hops + 1,
          limit: event.detail.limit,
          vetoReply: event.detail.vetoReply,
          tape: event.detail.tape
        }
      })
    }
  }

  record(event) {
    event.detail.tape.push("record")
    event.detail.tape.push(event.defaultPrevented ? "strike-vetoed" : "strike-open")
  }

  fileReply(event) {
    event.detail.tape.push("file-reply")
    if (event.detail.veto) event.preventDefault()
  }
}
