# Dispatching custom events · 02 · Coupeville landing slip

Penn Cove. The slip caller lands a boat and chooses the
prefix. The log counts which event name arrived.

**What it teaches**

- Omitting `prefix` uses the identifier:
  `slip-caller:landed`.
- `prefix: "terminal"` fires `terminal:landed`.
- `prefix: false` and `prefix: ""` fire `landed`. There is
  no colon and no identifier. `null` and `0` do the same,
  because the name is built with `prefix ? prefix + ":" + name : name`.
- `prefix: "false"` fires `false:landed`. The word is
  truthy, so it is kept. It does not hit the bare listener.

**Files**

| File | Role |
| --- | --- |
| [`index.html`](index.html) | The log and the six landing buttons |
| [`slip_caller_controller.js`](slip_caller_controller.js) | Passes each prefix |
| [`slip_log_controller.js`](slip_log_controller.js) | Counts the four event names |

**Try it**

The log opens "default 0. terminal 0. bare 0. word 0." The
caller says "No landing yet." Default prefix. The caller
says "type slip-caller:landed." The log says "default 1.
terminal 0. bare 0. word 0." Terminal prefix. The caller
says "type terminal:landed." and terminal becomes 1. Prefix
false. The caller says "type landed." and bare becomes 1.
Empty prefix. The caller says "type landed." and bare
becomes 2. The word false. The caller says "type
false:landed." Word becomes 1 and bare stays 2. Falsy
prefixes. The caller says "falsy types landed landed landed
landed." Bare becomes 6. Default, terminal, and word stay
where they were.
