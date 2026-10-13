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

**Seen in:** [Recipe card collection](features/01-controllers/05-recipe-card-collection/),
[Pilot boarding board](features/08-target-callbacks/01-pilot-boarding-board/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/),
[Neah Bay entrance log](features/12-outlets/03-neah-bay-entrance-log/).

### Action params turn all-digit strings into numbers

**What happens.** `data-[identifier]-[name]-param` values go through
`JSON.parse`. A string of digits with no leading zero becomes a number,
so `"482917"` arrives as `482917` and is not `===` to the printed tag
`"482917"`. A leading zero is illegal in JSON, so `"01482"` and a UPC
like `"084271003318"` stay strings — `Number("084271003318")` would have
dropped the zero, and Stimulus params do not. A digit string past
`Number.MAX_SAFE_INTEGER` (`9007199254740993`) becomes a number and is
rounded. Wrapping the attribute in JSON quotes (`'"482917"'`) forces a
string.

**Why it matters.** The failure is inconsistent. A coat-check tag or a
member id that is only digits will not compare equal to the printed
string. A zip or a lot code that happens to start with zero survives,
which makes the bug look random. Long tokens lose a digit either way
once they parse as numbers.

**What to do.** Keep codes you must match character for character in a
String value, in `value=""`, or in a `data-*` attribute you read
yourself. To force a param to stay a string, wrap it in JSON quotes.
Don't put a bare all-digit identifier in an action param.

**Seen in:** [Warehouse pick list](features/01-controllers/12-warehouse-pick-list/)
(the scanner buttons keep every UPC in `value=""`),
[Concert hall coat check](features/06-action-parameters/04-concert-hall-coat-check/).

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
[Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/),
[Pilot boarding board](features/08-target-callbacks/01-pilot-boarding-board/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### Value-changed callbacks re-fire on every reconnect

**What happens.** Moving an element, or removing it and putting the same
node back, runs `[name]ValueChanged()` again for every value whose
attribute is absent. The callback is not only for writes. A value that
still has its attribute does not run again, unless the text changed
while the controller was disconnected. The precise rule is
[Present values do not re-fire on reconnect](#present-values-do-not-re-fire-on-reconnect).

**Why it matters.** A callback that starts a clock, opens a socket, or
increments a counter for a defaulted value will do that on every
drag-reorder or filter toggle. A callback for a value written on the
element will not.

**What to do.** Make the callback idempotent: starting something that is
already running is a no-op.

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/),
[Bell buoy ledger](features/10-value-change-callbacks/02-bell-buoy-ledger/).

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

**Seen in:** [Reordered playlist that survives moves](features/02-lifecycle-callbacks/13-reordered-playlist-that-survives-moves/),
[Canal lock queue](features/08-target-callbacks/04-canal-lock-queue/).

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

**Seen in:** [Insurance quote connect order](features/02-lifecycle-callbacks/11-insurance-quote-connect-order/),
[Smith Island tide drum](features/13-dispatching-events/11-smith-island-tide-drum/).

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
the DOM finishes. On the line after `element.remove()`,
`element.isConnected` is already false, and
`getControllerForElementAndIdentifier` still returns the controller.
`disconnect()` has not run.

**Why it matters.** Counting instances, destroying a third-party widget,
or reading layout immediately after a DOM write is one frame too early.

**What to do.** Wait until after Stimulus has reacted (`queueMicrotask`,
or the next animation frame) before asking "is it gone?".

**Seen in:** [Pet clinic visit date pickers](features/02-lifecycle-callbacks/04-pet-clinic-visit-date-pickers/),
[Smith Island tide drum](features/13-dispatching-events/11-smith-island-tide-drum/).

### Events from a detached element don't reach old ancestors

**What happens.** Once an element is out of the document,
`this.element.closest()` can't find its old ancestors, and a bubbling
event dispatched from it never arrives there either.

**Why it matters.** A lot, tile, or row that announces "my clock
stopped" from `disconnect()` by dispatching on `this.element` is talking
to nobody.

**What to do.** Keep a reference to the parent element from `connect()`,
and dispatch there with `this.dispatch(name, { target: parentElement })`.

**Seen in:** [Auction lot countdowns](features/02-lifecycle-callbacks/01-auction-lot-countdowns/),
[Smith Island tide drum](features/13-dispatching-events/11-smith-island-tide-drum/).

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

**Seen in:** [Newsletter signup with live validation](features/03-actions/02-newsletter-signup-with-live-validation/),
[Admiralty pilot orders](features/13-dispatching-events/10-admiralty-pilot-orders/).

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

## Keyboard filters

### Filters match every modifier flag, not just the named key

**What happens.** `keydown.enter` compares `event.key` to `"Enter"` *and*
requires `shiftKey`, `altKey`, `ctrlKey`, and `metaKey` to be false.
Shift+Enter does not match. `keydown.alt+left` does not match
Alt+Shift+Left. The order of modifiers in the descriptor does not matter
(`shift+alt+left` and `alt+shift+left` are the same set).

**Why it matters.** A chat composer that "sends on Enter" will also send
on Shift+Enter — the usual "newline" chord — unless Shift+Enter is a
separate descriptor. A kanban that moves on Alt+arrows will ignore
Shift+Alt+arrows until those combinations are declared too.

**What to do.** Declare each chord you want: `keydown.enter` and
`keydown.shift+enter`, or `keydown.alt+left` and `keydown.shift+alt+left`.

**Seen in:** [Clinic message composer](features/04-keyboard-filters/02-clinic-message-composer/),
[Newsroom assignment board](features/04-keyboard-filters/10-newsroom-assignment-board/).

### A local key filter never sees keys from a sibling

**What happens.** `keydown` goes to the focused element and bubbles
through its ancestors. A `keydown.esc` action on a dialog element does
not run while focus is in a sibling field. `keydown.esc@document` does.

**Why it matters.** Confirmation dialogs, palettes, and lightboxes that
listen on themselves miss Escape as soon as the visitor is typing
somewhere else on the page.

**What to do.** Put dismiss/open shortcuts on `@document` or `@window`,
and return early when the UI they control is not active.

**Seen in:** [Pharmacy refill confirmation](features/04-keyboard-filters/01-pharmacy-refill-confirmation/),
[Darkroom contact sheet](features/04-keyboard-filters/03-darkroom-contact-sheet/)
(the opposite: left/right stay on the filmstrip on purpose).

### `@window` filters still run while typing in a field

**What happens.** `keydown` bubbles to `window`. A
`keydown.a@window` action fires while the caret is in an `<input>`,
`<textarea>`, or `contenteditable` element. Stimulus does not skip
those targets.

**Why it matters.** Letter-key shortcuts steal keystrokes from team
names, notes, and captions. Save shortcuts (`ctrl+s`) usually *should*
win from those fields; answer keys usually should not.

**What to do.** Ignore the event when `event.target` is inside an
editable field, or, for a command palette, let the shortcut win on
purpose.

**Seen in:** [Pub quiz buzzers](features/04-keyboard-filters/04-pub-quiz-buzzers/)
(skip the team-name field),
[Hospital command palette](features/04-keyboard-filters/12-hospital-command-palette/)
(Ctrl+K wins from chart notes),
[Legal brief editor](features/04-keyboard-filters/11-legal-brief-editor/)
(save from every field).

### Unknown filter names throw when a key arrives, not when the page parses

**What happens.** `keydown.comma` parses as a valid descriptor. The first
keyboard event that reaches that action throws
`Error: contains unknown key filter: comma` into `handleError`. The
built-in map has `enter`, `tab`, `esc`, `space`, `up`, `down`, `left`,
`right`, `home`, `end`, `page_up`, `page_down`, `a`–`z`, and `0`–`9`.
`page-up`, `escape`, `backspace`, `comma`, and `plus` are not in it.

**Why it matters.** The page looks fine until someone presses a key.
`page_up` is the real name; `page-up` is an unknown filter.

**What to do.** Add the name to `schema.keyMappings`, or read `event.key`
from an unfiltered `keydown` action.

**Seen in:** [Recipe dietary tags](features/04-keyboard-filters/06-recipe-dietary-tags/)
(comma and Backspace via `event.key`),
[Vet appointment calendar](features/04-keyboard-filters/08-vet-appointment-calendar/)
(`page_up`, not `page-up`),
[Deli counter scale](features/04-keyboard-filters/13-deli-counter-scale/)
(custom mappings).

### Custom mappings belong on the schema passed to `Application.start()`

**What happens.** `Action` reads `this.schema.keyMappings` from the
application. Spreading `defaultSchema.keyMappings` and adding `plus: "+"`,
`f2: "F2"`, and so on makes `keydown.plus` and `keydown.f2` work.
Replacing `keyMappings` outright drops `enter` and `esc`. The comparison
is `event.key`, case-insensitive, still with exact modifier flags.

**Why it matters.** A scale that maps `plus` but forgets to keep the
defaults can no longer listen for Enter. Numpad `+` is `event.key === "+"`
with `shiftKey === false`; the main-keyboard `+` is Shift+`=` (`event.key`
`"+"` with `shiftKey === true`), so it needs `keydown.shift+plus`.

**What to do.** Pass `{ ...defaultSchema, keyMappings: { ...defaultSchema.keyMappings, plus: "+" } }`
into `Application.start()`. Declare both the shifted and unshifted
forms when the produced character is the same.

**Seen in:** [Deli counter scale](features/04-keyboard-filters/13-deli-counter-scale/).

### Filters only apply to `keydown`, `keyup`, and `keypress`

**What happens.** The descriptor parser treats `.esc` as a key filter
only when the event name is `keydown`, `keyup`, or `keypress`. On any
other event it concatenates the suffix, so `click.esc` listens for an
event literally named `click.esc`, which never fires. No error is logged.

**Why it matters.** A "click the Escape-looking button" descriptor that
borrows the keyboard-filter spelling fails silently.

**What to do.** Use keyboard event names for key filters. The three
events are not interchangeable: `keydown` repeats while held, `keyup`
fires once, and `keypress` does not fire for Escape, Tab, or arrows.

**Seen in:** [Ferry radio talkback](features/04-keyboard-filters/05-ferry-radio-talkback/).

**Why this section.** The silent `click.esc` miss is Stimulus's parser;
which keys fire `keypress` is the browser (see below).

### Letter filters ignore case on `event.key`, but Shift is still a modifier

**What happens.** `keydown.a` lowercases both sides, so Caps Lock + A
matches (`event.key` is `"A"`, `shiftKey` is false). Shift+A does not,
because `shiftKey` is true and the filter did not name `shift`.

**Why it matters.** A buzzer that should accept `A` with Caps Lock on
already does. One that should accept Shift+A needs `keydown.shift+a`.

**What to do.** Treat Caps Lock as `keydown.a`. Declare `shift` when you
mean the Shift key.

**Seen in:** [Pub quiz buzzers](features/04-keyboard-filters/04-pub-quiz-buzzers/).

### `alt+letter` compares `event.key`, which Option rewrites on macOS

**What happens.** `keydown.alt+r` requires `event.key.toLowerCase() === "r"`
and `altKey === true`. On macOS, Option+R often produces a different
character (`®`, `å`, …), so the filter misses. `event.code` stays `KeyR`.

**Why it matters.** Menu mnemonics that look right in the markup fail on
Mac keyboards.

**What to do.** Keep the Stimulus filter for Windows/Linux, and also
match `event.altKey && event.code === "KeyR"` from an unfiltered
`keydown@window` action.

**Seen in:** [Kitchen expo menubar](features/04-keyboard-filters/09-kitchen-expo-menubar/).

### There is no `cmdorctrl` modifier

**What happens.** Meta is Command on macOS and the Windows key elsewhere.
Ctrl is Control on every platform. Stimulus has no combined modifier.
`keydown.meta+s` and `keydown.ctrl+s` are two descriptors.

**Why it matters.** A save shortcut declared only as `ctrl+s` never runs
for ⌘S. One declared only as `meta+s` never runs for Ctrl+S on Windows
and Linux.

**What to do.** Declare both. `preventDefault()` on each so the browser's
Save dialog does not appear.

**Seen in:** [Legal brief editor](features/04-keyboard-filters/11-legal-brief-editor/),
[Hospital command palette](features/04-keyboard-filters/12-hospital-command-palette/).

## Action options

### `:once` is spent by the first event, even when a keyboard filter rejects it

**What happens.** `:once` is `{ once: true }` on the native listener for
that event name. `keydown.enter@document->…:once` still receives every
`keydown`. The first key — a letter in a field, Shift, Tab — invokes the
listener. The keyboard filter then rejects it, the method never runs, and
the browser has already removed the listener. Later Enter does nothing.

**Why it matters.** A front desk that "encodes on Enter once" silently
dies as soon as anyone types the guest's name. The page looks fine. The
button beside it, with `click->…:once`, still works, because that is a
different event.

**What to do.** Do not put `:once` on a filtered `keydown` / `keyup` /
`keypress`. Guard the method with an instance flag, or put `:once` on
`click` / `submit`.

**Seen in:** [Hotel key encoder](features/05-action-options/09-hotel-key-encoder/).

### `:once` takes `:prevent` with it

**What happens.** `:once` is `{ once: true }` on the native listener.
After the first event the browser removes that listener. `:prevent` was
a Stimulus filter on the same listener, not a separate one. A second
click on a Charge card `<a href="receipt/">` or a second Join submit
is a plain browser click/submit again.

**Why it matters.** The first Charge stays on the box office page. The
second follows `receipt/` and looks like `:once` "didn't work", when
what actually happened is `:prevent` stopped working.

**What to do.** After a `:prevent:once` action runs, disable the control
or remove the `href` / `action`. Don't leave a live link or submit
button whose only guard was that listener.

**Seen in:** [Community theater box office](features/05-action-options/01-community-theater-box-office/),
[CSA share signup](features/05-action-options/07-csa-share-signup/),
[Permit photo uploader](features/05-action-options/13-permit-photo-uploader/).

### Built-in filters run in descriptor order and short-circuit

**What happens.** Stimulus walks `Object.entries(eventOptions)` and
assigns `passes = passes && filter(...)`. `:prevent:self` still calls
`preventDefault()` on a child click, then `:self` returns false and the
method does not run. `:self:prevent` fails `:self` on that child first,
never reaches `:prevent`, and the click's default (a hash change, a
navigation) goes through.

**Why it matters.** A card that "prevents and only handles self" does not
do those two things independently. The nested "What's a hold?" link either
loses its navigation or keeps it, depending on which token is written
first.

**What to do.** Put filtering options (`:self`, custom options) before
mutating ones (`:prevent`, `:stop`) when a rejected event should keep its
default. Put mutating ones first when the default must never happen, even
if the method will not run.

**Seen in:** [CSA share signup](features/05-action-options/07-csa-share-signup/),
[Permit photo uploader](features/05-action-options/13-permit-photo-uploader/)
(an offline drop still `:prevent`s, so the browser does not navigate to
the file).

### Actions with different option sets are different native listeners

**What happens.** The dispatcher keys listeners by event name plus every
option, including `:prevent`, `:stop`, `:self`, and custom names. In
Stimulus 3.2.2 that is not limited to `capture` / `once` / `passive`.
`click->csa-signup#logValidate:prevent click->csa-signup#logAnnounce` are
two `addEventListener` calls, so both methods run. `:stop` on the first
would not skip the second: `stopPropagation()` hides the event from
ancestors, not from other listeners on the same element.
`stopImmediatePropagation()` in a method *does* skip remaining listeners
on that target, including ones with a different option set.

**Why it matters.** Adding `:prevent` to the first of two actions does
not by itself stop the second. Assuming "different options mean
`stopImmediatePropagation()` can't see the other action" is also wrong;
that call is native and applies to the target.

**What to do.** If two actions on one control must both run, don't call
`stopImmediatePropagation()`. If the first must skip the second, call it
— or do the later work from the first method. Don't rely on `:stop` to
skip a sibling action.

**Seen in:** [CSA share signup](features/05-action-options/07-csa-share-signup/).

### A custom option that returns `undefined` blocks the action

**What happens.** `registerActionOption` callbacks are AND-ed into
`passes`. Returning `false` blocks, as the docs say. Returning nothing
also blocks, because `passes && undefined` is `undefined`. Returning
`true` is what lets the method run. `:open` yields `value: true`;
`:!open` yields `value: false` to the same callback.

**Why it matters.** A filter that `return event.target.open === value`
inside an `if (event.type == "toggle")` and forgets `return true` in the
`else` will swallow every non-toggle event on that descriptor.

**What to do.** Always return a boolean. Log `{ name, value, event,
element, controller }` while writing the filter; `element` is the node
that declared the action, not `event.target`, and `event.params` is
already filled in.

**Seen in:** [Metro fare FAQ](features/05-action-options/11-metro-fare-faq/),
[Community solar cancel](features/05-action-options/12-community-solar-cancel/)
(returning `false` is what keeps `cancelShare()` from running).

### `:!self` does not mean "only children"

**What happens.** The built-in `self` filter returns `element ===
event.target` when `value` is true, and returns `true` when `value` is
false. `:!self` therefore never filters. The comparison is to
`event.target`, not `event.currentTarget` — `currentTarget` is already
the declaring element for every click inside it.

**Why it matters.** An overlay that tries `:!self` to "handle the scan
but not the backdrop" handles both. Close has to omit `:self` instead.

**What to do.** Use `:self` for the backdrop. Give child controls their
own actions without `:self`. There is no built-in inverse.

**Seen in:** [County archives viewer](features/05-action-options/03-county-archives-viewer/).

### Keyboard filters run before action options

**What happens.** `Binding.handleEvent` asks `willBeInvokedByEvent` (the
key / modifier filter) before `applyEventModifiers` (`:prevent`,
`:stop`, `:self`, custom options). A key that fails the filter never
reaches `:prevent`. `keydown.enter->…:prevent` does not cancel
Shift+Enter.

**Why it matters.** Find-in-minutes that "prevents Enter from submitting
the form" still lets Shift+Enter through, because that chord is a
different filter.

**What to do.** Declare each chord you want to cancel. Leave the ones
you want the browser to keep (Shift+Enter in a field) off the
descriptor.

**Seen in:** [Clerk minutes editor](features/05-action-options/08-clerk-minutes-editor/).

### `:capture` runs before a child's `:stop`

**What happens.** `:capture` is `{ capture: true }`. That action runs
while the event is traveling down, before any bubble-phase child.
`:stop` calls `stopPropagation()` when *its* action runs, in the bubble
phase unless that child also asked for `:capture`. Capture-phase
ancestors have already run. Bubble-phase ancestors, `@document`, and
`@window` never see the event.

**Why it matters.** A directory that logs visits on the way down still
sees "Text the stall". The same directory's bubble logger, and the
card's `openStall`, do not.

**What to do.** Put analytics and "I need to see every click" handlers
in `:capture`. Put "this button owns the click" on the button with
`:stop`.

**Seen in:** [Farmers market stall analytics](features/05-action-options/05-farmers-market-stall-analytics/),
[Community radio request](features/05-action-options/10-community-radio-request/)
(`:stop` hides `@document` / `@window` bubble, not `@window:capture`).

## Action parameters

### Params are read from the action's element when the action runs

**What happens.** `event.params` is built from
`data-[identifier]-[name]-param` attributes on the element that declares
the action. A click whose `event.target` is a child `<span>` still sees
the button's params. An action on a parent does not see param attributes
on the child that was clicked. An `@document` or `@window` action reads
the element that wrote the descriptor, not the focused field. The
attributes are read at the call, not when the action was bound, so
changing one updates the next event. An element inserted in the same
turn has no action yet; see
[Actions on a brand-new element are not bound in the same turn](#actions-on-a-brand-new-element-are-not-bound-in-the-same-turn).

**Why it matters.** A room that listens for clicks will not pick up
accessions written on the paintings. A keyboard shortcut on the page
shell will not pick up a param written on the field that has focus.
Doubling a servings attribute, though, is visible on the next click
without reconnecting.

**What to do.** Put the action and its params on the same element. Read
`event.target` yourself when the click target is the data you need and
the action lives on an ancestor. Change param attributes freely; don't
cache them in `connect()`.

**Seen in:** [Museum gallery labels](features/06-action-parameters/08-museum-gallery-labels/),
[Neighborhood potluck board](features/06-action-parameters/06-neighborhood-potluck-board/),
[Lighthouse watch log](features/06-action-parameters/11-lighthouse-watch-log/),
[Field recording chapters](features/06-action-parameters/07-field-recording-chapters/).

### Each action gets a fresh `event.params`, and the next action replaces it

**What happens.** Stimulus assigns `event.params` on the shared event
object just before each action method. The object is built again from
the attributes, so a property the first method adds is not visible to
the second method on the same element. After the click has finished
bubbling, a later action's assignment is what `event.params` points at.
A reference saved at the start of the method still points at the
original object. `:stop` keeps ancestors from running, so nothing
replaces it.

**Why it matters.** `const seat = event.params` is stable.
`event.params.sectionName` after the click may be missing, or may be
the ancestor's house note. `await Promise.resolve()` is not late enough
to see that on a real click; see
[A real click runs microtasks before the event finishes bubbling](#a-real-click-runs-microtasks-before-the-event-finishes-bubbling).

**What to do.** Copy the fields you need before you yield. Don't read
`event.params` again after the click has moved on.

**Seen in:** [Campus mail tray](features/06-action-parameters/05-campus-mail-tray/),
[Repertory seat holds](features/06-action-parameters/12-repertory-seat-holds/).

### Params are `JSON.parse`; values and `dataset` are not

**What happens.** A param is cast with `JSON.parse`. `"2"` and `"1.5"`
become numbers, `"true"` and `"false"` become booleans, `"null"` becomes
`null`, and a JSON array or object becomes that value. Anything that is
not valid JSON, including `"Caraway rye"`, `"FALSE"`, and `"1_000"`,
stays the original string. `"2e1"` is valid JSON and becomes `20`. Keys
inside a JSON object are not camelized. A String value is never parsed.
A Number value uses `Number()`, so `"08"` becomes `8` and `"1_000"`
becomes `1000`. A Boolean value treats `"FALSE"` as false. `dataset`
keeps the raw string under a key that includes the identifier and the
`Param` suffix (`greenhouseBedLitersParam`), not the param name
(`liters`).

**Why it matters.** The same characters mean different things depending
on which channel you read. A spreadsheet's `"FALSE"` is a string in a
param and `false` in a Boolean value. A liters param is a number on
`event.params.liters` and the string `"1.5"` on `dataset`.

**What to do.** Read `event.params` for action arguments. Use a value
when the controller needs the data without an event and a declared type.
Use `dataset` only when you want the raw attribute string. For all-digit
strings and leading zeros, see
[Action params turn all-digit strings into numbers](#action-params-turn-all-digit-strings-into-numbers).

**Seen in:** [Bakery preorder window](features/06-action-parameters/02-bakery-preorder-window/),
[Trail kitchen batch card](features/06-action-parameters/03-trail-kitchen-batch-card/),
[Greenhouse watering round](features/06-action-parameters/09-greenhouse-watering-round/).

**Why this section.** `dataset` returning strings is the DOM. It's here
because the surprise is reading it instead of `event.params`.

### A shorter identifier matches a longer identifier's param attributes

**What happens.** The pattern is `^data-${identifier}-(.+)-param$`. For
`bin-ticket` that also matches
`data-bin-ticket-printer-copies-param`, and the captured name
`printer-copies` camelizes to `printerCopies`.
`data-bin-ticket-printer-tray-name-param` becomes `printerTrayName`.
The controller `bin-ticket-printer` sees those same attributes as
`copies` and `trayName`. `data-bin-ticket-shed-name-param` matches only
`bin-ticket`.

**Why it matters.** Two controllers on one element, where one identifier
extends the other with a hyphen, leak params into the shorter one under
a different name.

**What to do.** Don't let one identifier be a hyphen-prefix of another
(`bin-ticket` / `bin-ticket-printer`). Use names that don't nest
(`dispatch-slip` / `courier-radio`).

**Seen in:** [Orchard bin tickets](features/06-action-parameters/13-orchard-bin-tickets/),
[Courier dispatch slip](features/06-action-parameters/10-courier-dispatch-slip/).

## Targets

### The singular target throws when it is missing; the plural and the has-property do not

**What happens.** `this.slipTarget` throws
`Missing target element "slip" for "tide-board" controller` at the
moment it is read. `this.slipTargets` is `[]` and `this.hasSlipTarget`
is false. The controller still connects and can render its other
targets. A name that is not listed in `static targets` never gets a
getter: `this.botanicalTarget` is `undefined`, and reading it does not
throw that error, even when an element carries the token.

**Why it matters.** An optional advisory can be absent and the board
still loads. Code that treats the singular form as "zero or one" fails
through `handleError` the first time that line runs. Code that invents
a getter for an undeclared token fails differently, with no Stimulus
error at all.

**What to do.** Declare every name you read. Use `has[Name]Target`
before the singular getter when the element is optional. Use the plural
when there may be many, or none.

**Seen in:** [Harbor tide board](features/07-targets/01-harbor-tide-board/),
[Seed packet label press](features/07-targets/04-seed-packet-label-press/).

### Target names are matched exactly and are not camelized

**What happens.** The selector is `[data-${identifier}-target~="varietyName"]`.
The token has to be the `static targets` string, including case.
`variety-name` does not match `varietyName`. Stimulus camelizes value
names, CSS class names, outlet names, and action parameters. It does
not camelize target names. `hasVarietyNameTarget` is `has`, plus the
declared name with only its first character capitalized, plus `Target`.

**Why it matters.** Markup written in the value-attribute style
(`variety-name`) leaves `hasVarietyNameTarget` false, and the singular
getter throws the missing-target error, on a packet that clearly has a
variety field.

**What to do.** Write the token in the same camelCase as `static targets`:
`data-label-press-target="varietyName"`. Keep kebab-case for the
identifier only.

**Seen in:** [Seed packet label press](features/07-targets/04-seed-packet-label-press/).

### The singular target is the first match in the document

**What happens.** `terminusTarget` is `terminusTargets[0]`. Several
elements may carry the token. Stimulus does not warn. The first in the
document wins, not the last and not a highlighted one. An element whose
attribute is `stop terminus` is one node, so it is in both lists, and
writing its `textContent` changes both.

**Why it matters.** Flagging Harper, printed above Port Orchard, makes
`terminusTarget` Harper. Renaming the end of the line renames that same
stop in the stop list.

**What to do.** Use the plural list when more than one element can
match, and pick the one you mean. Put several tokens on one element
only when it really is both things.

**Seen in:** [County bus route card](features/07-targets/02-county-bus-route-card/),
[Orchestra seating chart](features/07-targets/13-orchestra-seating-chart/).

### Target getters query the DOM when you read them

**What happens.** `this.plotTargets` runs a query on every read and
returns a new array. A plot appended in the current turn is already in
the list. A plot removed in the current turn is already gone. An array
saved from `connect()` is not updated. `plotTargetConnected()` runs
later, from the mutation observer, after the method that inserted the
plot has finished writing its status.

**Why it matters.** A roster cached at connect still says Beans, Kale
after Squash is on the board. A status line written in the add method
cannot see the callback's stamp yet. The list itself is already current,
so the callback is not a refresh.

**What to do.** Read `this.plotTargets` at the moment you need it. Do
not keep the array. Use a connected callback for work that should happen
because a target appeared; that is a separate feature.

**Seen in:** [Garden work day](features/07-targets/05-garden-work-day/).

**Why this section.** Scheduling the callback is the observer. The
getter is the target API, and it is already current before the callback
runs.

### A nested controller with the same identifier is a scope boundary, re-checked on every read

**What happens.** A target counts when
`element.closest('[data-controller~="that-identifier"]')` is that
controller's element. A nested `meter-bank` is a boundary: its meters,
and the nested element itself when it carries the target attribute, are
left out of the outer `meterTargets`. A nested `water-heater` is not a
`meter-bank`, so a meter inside the heater still belongs to the outer
bank. The check runs at read time. Moving Owen's element into the nested
saw crew drops him from the trail day's list on the next line. The outer
controller does not disconnect.

**Why it matters.** A building total written with `querySelectorAll`
bills Unit 2's kitchen to the building. A roll that is not re-read after
a move still includes someone who now belongs to the nested crew.

**What to do.** Read the target list. Use a nested controller of the
same identifier only where that boundary is what you want. Read again
after you move nodes.

**Seen in:** [Apartment meter bank](features/07-targets/09-apartment-meter-bank/),
[Trail work crew](features/07-targets/12-trail-work-crew/).

### Target attributes are not prefix-matched

**What happens.** The attribute name is exactly
`data-${identifier}-target`. `data-moorage-bill-ledger-target="slipFee"`
is not a `slipFee` target of `moorage-bill`, even though `moorage-bill`
is a hyphen-prefix of `moorage-bill-ledger`. Action parameters use a
prefix pattern and do leak across that pair of names. Targets do not.
An input both controllers should see needs both attributes.

**Why it matters.** A $999 field stamped only for the ledger stays out
of the bill's slip-fee list. Sharing the real slip fee means writing
`data-moorage-bill-target` and `data-moorage-bill-ledger-target` on
that one input.

**What to do.** Stamp each controller's own attribute on the elements it
should see. The target lookup will not borrow the longer identifier's
attribute.

**Seen in:** [Marina moorage bill](features/07-targets/03-marina-moorage-bill/).

**Why this section.** The contrast with
[A shorter identifier matches a longer identifier's param attributes](#a-shorter-identifier-matches-a-longer-identifiers-param-attributes)
is the point. The target attribute is a different name, not a prefix.

### `querySelector` is not a target lookup, and the legacy attribute still matches

**What happens.** Stimulus finds a target with
`[data-identifier-target~="name"]`, includes the controller element
when it matches, drops anything inside a nested element with the same
identifier, and then appends legacy `data-target="identifier.name"`
matches. `querySelectorAll` does none of the scope work, skips the
element itself, and an exact `[data-request-desk-target="slip"]` misses
`slip rush`. A `NodeList` from `querySelectorAll` is static. The legacy
attribute still matches. Those matches are concatenated after the
modern ones, so they are not interleaved in document order. An element
with both attributes appears twice in the plural list. The first time a
legacy element is found, Stimulus logs a deprecation warning naming
`data-target` and the replacement `data-identifier-target`. The singular
getter prefers a modern match and does not, by itself, look at the
legacy attribute when a modern one exists.

**Why it matters.** A count written with `querySelectorAll` includes the
nested desk's map, misses the walk-up slip on the desk element, misses
a rush slip when the selector is exact, and goes stale when a tax lien
is filed. The card catalog's old stamp still shows up in `slipTargets`,
and the dual-stamped slip shows up twice, the second time in the legacy
block rather than at its place in the document.

**What to do.** Read `this.slipTargets`. Replace
`data-target="request-desk.slip"` with
`data-request-desk-target="slip"`. Do not leave both on one element.

**Seen in:** [Archive request desk](features/07-targets/10-archive-request-desk/).

### Inherited target names use the subclass identifier

**What happens.** `static targets` is collected from the class and its
ancestors. `InsuranceSection` declares `memberId` and inherits
`heading`, `field`, and `summary`, so `headingTarget` exists. The
attribute Stimulus looks up is `data-insurance-section-target="heading"`,
the instance's identifier, not `data-intake-section-target`. A paragraph
stamped with the parent attribute sits in the section and is not the
heading target.

**Why it matters.** A block copied from the base section's markup looks
wired. `hasHeadingTarget` is true only because the subclass's own
attribute is also present. The stray heading is ignored.

**What to do.** Stamp inherited targets with the identifier of the
controller that is actually on the element.

**Seen in:** [Clinic intake sections](features/07-targets/11-clinic-intake-sections/).

### A hidden element is still a target

**What happens.** `[hidden]` does not remove a node, and the target
query does not care that it is hidden. `pieceTargets` includes the
lantern in storage. After a wig filter sets `hidden` on the coat,
`pieceTarget` is still the coat, the first piece in the document. The
visible rows are the wigs. A checked lantern is still in the list a
pull walks, in document order, after the pocket watch.

**Why it matters.** Filtering the screen and then reading the singular
target returns the coat, not the first wig. A count of `pieceTargets`
counts covered pieces.

**What to do.** Filter the `pieceTargets` array for the rows you mean.
Treat `hidden` as a visual state. The plural list is the whole rack.

**Seen in:** [Costume shop pull list](features/07-targets/07-costume-shop-pull-list/).

**Why this section.** Hiding is presentation. The target list is a DOM
query, so a covered lantern is still a piece. The same split is why
[hidden elements keep their actions](#hidden-elements-keep-their-actions).

## Target callbacks

### After `disconnect()`, each target callback still receives its element

**What happens.** The way-out order is the one in
[Callback order is initialize, value-changed, target-connected, then connect](#callback-order-is-initialize-value-changed-target-connected-then-connect):
`disconnect()` first, then each `[name]TargetDisconnected(element)`.
Removing the identifier empties the getters inside `disconnect()`, as in
[Targets vanish in `disconnect()` after the identifier is removed](#targets-vanish-in-disconnect-after-the-identifier-is-removed).
The disconnected callback still runs after that and is given the
element, which is still in the document and still carries the target
attribute. Moving the controller element runs that way-out pair and
then the way-in pair on the same instance: `disconnect()` while the
getters still work (see
[A move is `disconnect()` then `connect()` on the same instance](#a-move-is-disconnect-then-connect-on-the-same-instance-and-isconnected-is-true-inside-disconnect)),
each target disconnected, each target connected, then `connect()`.
`initialize()` does not run again.

**Why it matters.** A transcript written from `this.transcriptTarget`
while the board is being taken down has nowhere to go: the getter is
empty, and the ships are still on the wall. The disconnected callback
is what can still name them. Shifting a lock to another pier also
rebuilds anything a boat callback allocated, because those callbacks
run again around the second `connect()`.

**What to do.** Save, from the connected callback, any element you must
write after the identifier is gone. Release per-target resources in the
disconnected callback, using the element argument. Expect a move of the
controller element to run every target callback twice.

**Seen in:** [Pilot boarding board](features/08-target-callbacks/01-pilot-boarding-board/),
[Canal lock queue](features/08-target-callbacks/04-canal-lock-queue/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### Moving a target inside its controller fires disconnected, then connected

**What happens.** Reordering a target, or moving it to another parent
that is still inside the same controller, runs
`[name]TargetDisconnected` and then `[name]TargetConnected`. The
controller's own `connect()` and `disconnect()` do not run. During the
disconnected callback the node is already in its new place,
`isConnected` is true, and `closest()` still finds this controller.
Moving the target outside the controller runs only the disconnected
callback. `closest()` no longer matches, even though the node is still
in the document. Moving it into a nested controller with the same
identifier is the outside case for the outer controller and the inside
case for the inner one: outer disconnected, then inner connected.

**Why it matters.** A passage count incremented in the connected
callback goes up when a boat changes places in the queue. A widget
created there is destroyed and built again. Skipping teardown because
`isConnected` is true also skips the lay-by, because that boat is still
on the page.

**What to do.** Detach in the disconnected callback and attach in the
connected callback. Keep durable state on the element when a move
should not reset it. Decide "still in this controller" with `closest()`,
not with `isConnected`.

**Seen in:** [Canal lock queue](features/08-target-callbacks/04-canal-lock-queue/),
[Smokehouse racks](features/08-target-callbacks/05-smokehouse-racks/),
[Buoy tender charts](features/08-target-callbacks/08-buoy-tender-charts/).

### A target token can change without removing the element

**What happens.** Setting the target attribute on an element that is
already in the tree runs the connected callback. Removing the
attribute, or removing one token, runs the disconnected callback for
the names that left. The element stays put, and the controller does not
reconnect. Tokens are compared by index. Adding or removing a token at
the end notifies only that name. The first index that differs is
unmatched and then rematched, along with every token after it.
Rewriting `station beacon` as `beacon station` disconnects and
reconnects both names, even though the card still has both.

**Why it matters.** Wiring a lantern that is already hanging is a new
target and not a new element. Reordering the chalk on a listening card
tears down and rebuilds every name from the first token that moved.
Clearing a beacon that sits in front, by writing the attribute back as
only `station`, restarts the station too.

**What to do.** Add and remove tokens at the end when the other names
should stay quiet. Treat a reorder as a restart of every name from the
first change. Setting the attribute to the value it already has does
not notify.

**Seen in:** [Orchard frost lanterns](features/08-target-callbacks/03-orchard-frost-lanterns/),
[Shortwave listening post](features/08-target-callbacks/06-shortwave-listening-post/).

### A nested same-identifier controller does not disconnect outer targets unless the element moves

**What happens.** The getter drops a target as soon as a nested element
with the same identifier is its closest controller. That re-check is
[A nested controller with the same identifier is a scope boundary](#a-nested-controller-with-the-same-identifier-is-a-scope-boundary-re-checked-on-every-read).
The callbacks do not follow it unless the target node itself is added,
removed, or retokened. Setting `data-controller` on a bay that already
contains a hull runs the connected callback on the new booth and does
not run the disconnected callback on the yard. Moving a side into a
cabinet that is already a controller does run the outer disconnected
callback and the inner connected callback.

**Why it matters.** A chalk total kept only in callbacks still includes
the hull, and the booth's own callback includes it too. The gallons are
counted twice. A slip that reads the getter does not include it.

**What to do.** Move the nodes when you open the nested controller, or
recount from the getter after you add the identifier. Do not expect the
outer disconnected callback to notice a scope change that did not touch
the target.

**Seen in:** [Smokehouse racks](features/08-target-callbacks/05-smokehouse-racks/),
[Shipyard paint booths](features/08-target-callbacks/12-shipyard-paint-booths/).

### In one mutation the getter already shows the finished tree

**What happens.** Appending a document fragment, assigning `innerHTML`,
calling `insertAdjacentHTML`, and appending a cloned `<template>` each
deliver their target callbacks in one mutation-observer turn, after the
method that changed the DOM has finished writing. The getter is already
current on the next line, as in
[Target getters query the DOM when you read them](#target-getters-query-the-dom-when-you-read-them),
and the callbacks are batched after that write, as in
[Lifecycle callbacks are batched after the DOM change](#lifecycle-callbacks-are-batched-after-the-dom-change).
Inside the turn, callbacks run one element at a time. `innerHTML`
unmatches every removed target before it matches the added ones, in
tree order. On the first disconnected callback of a reprint, the plural
getter is already the new list.

**Why it matters.** A weighmaster who clears the chalk and copies the
board on the first erasure copies the new ticket, and the connected
callbacks then add it again. A notice written in the action can still
say the ledger had not stamped the new berries; the ledger stamps them
after that sentence is already on the page.

**What to do.** Add and subtract the element the callback was given.
Read the getter when you want the finished list, once, not from inside
every callback of the same mutation. Nodes in a template stay out of
that list until the clone is appended; see
[Nodes inside a `<template>` are not targets](#nodes-inside-a-template-are-not-targets).

**Seen in:** [Cranberry receiving dock](features/08-target-callbacks/07-cranberry-receiving-dock/),
[Grain elevator ledger](features/08-target-callbacks/09-grain-elevator-ledger/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

### The target observer is paused while the callback runs

**What happens.** Stimulus disconnects the mutation observer before
calling `[name]TargetConnected` or `[name]TargetDisconnected`, and
starts it again afterward without scanning the tree. A target inserted
or removed synchronously inside the callback does not get its own
callback. The node is in the document, and the getter sees it.
`queueMicrotask` runs after the observer is listening again, so a
target inserted there does get a callback. A callback that always
defers another insert does not stop. If the callback throws, the
observer is never restarted. The error is uncaught:
`application.handleError` does not see it. Later targets in that batch
are skipped. If the throw happens while the controller is connecting,
`connect()` never runs, and targets added afterward are silent.

**Why it matters.** Writing a serial into a docket is safe, because
that paragraph is not a target. Inserting the next docket from the
callback looks like it should number that one too, and it does not,
which is also why the tray does not fill itself. A throw looks like a
one-time failure and quietly disables every later target callback.

**What to do.** Change text, classes, and non-target nodes from the
callback. Insert or remove targets from the action, or from a microtask
you mean to run once. Catch inside the callback if the work can fail.
Do not rely on `handleError` for these callbacks.

**Seen in:** [Letterpress job dockets](features/08-target-callbacks/10-letterpress-job-dockets/).

## Values

### `has[Name]Value` stays true when the definition is an object or a literal

**What happens.** The reference says `has[Name]Value` is true when the
data attribute is present and false when it is absent. That is true for
a bare type (`breed: String`, `temperature: Number`, `flagged: Boolean`).
It is not true for the `{ type, default }` form, for `{ type: Number }`
with no `default` key, or for a literal (`breed: "Jersey"`,
`flagged: false`, `spareDegrees: 0`). Those definitions make
`has[Name]Value` true even when the attribute was never written. The
getter still returns the default: `"Jersey"`, `86`, `0`, `false`, or
`["mesophilic"]`.

**Why it matters.** A card that uses the object form cannot tell "the
cook left this blank" from "the cook wrote the default." A spare
temperature declared as `{ type: Number }` looks present (`has` is
true) and reads `0`, the same number a bare `Number` reads when `has`
is false. A flag defaulted to `false` with `flagged: false` also
reports `hasFlaggedValue` true.

**What to do.** Use a bare type when `has[Name]Value` has to mean "the
attribute is in the markup." Use `{ type, default }` or a literal when
a missing attribute should still count as set. Read
`element.hasAttribute` when you need the attribute itself.

**Seen in:** [Creamery vat card](features/09-values/06-creamery-vat-card/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/)
(the relief boat's name and bowl count).

### An empty Boolean attribute is true

**What happens.** The reader is
`!(value == "0" || String(value).toLowerCase() == "false")`. `"0"`,
`"false"`, `"FALSE"`, and `"False"` are false. An empty attribute,
including `data-signal-horn-sounding-value` with no value, is `""`,
and that is true. `"00"`, `"false "` (trailing space), `" 0"`,
`"no"`, `"off"`, and `"1"` are true. A missing attribute is the
default `false`, and for a bare `Boolean` the `has` property is false.
The reference formula does not lowercase. Stimulus 3.2.2 does, which
is why `"FALSE"` is false. That case is already noted under
[Params are `JSON.parse`; values and `dataset` are not](#params-are-jsonparse-values-and-dataset-are-not).

**Why it matters.** A blank cell on a fog slip is not "they said no."
It is "the horn is sounding," and `hasSoundingValue` is true because
the attribute is present. `"00"` is not `"0"`. A trailing space keeps
`"false"` from matching.

**What to do.** Treat only `"0"` and `"false"` in any letter case as
false. Don't leave the attribute empty if you mean false. Assign
`false` to write the attribute `"false"`.

**Seen in:** [Fog signal board](features/09-values/03-fog-signal-board/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/)
(the relief galley's blank cell).

### A Number value keeps the attribute text until you assign

**What happens.** The reader strips underscores, then calls `Number()`.
`"1_000"` is `1000`. `"08"` is `8`. `" 14.5 "` is `14.5`. `"2e1"` is
`20`. `"1,200"` and `"12dwt"` are `NaN`. An empty attribute is `0`
with `hasPennyweightsValue` true. A missing attribute is `0` with
`has` false, for a bare `Number`. `9007199254740993` becomes
`9007199254740992`. None of those reads rewrite the attribute. The
writer is `` `${value}` ``, so assigning the parsed number stores a
plain decimal: Kingston's `"08"` becomes `"9"` after one more bushel,
and a certificate assigned back to itself loses the digit in the
attribute too.

**Why it matters.** The slip on the wall and the number in the
controller disagree until something assigns. A comma that a clerk
thinks is a thousands separator is `NaN`, and `has` is still true, so
a guard that only checks `has` will add to `NaN`. A blank weight and
a missing weight are both `0` and only `has` tells them apart.

**What to do.** Keep identifiers and leading zeros in a `String`
value. Assign only when you mean to normalize the attribute. Check
`Number.isNaN` before doing arithmetic. For the same precision loss
on action params, see
[Action params turn all-digit strings into numbers](#action-params-turn-all-digit-strings-into-numbers).

**Seen in:** [Cider press tally](features/09-values/02-cider-press-tally/),
[Assay office slips](features/09-values/07-assay-office-slips/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/).

### Array and Object values reject the other shape

**What happens.** Both types `JSON.parse` the attribute. An `Array`
then requires `Array.isArray`. An `Object` rejects `null`, arrays, and
anything whose `typeof` is not `"object"`. The failure is a
`TypeError` whose message names the attribute text and a type:
`"object"`, `"array"`, `"number"`, or, for `null`, `"undefined"`.
Invalid JSON, including `eagle,shield` and `{fine:900}`, throws
`SyntaxError` from `JSON.parse` instead. Neither throw happens at
connect. It happens when the getter runs. Keys inside an object are
not camelized: `wick_height` stays `wick_height`. Each read parses
again, so `this.lampValue === this.lampValue` is false when the
attribute is present, and `push` on the returned array is gone by the
next read.

**Why it matters.** A spare tin written as a list looks like data and
throws the first time the watch reads it. A menu written as
`chowder, pilot bread` connects fine and throws on the button. A
`push` that is not followed by an assignment never reaches the
attribute.

**What to do.** Store arrays as JSON arrays and objects as JSON
objects. Catch the read if the attribute came from a person. Assign a
new array or object to persist a change. Don't mutate the value you
just read.

**Seen in:** [Seed vault tray](features/09-values/04-seed-vault-tray/),
[Lighthouse wick log](features/09-values/05-lighthouse-wick-log/),
[Assay office slips](features/09-values/07-assay-office-slips/),
[Pilot boat mess slate](features/09-values/13-pilot-boat-mess-slate/).

### A custom Array or Object default is one shared value

**What happens.** `{ type: Array, default: ["brood", "honey"] }`
returns that same array every time the attribute is missing, on every
instance. `push` mutates it. The attribute stays absent.
`hasFramesValue` is true because of the object form, as in
[`has[Name]Value` stays true when the definition is an object or a literal](#hasnamevalue-stays-true-when-the-definition-is-an-object-or-a-literal).
A bare `frames: Array` is different: the built-in default is a new
`[]` on every read, so a `push` disappears, and `hasFramesValue` is
false. Assigning `this.framesValue = this.framesValue.slice()` writes
JSON on that element only. The other hive, still missing its
attribute, keeps reading the mutated default.

**Why it matters.** Dropping a frame on the Langstroth changes the
Warre's next read. Writing one lid down does not give the other hive
its own list.

**What to do.** Don't mutate a default. Assign a new array or object.
If each controller needs its own starting list, put the JSON on the
element, or copy the default before you change it
(`this.framesValue = this.framesValue.concat(["pollen"])`).

**Seen in:** [Apiary super stack](features/09-values/08-apiary-super-stack/).

### Value attributes are the exact kebab-case name

**What happens.** Stimulus looks up
`data-${identifier}-${dasherize(name)}-value`. `meshSize` is
`data-bolt-ticket-mesh-size-value`. HTML lowercases attribute names,
so `data-bolt-ticket-meshSize-value` is stored as
`data-bolt-ticket-meshsize-value` and does not match. Underscores are
not camelized either. `data-bolt-ticket-mesh_size-value` is a
different attribute. Action parameters do camelize `-` and `_`. Value
lookup does not scan the element's attributes and camelize them. A
miss reads as the type default, and for a bare `String`
`hasMeshSizeValue` is false.

**Why it matters.** A ticket written in the controller's camelCase, or
with underscores, still shows "4 in" in the markup and the controller
reads `""`.

**What to do.** Write value attributes in kebab-case. The same
lowercasing rule for params is
[HTML lowercases param attribute names](#html-lowercases-param-attribute-names).
The value failure is an exact-name miss, not a failed camelize.

**Seen in:** [Sail loft bolt ticket](features/09-values/09-sail-loft-bolt-ticket/),
[Maple sugar shack](features/09-values/01-maple-sugar-shack/).

**Why this section.** Lowercasing is the HTML parser. Stimulus is what
requires the hyphenated name and will not accept the underscore form
that params accept.

### Only `undefined` removes a value attribute

**What happens.** The setter deletes the attribute when the new value
is `undefined`. Every other assignment writes.
`hoopCountValue = 0` writes `"0"` and `hasHoopCountValue` stays true.
`flaggedValue = false` writes `"false"`. `woodNameValue = null` writes
the characters `null`, and the getter returns the string `"null"`.
After a real delete, a bare `Number` reads `0` with `has` false, and a
bare `String` reads `""` with `has` false.

**Why it matters.** Zeroing a hoop count looks like clearing it and
leaves `"0"` on the barrel. A "blank" wood name of `null` becomes the
word null. The next read cannot tell that from a cooper who stamped
those letters.

**What to do.** Assign `undefined` to remove the attribute. Assign
`0`, `false`, or `""` only when that value should stay on the element.

**Seen in:** [Cooperage hoop log](features/09-values/10-cooperage-hoop-log/).

### Inherited values use the subclass identifier

**What happens.** `static values` is collected from the class and its
ancestors. `RidgeLog` declares `gustKnots` and inherits `stationName`
and `launched`, so `stationNameValue` exists. The attribute is
`data-ridge-log-station-name-value`, the instance's identifier, not
`data-kite-log-station-name-value`. A station name stamped with the
parent identifier sits on the element and is not the value. Assigning
`launchedValue` writes `data-ridge-log-launched-value`.

**Why it matters.** A card copied from the base log looks wired. The
reading uses Cape Flattery, the subclass attribute, and leaves the
valley line unread.

**What to do.** Stamp inherited values with the identifier of the
controller that is actually on the element. The same rule for targets
is
[Inherited target names use the subclass identifier](#inherited-target-names-use-the-subclass-identifier).

**Seen in:** [Ridge kite log](features/09-values/11-ridge-kite-log/).

### A shorter identifier can share a longer identifier's value attribute

**What happens.** The attribute name is
`data-${identifier}-${dasherize(valueName)}-value`. For `gauge` and
`houseZeroFeet` that is `data-gauge-house-zero-feet-value`. For
`gauge-house` and `zeroFeet` it is the same string. Both controllers,
on one element, read and write one attribute. Setting the gauge zero
to `5` makes the house zero `5` on the next read, in the same turn.
`poolFeet` does not collide: the gauge's pool is
`data-gauge-pool-feet-value` and the house's pool is
`data-gauge-house-pool-feet-value`. This is not the param prefix
regex. Each controller asks for an attribute it declared. The names
happen to compose to one string. Targets do not do this, because a
target attribute is `data-${identifier}-target` and does not include
the token in the attribute name. See
[Target attributes are not prefix-matched](#target-attributes-are-not-prefix-matched).

**Why it matters.** Two controllers that were meant to keep separate
zeros share one, with no error. Raising the gauge moves the house.

**What to do.** Don't let one identifier be a hyphen-prefix of another
when a value name on the shorter one can spell the rest
(`gauge` / `gauge-house`, `houseZeroFeet` / `zeroFeet`). Name the
shorter controller so it does not begin the longer one.

**Seen in:** [Lock gauge house](features/09-values/12-lock-gauge-house/).

### A mismatched default throws when the controller is registered

**What happens.** `{ type: Number, default: "12" }` throws while the
controller is blessed, inside `application.register()`, before
`initialize()`. The message is `The specified default value for the
Stimulus Value "temperature" must match the defined type "number".
The provided default value of "12" is of type "string".` The
identifier is not in that message. The throw is not an action and
does not go through `handleError` unless the caller catches it.
Controllers already registered stay registered. The mismatched class
is not.

**Why it matters.** A vat card filed from a button can fail the whole
module if the `register()` call is not caught. The wording names the
value and not which controller it was.

**What to do.** Match the default's type to `type`. Catch around a
`register()` that might load a card you did not write. Read the value
token out of the message; don't expect the identifier there.

**Seen in:** [Creamery vat card](features/09-values/06-creamery-vat-card/).

## Value change callbacks

### The first previousValue is the default when the attribute is present

**What happens.** `[name]ValueChanged(value, previousValue)` runs once
for every declared value while the controller is connecting, after
`initialize()` and before target callbacks and `connect()`. When the
attribute is absent, `previousValue` is `undefined` and `value` is the
default, including `0`, `false`, `""`, `[]`, and `{}`. When the
attribute is present, `previousValue` is that same default, parsed, and
not `undefined`. A staff chalked `0` is `(0, 0)`. A boolean chalked
`false` is `(false, false)`. A string chalked `"City"` is
`("City", "")`. An array attribute's previous value is a new `[]`, and
an object attribute's previous value is a new `{}`. Adding the
attribute later, after that first call, reports the default as
`previousValue` again, not `undefined`.

**Why it matters.** `previousValue === undefined` does not mean "this
is the first paint" once the attribute is on the element. A guard of
`value === previousValue` skips the first paint of a zero, of `false`,
and of a blank string that was actually written down. Koitlah's chalked
zero and Tongue Point's missing height are both 0 feet, and only the
missing one has `previousValue === undefined`.

**What to do.** Paint from the callback either way. Treat `undefined`
as "the attribute was absent for this call," and treat an equal
previous value as "the attribute is present and parses as the default."
Read the attribute when you need to tell a chalked zero from a missing
one.

**Seen in:** [Tide staff reading](features/10-value-change-callbacks/01-tide-staff-reading/),
[Bell buoy ledger](features/10-value-change-callbacks/02-bell-buoy-ledger/),
[Wharf office chalk](features/10-value-change-callbacks/03-wharf-office-chalk/).

### An empty previous value skips the reader, and removing an empty attribute does not fire

**What happens.** The observer parses `previousValue` only when the raw
previous string is truthy. `""` is not, so it is handed to the callback
as the string `""` and not as the typed reading. Changing a blank
boolean, which reads as true, reports `previousValue` `""`, not `true`.
A blank number reports `""`, not `0`. Removing an attribute whose text
is `""` does not run the callback at all. Removing `"0"` does run it,
with `(0, 0)`, and the attribute is gone. Removing `"false"` or `"white"`
runs it with the type default as the new value. Assigning `undefined`
and `removeAttribute` are that same path.

**Why it matters.** A blank lit cell is sounding, because an empty
boolean attribute is true. Erasing that cell makes the getter false and
leaves the board saying the lamp is lit. A chalked zero that is cleared
looks, in the arguments, like a callback that changed nothing.

**What to do.** Don't use an empty attribute as a way to clear a value.
Assign `undefined`, or remove an attribute that has text, and paint
from the callback. After a removal, read the getter or the attribute
before trusting a board that was painted earlier. For the boolean
reading itself, see
[An empty Boolean attribute is true](#an-empty-boolean-attribute-is-true).

**Seen in:** [New Dungeness range](features/10-value-change-callbacks/06-range-light-board/).

**Why this section.** The empty string is the attribute. Skipping the
callback, and skipping the reader, is Stimulus.

### Present values do not re-fire on reconnect

**What happens.** Disconnecting and connecting the same element runs
`[name]ValueChanged` again only for values whose attribute is absent.
Each of those calls is `(default, undefined)` again. A value that still
has its attribute, including an attribute whose text is `""`, does not
run. If the attribute text changes while the controller is disconnected,
the next connect does run, and `previousValue` is the default rather
than `undefined`. `initialize()` does not run again.

**Why it matters.** Laying a pier up, or dragging a row, reconnects the
controller. A callback that counts connects will count the buoys that
never had the attribute, and will not count the ones that did. The
lifecycle note
[Value-changed callbacks re-fire on every reconnect](#value-changed-callbacks-re-fire-on-every-reconnect)
is this rule. A present `onAir` value does not run again on a move.

**What to do.** Put a value you need to replay on every connect on the
element only when you mean it to stay quiet. Make a defaulted callback
idempotent if the element will move.

**Seen in:** [Bell buoy ledger](features/10-value-change-callbacks/02-bell-buoy-ledger/).

### Present values run in attribute order, then absent ones

**What happens.** During the first pass, callbacks for attributes that
exist run in the element's attribute order, synchronously, before
callbacks for absent values. Absent values then run in `static values`
order, inherited names before the subclass. That whole pass is before
`[name]TargetConnected` and before `connect()`, which is the order in
[Callback order is initialize, value-changed, target-connected, then connect](#callback-order-is-initialize-value-changed-target-connected-then-connect).
Targets are already readable in the value callback. A value assigned
from a callback before that value's own first visit replaces what the
first callback sees. The chalked text is never an argument.
`previousValue` is still the default. A value assigned after it has
been recorded, including an assignment inside `connect()`, waits for a
later turn. Other controllers in the same scan can connect before that
callback runs. See
[A value's changed callback runs after the method that set the value has returned](#a-values-changed-callback-runs-after-the-method-that-set-the-value-has-returned).

**Why it matters.** Duckabush is already on the ebb, and the card still
says the current is north, but north is written after the stage. The
stage callback sets south first, and the current callback never sees
north. A needle count written ahead of the mesh in the tag logs ahead
of the mesh, whatever order `static values` uses. A mesh target is
readable there, even though `meshTargetConnected` has not run.

**What to do.** Do not depend on `static values` order for attributes
that are in the tag. Put a derived value's attribute before the value
that overwrites it if the chalked text has to be seen once. Read
targets from the value callback when they are already in the document.
Expect a write inside `connect()` to land after `connect()` returns.

**Seen in:** [Cap Sante net loft](features/10-value-change-callbacks/04-net-loft-mending/),
[Dosewallips tide gate](features/10-value-change-callbacks/07-tide-gate-current/).

### The callback array or object is a new parse

**What happens.** Array and object callbacks receive the result of
parsing the attribute, and the previous value is parsed again when it
is passed through. The two are never the same reference, even when both
are empty. Mutating the array or object the callback received does not
write the attribute and does not schedule another callback. Mutating
the array the getter just returned does not either. Assigning a new
array or object does. Assigning an object that `JSON.stringify`s to the
same text as the attribute does not, because the attribute string did
not change. Assigning a number over its own text can: the attribute
`08` reads as `8`, and assigning `8` writes `"8"`, so the callback runs
with `(8, 8)`.

**Why it matters.** Dropping cultch on the returned tray list updates
neither the card nor the board. Filing the same depth and bay looks
like a save and does not run. Rewriting lot `08` does run, with both
arguments equal, and the attribute loses the zero. The push that never
reaches the attribute is
[Array and Object values reject the other shape](#array-and-object-values-reject-the-other-shape).

**What to do.** Assign a new array or object when the change should be
seen. Compare array and object values by their text, not with `===`.
Do not treat equal numbers as "the callback will not run" if the
attribute text can still change.

**Seen in:** [Totten Inlet nursery](features/10-value-change-callbacks/05-oyster-nursery-card/),
[Admiralty Inlet board](features/10-value-change-callbacks/13-admiralty-inlet-board/).

### A throw from a value callback skips the rest of the connect scan

**What happens.** Defining `[name]ValueChanged` makes the observer parse
the attribute before the method runs. Invalid JSON throws `SyntaxError`
with `JSON.parse`'s message and no Stimulus prefix. JSON of the wrong
shape throws `TypeError` prefixed `Stimulus Value "identifier.nameValue"`,
using the value's method name (`readingValue`, not `reading`). The
method body does not run. `handleError` is not called. On the way in,
the throw skips the rest of that controller's value callbacks, its
target callbacks, and `connect()`, and it skips every controller later
in the same scan. That scan is inside the promise returned by
`Application.start()`, so the `SyntaxError` is an unhandled rejection.
The observer has already started listening. A later change still runs,
and a throw from it is an uncaught `error` from the mutation observer,
not a rejection and not `handleError`. The string map stores the new
attribute text only after the callback returns, so a throw leaves the
map on the previous text. The next assignment still parses
`previousValue` from the attribute. If that text is the bad JSON, the
method does not run, even though the attribute now holds a good value.
A further assignment, whose previous text parses, does run. That is not
the target-callback pause in
[The target observer is paused while the callback runs](#the-target-observer-is-paused-while-the-callback-runs).

**Why it matters.** A hatchery fax of `chowder, pilot bread` connects
nothing after it, including a tally that has nothing wrong with it.
The nursery ahead of the fax is fine. Filing `["bay"]` into an object
value throws the prefixed type error and leaves the summary on the
last successful paint. Filing bay B writes a real object and throws
again, because the previous text is still the list. Filing bay C is
the one that paints.

**What to do.** Keep untrusted JSON off a value that has a changed
callback, or catch at the edge that writes the attribute. Put a card
that might throw last if a failure must not silence the rest of the
page. Don't look for these errors in `handleError`.

**Seen in:** [Totten Inlet nursery](features/10-value-change-callbacks/05-oyster-nursery-card/).

### A value callback can schedule another

**What happens.** The value observer is not paused while the callback
runs. Assigning a different value schedules another callback for a
later turn. The getter is already the new value before the first
callback returns. A pair that each write a new number keeps going, one
callback at a time, until the values stop changing. Nothing in Stimulus
cuts that off. Assigning the same string does not schedule another
callback. On the first pass, a write to a value that has not been
visited yet is the case in
[Present values run in attribute order, then absent ones](#present-values-run-in-attribute-order-then-absent-ones):
that value's first callback sees the write, and there is not a second
one.

**Why it matters.** Slip Point and Waadah Island, each setting the
other a second longer, will not settle. A stage that sets the current
only when the getter differs settles. A guard of
`value === previousValue` does not stop a chase between two different
numbers, and it also skips the first paint when they are equal.

**What to do.** Assign the derived value only when the getter is not
already that value. Cap a coupling you do not trust. Debounce work
that should survive a burst of callbacks, as the Lime Kiln plot does,
instead of doing it on every strike.

**Seen in:** [Dosewallips tide gate](features/10-value-change-callbacks/07-tide-gate-current/),
[Coupled fog bells](features/10-value-change-callbacks/08-coupled-fog-bells/),
[Lime Kiln hydrophone](features/10-value-change-callbacks/09-lime-kiln-hydrophone/),
[Admiralty Inlet board](features/10-value-change-callbacks/13-admiralty-inlet-board/).

### Restore persisted state in initialize(), before the callback writes it

**What happens.** The first callbacks run before `connect()`, and they
see the attributes as they are after `initialize()`. A callback that
writes the query string or `localStorage` will write the markup if
`initialize()` did not replace it. `connect()` is too late to read the
saved value: the key or the URL already holds the markup. Setting the
values in `initialize()` writes the attributes before the observer
starts, so there is one callback, for the restored value, and
`previousValue` is the default because the attribute is present. There
is no callback for the markup that was replaced.

**Why it matters.** A ferry board opened on Kingston with draft 14
will record draft 12, the markup, if the query is read in `connect()`.
A keeper's slate opened on Point No Point will store New Dungeness, the
markup, and then "restore" that. Forgetting a slate has the same shape
in reverse: the callbacks that run after `undefined` will write the
defaults back unless they are told not to.

**What to do.** Read the query and `localStorage` in `initialize()`,
and write them from the callbacks. Skip the write when the URL or the
key already matches. When the user clears the store, stop the callbacks
from writing the defaults back. Use `pushState` for a user change and
`replaceState` for the opening write, so the first paint does not add
a history entry.

**Seen in:** [Ferry sailing filters](features/10-value-change-callbacks/11-ferry-sailing-filters/),
[Keeper watch slate](features/10-value-change-callbacks/12-keeper-watch-slate/),
[Admiralty Inlet board](features/10-value-change-callbacks/13-admiralty-inlet-board/).

## CSS classes

### The singular class throws only when the attribute is absent

**What happens.** `this.[name]Class` throws `Error: Missing attribute
"data-identifier-name-class"` when that attribute is not on the
controller element. The message names the kebab-case attribute, not
the logical name, and it is a plain `Error`. `this.[name]Classes`
does not throw: it returns a new `[]` on every read.
`has[Name]Class` is false. The reference says Stimulus throws if you
access a CSS class property when the attribute is absent. That is
the singular getter. The plural getter and `has[Name]Class` do not
throw. In `connect()`, the error is caught and reported as
`Error connecting controller`. The rest of that `connect()` does not
run, and controllers later in the scan still connect. In an action
it is `Error invoking action "click->identifier#method"`. In a value
callback the error is not a `TypeError`, so the value observer does
not prefix it with `Stimulus Value "identifier.name"`. It follows
[A throw from a value callback skips the rest of the connect scan](#a-throw-from-a-value-callback-skips-the-rest-of-the-connect-scan):
`handleError` stays quiet, `connect()` does not run, and every
controller after that element in the scan is skipped.

**Why it matters.** Wing kelp can read `scorchingClasses` and fall
back to `steadyClass`. Reading `scorchingClass` from the button is
the action error, and the connect reading stays. Nori reads it from
`connect()` and stops after the sentence it wrote first. The lane
slip at Vessel Traffic reads `alarmClass` from `laneValueChanged`.
The fault is `Error: Missing attribute "data-lane-slip-alarm-class"`,
the slip never says it connected, and the bell book after it stays
on "Bell book has not connected."

**What to do.** Branch on `has[Name]Class` before the singular
getter. Use the plural list when an absent attribute should mean
"add nothing." Keep a value callback that reads a class from
throwing, or put that controller last on the page.

**Seen in:** [Kelp dryer trays](features/11-css-classes/04-kelp-dryer-trays/),
[Seattle traffic board](features/11-css-classes/13-seattle-traffic-board/).

### An empty class attribute is present and the singular value is undefined

**What happens.** `data-end-labeler-jammed-class=""` and
`data-end-labeler-jammed-class="   "` are present, so
`hasJammedClass` is true. Tokenizing keeps runs of non-whitespace,
so the empty string and the spaces are both `[]` from
`jammedClasses`. `jammedClass` is `undefined`. It does not throw,
because the throw is only for a missing attribute. `has[Name]Class`
does not mean the singular getter returns a string.

**Why it matters.** A blank jam slip on line 2 looks filled in to a
guard that only checks `hasJammedClass`. Stamping `jammedClass`
onto the label adds the token `undefined`. Stamping the list adds
nothing, and the label stays `tin`.

**What to do.** Treat a missing attribute and a blank attribute as
different. Fall back when `has[Name]Class` is false, and also when
the plural list is empty. Spread the plural list into
`classList.add` and `classList.remove`.

**Why this section.** The empty list is Stimulus. The token
`undefined` is the DOM stringifying the value `classList.add`
received. It belongs here because the singular getter is what
handed that value over.

**Seen in:** [Ilwaco end labeler](features/11-css-classes/05-ilwaco-end-labeler/),
[Netshed mend flags](features/11-css-classes/03-netshed-mend-flags/)
(the gillnet's extra spaces are dropped, and three tokens remain).

### Class properties are getters, and nothing watches the attribute

**What happens.** `staleClass` and `staleClasses` have no setter.
`this.staleClass = this.freshClass` throws `TypeError: Cannot set
property staleClass of #<extended> which has only a getter`. The
name in that message is the blessed constructor, `extended`, not the
controller class. Each read of `staleClasses` tokenizes again, so
`this.staleClasses === this.staleClasses` is false, and `push` on
the array is gone by the next read. Writing the attribute with
`setAttribute` does not run a callback. The read count stays `1`.
The next `staleClass` is the new token.

**Why it matters.** Correcting plate 18465 to `chart-fresh` does not
look like a value change. Nothing else on the plate repaints unless
the action does it. Assigning the property leaves the attribute on
`chart-stale` and reports the `TypeError`. Unlike values, there is
no writer and no `[name]ClassChanged`.

**What to do.** Change the attribute with `setAttribute` or
`removeAttribute`, then read again and apply the tokens yourself.
Don't assign the class property. Don't mutate the array you just
read.

**Seen in:** [Strait chart locker](features/11-css-classes/12-strait-chart-locker/),
[Terminal shed lamps](features/11-css-classes/11-terminal-shed-lamps/).

### A classes object or a classes string is ignored

**What happens.** `static classes` is read with the array walker.
An object (`{ stale: "chart-stale" }`) and a string (`"stale"`) are
not arrays, so no class properties are defined. `"staleClass" in
controller` is false. `this.staleClass` is `undefined` and does not
throw. `this.hasStaleClass` is `undefined`. The
`data-plate-object-stale-class` attribute is never read. This is
not the missing-attribute error, which is thrown only by a getter
that was defined.

**Why it matters.** A plate filed the way a value is filed, with a
type or a default, connects and then has no class to apply. The
attribute on the element looks correct and is unused.

**What to do.** Declare `static classes` as an array of logical
names. Put the CSS tokens in `data-[identifier]-[name]-class`.

**Seen in:** [Strait chart locker](features/11-css-classes/12-strait-chart-locker/).

### A class attribute has to be the exact kebab-case name

**What happens.** The lookup is
`data-${identifier}-${dasherize(name + "-class")}`. `stale` is
`data-chart-correction-stale-class`. HTML lowercases attribute
names, so `data-chart-correction-staleClass` is stored as
`data-chart-correction-staleclass` and does not match. Underscores
are not camelized. `data-chart-correction-stale_class` is a
different attribute. Either miss makes `hasStaleClass` false and
makes `staleClass` throw `Missing attribute
"data-chart-correction-stale-class"`. A sibling `fresh` attribute
written in kebab-case on the same element still reads. Values miss
the same way and then return the type default. Classes miss and the
singular getter throws. See
[Value attributes are the exact kebab-case name](#value-attributes-are-the-exact-kebab-case-name).

**Why it matters.** Plate 18441 holds `chart-stale` in the DOM and
the controller still throws. Plate 18484's underscore attribute is
present and unread. `freshClass` on both plates is `chart-fresh`.

**What to do.** Write class attributes in kebab-case. A camelCase
logical name in `static classes` belongs to a hyphenated attribute,
the way `coldHold` belongs to `data-brine-tag-cold-hold-class`.

**Why this section.** Lowercasing is the HTML parser. Stimulus is
what requires the hyphenated name and throws, instead of falling
back, when the attribute does not match.

**Seen in:** [Strait chart locker](features/11-css-classes/12-strait-chart-locker/),
[Icehouse brine tags](features/11-css-classes/01-icehouse-brine-tags/).

### Inherited class names use the subclass identifier

**What happens.** `static classes` is collected from the class and
its ancestors. `ReefnetTally` declares `soaked` and inherits
`overLimit`. `SetnetTally` declares no classes and still has
`overLimitClass`. `soakedClass` is not a property on the gillnet or
the setnet, so the read is `undefined` and does not throw. The
attribute is the instance's identifier.
`data-reefnet-tally-over-limit-class` is the reefnet's over-limit
class. `data-gillnet-tally-over-limit-class` on that element is not
read. The setnet reads `data-setnet-tally-over-limit-class`. The
same rule for values is
[Inherited values use the subclass identifier](#inherited-values-use-the-subclass-identifier).

**Why it matters.** A reefnet card copied from the gillnet tally
looks wired. The class it applies is `net-over`, from its own
attribute, and `parent-over` stays on the element unused.

**What to do.** Stamp inherited classes with the identifier of the
controller that is actually on the element.

**Seen in:** [Lummi reefnet tally](features/11-css-classes/10-lummi-reefnet-tally/).

### A shorter identifier can share a longer identifier's class attribute

**What happens.** The attribute name is
`data-${identifier}-${dasherize(name + "-class")}`. For `wharf` and
`shedLamp` that is `data-wharf-shed-lamp-class`. For `wharf-shed`
and `lamp` it is the same string. Both controllers, on one element,
read that attribute. Copying `amberClass` into it makes the next
read on both controllers `shed-amber`, in the same action. `pile`
does not collide: the wharf's pile is `data-wharf-pile-class` and
the shed's pile is `data-wharf-shed-pile-class`. There is no class
callback, so the action has to paint both. This is the same
composition as
[A shorter identifier can share a longer identifier's value attribute](#a-shorter-identifier-can-share-a-longer-identifiers-value-attribute),
with `-class` instead of `-value`.

**Why it matters.** Ambering the shed lamp from the wharf moves the
shed's lamp too. Swapping the piles does not: fir stays on the
wharf and spruce stays on the shed.

**What to do.** Don't let one identifier be a hyphen-prefix of
another when a class name on the shorter one can spell the rest
(`wharf` / `wharf-shed`, `shedLamp` / `lamp`).

**Seen in:** [Terminal shed lamps](features/11-css-classes/11-terminal-shed-lamps/).

### Spreading class lists into classList.toggle forces the first class on

**What happens.** `classList.toggle` takes a token and an optional
force flag. `toggle(...["horn-on"])` toggles. `toggle(...["horn-on",
"horn-pulse"])` is `toggle("horn-on", "horn-pulse")`. A non-empty
string is forced true, so the first class is added and stays added
on the next press. The second class is never toggled. Looping the
list and toggling one token at a time clears the stack, then brings
both tokens back.

**Why it matters.** Patos stays `horn-on` no matter how many times
the spread runs. Stuart Island, toggled per token, goes quiet and
then sounds again. Point Wilson, with one class, really does toggle.

**What to do.** Spread `[name]Classes` into `classList.add` and
`classList.remove`. Toggle one token, or loop. Don't spread two or
more classes into `toggle`.

**Why this section.** The force flag is the DOM. It belongs here
because `[name]Classes` is the array that gets spread.

**Seen in:** [Turn Point foghorn](features/11-css-classes/09-turn-point-foghorn/).

## Outlets

### A missing outlet throws one of two errors, and the handbook names a third

**What happens.** `this.[name]Outlet` and `this.[name]OutletElement`
throw `Error: Missing outlet element "name" for host controller
"identifier". Stimulus couldn't find a matching outlet element
using selector "…"`. The quoted selector is the attribute text.
An absent attribute is the word `null`. An empty attribute is
an empty pair of quotes. A selector that matches an element
whose `data-controller` token is not the outlet name is the
same error: that element is not an outlet. The handbook's
sentence about a missing `data-controller` attribute is not
what 3.2.2 throws.

When the element matches and the token is present, but no
controller instance exists, the errors split. `has[Name]Outlet`
is true. `[name]OutletElement` returns the element.
`[name]OutletElements` includes it. `[name]Outlet` throws
`Error: The provided outlet element is missing an outlet
controller "name" instance for host controller "identifier"`.
`[name]Outlets` does not throw. It `console.warn`s that same
sentence, once per missing element per read, and returns the
controllers it could find, which may be none. The warning is
not `handleError`.

A `connect()` that reads the singular getter and throws is
caught as `Error connecting controller`. Controllers later in
the scan still connect. That is not the callback throw in
[A throw from an outlet callback skips the rest of the connect scan](#a-throw-from-an-outlet-callback-skips-the-rest-of-the-connect-scan).

**Why it matters.** The float at Willapa matches the barge's
selector and the barge still says the outlet element is
missing. Shell 2 at Blaine looks present — `has` is true and
the element id is there — and the singular getter still
throws because the controller was never registered. The plural
list is empty and the console has already warned. Tokeland's
`connect()` throw does not silence the tally board.

**What to do.** Treat `has[Name]Outlet` as "an element with
this token matches the selector," not "the controller getter
will succeed." Use the element getters when you only need the
node. Read the plural list when a missing instance should be
skipped. Branch before the singular getter. Don't describe
the failure with the handbook's `data-controller` sentence.

**Seen in:** [Willapa seed barge](features/12-outlets/05-willapa-seed-barge/),
[Blaine retort floor](features/12-outlets/06-blaine-retort-floor/).

### Outlet callbacks and connect() do not share a clock

**What happens.** `[name]OutletConnected(outlet, element)` can
run before either `connect()`. Which one depends on document
order.

When the outlet element is later than the host, the host's
`connect()` finishes with no callback yet. The callback runs
from the outlet controller's startup, before that outlet's
`connect()`. Values and targets are already live, because
those observers start first. State written in the outlet's
`connect()` is not. Registering the controller later has the
same shape: the callback runs, then the new controller's
`connect()`.

When the outlet element is earlier, its `connect()` has
finished before the host starts. The callback runs during the
host's outlet observer startup, before the host's `connect()`.

Reading `[name]Outlet` or `[name]Outlets` from the host's
`connect()` force-connects a later outlet inside that
`connect()`. The callback, then the outlet's `connect()`, run
before the getter returns. `has[Name]Outlet` and the element
getters do not force-connect. The reference-count consequence
is
[Reading the outlet controller in connect() keeps it alive after removal](#reading-the-outlet-controller-in-connect-keeps-it-alive-after-removal).

**Why it matters.** Ediz's height is readable in the entrance
callback and the watch flag is not, because the flag is set
in `connect()`. Travis is the same, because the early gate
reads the controller list while connecting. Gibson is already
latched when the late gate's callback runs. Shell 2's cook
flag is missing in the callback that registration fires, and
set a moment later. The Rosario desk's sector callback has
already run when the desk's `connect()` reads the count.

**What to do.** Don't require `connect()` state inside an
outlet callback. Read values and targets there, and read
flags the outlet's `connect()` owns only after that
`connect()` has had a chance to run. If the host must call
the outlet during its own `connect()`, put the outlet earlier
in the document, or call it from the callback and tolerate
the outlet's `connect()` not having run.

**Seen in:** [Neah Bay entrance log](features/12-outlets/03-neah-bay-entrance-log/),
[Blaine retort floor](features/12-outlets/06-blaine-retort-floor/),
[Sequim Bay staff gate](features/12-outlets/09-sequim-bay-staff-gate/),
[Rosario watch floor](features/12-outlets/13-rosario-watch-floor/).

### Reading the outlet controller in connect() keeps it alive after removal

**What happens.** `[name]Outlet` and `[name]Outlets` call
through to connect a matching element whose controller is not
connected yet. That bumps the scope's reference count. The
scope observer later matches the same element and bumps it
again. Removing the element drops the count by one, so the
outlet's `disconnect()` does not run. The host's
`[name]OutletDisconnected` still runs, because that comes
from the selector observer. Putting the element back fires
`[name]OutletConnected` again and does not call `connect()`
a second time. The same instance is still in
`application.controllers`.

`has[Name]Outlet`, `[name]OutletElement`, and
`[name]OutletElements` only look at the selector and the
controller token. They do not bump the count. An outlet that
connected on its own disconnects when it is removed.

**Why it matters.** Pulling Travis leaves life at `c` and
leaves the card's connect sentence in place when the staff
is hung again. Pulling Gibson, whose gate never read the
controller getter, runs `disconnect()` and life becomes `cd`.

**What to do.** In `connect()`, read `has[Name]Outlet` and
the element list if you must look. Call the controller from
the outlet callback, or from an action after both have
connected. Put the outlet earlier in the document when the
host's `connect()` truly has to call it.

**Seen in:** [Sequim Bay staff gate](features/12-outlets/09-sequim-bay-staff-gate/).

### The host's disconnect() runs before outletDisconnected, and the outlet stays up

**What happens.** Removing the host's controller token runs
the host's `disconnect()` first. Outlet elements are still
listed. `[name]OutletDisconnected` runs after that, from
`outletObserver.stop()`. The outlet controllers are not
disconnected. Their `disconnect()` does not run. A host that
goes away is not a teardown of the controllers it named.

**Why it matters.** Closing the Neah Bay log records the
staffs as still present, then records each outlet
disconnected, and Ediz's removal is the only one that ran a
staff `disconnect()`. Waadah and Slip Point still show the
watch as set.

**What to do.** Stop work that belongs to the host in the
host's `disconnect()`. Don't stop the outlet's timers there
unless you call the outlet yourself. Use the outlet callback
for "I no longer see you," and the outlet's `disconnect()`
for "I left the document."

**Seen in:** [Neah Bay entrance log](features/12-outlets/03-neah-bay-entrance-log/).

### A removal inside an outlet callback delays outletDisconnected

**What happens.** The selector observer is paused while
`[name]OutletConnected` or `[name]OutletDisconnected` runs.
A removal inside the callback is not delivered to that
observer. The scope observer is not paused, so the removed
outlet's own `disconnect()` runs on the next mutation
delivery. `[name]OutletDisconnected` does not. The public
outlet list already omits the element, because the getters
query the document. The observer still has the element until
something refreshes it. Writing the selector attribute again,
even to an equivalent selector, refreshes and then fires
`[name]OutletDisconnected` for an element that is already out
of the document.

This is the same pause as
[The target observer is paused while the callback runs](#the-target-observer-is-paused-while-the-callback-runs),
on the outlet selector observer. The scope observer keeps
running beside it, which targets do not have.

**Why it matters.** Hanging the spare at Ballard pulls the
small lamp immediately. The small lamp's life becomes `cd`.
The bank's disconnected count stays 0 until recount writes
`.lock-lamp, .lock-lamp`. The disconnected line then says
the lamp is not in the document.

**What to do.** Don't remove or insert other outlets for the
same name inside the callback if you need the paired
callback now. Remove them from the action, after the
callback has returned. If a callback must pull a lamp, treat
the outlet's `disconnect()` as the immediate signal and
expect `outletDisconnected` on the next selector change.

**Seen in:** [Ballard lamp bank](features/12-outlets/10-ballard-lamp-bank/).

### A throw from an outlet callback skips the rest of the connect scan

**What happens.** `[name]OutletConnected` is invoked with no
try/catch, from `outletObserver.start()`, which runs before
`connect()` and outside the try that becomes `Error
connecting controller`. A throw rejects the promise returned
by `Application.start()` and is also reported as an error
event. `handleError` is not called. The host's `connect()`
does not run. Controllers later in the document do not
connect. Controllers that already connected stay up.

An outlet selector that is not valid CSS throws
`SyntaxError` from `Element.matches` during that same start,
and aborts the scan the same way. Setting the bad selector
after the host has connected throws from the mutation
observer instead: an error event, not a rejected `start()`,
and not `handleError`. The host stays connected. The
disconnected callback for the previous match does not run,
because the refresh throws before it can unmatch. Later
reads of the outlet getters throw `SyntaxError` from
`querySelectorAll`.

**Why it matters.** The Rosario lane slip never says it
connected, and the bell book after it stays on "Bell book
has not connected." The desk above the slip is fine. The
fault line is `Error: lane slip lost the bell` and the
handled line stays quiet. Filing `[` onto the desk after
that replaces the fault with the `matches` SyntaxError and
still does not call `handleError`.

**What to do.** Keep outlet callbacks from throwing. A
missing outlet inside a callback should be guarded the way
an action is guarded. Don't put an untrusted string in an
outlet attribute. Put a controller that might throw last
only if you accept that everything after it will not
connect; the lane slip shows that "last" still has to be
after the controllers you need.

**Seen in:** [Rosario watch floor](features/12-outlets/13-rosario-watch-floor/).

### An outlet in head is readable and never calls back

**What happens.** Outlet getters search from
`document.documentElement`. The selector observer is
constructed on `document.body`. A controller on an element
that stays in `head` — a `meta`, not a `div`, which the
parser would move into the body — connects, because the
scope observer watches the document element. `has[Name]Outlet`
is true and `[name]Outlet` returns the controller.
`[name]OutletConnected` and `[name]OutletDisconnected` do
not run for it.

**Why it matters.** The Rosario night order is in `head`.
The desk reads `forenoon` and the tag `META`, and the night
callback count stays 0. A watch that waits for the callback
to paint the order never paints it.

**What to do.** Put outlet elements in the body when you
need the callbacks. Read a head element through the getter
on purpose, and don't wait for `outletConnected` to tell
you it is there.

**Why this section.** The parser moving a `div` out of
`head` would be the platform. The split here is Stimulus:
the scope observer and the getters see the document
element, and the outlet selector observer does not.

**Seen in:** [Rosario watch floor](features/12-outlets/13-rosario-watch-floor/).

### A dispatch does not reach a sibling outlet

**What happens.** `this.dispatch(eventName)` fires
`identifier:eventName` on the host element and bubbles.
An outlet is found by selector, not by ancestry, so it is
often a sibling. A `identifier:eventName->outlet#method`
action on that sibling does not run. The same event with
`@window` does. `blast()` on the outlet returns a value.
Nothing about the event hands a return value back. If the
outlet getter throws, code after it in that action does not
run, so the dispatch never happens. A window listener that
is simply absent does not throw.

**Why it matters.** Calling the Marrowstone horn returns
"two blasts" and Marrowstone's own listener stays quiet.
Kilisut hears the window. Dropping the outlet and calling
again throws the missing-element error, the dispatch is
skipped, and Kilisut does not hear a second sound. La
Conner dispatches before the outlet read, so the cook is
filed and that same error is caught afterward. The
sibling inspector's action still does not run.

**What to do.** Use an outlet when you need a return value
or a specific controller. Use `dispatch` when any listener
may care and a missing listener must not throw. Listen at
`window` or on a shared ancestor when the outlet is not
inside the host. Don't dispatch after an unguarded outlet
read if the event still has to fire when the outlet is gone.

**Seen in:** [Marrowstone fog desk](features/12-outlets/08-marrowstone-fog-desk/),
[La Conner cannery pass](features/13-dispatching-events/09-la-conner-cannery-pass/).

### A namespaced outlet and its dashed twin share one property

**What happens.** Property names go through
`namespaceCamelize`: `--` is replaced with `-`, then the
string is camelized. `keeper--log` and `keeper-log` both
become `keeperLog`. `static outlets` lists both, and the
later entry's getter overwrites the earlier one.
`keeperLogOutlet` reads only the later name. The attributes
stay distinct (`data-collision-plate-keeper--log-outlet`
and `data-collision-plate-keeper-log-outlet`). Both names
still call `keeperLogOutletConnected` and
`keeperLogOutletDisconnected`, because the callback method
is chosen with the same camelizing. The outlet instance
passed in still has its real identifier.

The handbook shows that `admin--user-status` is read as
`adminUserStatusOutlet`. It does not say that
`admin-user-status` is the same property.

**Why it matters.** The Quillayute collision plate logs both
identifiers, then the getter returns the dashed log only.
A desk that declares both and reads one property is talking
to whichever name came last in the array.

**What to do.** Don't declare two outlet names that
camelize to the same property. If a namespace and a dashed
name both exist, give the host one of them.

**Seen in:** [Quillayute chart desk](features/12-outlets/12-quillayute-chart-desk/).

### Outlet attributes are copied, not dasherized

**What happens.** The attribute is
`data-${identifier}-${outletName}-outlet`. The outlet name
is the identifier string from `static outlets`, copied as
written. Class names are dasherized. Outlet names are not.
`tide-staff` is `data-staff-plate-tide-staff-outlet`.
`data-staff-plate-tideStaff-outlet` is lowercased by the
HTML parser to `data-staff-plate-tidestaff-outlet` and does
not match. `hasTideStaffOutlet` is false. The singular
getter throws the missing-element error with selector
`null`. The staff controller can be connected the whole
time, under the attribute it actually uses.

**Why it matters.** The Quillayute staff says it connected.
The plate that names `tideStaff` in the attribute still
cannot see it.

**What to do.** Put the identifier, already kebab-case or
already namespaced, in `static outlets`. Write the attribute
with that same string. A camelCase logical name belongs to
classes and values, not to an outlet identifier.

**Why this section.** Lowercasing is the HTML parser.
Stimulus is what requires the outlet name unchanged and
then reports selector `null` when the attribute does not
match.

**Seen in:** [Quillayute chart desk](features/12-outlets/12-quillayute-chart-desk/),
[New Dungeness lens desk](features/12-outlets/07-new-dungeness-lens-desk/)
(the slate attribute keeps `--`).

### A non-array static outlets is ignored

**What happens.** `static outlets` is read with the array
walker. An object (`{ tideStaff: "#quillayute-staff" }`)
and a string (`"tide-staff"`) are not arrays, so no outlet
properties are defined. `"tideStaffOutlet" in controller`
is false. `this.tideStaffOutlet` is `undefined` and does
not throw. No selector is observed. This is the same shape
as
[A classes object or a classes string is ignored](#a-classes-object-or-a-classes-string-is-ignored).

**Why it matters.** A plate filed the way a value is filed
connects and then has no outlet. The staff on the page is
unused.

**What to do.** Declare `static outlets` as an array of
controller identifiers.

**Seen in:** [Quillayute chart desk](features/12-outlets/12-quillayute-chart-desk/).

### Inherited outlet names use the subclass identifier

**What happens.** `static outlets` is collected from the
class and its ancestors. The attribute name uses the
instance's identifier. A tide desk that inherits `horn` and
declares `bell` reads `data-tide-desk-horn-outlet` and
`data-tide-desk-bell-outlet`. `data-chart-desk-horn-outlet`
on that element is not read. The same rule for values is
[Inherited values use the subclass identifier](#inherited-values-use-the-subclass-identifier).

**Why it matters.** The tide desk's horn is cape-horn, the
id in its own attribute. The decoy horn named by the parent
attribute stays on the element unused.

**What to do.** Stamp inherited outlets with the identifier
of the controller that is actually on the element.

**Seen in:** [Quillayute chart desk](features/12-outlets/12-quillayute-chart-desk/).

### A shorter identifier can share a longer identifier's outlet attribute

**What happens.** The attribute name is
`data-${identifier}-${outlet}-outlet`. For `pier` and
`shed-lamp` that is `data-pier-shed-lamp-outlet`. For
`pier-shed` and `lamp` it is the same string. Both
controllers, on one element, read that attribute. Each
still filters matches by its own outlet token, so the lamp
element needs both `shed-lamp` and `lamp` if both getters
should find it. Changing the attribute moves both outlets.
`pile-lamp` does not collide: the pier's pile is
`data-pier-pile-lamp-outlet`. This is the same composition
as
[A shorter identifier can share a longer identifier's value attribute](#a-shorter-identifier-can-share-a-longer-identifiers-value-attribute),
with `-outlet` instead of `-value`.

**Why it matters.** Pointing the shared attribute at the
spare moves the pier's shed lamp and the shed office's
lamp together. The north pile stays where it was.

**What to do.** Don't let one identifier be a hyphen-prefix
of another when an outlet name on the shorter one can spell
the rest (`pier` / `pier-shed`, `shed-lamp` / `lamp`).

**Seen in:** [Pier 91 shed office](features/12-outlets/11-pier-91-shed-office/).

## Dispatching custom events

### The default type is the identifier, a colon, and the name you passed

**What happens.** `dispatch("posted")` on a controller registered
as `tide-staff` fires `tide-staff:posted`. `dispatch("line-changed")`
fires `tide-staff:line-changed`. The name argument is copied as
written. It is not camelized, and it is not dasherized. A different
controller's `dispatch("posted")` is a different type.
`gauge-card:posted` does not run a `tide-staff:posted` action.

**Why it matters.** The Port Gamble log files the staff reading,
then the south line, then the gauge, as three types. The gauge
posting 8.1 ft does not look like the staff posting 8.4 ft.

**What to do.** Listen for `identifier:name`, hyphens included.
Don't treat one event name as shared across controllers unless
you set `prefix` yourself.

**Seen in:** [Port Gamble tide staff](features/13-dispatching-events/01-port-gamble-tide-staff/).

### A falsy `prefix` drops the identifier

**What happens.** The event type is `prefix ? prefix + ":" + name : name`.
The default prefix is `this.identifier`, so an omitted prefix on
the slip caller is `slip-caller:landed`. A custom string replaces
it (`terminal:landed`). `false`, `""`, `null`, and `0` are falsy,
so the type is the bare name `landed`. The string `"false"` is
truthy, so the type is `false:landed`.

A param attribute `"false"` arrives as the boolean `false`, not
the string `"false"`. Comparing it to `"false"` leaves the prefix
at the identifier. See
[Params are `JSON.parse`; values and `dataset` are not](#params-are-jsonparse-values-and-dataset-are-not).

**Why it matters.** The Coupeville slip counts a bare landing for
Prefix false, Empty prefix, and the four falsy values together.
The word false is a different event. The default and terminal
prefixes do not hear either of those.

**What to do.** Pass `prefix: false` or `prefix: ""` when the
event name must stand alone. Pass the string `"false"` only when
that string is the prefix you want. Read a param as the type the
typecast actually produces.

**Seen in:** [Coupeville landing slip](features/13-dispatching-events/02-coupeville-landing-slip/).

### `detail` is shared by reference

**What happens.** The object passed as `detail` is the object on
the event. A listener can write a field, a later listener reads
that write, and the returned event is that same object. Omitting
`detail` uses a new `{}` for that call only. The next omitted
call gets a different object. `detail: null` stays `null`. The
default `{}` applies only when the property is missing.

**Why it matters.** The Samish sack comes back as the same object,
with bed Samish. Two omitted dispatches are fresh and not null.
A null detail is null on the board. At Edmonds the deck sets
`fathoms` to 0, the mate sees 0, and the bell's returned detail
is 0 and the same object.

**What to do.** Treat `detail` as a shared scratch pad, or copy
the fields the caller still needs before a listener can change
them. Don't rely on one omitted `{}` surviving for the next
event. Pass `null` only when the listener is written to see null.

**Why this section.** Object identity is JavaScript. It's here
because `dispatch` takes `detail` as the payload and does not
copy it.

**Seen in:** [Samish shellfish ticket](features/13-dispatching-events/03-samish-shellfish-ticket/),
[Edmonds ramp pitfalls](features/13-dispatching-events/13-edmonds-ramp-pitfalls/).

### `target` is where the event starts

**What happens.** The default target is the controller element.
`target` moves the start to another element, `document`, or
`window`. Bubbling still walks up from that start, in the order
in
[One click runs actions in a fixed order: element, ancestors, `@document`, `@window`](#one-click-runs-actions-in-a-fixed-order-element-ancestors-document-window).
A descendant of the dispatcher does not hear an event that
started on the dispatcher. An event that starts on a descendant
is heard there, then by ancestors, `@document`, and `@window`.
`bubbles: false` is heard only by listeners on the target.
`target: document` skips every element and is heard by
`@document`, then `@window`. `target: window` is heard only by
`@window`. It does not travel down to `document`.

A sibling does not hear the bubble. That is the same limit as
[A dispatch does not reach a sibling outlet](#a-dispatch-does-not-reach-a-sibling-outlet).

**Why it matters.** The Lopez desk call is heard by the pier,
the clerk, and the watch, and the shed under the desk stays
quiet. Calling on the shed is heard by the shed and then by
everyone above it. Calling the shed without bubbling is heard
by the shed alone. Calling on `window` leaves the clerk quiet.
The Edmonds horn shed, a sibling of the deck, stays quiet.

**What to do.** Pass `target` when the event should start
somewhere other than the host. Pass `bubbles: false` when only
that node should hear it. Use `@window` or an ancestor for a
listener that is not on the path up.

**Why this section.** Which way an event travels is the DOM.
Stimulus adds the `target` option and the default of
`this.element`.

**Seen in:** [Lopez freight bell](features/13-dispatching-events/04-lopez-freight-bell/),
[Edmonds ramp pitfalls](features/13-dispatching-events/13-edmonds-ramp-pitfalls/).

### `composed` is ignored, and the string `"false"` does not turn the flags off

**What happens.** `dispatch` constructs the `CustomEvent` with
`detail`, `bubbles`, and `cancelable` only. A `composed: true`
option is dropped. `event.composed` stays false. `bubbles` and
`cancelable` default to true.

The string `"false"` for either flag stays true. The DOM
converts the option with a boolean conversion, and a non-empty
string is true. `0` is false for both. An event that does not
bubble is not heard by an ancestor or by `@window`. An event
that is not cancelable ignores `preventDefault`: the listener
still runs, and `defaultPrevented` stays false.

A node inside an open shadow root is a different tree. Stimulus
does not connect a controller there. A `dispatch` aimed at that
node, `composed` option and all, reaches nobody outside the
shadow: not the host, not the ancestor log, not `@window`. A
hand-built `CustomEvent` with `composed: true` does cross. That
event is cancelable only if the constructor is given
`cancelable: true`. The DOM default is false, so a veto on a
hand-built event does not stick unless you ask. `dispatch` is
cancelable unless you pass `cancelable: false`.

**Why it matters.** Hoisting baker with `composed: true` still
reports composed false, and the veto sticks. The worded hoist
bubbles and is vetoed. The zero hoist does neither. The lamp
inside the shadow reports composed false and the host stays
quiet. The hand-built hoist is composed, the host hears it,
and the veto sticks because cancelable was set.

**What to do.** Don't pass `composed` to `dispatch` and expect
the event to leave a shadow root. Build the event yourself when
it has to cross, and set `cancelable` if a listener should be
able to veto it. Pass a real boolean for `bubbles` and
`cancelable`. `0` turns them off. The string `"false"` does not.

**Why this section.** Boolean conversion and shadow retargeting
are the platform. Stimulus is what drops `composed` and defaults
the other two flags to true.

**Seen in:** [Point Wilson signal flags](features/13-dispatching-events/05-point-wilson-signal-flags/).

### The returned event has already been through its listeners

**What happens.** `dispatch` returns the event after
`dispatchEvent`. `defaultPrevented` is whatever the listeners
left. A listener calls `preventDefault` to veto, and the caller
decides from that flag. `cancelable: false` makes the call a
no-op: the listener still runs, and `defaultPrevented` stays
false.

A throw inside an action is caught as
`Error invoking action "…"`. `dispatch` still returns. Listeners
later in the order still run. The order is the one in
[One click runs actions in a fixed order: element, ancestors, `@document`, `@window`](#one-click-runs-actions-in-a-fixed-order-element-ancestors-document-window).

**Why it matters.** The Orcas board holds the Chelan when the
harbor master refuses, and lets her go when the event is not
cancelable even though the master still calls `preventDefault`.
Jamming the winch prints the invoking error, the master still
refuses, and the wharf still sees `defaultPrevented` true.

**What to do.** Read `defaultPrevented` on the returned event
before doing the work the listeners were allowed to stop. Pass
`cancelable: false` only when a veto must not stick. Don't wrap
`dispatch` in try/catch to hear an action throw; use
`handleError`. Don't assume a throw skipped the window listener.

**Seen in:** [Orcas departure board](features/13-dispatching-events/06-orcas-departure-board/).

### A namespaced identifier keeps `--` in the event name

**What happens.** The prefix is the identifier string, not the
camelized property name. `keeper--slate` dispatches
`keeper--slate:signed` and `keeper--slate:watch-relieved`.
`keeper-slate:signed`, one hyphen, does not match.
`lens-cabinet:rotated` is the ordinary hyphenated identifier.
Outlet properties collapse `--` to `-`. Event names do not. See
[A namespaced outlet and its dashed twin share one property](#a-namespaced-outlet-and-its-dashed-twin-share-one-property).

`data-action` hears the full type on the element, at
`@document`, and at `@window`, in that order. Params on the
action's element sit beside `detail`. `"Lime Kiln"` stays a
string because it is not JSON. See
[Params are `JSON.parse`; values and `dataset` are not](#params-are-jsonparse-values-and-dataset-are-not).

**Why it matters.** The Lime Kiln book files local, then
document, then window, for the double-hyphen name. The
one-hyphen decoy stays at 0. Relieving the watch and rotating
the lens are different types.

**What to do.** Listen for the identifier as it was registered,
including `--`. Don't camelize it, and don't collapse the
namespace to one hyphen.

**Seen in:** [Lime Kiln keeper slate](features/13-dispatching-events/07-lime-kiln-keeper-slate/).

### `event.params` is stamped before the action is allowed to run

**What happens.** Each binding assigns `event.params` before it
decides whether the method runs. A `:self` filter that then
declines still leaves its params on the event. When `dispatch`
returns, `event.params` is the last binding that handled the
event, including one whose method did not run. During a method,
`event.params` is that binding's own params. The typecast is
unchanged: `"3"` is a number, `"true"` and `"false"` are
booleans, and `"03"` stays a string. See
[Each action gets a fresh `event.params`, and the next action replaces it](#each-action-gets-a-fresh-eventparams-and-the-next-action-replaces-it)
and
[Action params turn all-digit strings into numbers](#action-params-turn-all-digit-strings-into-numbers).

**Why it matters.** The Goose Point floor records belt 3, hold
true, and lot `03` as a string. The belt clerk records belt 7
and hold false. Late self never runs, and the returned event
still says belt 9, hold false, and lot `08` as a string, because
that binding was last.

**What to do.** Read `event.params` inside the method, or copy
them before you return from it. Don't read `event.params` on the
object `dispatch` returned and expect your own action's params,
or expect them to be absent because a later `:self` did not run.

**Seen in:** [Goose Point retort tickets](features/13-dispatching-events/08-goose-point-retort-tickets/).

### An ancestor hears the bubble; an outlet can return a value

**What happens.** A controller with a different identifier, on
an ancestor, hears a bubbling dispatch. The event does not
carry a return value back. An outlet method can return a value,
and the singular getter throws when the outlet is missing. If
that throw happens before `dispatch`, the event never fires.
Dispatching first, then reading the outlet inside try/catch,
files the event and still reports the missing outlet. The
sibling's action for the same type does not run. See
[A dispatch does not reach a sibling outlet](#a-dispatch-does-not-reach-a-sibling-outlet).

**Why it matters.** La Conner files `retort-basket:cooked` and
the inspector returns "accepted". After the outlet attribute is
removed, the floor still files the cook, the inspector's text
does not change, and the fault is the missing-element error
with selector `null`.

**What to do.** Dispatch, then call the outlet. Catch the
missing-outlet error when the event must go out either way. Use
the outlet when you need the return value. Use the ancestor, or
`@window`, when a missing listener must not throw.

**Seen in:** [La Conner cannery pass](features/13-dispatching-events/09-la-conner-cannery-pass/).

### `@window` listeners for one event sort by action index

**What happens.** Bindings that share one native listener are
sorted by their index in that element's `data-action`, not by
document order. Equal indexes keep connection order. For a
bubbling event the groups are still element, ancestors,
`@document`, then `@window`. Inside the window group, a later
element's index-0 action runs before an earlier element's
index-1 action.

`stopPropagation` and `stopImmediatePropagation` apply to a
custom event the same way they apply to a click. See
[`stopPropagation()` does not stop the next action on the same element](#stoppropagation-does-not-stop-the-next-action-on-the-same-element).

**Why it matters.** The Admiralty tape for a plain hail is
`log bell station book late early`. Late watch is below early
watch in the page, and its hail action is the first token.
Early watch's hail is the second token, after a clear action,
so it answers last. Stopping the hail leaves `log bell`.
Cutting it leaves `log`.

**What to do.** Don't put another action before the window
action you need to win a race with a different window listener.
Give the action the index you mean, or listen on an ancestor
when document order is the order you want. Put a guard that
must skip the next action on the same element first, and call
`stopImmediatePropagation`.

**Seen in:** [Admiralty pilot orders](features/13-dispatching-events/10-admiralty-pilot-orders/).
Goose Point's two window actions are both index 0, so the later
one stamps the returned params. See
[Goose Point retort tickets](features/13-dispatching-events/08-goose-point-retort-tickets/).

### A `connect()` dispatch is heard only by controllers already listening

**What happens.** Action listeners are started before
`controller.connect()`. A controller hears its own dispatch from
`connect()`. It does not hear a dispatch that already happened.
When both controllers were registered before `start()`, the
parent connects first, so a dispatch in the parent's
`connect()` runs before the child is listening. The child's
`connect()` dispatch is heard by that parent. A controller
connected later does not hear the earlier child's dispatch. See
[Parent-before-child connect order only holds when both are registered before start](#parent-before-child-connect-order-only-holds-when-both-are-registered-before-start).

**Why it matters.** The Smith Island drum's set goes out before
the west striker is listening. The striker hears its own armed
event, and the drum hears that armed event. The east striker,
hung later, misses the set and misses west's armed event. West
hears east when east arms.

**What to do.** Don't announce from the parent's `connect()` and
expect children to answer. Announce from the child's
`connect()`, or dispatch again when a listener connects. A
controller that must not handle its own event should not listen
for the type it dispatches during `connect()`.

**Seen in:** [Smith Island tide drum](features/13-dispatching-events/11-smith-island-tide-drum/).

### `disconnect()` still has its listeners

**What happens.** The context calls `controller.disconnect()`
and then stops the binding observer. Actions still run during
`disconnect()`. On the line after `remove()`, the element is
already disconnected from the document and the controller is
still registered. The callback itself waits for the microtask
in
[Lifecycle callbacks are batched after the DOM change](#lifecycle-callbacks-are-batched-after-the-dom-change).

A bubbling dispatch from the detached element does not reach
the old ancestor. A dispatch with `target` set to the element
saved in `connect()`, and `bubbles: false`, does. A dispatch
with `target: window` is heard by window listeners that are
still connected. See
[Events from a detached element don't reach old ancestors](#events-from-a-detached-element-dont-reach-old-ancestors).

Removing a subtree disconnects the parent first. During the
parent's `disconnect()` the child is still connected and hears
a window goodbye. The child's later window dispatch is heard by
a listener that stayed on the page, not by the parent. See
[The parent disconnects first when a subtree is removed](#the-parent-disconnects-first-when-a-subtree-is-removed).

**Why it matters.** Pulling the west striker reports the element
gone and the controller still present. After the microtask the
drum has the leaving note that was aimed at the saved drum
element. The detached bubble is not that note. Pulling the drum
lets the east striker hear the drum's goodbye, then the page
hears the east striker's own window step. The order is west,
then the drum, then east.

**What to do.** Say goodbye from `disconnect()` with
`target: window`, or with the parent element you saved while
you were connected. Don't bubble from `this.element` after it
has been removed. A parent hears a child's last word when the
child is removed alone. It does not hear that word when the
parent is removed with the child, because the parent has
already disconnected.

**Seen in:** [Smith Island tide drum](features/13-dispatching-events/11-smith-island-tide-drum/).

### A listener that dispatches again runs the nested event first

**What happens.** `dispatch` is synchronous. A listener that
calls `dispatch` finishes that nested event, including every
listener on it, before the outer listener list continues.
`defaultPrevented` belongs to the event it was called on. A
veto on the nested event does not mark the outer event. There
is no re-entrancy guard.

The prefix is the calling controller's identifier. A log that
wants to fire another controller's event has to pass that
identifier as `prefix`. A bare `dispatch("strike")` from
`relay-log` is `relay-log:strike`, and the `bell-relay:strike`
actions do not run.

**Why it matters.** One echo at Point Robinson answers, files
the reply, records the veto, then strikes again and does that
a second time, and only then records the outer strike as open.
The outer event's `defaultPrevented` stays false. Without the
`bell-relay` prefix the reply and the nested strike would be
named for the log, and the tape would stop early.

**What to do.** Keep a hop count, or some other guard, in
`detail` when a listener answers by dispatching the same type.
Pass `prefix` when the event name belongs to a different
controller. Read `defaultPrevented` on the event you just
dispatched, not on the event you are handling, when the veto
you care about is the nested one.

**Seen in:** [Point Robinson bell relay](features/13-dispatching-events/12-point-robinson-bell-relay/).

### `prefix: false` collides with native event names

**What happens.** `dispatch("click", { prefix: false })` fires
an event whose type is `click`. Actions written for a real
click run. The object is a `CustomEvent`, not a `MouseEvent`,
and it carries `detail`. A real click is a `MouseEvent` and
has no `detail`. The same split applies to `change`: the
dispatched event is a `CustomEvent` and not an `InputEvent`,
and a `new Event("change")` is neither. A sibling still does
not hear the bubbling custom event.

**Why it matters.** The Edmonds horn counts one custom click
with detail Edmonds, then a mouse click with no detail.
Posting a change reports a custom event and the detail feet.
Typing 9.5 reports a native event and the input's value. The
horn shed stays quiet the whole time.

**What to do.** Don't use `prefix: false` with `click`,
`change`, `submit`, or any other type you also listen for as
a native event, unless the method can tell a `CustomEvent`
from the browser's event. Prefer a prefixed name. Copy
`detail` if a listener will write it. See
[`detail` is shared by reference](#detail-is-shared-by-reference).

**Why this section.** What `click` and `change` mean is the
DOM. Stimulus is what will invoke those actions for a
`CustomEvent` of the same type.

**Seen in:** [Edmonds ramp pitfalls](features/13-dispatching-events/13-edmonds-ramp-pitfalls/).

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

### Nodes inside a `<template>` are not targets

**What happens.** `element.querySelectorAll` does not look inside a
`<template>`'s document fragment. Stimulus target lookup uses that
method, so a place card drawn in the blueprint is not a `guest` target.
The `<template>` element can itself be a target (`cardBlueprint`).
Cloning `template.content` and appending the clone puts a real guest in
the document, and the next `guestTargets` read includes them. The
blueprint still holds its own card.

**Why it matters.** A seating chart that counts guests on load reports
Priya and not the blank card, which is what you want, and it will keep
reporting that after a clone that was never appended.

**What to do.** Keep the blueprint as its own target. Clone
`template.content`, fill the clone, and append it where the chart
should show it. Then read `guestTargets`.

**Seen in:** [Rehearsal dinner seating](features/07-targets/06-rehearsal-dinner-seating/),
[Orchestra seating chart](features/07-targets/13-orchestra-seating-chart/),
[Cranberry receiving dock](features/08-target-callbacks/07-cranberry-receiving-dock/),
[Harbor night watch](features/08-target-callbacks/13-harbor-night-watch/).

**Why this section.** Skipping template contents is the HTML parsing
rules. Stimulus inherits it by querying the live document.

### Flex `order` does not change target order

**What happens.** `this.loafTargets` follows document order. CSS `order`
changes which loaf is painted first and leaves the target list alone.
`insertBefore` changes the document, and the next target read follows
the nodes.

**Why it matters.** A rack that paints Ciabatta at the front still pulls
Brioche first when Brioche is first in the markup. The pull order and
the paint order diverge on purpose only if you meant them to.

**What to do.** Move the nodes when the sequence matters. Read
`loafTargets` for that sequence. Use CSS `order` for a visual treatment
that must not become the sequence.

**Seen in:** [Bakery oven queue](features/07-targets/08-bakery-oven-queue/).

**Why this section.** Paint order is CSS. The target query never asks
for it.

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

### `keypress` does not fire for Escape, Tab, arrows, Home, End, or Page Up/Down

**What happens.** Modern browsers fire `keypress` only for (some)
printable characters. Space gets a `keypress`; Escape, Tab, arrows,
Home, End, PageUp, and PageDown do not. `keydown` and `keyup` still
fire for all of them. `keydown` repeats while the key is held; `keyup`
fires once.

**Why it matters.** `keypress.esc` is a valid Stimulus filter that never
runs. Talkback that starts on `keydown.space` must ignore the repeats
or it will flicker.

**What to do.** Use `keydown` / `keyup` for non-printable keys. Treat a
repeated `keydown` as "already doing this".

**Seen in:** [Ferry radio talkback](features/04-keyboard-filters/05-ferry-radio-talkback/).

### The `space` filter maps to `" "`, not `"Space"`

**What happens.** Stimulus's built-in `space` mapping is the character
`" "`. That matches `event.key`. `event.code` is `"Space"`.

**Why it matters.** Reading `event.code === "Space"` in a method that
already passed a `space` filter works, but a custom mapping of
`space: "Space"` would match nothing.

**What to do.** Keep the built-in mapping. `preventDefault()` on
`keydown.space` so the page does not scroll.

**Seen in:** [Ferry radio talkback](features/04-keyboard-filters/05-ferry-radio-talkback/),
[Medication pack tabs](features/04-keyboard-filters/07-medication-pack-tabs/).

### Enter in a textarea inserts a newline; Enter in an input submits the form

**What happens.** The browser's default for Enter depends on the field.
A textarea inserts a newline. An input in a form submits. A
`contenteditable` region inserts a break. Stimulus filters do not cancel
those defaults.

**Why it matters.** `keydown.enter` on a textarea that "sends" still
gets a newline unless the action `preventDefault()`s. `keydown.enter`
on a tag field inside a form submits the form unless it does the same.
Tab still moves focus unless `preventDefault()` runs during `keydown`.

**What to do.** Call `preventDefault()` when the filter should own the
key. Leave it off when you want the browser's newline (Shift+Enter in a
composer).

**Seen in:** [Clinic message composer](features/04-keyboard-filters/02-clinic-message-composer/),
[Recipe dietary tags](features/04-keyboard-filters/06-recipe-dietary-tags/),
[Legal brief editor](features/04-keyboard-filters/11-legal-brief-editor/).

### Alt+ArrowLeft is Back in some browsers

**What happens.** Alt+Left and Alt+Right are history navigation in
Chrome and Firefox on Windows and Linux. The page sees the `keydown`
and can `preventDefault()` it. Without that, a kanban that listens for
`keydown.alt+left` also leaves the page.

**Why it matters.** The story moves *and* the browser goes Back.

**What to do.** `preventDefault()` in the Alt+arrow actions.

**Seen in:** [Newsroom assignment board](features/04-keyboard-filters/10-newsroom-assignment-board/).

### `wheel` on `window`, `document`, and `body` is passive unless you opt out

**What happens.** Chrome (and other engines following the same spec)
treat `wheel`, `touchstart`, and `touchmove` listeners on `window`,
`document`, and `body` as `{ passive: true }` by default.
`preventDefault()` there does nothing. Stimulus `:prevent` is that call.
`:!passive` is `{ passive: false }` and is what makes `:prevent` work on
those events.

**Why it matters.** A map that zooms on wheel with
`wheel@window->…:prevent` still scrolls the page. The same descriptor
with `:!passive:prevent` zooms and the page stays put.

**What to do.** Write `:!passive:prevent` on `wheel` / `touchmove`
listeners that must cancel the default, including ones on an inner
element if you want the guarantee rather than the browser's default.

**Seen in:** [Botanical garden map](features/05-action-options/06-botanical-garden-map/).

**Why this section.** The passive default is the platform; `:!passive`
is the Stimulus spelling that opts out.

### `preventDefault()` in a `:passive` listener is ignored

**What happens.** `:passive` is `{ passive: true }`. The browser will not
cancel that event. Chromium logs a console warning if the handler calls
`preventDefault()` anyway. Stimulus `:prevent` on a `:passive`
descriptor is that ignored call.

**Why it matters.** A reading-progress bar that only reads `scrollTop`
is the right use of `:passive`. Pairing it with `:prevent` looks like it
should freeze the scroll and does not.

**What to do.** Use `:passive` when you will not cancel. Use
`:!passive:prevent` when you will.

**Seen in:** [Literary essay progress](features/05-action-options/04-literary-essay-progress/),
[Botanical garden map](features/05-action-options/06-botanical-garden-map/)
(the trail notes stay `:passive` and keep scrolling).

**Why this section.** Ignoring `preventDefault()` is the Event Listener
options spec; it shows up here because Stimulus exposes those flags as
`:passive` / `:prevent`.

### A real click runs microtasks before the event finishes bubbling

**What happens.** During a real click, the browser runs the microtask
checkpoint when a listener returns, before the event bubbles to the next
element. `await Promise.resolve()` inside an action therefore resumes
before ancestor actions run, and `event.params` is still the seat's
object. `element.click()` from script does not checkpoint there: the
rest of the bubble, including the ancestor action, runs before that
microtask, so the same `await` already sees the ancestor's params.
`setTimeout` runs after the whole dispatch either way.

**Why it matters.** A check that uses `element.click()` and
`await Promise.resolve()` will say the params were replaced. The same
code, clicked for real, still sees the seat. The two disagree, and only
the timer agrees with both.

**What to do.** Copy the params before yielding. When the read has to
happen after the click, wait for a timer. Don't treat
`Promise.resolve()` as "after the bubble."

**Seen in:** [Repertory seat holds](features/06-action-parameters/12-repertory-seat-holds/).

**Why this section.** The checkpoint is the browser. Stimulus is what
writes a new `event.params` for each action along the way.

### HTML lowercases param attribute names

**What happens.** In an HTML document, attribute names are converted to
ASCII lowercase. `data-hold-shelf-patronName-param` is stored as
`data-hold-shelf-patronname-param`. Stimulus camelizes only on `-` and
`_`, so the key is `patronname`, not `patronName`.
`setAttribute("data-hold-shelf-patronName-param", ...)` is lowercased
the same way.

**Why it matters.** `event.params.patronName` is `undefined`. The value
is sitting on `patronname`.

**What to do.** Write multi-word param names in kebab-case:
`data-hold-shelf-patron-name-param`. Underscores camelize too
(`patron_name` becomes `patronName`), but hyphens match the rest of the
`data-*` attributes in this catalog.

**Seen in:** [Library hold shelf](features/06-action-parameters/01-library-hold-shelf/).

**Why this section.** Lowercasing is the HTML parser. Stimulus's
camelize is what fails to put the capital letter back.

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

### A child of a removed node can still have `parentElement`

**What happens.** Replacing an element's `innerHTML` detaches its
children. A node that was a direct child has `parentElement === null`.
A node that was inside one of those children is still parented by that
child. `isConnected` is false either way. The removed wrapper is a
document fragment's worth of nodes, not a signal that the inner node
is still on the page.

**Why it matters.** `berryTargetDisconnected` runs for both shapes.
Checking `parentElement` to mean "still on the dock" treats a berry in
the morning tote as still packed somewhere on the slip. The tote is
only still its parent; the tote itself has left the document.

**What to do.** Use `isConnected` to ask whether the node is in the
document. Read `parentElement` when you want the detached fragment it
is still in.

**Seen in:** [Cranberry receiving dock](features/08-target-callbacks/07-cranberry-receiving-dock/).

**Why this section.** `parentElement` surviving on descendants is the
DOM. The disconnected callback is what hands you the node after the
slip was replaced.
