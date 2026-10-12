# Discoveries

Non-obvious or undocumented Stimulus behaviors found while bottling this
catalog, plus a few browser and DOM gotchas that show up inside Stimulus
code, and one note about serving the scenarios. Every entry was verified
on **Stimulus 3.2.2** (the version every page pins) either by a scenario
in this repository or by a scripted browser check against that scenario.

Each entry has a short title, what happens, why it matters, what to do
about it, and a link to the scenario that shows it. Entries that sit on
the line between Stimulus and the platform get a one-line note saying
why they are in the section they are in.

## Controllers

### Targets vanish in `disconnect()` after the identifier is removed

**What happens.** Removing a controller's token from `data-controller`
disconnects that instance while the element stays in the document. During
`disconnect()`, the element no longer matches
`[data-controller~="that-identifier"]`, so target lookups come back empty.

**Why it matters.** Cleanup that reads `this.toolbarTarget` or
`this.hasSaveButtonTarget` does nothing. The toolbar stays visible, fields
stay `contenteditable`, and buttons stay bound to a controller that is
gone.

**What to do.** Keep the elements `disconnect()` has to restore, from
`connect()` (or from the action that started the work), in instance
properties.

**Seen in:** [Recipe card collection](features/01-controllers/05-recipe-card-collection/).

### Action params turn all-digit strings into numbers

**What happens.** `data-[identifier]-[name]-param` values go through
`JSON.parse`. A string of digits becomes a number, so a UPC like
`084271003318` arrives in `event.params` as `84271003318`.

**Why it matters.** Leading zeros disappear. Codes, zip codes, and
international phone numbers that are "numbers that look like strings" get
corrupted before the action runs.

**What to do.** Keep those codes in `value=""` on the button, or in a
`data-*` attribute you read yourself. Don't put an all-digit identifier
in an action param.

**Seen in:** [Warehouse pick list](features/01-controllers/12-warehouse-pick-list/).

## Lifecycle callbacks

### Callback order is initialize, value-changed, target-connected, then connect

**What happens.** On the way in, Stimulus calls `initialize()` once,
then every `[name]ValueChanged()`, then every `[name]TargetConnected()`,
then `connect()`. On the way out it calls `disconnect()` first, then
`[name]TargetDisconnected()`.

**Why it matters.** A `*TargetConnected()` that observes a target can't
create the observer in `connect()` — `connect()` hasn't run yet. A
`*ValueChanged()` that looks up a parent in `connect()` has the same
problem. Teardown that expects targets to disappear first is also wrong:
`disconnect()` still sees them.

**What to do.** Create observers in `initialize()`. Look up neighbors
on first use, in a getter, and keep the reference. Tear targets down in
`*TargetDisconnected()` if the work is per-target, and in `disconnect()`
if it is per-instance.

**Seen in:** [Infinite-scroll product feed](features/02-lifecycle-callbacks/05-infinite-scroll-product-feed/),
[Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/).

### Value-changed callbacks re-fire on every reconnect

**What happens.** Moving an element, or removing it and putting the same
node back, runs `[name]ValueChanged()` again with the same value. The
callback is not only for writes.

**Why it matters.** A callback that starts a clock, opens a socket, or
increments a counter will do that on every drag-reorder or filter toggle.

**What to do.** Make the callback idempotent: starting something that is
already running is a no-op.

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/).

### A move is `disconnect()` then `connect()` on the same instance, and `isConnected` is true inside `disconnect()`

**What happens.** `element.parentNode.insertBefore(...)` that relocates a
connected node fires `disconnect()` and then `connect()` on the existing
instance. Inside that `disconnect()`, `this.element.isConnected` is already
`true` — the node is in its new place before Stimulus reacts.

**Why it matters.** Teardown that always clears timers and document
listeners will kill a drag session or a clock at the first reorder. You
cannot tell a move from a real removal by checking `isConnected` alone if
you also remove the identifier from `data-controller` (that case is
`isConnected === true` too).

**What to do.** Skip teardown when `this.element.isConnected` is true.
If the identifier might be removed while the element stays put, also
check `this.element.matches('[data-controller~="…"]')`.

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/).

**Why this section.** The element staying in the document is the DOM;
the surprise is that Stimulus still runs `disconnect()` then `connect()`
for that move.

### Re-inserting an element reuses the instance and skips `initialize()`

**What happens.** `element.remove()` followed by putting the same node
back reconnects the existing controller. `initialize()` does not run
again. New HTML, even if it looks identical, gets a new instance.

**Why it matters.** Deadlines, subscriptions, and "run once" setup that
belong in `initialize()` survive a hide/show. Reloading the same-looking
markup from the server does not — you get a fresh instance and a restarted
clock.

**What to do.** Put per-instance setup in `initialize()`, and per-appearance
setup in `connect()`. Treat fetched HTML as a new object.

**Seen in:** [Auction lot countdowns](features/02-lifecycle-callbacks/01-auction-lot-countdowns/),
[Resizable dashboard tiles](features/02-lifecycle-callbacks/07-resizable-dashboard-tiles/).

### Parent-before-child connect order only holds when both are registered before start

**What happens.** If every identifier is registered before
`Application.start()`, Stimulus connects in document order and a parent
connects before its children. A controller registered later (lazy load,
code splitting, `register()` after an `await`) connects at registration
time, after children that have been connected for a while.

**Why it matters.** `connect()` that does `closest()` and talks to a
parent will find nothing if the parent isn't registered yet. The reverse
assumption — "my children are already connected" — is also false on first
paint.

**What to do.** Handshakes have to work in both orders: the child retries
or waits to be collected, and the parent notices children that connect
later.

**Seen in:** [Insurance quote connect order](features/02-lifecycle-callbacks/11-insurance-quote-connect-order/).

### The parent disconnects first when a subtree is removed

**What happens.** Removing a parent element disconnects the parent, then
each child. A child's `disconnect()` cannot count on the parent still
being connected.

**Why it matters.** A child that reports "I'm leaving" to its parent during
`disconnect()` may call into a parent that has already stopped accepting
calls.

**What to do.** The parent should ignore late calls after it disconnects.
The child should keep a reference from `connect()` and tolerate a parent
that is already gone.

**Seen in:** [Insurance quote connect order](features/02-lifecycle-callbacks/11-insurance-quote-connect-order/).

### There is no unload callback

**What happens.** Closing the tab, reloading, or navigating away does not
run `disconnect()`. Stimulus watches the DOM; unloading the document does
not remove elements.

**Why it matters.** A pending autosave, an open socket, or a `document`
listener that you only clean up in `disconnect()` is still there when the
page dies — or, for the save, never happens.

**What to do.** Declare `pagehide@window` and `visibilitychange@document`
actions for work that must run as the visitor leaves. Stimulus removes
those listeners when the controller disconnects for a real DOM removal.

**Seen in:** [Autosaving draft editor](features/02-lifecycle-callbacks/06-autosaving-draft-editor/).

### Lifecycle callbacks are batched after the DOM change

**What happens.** `connect()` and `disconnect()` run from a
`MutationObserver` callback, as a microtask after the code that changed
the DOM finishes. On the line after `element.remove()`, the controller
is still connected.

**Why it matters.** Counting instances, destroying a third-party widget,
or reading layout immediately after a DOM write is one frame too early.

**What to do.** Wait until after Stimulus has reacted (`queueMicrotask`,
or the next animation frame) before asking "is it gone?".

**Seen in:** [Pet clinic visit date pickers](features/02-lifecycle-callbacks/04-pet-clinic-visit-date-pickers/).

### Events from a detached element don't reach old ancestors

**What happens.** Once an element is out of the document,
`this.element.closest()` can't find its old ancestors, and a bubbling
event dispatched from it never arrives there either.

**Why it matters.** A lot, tile, or row that announces "my clock
stopped" from `disconnect()` by dispatching on `this.element` is talking
to nobody.

**What to do.** Keep a reference to the parent element from `connect()`,
and dispatch there with `this.dispatch(name, { target: parentElement })`.

**Seen in:** [Auction lot countdowns](features/02-lifecycle-callbacks/01-auction-lot-countdowns/).

**Why this section.** The silent `closest()` / bubbling failure is the
DOM; it's here because Stimulus calls `disconnect()` after the node has
already left.

## Actions

### A descriptor without an event name is dropped if the element has no default

**What happens.** Stimulus fills in a default event only for `<a>`,
`<button>`, `<details>`, `<form>`, `<input>`, `<select>`, and
`<textarea>`. On anything else (`<div>`, `<td>`, `<label>`, `<span>`),
a bare `identifier#method` cannot be built. Stimulus skips that token
and logs nothing.

**Why it matters.** A clickable `<td>` or a `<div>` used as a button
silently does nothing.

**What to do.** Name the event: `click->harvest-board#editCell`.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/)
(the defaults table),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/)
(every cell names `click`).

### `<input type="button">` defaults to `input`, which it never fires

**What happens.** The default for `<input>` is `input`, except
`type="submit"` which is `click`. The comparison is exact and
case-sensitive: `type="SUBMIT"` falls back to `input`.
`<input type="button">` never fires `input`.

**Why it matters.** `data-action="pizza-order#repeatLastOrder"` on a
reset-looking input does nothing. No error appears.

**What to do.** Write `click->…` on `<input type="button">`, or use a
`<button type="button">`.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/).

**Why this section.** The element never firing `input` is the browser;
it's here because Stimulus is what assigned `input` as that default.

### `stopPropagation()` does not stop the next action on the same element

**What happens.** All of an element's actions for one event share one
native listener. Stimulus runs them in `data-action` order and only
stops the list when `event.stopImmediatePropagation()` is called.
`stopPropagation()` still lets the rest of that list run; it only hides
the event from ancestors, `@document`, and `@window`.

**Why it matters.** A `validate` action that "stops the event" with
`stopPropagation()` will still be followed by `subscribe` on the same
element. The invalid form is sent.

**What to do.** Call `event.stopImmediatePropagation()` to skip later
actions on the same element. Put the guard first in the list.

**Seen in:** [Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/).

### A rejected promise from an action never reaches `handleError`

**What happens.** Stimulus wraps the call to the action method. An
`async` method returns a promise before its body fails, so the throw
happens later, as an `unhandledrejection` on `window`.

**Why it matters.** `application.handleError()` never sees a failed
clipboard write or a failed fetch. The console shows a page error; your
error overlay does not.

**What to do.** Catch inside the action and update the UI yourself.

**Seen in:** [API token copy button](features/03-actions/07-api-token-copy-button/).

### A value's changed callback runs after the method that set the value has returned

**What happens.** Writing `this.ratingValue = 4` updates the data
attribute immediately. `[name]ValueChanged()` runs from a
`MutationObserver`, after the method returns.

**Why it matters.** Dispatching a custom event on the next line arrives
before the hidden field or the aria attributes have been updated, so a
parent that reads the field from the event sees the old value.

**What to do.** Dispatch from `[name]ValueChanged()`, once the markup
matches the value.

**Seen in:** [Product star rating](features/03-actions/08-product-star-rating/).

### `@window` and `@document` are the only global targets a descriptor can name

**What happens.** The descriptor grammar only accepts `@window` or
`@document`. `resize@visualViewport->…` or `change@matchMedia->…` does
not match that part of the pattern, so the whole string before `->`
becomes the event name. Stimulus listens on the element for an event
literally called `resize@visualViewport`, which never fires. No error is
logged.

**Why it matters.** A drawer that should follow a breakpoint, or a
banner that should follow `visualViewport`, silently never updates.

**What to do.** Listen on `@window` for `resize` (or on `@document` /
`@window` for an event that actually fires there) and read
`matchMedia()` or `visualViewport` inside the method.

**Seen in:** [Responsive navigation drawer](features/03-actions/05-responsive-navigation-drawer/).

### An action outside the controller's element silently does nothing

**What happens.** Stimulus only invokes an action if the event's path
is inside that controller's element (or the action is `@window` /
`@document` and the controller is still connected). A `data-action` on
markup outside the element is parsed and then ignored. No error is
logged.

**Why it matters.** A promo strip, third-party embed, or footer rendered
outside the page shell can look wired and never call the controller.

**What to do.** Move the controller up so it contains the control, or
send the request through a global event (`hashchange@window`, a custom
event on `document`) that the controller already listens for.

**Seen in:** [Responsive navigation drawer](features/03-actions/05-responsive-navigation-drawer/).

### Nested controllers with the same identifier hide inner events from the outer one

**What happens.** A controller's actions, including `@document` and
`@window` ones and actions on its own element, skip events that start
inside a nested element with the same identifier. Stimulus treats that
nested element as someone else's scope.

**Why it matters.** This is what makes a submenu's Escape close only the
submenu, and what keeps focus moving into the submenu from looking like
focus leaving the outer menu. It also means a click inside the submenu
never reaches the outer menu's `click@document` action, so an item that
should close the whole tree has to close it on purpose.

**What to do.** Let the inner controller handle events that start inside
it. Close the tree through a method the item calls
(`closeMenuTree()`), not by hoping the outer `@document` action will see
the click.

**Seen in:** [Menu that closes on outside click](features/03-actions/09-menu-that-closes-on-outside-click/).

### Removing the action's own element skips later actions for controllers outside the hole

**What happens.** After an action detaches its element, Stimulus still
walks the rest of that element's `data-action` list, but it only invokes
an action whose element is still inside its controller. A later
`shopping-cart#recalculate` on a button that just left the cart is
skipped. A later `cart-line#…` on the same button still runs, because
the button is still inside the detached line.

**Why it matters.** `cart-line#remove shopping-cart#recalculate` on
Remove looks right and leaves the totals stale.

**What to do.** Have the parent remove the child, then recalculate, in
one method.

**Seen in:** [Cart quantity steppers](features/03-actions/04-cart-quantity-steppers/).

### Actions on a brand-new element are not bound in the same turn

**What happens.** Stimulus notices `data-action` (and `data-controller`)
from a `MutationObserver`, after the code that inserted the node
returns. `button.click()` on the next line hits an element with no
actions. A microtask later (`await Promise.resolve()` or
`queueMicrotask`) is enough.

**Why it matters.** "Use these dates" that renders a month and then
clicks the offer's day does nothing. A same-turn click on a newly added
spreadsheet cell also does nothing.

**What to do.** Call the method directly (`chooseDate(isoDate)`,
`startEdit(cell)`) instead of synthesizing a click. Wait a microtask
only if you truly need the event to go through Stimulus.

**Seen in:** [Hotel booking date range](features/03-actions/10-hotel-booking-date-range/),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/).

### Method names are used exactly as written

**What happens.** Stimulus camelizes identifiers, value attributes, and
param names. It does not camelize action method names.
`unsaved-changes#save-profile` looks for a method literally called
`"save-profile"`.

**Why it matters.** The missing-method error is logged only when the
event fires. For `beforeunload@window`, that is the moment the visitor
leaves.

**What to do.** Spell the method the way it is declared. Name methods
for what they do (`saveProfile`, `trackChanges`), not for the event
(`handleInput`, `onSubmit`).

**Seen in:** [Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/).

### Hidden elements keep their actions

**What happens.** `[hidden]` only affects display. Stimulus does not
unbind actions on a hidden field. A radio the guest already chose still
listens, and a checkbox that is now on a hidden step still runs its
action if something dispatches `input` on it.

**Why it matters.** Branching UIs can keep answers on a hidden path
without rebinding when the path comes back. They can also be surprised
when a hidden control still reacts.

**What to do.** Treat hiding as hide, not as teardown. Clear values only
when you mean to.

**Seen in:** [Branching customer survey](features/03-actions/12-branching-customer-survey/).

**Why this section.** `[hidden]` only hides the element; it's here
because Stimulus is what leaves the actions bound.

### One click runs actions in a fixed order: element, ancestors, `@document`, `@window`

**What happens.** For a single event Stimulus runs:

1. actions on the event's target element, in `data-action` order;
2. actions on its ancestors, innermost first;
3. `@document` actions;
4. `@window` actions.

**Why it matters.** A toggle that opens a menu has already opened it
when that menu's `click@document` "outside" action runs for the same
click, so the menu does not immediately close. `stopPropagation()` in
the toggle would keep other open menus from hearing the click at all.

**What to do.** Let the order work for you: open first (on the button),
then let `@document` close everyone else. Don't stop propagation on a
toggle that shares the page with other menus.

**Seen in:** [Menu that closes on outside click](features/03-actions/09-menu-that-closes-on-outside-click/),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/).

## Running the examples

### `npx serve` without a trailing slash breaks relative imports

**What happens.** Scenario pages load controllers with
`import LineItemController from "./line_item_controller.js"`. That URL is
resolved against the page URL. `python3 -m http.server` serves a folder
at both `/path` and `/path/`. `npx serve` without configuration serves
`/path` as the folder's `index.html` but leaves the URL at `/path`, so
the browser asks for `/line_item_controller.js` at the repository root
and gets a 404.

**Why it matters.** Opening a catalog link that forgot the trailing slash
fails silently in the page (a blank scenario and a console error) when
someone follows the README's `npx serve .` instructions.

**What to do.** This repository's [`serve.json`](serve.json) sets
`"trailingSlash": true`, so `npx serve` redirects `/path` to `/path/`.
Catalog links in `index.html` already include the slash
(`features/01-controllers/01-invoice-line-items/`). Extra pages that
must load under `npx serve` (a dashboard, a fetched fragment) live in
their own folder as `index.html`, not as `dashboard.html`.

**Seen in:** [CONTRIBUTING.md](CONTRIBUTING.md) (the trailing-slash
rule), [Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/)
(the dashboard is `dashboard/`, not `dashboard.html`),
[Spreadsheet-style cell editing](features/03-actions/13-spreadsheet-style-cell-editing/)
(last week's extras are `last-week/extra-crops/`).

## Browser gotchas that bite Stimulus code

These are the platform, not Stimulus. They belong here because they show
up inside actions, callbacks, and `data-action` descriptors, and the
fix is usually in the Stimulus code.

### `[hidden]` loses to any author `display` rule

**What happens.** The user-agent stylesheet hides `[hidden]` with
`display: none`. A class or element rule that sets `display: flex`,
`display: grid`, or `display: block` wins, and the element shows.

**Why it matters.** A banner, drawer, dialog, or toolbar that uses
`hidden` and also sets `display` in the page stylesheet appears on load
even though the markup says it shouldn't.

**What to do.** Every scenario page includes
`[hidden] { display: none !important; }` in its own `<style>`. The shared
stylesheet does not, because scenarios must still work if that file fails
to load.

**Seen in:** [Offline connection banner](features/03-actions/11-offline-connection-banner/)
(the banner is `display: flex` and `[hidden]` on load), and every
Controllers scenario from
[Restaurant seat picker](features/01-controllers/02-restaurant-seat-picker/)
onward.

### Setting `.value` or `.checked` from code fires no events

**What happens.** Assigning to a field's `.value` or `.checked` does not
dispatch `input` or `change`. None of that field's actions run.

**Why it matters.** "Repeat last order", "use this address", and
"restore the saved profile" update the fields and leave the rest of the
UI stale if they wait for actions to catch up.

**What to do.** Call the render method yourself, or dispatch the event
you want (`field.dispatchEvent(new Event("input", { bubbles: true }))`)
so the field's actions run in their usual order.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/),
[Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/).

### A `<details>` rendered open fires `toggle` before Stimulus is listening

**What happens.** The browser fires `toggle` when it applies the `open`
attribute during parsing. Stimulus binds actions later, so that first
event is missed.

**Why it matters.** A `toggle` action that shows or hides related fields
never sees the starting state of a `<details open>`.

**What to do.** Read `.open` in `connect()` and render from that.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/).

**Why this section.** The early `toggle` is the browser; the miss happens
because Stimulus binds actions after parse.

### The browser's own validation can swallow `submit` before any action sees it

**What happens.** A field with `required` or `type="email"` and no
`novalidate` on the form makes the browser cancel `submit`. No `submit`
action runs.

**Why it matters.** Your `validateSignup` and `saveProfile` never fire,
and you get the browser's bubble instead of your own messages.

**What to do.** Put `novalidate` on the form and validate in the action.

**Seen in:** [Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/),
[Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/).

### `HTMLFormElement.submit()` never fires `submit`

**What happens.** `form.submit()` from JavaScript submits (or, in this
catalog, navigates) without dispatching a `submit` event.
`form.requestSubmit()` and a clicked submit button do dispatch it.

**Why it matters.** A `data-action` on the form that prevents the default
and saves in place never runs if some other script calls `.submit()`.

**What to do.** Use `requestSubmit()`, or click the submit button, or
call the save method directly.

**Seen in:** [Pizza order builder](features/03-actions/01-pizza-order-builder/).

### `event.currentTarget` is `null` after an `await` that waits for a later task

**What happens.** The browser sets `event.currentTarget` only while the
event is being dispatched. After `await navigator.clipboard.writeText()`,
`await fetch(...)`, or `await` a timer, it is `null`.
`await Promise.resolve()` can still look fine, because that promise
settles before dispatch moves on.

**Why it matters.** `event.currentTarget.disabled = true` after a fetch
throws. The bug only shows up once real work is awaited, so it passes a
check that `await`s a resolved promise.

**What to do.** Take what you need from the event before the first
`await`: `async rollSecret({ currentTarget: rollButton })`.

**Seen in:** [API token copy button](features/03-actions/07-api-token-copy-button/).

**Why this section.** Clearing `currentTarget` is the Event object's
lifetime; it shows up here because the usual trigger is an `async`
Stimulus action.

### `focus` and `blur` do not bubble

**What happens.** `focus` and `blur` fire only on the element that gained
or lost focus. They never reach an ancestor. `focusin` and `focusout`
fire at the same moments and do bubble. The same split exists for
`pointerenter` / `pointerleave` versus `pointerover` / `pointerout`, and
for `mouseenter` / `mouseleave` versus `mouseover` / `mouseout`. `toggle`
on `<details>` has no bubbling twin.

**Why it matters.** `focus->product-review#highlightAspect` on the form
never runs when a star row is focused, so the form has no idea which
aspect is active.

**What to do.** Put non-bubbling listeners on the element that actually
fires them, or use the bubbling twin (`focusin`, `focusout`,
`pointerover`, `pointerout`).

**Seen in:** [Product star rating](features/03-actions/08-product-star-rating/).

### The `reset` event fires before the form resets

**What happens.** A `reset` action runs while the fields still hold the
edits. The native reset then puts back the values from the page's
markup, not the last save. Even a microtask after the action is too
early; a `setTimeout(0)` is late enough to see the markup values.

**Why it matters.** "Discard changes" that lets the native reset through
throws away a successful save and restores page-load data.

**What to do.** `event.preventDefault()` and restore the last save
yourself.

**Seen in:** [Unsaved-changes guard](features/03-actions/06-unsaved-changes-guard/).

### `online` and `offline` fire on `window` only

**What happens.** The browser dispatches `online` and `offline` on
`window`. They do not fire on `document` and they do not bubble there.
`visibilitychange` fires on `document` and does bubble to `window`.

**Why it matters.** `offline@document->…` never runs. A banner that used
`@document` for both kinds of event would only ever see the tab hiding.

**What to do.** Use `online@window` and `offline@window`. Read
`navigator.onLine` in `connect()` for the state the page loaded in;
these events report changes only.

**Seen in:** [Offline connection banner](features/03-actions/11-offline-connection-banner/).

**Why this section.** Where the browser fires the event is the platform;
the silent miss is a Stimulus `@document` descriptor that looks valid.

### Setting `location.hash` to the value it already has fires no `hashchange`

**What happens.** Assigning `location.hash = "#departments"` when the
hash is already `#departments` dispatches nothing.

**Why it matters.** A promo link that opens the drawer through
`hashchange@window` works once and then seems broken.

**What to do.** After answering the hash, clear it with
`history.replaceState(...)` so the next click is a real change. Also
read the hash in `connect()` for a shared URL.

**Seen in:** [Responsive navigation drawer](features/03-actions/05-responsive-navigation-drawer/).

### Scroll position is already reset before `disconnect()`

**What happens.** Moving an element resets its `scrollTop` as part of the
move. Stimulus reacts after the move, so `disconnect()` reads `0`.

**Why it matters.** Saving scroll in `disconnect()` and restoring it in
`connect()` always restores `0`.

**What to do.** Record the offset on every `scroll` event and restore it
in `connect()`.

**Seen in:** [Live support chat transcript](features/02-lifecycle-callbacks/08-live-support-chat-transcript/).

**Why this section.** The scroll offset is already gone before Stimulus
runs; `disconnect()` is just too late to read it.

### A moved element never gets `pointerleave`

**What happens.** If you move or remove the element that is under the
pointer, the browser does not fire `pointerleave` (or `mouseleave`) on
it. The pointer is still "inside" as far as that element knows.

**Why it matters.** A hover-to-pause flag kept across a reconnect stays
true forever, and the carousel, tooltip, or menu never resumes.

**What to do.** Recompute pointer state on `connect()`. Don't keep
"the pointer is over me" across a move.

**Seen in:** [Carousel that pauses offscreen](features/02-lifecycle-callbacks/09-carousel-that-pauses-offscreen/).

**Why this section.** Missing `pointerleave` is the browser; it bites
because a Stimulus reconnect would otherwise restore a stale hover flag.

### An already-aborted `AbortSignal` silently adds nothing

**What happens.** `AbortController.abort()` can only happen once.
`addEventListener(..., { signal })` with an already-aborted signal
attaches no listener and throws nothing.

**Why it matters.** An `AbortController` created in `initialize()` and
aborted in `disconnect()` is spent. The next `connect()` adds no
listeners, and the page looks fine until the feature just stops working.

**What to do.** Make a new `AbortController` every time you start
listening.

**Seen in:** [Session timeout warning](features/02-lifecycle-callbacks/02-session-timeout-warning/).

**Why this section.** `addEventListener` ignoring a spent signal is the
platform; the usual victim is a controller that aborts in `disconnect()`
and listens again in `connect()`.
